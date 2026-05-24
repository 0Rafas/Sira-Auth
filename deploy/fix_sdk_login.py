#!/usr/bin/env python3
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

BASE = "/opt/sira-backend"

# The Login function has sessionData with "sessionKey": sessionID
# but in Login, the variable is sessID, not sessionID
# The Init function uses sessionID, Login uses sessID
# Fix: In the Login function's sessionData, change sessionID back to sessID

run_script(rf"""
cd {BASE}
python3 << 'PYEOF'
content = open('internal/handlers/sdk/sdk.go').read()

# Find the Login function's sessionData block and fix sessionKey
# The pattern is: in Login function, sessID is defined, then sessionData uses sessionID (wrong)
# We need to change the second occurrence of "sessionKey": sessionID to "sessionKey": sessID

import re

# Count occurrences
count = content.count('"sessionKey": sessionID')
print(f'Found "sessionKey": sessionID {count} times')

# The Login function (second occurrence if Init was fixed) should use sessID
# Replace the last occurrence of "sessionKey": sessionID with sessID
if count >= 1:
    # Replace all occurrences in Login context (which has sessID, not sessionID)
    # First occurrence (Init) correctly uses sessionID
    # Any other occurrence (Login) should use sessID
    
    # Split by the Init function's block to distinguish
    # Actually, let's just replace all "sessionKey": sessionID with "sessionKey": sessID
    # because Init function actually creates sessionID = uuid.NewString(), so it's fine there too
    # But Login uses sessID := uuid.NewString()
    
    # Check: does Init have "sessionID := " ?
    if 'sessionID := uuid.NewString()' in content:
        print("Init has sessionID - first occurrence is correct")
        # Only fix occurrences in Login context where sessID is the var
        # Login function will have sessID := before the sessionData
        
        # Find the Login function start
        login_start = content.find('func Login(')
        if login_start == -1:
            login_start = content.find('func SDKLogin(')
        if login_start == -1:
            login_start = content.find('// ── Login') 
        
        if login_start > 0:
            init_part = content[:login_start]
            login_part = content[login_start:]
            
            # Fix login_part
            login_part = login_part.replace('"sessionKey": sessionID,', '"sessionKey": sessID,')
            content = init_part + login_part
            print("Fixed Login function")
    else:
        # Both Init and Login, both should use their respective session var
        # Just replace all with sessID for now since that's the Login function issue
        content = content.replace('"sessionKey": sessionID,', '"sessionKey": sessID,')
        print("Replaced all sessionID references in sessionKey")

open('internal/handlers/sdk/sdk.go', 'w').write(content)
print("Done")
PYEOF
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
    # Get remaining errors
    errors, _, _ = run_script(rf"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd {BASE}
go build ./... 2>&1 | head -20
""")
    print("Remaining errors:", errors[:300])
    sys.exit(1)

print("Build SUCCESS!")
run_script(r"""
chown -R siraapp:siraapp /opt/sira-backend
systemctl restart sira-api
sleep 3
systemctl is-active sira-api
""")

out, _, _ = run_script("sleep 2; curl -s http://localhost:8080/health")
print("Health:", out[:150])
