#!/usr/bin/env python3
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

script = r"""
set -e
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend

go get github.com/golang-jwt/jwt/v5@latest
go get github.com/google/uuid@latest
go get golang.org/x/crypto@latest
go get github.com/gofiber/fiber/v2@latest
go get github.com/gofiber/websocket/v2@latest
go get github.com/jackc/pgx/v5@latest
go get github.com/redis/go-redis/v9@latest
go get github.com/joho/godotenv@latest
go get github.com/go-playground/validator/v10@latest
go get go.uber.org/zap@latest
go get github.com/robfig/cron/v3@latest
go mod tidy
echo "ALL_DEPS_DONE"
go build ./internal/crypto/...
echo "CRYPTO_BUILD_OK"
"""
out, err, code = run_script(script, timeout=180)
if code != 0:
    print(f"Error: {err}")
    sys.exit(1)
print("Phase 3 crypto layer complete!")
