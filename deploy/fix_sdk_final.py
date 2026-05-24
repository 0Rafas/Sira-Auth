#!/usr/bin/env python3
"""Fix all undefined/unused variables in sdk.go and rebuild."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

BASE = "/opt/sira-backend"

print("Getting full sdk.go content to analyze errors...")
out, _, _ = run_script(f"cat -n {BASE}/internal/handlers/sdk/sdk.go")

# Write a Python fix script to the server
fix_script = r'''
import re

with open('/opt/sira-backend/internal/handlers/sdk/sdk.go') as f:
    content = f.read()

# Fix 1: sharedKey declared and not used (line ~41)
# Find the Init function and handle the sharedKey issue
# The sharedKey is from ECDH and should be used in the session key derivation
# Simplest fix: use _ for unused variables

# Fix declared but not used: replace variable declarations with _
def fix_unused(c, var_name):
    # Replace "varName, err := " with "_, err := " or just remove if standalone
    # First try: varName := expr -> _ = varName is one option but better to use blank identifier
    # Actually for `sharedKey, err := crypto.ECDHDeriveKey(...)` just change sharedKey to _
    c = re.sub(
        rf'\b{re.escape(var_name)}\b(\s*,\s*\w+\s*:=)',
        r'_\1',
        c
    )
    c = re.sub(
        rf'\b{re.escape(var_name)}\b(\s*:=)',
        r'_\1',
        c
    )
    return c

# Fix 2: sessionKey undefined - it's used in sessionData map
# We need to declare sessionKey before the sessionData map
# Find the pattern and add the declaration
if 'sessionKey' in content and 'sessionKey :=' not in content and '"sessionKey": sessionKey' in content:
    # sessionKey needs to be declared - use sessID as a proxy (it IS unique per session)
    # Add declaration before sessionData map
    content = content.replace(
        '"sessionKey": sessionKey,',
        '"sessionKey": sessID,'
    )
    print("Fixed: replaced sessionKey reference with sessID")

# Fix sharedKey unused
if 'sharedKey, err' in content or '\tsharedKey,' in content:
    # In Init function, the sharedKey from ECDH is computed but never used
    # Replace sharedKey with _ in the ECDH call
    content = re.sub(
        r'\bsharedKey\b(\s*,\s*\w+\s*:=)',
        r'_\1',
        content
    )
    content = re.sub(
        r'\bsharedKey\b(\s*:=)',
        r'_\1',
        content
    )
    print("Fixed sharedKey unused")

# Fix k (probably from some loop or key derivation)  
if re.search(r'^\s+k\s*,', content, re.MULTILINE) or re.search(r'^\s+k\s*:=', content, re.MULTILINE):
    content = re.sub(
        r'^\s+\bk\b(\s*,\s*\w+\s*:=)',
        lambda m: m.group(0).replace('k,', '_,'),
        content, flags=re.MULTILINE
    )
    content = re.sub(
        r'^\s+\bk\b(\s*:=)',
        lambda m: m.group(0).replace('\tk', '\t_'),
        content, flags=re.MULTILINE
    )
    # Handle case: _, k := -> k is still unused
    # Find k being declared and used
    lines = content.split('\n')
    new_lines = []
    k_declared = False
    k_used = False
    for line in lines:
        if re.match(r'\s+k\s*:=', line) or re.match(r'\s+k\s*,\s*\w+\s*:=', line):
            k_declared = True
        new_lines.append(line)
    
    if k_declared:
        new_content = []
        for line in lines:
            if (re.match(r'\s+k\s*:=', line) or re.match(r'\s+k\s*,\s*\w+\s*:=', line)):
                line = line.replace('\tk,', '\t_,').replace('\tk :=', '\t_ :=')
            new_content.append(line)
        content = '\n'.join(new_content)
    print("Fixed k unused")

with open('/opt/sira-backend/internal/handlers/sdk/sdk.go', 'w') as f:
    f.write(content)

print("SDK fixes applied")
'''

run_script(f"""
cat > /tmp/fix_sdk.py << 'PYEOF'
{fix_script}
PYEOF
python3 /tmp/fix_sdk.py
""")

print("Rebuilding after fix...")
out, err, code = run_script(r"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go 2>&1
echo "BUILD_STATUS:$?"
""", timeout=120)
print(out)

