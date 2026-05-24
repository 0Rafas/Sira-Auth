#!/usr/bin/env python3
"""Precise fix for sdk.go compilation errors."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

BASE = "/opt/sira-backend"

print("Applying precise fixes...")
run_script(rf"""
cd {BASE}
python3 << 'EOF'
content = open('internal/handlers/sdk/sdk.go').read()

# Fix 1: "_, _ := crypto.GenerateRandomHex(16)" -> remove the line entirely (it's unused)
content = content.replace(
    '\t\t_, _ := crypto.GenerateRandomHex(16)\n',
    '\n'
)

# Fix 2: "sessionKey": sessID -> "sessionKey": sessionID (sessID doesn't exist here)
content = content.replace(
    '"sessionKey": sessID,',
    '"sessionKey": sessionID,'
)

open('internal/handlers/sdk/sdk.go', 'w').write(content)
print("Applied fixes:")
print("  - Removed unused GenerateRandomHex call")
print("  - Changed sessID to sessionID in Init function")
EOF
""")

print("Rebuilding...")
out, err, code = run_script(rf"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd {BASE}
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go 2>&1
echo "BUILD_STATUS:$?"
""", timeout=120)
print(out)

if 'BUILD_STATUS:0' not in out:
    print("Still errors. Getting remaining issues...")
    err_out, _, _ = run_script(rf"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go  
cd {BASE}
go build ./... 2>&1 | head -30
""")
    print(err_out)
    sys.exit(1)

print("Build successful! Restarting service...")
run_script(r"""
chown -R siraapp:siraapp /opt/sira-backend
systemctl restart sira-api
sleep 3
systemctl is-active sira-api
""")

print("Testing API health...")
out, _, _ = run_script(r"""sleep 2; curl -s http://localhost:8080/health""")
print("Health:", out[:200])

print("Testing login endpoint...")
out, _, _ = run_script(r"""
curl -s -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser99","email":"test99@test.com","password":"Test@12345"}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print('Register:', d.get('success'), d.get('data',{}).get('user',{}).get('username') if d.get('data') else d.get('message'))"
""")
print(out)
