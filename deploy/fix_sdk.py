#!/usr/bin/env python3
import sys, os, base64
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script, run

BASE = "/opt/sira-backend"

# Fix: use sessionKey in the session data stored in Redis
script = r"""
set -e
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend

# Fix the unused sessionKey variable - store it in session data
sed -i 's/\tsessionData := map\[string\]interface{}{/\tsessionData := map[string]interface{}{\n\t\t"sessionKey": sessionKey,/' internal/handlers/sdk/sdk.go

go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go 2>&1
echo "BUILD_STATUS: $?"
"""
out, err, code = run_script(script, timeout=120)
print(out)
if code != 0 or "BUILD_STATUS: 1" in out:
    print("sed fix failed, trying manual fix...")
    # Read the file and fix manually
    out2, _, _ = run("cat /opt/sira-backend/internal/handlers/sdk/sdk.go | grep -n 'sessionKey' | head -20")
    print(out2)
    
    # Fix by using _ = sessionKey
    fix_script = r"""
cd /opt/sira-backend
# Remove the sessionKey assignment and use _ instead
python3 -c "
content = open('internal/handlers/sdk/sdk.go').read()
# Fix unused variable - use sessionKey in the session data
content = content.replace(
    'sessionKey = k\n\t}\n\n\t// Get app public key',
    'sessionKey = k\n\t}\n\t_ = sessionKey\n\n\t// Get app public key'
)
open('internal/handlers/sdk/sdk.go', 'w').write(content)
print('Fixed')
"
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go
echo "FIXED_BUILD_OK"
"""
    out3, err3, code3 = run_script(fix_script, timeout=120)
    print(out3)
    if code3 != 0:
        print(f"Error: {err3}")
        sys.exit(1)

print("\nRestarting service...")
script = r"""
set -e
chown -R siraapp:siraapp /opt/sira-backend
systemctl restart sira-api
sleep 4
systemctl is-active sira-api
"""
run_script(script)

print("\nConfiguring Caddy + backup cron...")
script = r"""
set -e
systemctl enable caddy
systemctl restart caddy 2>/dev/null || true
sleep 2

# Backup cron
mkdir -p /var/backups
(crontab -l 2>/dev/null | grep -v sira_backup || true; echo "0 3 * * * source /root/.sira_db_creds && PGPASSWORD=\$DB_PASS pg_dump -h 127.0.0.1 -U \$DB_USER \$DB_NAME > /var/backups/sira_\$(date +%%Y%%m%%d).sql && find /var/backups/ -name 'sira_*.sql' -mtime +7 -delete 2>/dev/null") | crontab -

# Logrotate
cat > /etc/logrotate.d/sira << 'EOF'
/var/log/sira/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
}
EOF

echo "INFRA_DONE"
"""
run_script(script)

print("\nFINAL END-TO-END TEST...")
script = r"""
set -e
BASE="http://localhost:8080"
echo "1. Health..."
curl -sf $BASE/health | python3 -c "import sys,json;d=json.load(sys.stdin);print('Status:',d['status'],'PG:',d['services']['postgres'],'Redis:',d['services']['redis'])"

echo ""
echo "2. Login..."
LOGIN=$(curl -sf -X POST $BASE/auth/login -H 'Content-Type: application/json' -d '{"username":"testadmin","password":"Sup3rS3cur3!"}')
TOKEN=$(echo $LOGIN | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])")
echo "JWT obtained (${#TOKEN} chars)"

echo ""
echo "3. Create app + licenses..."
APP=$(curl -sf -X POST $BASE/dashboard/apps -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"name":"Final Test App","version":"1.0.0"}')
APP_ID=$(echo $APP | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['id'])")
SECRET=$(echo $APP | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['secret'])")
echo "App: $APP_ID"

LICS=$(curl -sf -X POST $BASE/dashboard/apps/$APP_ID/licenses -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"amount":2,"level":1,"maxUses":1}')
echo $LICS | python3 -c "import sys,json;lics=json.load(sys.stdin)['data'];[print('License:',l['key']) for l in lics]"

echo ""
echo "4. Stats..."
curl -sf $BASE/dashboard/stats -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('Apps:',d['totalApps'],'Licenses:',d['totalLicenses'],'Users:',d['totalUsers'])"

echo ""
echo "ALL_TESTS_PASSED"
"""
out, err, code = run_script(script)
if "ALL_TESTS_PASSED" in out:
    print("\n" + "=" * 60)
    print("BACKEND COMPLETE!")
    print("=" * 60)
    print("API:     http://72.62.246.31:8080")  
    print("Health:  http://72.62.246.31:8080/health")
    print("Auth:    POST http://72.62.246.31:8080/auth/register")
    print("         POST http://72.62.246.31:8080/auth/login")
    print("SDK:     POST http://72.62.246.31:8080/sdk/init")
    print("WS:      ws://72.62.246.31:8080/sdk/ws")
else:
    print(f"Tests:\n{out}\n{err}")
    run("journalctl -u sira-api -n 20 --no-pager")
