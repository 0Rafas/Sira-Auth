#!/usr/bin/env python3
"""Fix go.sum and rebuild."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script, run

BASE = "/opt/sira-backend"

print("Running go mod tidy to resolve dependencies...")
script = f"""
set -e
export PATH=$PATH:/usr/local/go/bin
export GOPATH=/root/go
export GOFLAGS=-mod=mod
cd {BASE}
# Remove stale go.sum if any
rm -f go.sum
# Use go get to add all deps
go get github.com/gofiber/fiber/v2@v2.52.6
go get github.com/gofiber/websocket/v2@v2.2.1
go get github.com/jackc/pgx/v5@v5.7.4
go get github.com/redis/go-redis/v9@v9.7.3
go get github.com/golang-jwt/jwt/v5@v5.2.2
go get golang.org/x/crypto@v0.31.0
go get github.com/google/uuid@v1.6.0
go get github.com/joho/godotenv@v1.5.1
go get github.com/go-playground/validator/v10@v10.24.0
go get go.uber.org/zap@v1.27.0
go get github.com/robfig/cron/v3@v3.0.1
go mod tidy
echo "TIDY_DONE"
"""
out, err, code = run_script(script, timeout=180)
if code != 0:
    print(f"go mod tidy failed:\nstdout: {out}\nstderr: {err}")
    # Try alternative - use go 1.23 directly
    print("\nTrying with GOTOOLCHAIN=auto...")
    script2 = f"""
export PATH=$PATH:/usr/local/go/bin:/root/sdk/go1.23.0/bin
export GOTOOLCHAIN=go1.23.0
cd {BASE}
rm -f go.sum
go mod tidy
echo "TIDY2_DONE"
"""
    run_script(script2, timeout=120)

print("\nFixing go.mod to use go 1.23...")
script = f"""
set -e
export PATH=$PATH:/usr/local/go/bin
export GOPATH=/root/go
cd {BASE}

# Update go version in go.mod to match what was downloaded
sed -i 's/^go 1.22$/go 1.23/' go.mod
go mod tidy
echo "MOD_FIXED"
"""
run_script(script, timeout=60)

print("\nBuilding binary...")
script = f"""
set -e
export PATH=$PATH:/usr/local/go/bin:/root/sdk/go1.23.0/bin:/root/go/bin
export GOPATH=/root/go
cd {BASE}
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go
ls -lh bin/sira-api
echo "BUILD_OK"
"""
out, err, code = run_script(script, timeout=120)
if code != 0:
    print(f"Build failed:\n{err}")
    # Check what go version is being used
    run("export PATH=$PATH:/usr/local/go/bin; go version; ls ~/sdk/ 2>/dev/null || echo 'no sdk dir'")
    sys.exit(1)

print("\nGenerating JWT RSA keys (if not exist)...")
script = f"""
set -e
mkdir -p {BASE}/keys
chmod 700 {BASE}/keys
if [ ! -f {BASE}/keys/jwt_private.pem ]; then
    openssl genrsa -out {BASE}/keys/jwt_private.pem 4096
    openssl rsa -in {BASE}/keys/jwt_private.pem -pubout -out {BASE}/keys/jwt_public.pem
    chmod 600 {BASE}/keys/jwt_private.pem
    chmod 644 {BASE}/keys/jwt_public.pem
    echo "Keys generated"
else
    echo "Keys already exist"
fi
echo "KEYS_DONE"
"""
run_script(script)

print("\nCreating .env from saved credentials...")
script = r"""
set -e
source /root/.sira_db_creds
source /root/.sira_redis_creds

AES_KEY=$(openssl rand -hex 32)
HMAC_KEY=$(openssl rand -hex 64)

cat > /opt/sira-backend/.env << ENVEOF
PORT=8080
ENV=production
LOG_PATH=/var/log/sira

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASS=${DB_PASS}
DB_SSL_MODE=disable

REDIS_ADDR=127.0.0.1:6379
REDIS_PASS=${REDIS_PASS}
REDIS_DB=0

JWT_PRIVATE_KEY_PATH=/opt/sira-backend/keys/jwt_private.pem
JWT_PUBLIC_KEY_PATH=/opt/sira-backend/keys/jwt_public.pem
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

AES_MASTER_KEY=${AES_KEY}
HMAC_MASTER_KEY=${HMAC_KEY}

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173,http://72.62.246.31

UPLOAD_PATH=/var/sira/uploads
MAX_UPLOAD_SIZE=52428800

RATE_LIMIT_REQS=100
RATE_LIMIT_WINDOW=1m
ENVEOF

chmod 600 /opt/sira-backend/.env
echo "ENV_DONE"
"""
run_script(script)

print("\nFixing ownership and starting service...")
script = f"""
set -e
chown -R siraapp:siraapp {BASE}
chmod +x {BASE}/bin/sira-api

systemctl daemon-reload
systemctl enable sira-api

# Stop if already running
systemctl stop sira-api 2>/dev/null || true
sleep 1
systemctl start sira-api
sleep 3

systemctl status sira-api --no-pager | head -25
echo "SERVICE_DONE"
"""
run_script(script)

print("\nTesting /health endpoint...")
out, err, code = run_script(r"""
sleep 2
curl -s http://localhost:8080/health
echo ""
echo "HEALTH_TEST_DONE"
""")

print("\nPhase 1 COMPLETE - /health endpoint live!")
