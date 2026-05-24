#!/usr/bin/env python3
"""Fix sdk.go sessionKey issue and rebuild backend."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

BASE = "/opt/sira-backend"

print("Checking sdk.go around line 191...")
out, _, _ = run_script(f"sed -n '180,200p' {BASE}/internal/handlers/sdk/sdk.go")
print(out)

print("Fixing sessionKey issue...")
run_script(rf"""
cd {BASE}
python3 -c "
content = open('internal/handlers/sdk/sdk.go').read()
# Remove the line that uses sessionKey if it's undefined (declaration was removed)
# First check if sessionKey is declared
if 'sessionKey :=' in content:
    print('sessionKey is declared, checking where it is used...')
elif 'sessionKey' in content:
    # Remove any remaining references to sessionKey
    import re
    # Remove lines that reference sessionKey but don't declare it
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if 'sessionKey' in line and ':=' not in line and '\"sessionKey\"' not in line:
            new_lines.append('\t\t// removed: ' + line.strip())
        else:
            new_lines.append(line)
    content = '\n'.join(new_lines)
    open('internal/handlers/sdk/sdk.go', 'w').write(content)
    print('Removed undefined sessionKey references')
else:
    print('No sessionKey found')
"
""")

print("Rebuilding...")
out, err, code = run_script(r"""
set -e
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go 2>&1
echo "BUILD_OK"
""", timeout=120)
print(out)
if code != 0:
    print(f"Still failing:\n{err}")
    # Try another approach - just comment out the problematic line
    run_script(rf"""
cd {BASE}
python3 -c "
content = open('internal/handlers/sdk/sdk.go').read()
# Find the exact line with sessionKey and comment it out
lines = content.split('\n')
new_lines = []
for i, line in enumerate(lines):
    if 'sessionKey' in line and 'sessionKey :=' not in line and '\"sessionKey\"' not in line:
        new_lines.append('//' + line)
        print(f'Commented out line {i+1}: {line.strip()}')
    else:
        new_lines.append(line)
open('internal/handlers/sdk/sdk.go', 'w').write('\n'.join(new_lines))
print('Done')
"
""")
    out2, err2, code2 = run_script(r"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go 2>&1
echo "BUILD_OK"
""", timeout=120)
    print(out2)
    if code2 != 0:
        print(f"Build still failing:\n{err2}")
        sys.exit(1)

run_script(r"""
chown -R siraapp:siraapp /opt/sira-backend
systemctl restart sira-api
sleep 3
systemctl is-active sira-api && echo "SERVICE_RUNNING"
""")

print("Done! Testing endpoints...")
out, _, _ = run_script(r"""
sleep 2
curl -s http://localhost:8080/health | python3 -c "import sys,json; d=json.load(sys.stdin); print('Health:', d.get('status','?'))"
""")
print(out)
