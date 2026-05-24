#!/usr/bin/env python3
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

out, _, _ = run_script("sed -n '35,70p' /opt/sira-backend/internal/handlers/sdk/sdk.go")
print("Lines 35-70 of sdk.go:")
print(out)
