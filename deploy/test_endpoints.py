#!/usr/bin/env python3
"""Test all major endpoints after the full integration."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

print("=" * 60)
print("TESTING SIRA AUTH BACKEND ENDPOINTS")
print("=" * 60)

tests = [
    ("Health", "curl -s http://localhost:8080/health"),
    ("Register", """curl -s -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"integtest","email":"integtest@sira.dev","password":"Test@Password123"}'"""),
    ("Login", """curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"integtest","password":"Test@Password123"}'"""),
]

token = None
for name, cmd in tests:
    print(f"\n--- {name} ---")
    out, _, code = run_script(cmd)
    try:
        import json as j
        data = j.loads(out)
        print(f"Success: {data.get('success')}")
        if name == "Login" and data.get('data'):
            token = data['data'].get('token')
            user = data['data'].get('user', {})
            print(f"User: {user.get('username')} | Plan: {user.get('planName')}")
            print(f"Token: {token[:30]}..." if token else "No token")
            refresh = data['data'].get('refreshToken')
            print(f"RefreshToken: {refresh[:20]}..." if refresh else "No refreshToken")
    except Exception as e:
        print(f"Response: {out[:200]}")

if token:
    print("\n--- GetMe (with token) ---")
    out, _, _ = run_script(f"""curl -s http://localhost:8080/auth/me \
      -H "Authorization: Bearer {token}" """)
    try:
        data = j.loads(out)
        print(f"GetMe success: {data.get('success')}")
        if data.get('data'):
            print(f"User: {data['data'].get('username')} | Email: {data['data'].get('email')}")
    except:
        print(out[:200])
    
    print("\n--- Create App ---")
    out, _, _ = run_script(f"""curl -s -X POST http://localhost:8080/dashboard/apps \
      -H "Authorization: Bearer {token}" \
      -H "Content-Type: application/json" \
      -d '{{"name":"Test App","version":"1.0.0"}}'""")
    try:
        data = j.loads(out)
        print(f"Create app: {data.get('success')} | {data.get('data',{}).get('id','')[:20]}")
        app_id = data.get('data',{}).get('id')
    except:
        print(out[:200])
        app_id = None
    
    if app_id:
        print("\n--- Dashboard Stats ---")
        out, _, _ = run_script(f"""curl -s http://localhost:8080/dashboard/stats \
          -H "Authorization: Bearer {token}" """)
        try:
            data = j.loads(out)
            stats = data.get('data', {})
            print(f"Stats: apps={stats.get('totalApps')}, licenses={stats.get('totalLicenses')}, users={stats.get('totalUsers')}")
        except:
            print(out[:200])

print("\n" + "=" * 60)
print("ALL TESTS COMPLETE")
print("=" * 60)