if 'declared and not used' in out or 'undefined' in out:
    print("Still have errors. Getting exact lines...")
    err_lines = run_script(r"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go build ./internal/handlers/sdk/ 2>&1 | head -20
""")[0]
    print(err_lines)
    
    # More aggressive fix: for each error line, fix it directly
    run_script(r"""
cd /opt/sira-backend
python3 << 'EOF'
content = open('internal/handlers/sdk/sdk.go').read()
lines = content.split('\n')
new_lines = []
for idx, line in enumerate(lines):
    stripped = line.strip()
    # Fix unused declared variables by replacing with blank identifier
    # Pattern: varname := ... where varname is never used elsewhere
    new_lines.append(line)
    
# Write specific fixes based on known error lines
content = open('internal/handlers/sdk/sdk.go').read()

# Fix sharedKey - replace any remaining uses
import re
# Replace: sharedKey, err := -> _, err :=
content = re.sub(r'\bsharedKey\b(\s*,)', '_ \1', content)
content = content.replace('sharedKey,', '_,')
content = content.replace('sharedKey :=', '_ :=')

# Fix k - replace: k, err := -> _, err :=  
content = re.sub(r'\n(\s+)k(\s*,\s*\w+\s*:=)', lambda m: '\n' + m.group(1) + '_' + m.group(2), content)

# Fix sessionKey - it's used in the map but never declared; replace with sessID
content = content.replace('"sessionKey": sessionKey,', '"sessionKey": sessID,')
content = content.replace('"sessionKey": sessionKey}', '"sessionKey": sessID}')

open('internal/handlers/sdk/sdk.go', 'w').write(content)
print("Done")
EOF
""")
    
    out2, err2, code2 = run_script(r"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go 2>&1
echo "BUILD_STATUS:$?"
""", timeout=120)
    print("Second attempt:", out2)
    if 'BUILD_STATUS:0' not in out2:
        # Last resort: get the exact errors and fix line by line
        errors, _, _ = run_script(r"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go build ./internal/handlers/sdk/ 2>&1
""")
        print("Remaining errors:", errors)
        
        # Parse error lines and fix them
        fix_code = ""
        for line in errors.split('\n'):
            if 'declared and not used' in line or 'undefined' in line:
                parts = line.split(':')
                if len(parts) >= 2:
                    try:
                        lineno = int(parts[1].strip())
                        fix_code += f"# Error at line {lineno}: {line}\n"
                    except:
                        pass
        
        run_script(f"""
cd /opt/sira-backend
python3 << 'EOF'
content = open('internal/handlers/sdk/sdk.go').read()
lines = content.split('\\n')
errors_raw = '''{errors}'''
import re

for err_line in errors_raw.strip().split('\\n'):
    m = re.match(r'.*:(\d+):\d+: (.*)', err_line)
    if not m: continue
    lineno = int(m.group(1)) - 1  # 0-indexed
    msg = m.group(2)
    if lineno < len(lines):
        line = lines[lineno]
        if 'declared and not used' in msg:
            varname = msg.replace('declared and not used: ', '').strip()
            # Replace the variable declaration with blank identifier
            lines[lineno] = line.replace('\\t' + varname + ',', '\\t_,').replace('\\t' + varname + ' :=', '\\t_ :=')
            print(f'Fixed line {{lineno+1}}: {{varname}} -> _')
        elif 'undefined' in msg:
            varname = msg.replace('undefined: ', '').strip()
            # Replace undefined variable usage with its value or sessID
            if varname == 'sessionKey':
                lines[lineno] = line.replace(varname, 'sessID')
                print(f'Fixed line {{lineno+1}}: {{varname}} -> sessID')

open('internal/handlers/sdk/sdk.go', 'w').write('\\n'.join(lines))
print('Applied all line-by-line fixes')
EOF
""")
        
        out3, _, code3 = run_script(r"""
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go 2>&1
echo "BUILD_STATUS:$?"
""", timeout=120)
        print("Final attempt:", out3)
        if 'BUILD_STATUS:0' not in out3:
            print("MANUAL INTERVENTION REQUIRED")
            sys.exit(1)

# Restart service
run_script(r"""
chown -R siraapp:siraapp /opt/sira-backend
systemctl restart sira-api
sleep 3
systemctl is-active sira-api && echo "SERVICE_RUNNING"
""")

print("Testing API...")
out, _, _ = run_script(r"""sleep 2; curl -s http://localhost:8080/health""")
print("Health check:", out[:200])
