#!/usr/bin/env python3
"""Direct fix for sdk.go - replace sessionID with sessID in Login function."""
import sys, os, base64
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

BASE = "/opt/sira-backend"

# Simple sed command to fix the issue
print("Fixing with sed...")
run_script(f"""
cd {BASE}
# Find the line number of the Login function
LOGIN_LINE=$(grep -n 'func Login' internal/handlers/sdk/sdk.go | head -1 | cut -d: -f1)
INIT_LINE=$(grep -n 'func Init' internal/handlers/sdk/sdk.go | head -1 | cut -d: -f1)
echo "Init starts at line: $INIT_LINE"
echo "Login starts at line: $LOGIN_LINE"

# In the Login function, replace "sessionKey": sessionID with "sessionKey": sessID
# Use awk to only replace after the Login function starts
awk -v login_line="$LOGIN_LINE" '
NR >= login_line && /"sessionKey": sessionID/ {{ gsub(/"sessionKey": sessionID/, "\\"sessionKey\\": sessID") }}
{{ print }}
' internal/handlers/sdk/sdk.go > /tmp/sdk_fixed.go

# Verify the change
diff internal/handlers/sdk/sdk.go /tmp/sdk_fixed.go | head -10
mv /tmp/sdk_fixed.go internal/handlers/sdk/sdk.go
echo "Fix applied"
""")

print("Rebuilding...")
out, err, code = run_script(rf"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd {BASE}
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go 2>&1
echo "BUILD_STATUS:$?"
""", timeout=120)
print(out[:500])

if 'BUILD_STATUS:0' not in out:
    errors, _, _ = run_script(rf"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd {BASE}
go build ./... 2>&1 | head -10
""")
    print("Errors:", errors)
    sys.exit(1)

print("Build SUCCESS!")
run_script(r"""
chown -R siraapp:siraapp /opt/sira-backend
systemctl restart sira-api
sleep 3
systemctl is-active sira-api && echo "SERVICE_OK"
""")

out, _, _ = run_script("sleep 2; curl -s http://localhost:8080/health")
print("Health:", out[:200])
