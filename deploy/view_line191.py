#!/usr/bin/env python3
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

# View the Login function in sdk.go around line 191
out, _, _ = run_script("sed -n '170,220p' /opt/sira-backend/internal/handlers/sdk/sdk.go")
print("Lines 170-220:")
print(out)
