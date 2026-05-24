#!/usr/bin/env python3
"""Phase 0: Server setup script."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run, run_script

print("=" * 60)
print("PHASE 0: Installing Go 1.22")
print("=" * 60)
script = r"""
set -e
GO_VER=1.22.10
echo "Downloading Go $GO_VER..."
wget -q https://go.dev/dl/go${GO_VER}.linux-amd64.tar.gz -O /tmp/go.tar.gz
rm -rf /usr/local/go
tar -C /usr/local -xzf /tmp/go.tar.gz
rm /tmp/go.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' > /etc/profile.d/go.sh
export PATH=$PATH:/usr/local/go/bin
go version
echo "GO_DONE"
"""
_, _, code = run_script(script)
if code != 0:
    print("ERROR installing Go"); sys.exit(1)

print("\n" + "=" * 60)
print("PHASE 0: Installing Caddy")
print("=" * 60)
script = r"""
set -e
curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg 2>/dev/null
curl -fsSL https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt | tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq caddy 2>&1 | tail -2
caddy version
echo "CADDY_DONE"
"""
_, _, code = run_script(script)
if code != 0:
    print("ERROR installing Caddy"); sys.exit(1)

print("\n" + "=" * 60)
print("PHASE 0: Creating siraapp user + directories")
print("=" * 60)
script = r"""
set -e
# Create non-root user for the app
if ! id siraapp &>/dev/null; then
    useradd -m -s /bin/bash siraapp
    echo "User siraapp created"
else
    echo "User siraapp already exists"
fi

# Create directories
mkdir -p /opt/sira-backend
mkdir -p /var/log/sira
mkdir -p /var/sira/uploads
chown -R siraapp:siraapp /opt/sira-backend /var/log/sira /var/sira
chmod 750 /opt/sira-backend /var/log/sira /var/sira/uploads

echo "DIRS_DONE"
"""
_, _, code = run_script(script)
if code != 0:
    print("ERROR creating user/dirs"); sys.exit(1)

print("\n" + "=" * 60)
print("PHASE 0: Configuring PostgreSQL")
print("=" * 60)
script = r"""
set -e
systemctl enable postgresql
systemctl start postgresql

# Generate secure DB password
DB_PASS=$(openssl rand -base64 32 | tr -d '=/+' | head -c 40)

# Create DB user and database
sudo -u postgres psql -c "DROP USER IF EXISTS sira_user;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER sira_user WITH ENCRYPTED PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS sira_auth;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE sira_auth OWNER sira_user ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE sira_auth TO sira_user;"

# Save credentials
echo "DB_HOST=127.0.0.1" > /root/.sira_db_creds
echo "DB_PORT=5432" >> /root/.sira_db_creds
echo "DB_NAME=sira_auth" >> /root/.sira_db_creds
echo "DB_USER=sira_user" >> /root/.sira_db_creds
echo "DB_PASS=$DB_PASS" >> /root/.sira_db_creds
chmod 600 /root/.sira_db_creds

echo "DB_PASS=$DB_PASS"
echo "POSTGRES_CONFIG_DONE"
"""
out, _, code = run_script(script)
if code != 0:
    print("ERROR configuring PostgreSQL"); sys.exit(1)

print("\n" + "=" * 60)
print("PHASE 0: Configuring Redis")
print("=" * 60)
script = r"""
set -e
REDIS_PASS=$(openssl rand -base64 32 | tr -d '=/+' | head -c 40)

# Configure Redis for security
cat > /etc/redis/redis.conf << 'REDISCONF'
bind 127.0.0.1
protected-mode yes
port 6379
tcp-backlog 511
timeout 0
tcp-keepalive 300
daemonize yes
supervised systemd
pidfile /var/run/redis/redis-server.pid
loglevel notice
logfile /var/log/redis/redis-server.log
databases 16
save 900 1
save 300 10
save 60 10000
stop-writes-on-bgsave-error yes
rdbcompression yes
dir /var/lib/redis
maxmemory 2gb
maxmemory-policy allkeys-lru
REDISCONF

# Add password to config
echo "requirepass $REDIS_PASS" >> /etc/redis/redis.conf

systemctl enable redis-server
systemctl restart redis-server
sleep 1

redis-cli -a "$REDIS_PASS" ping

echo "REDIS_PASS=$REDIS_PASS" > /root/.sira_redis_creds
chmod 600 /root/.sira_redis_creds
echo "REDIS_CONFIG_DONE"
"""
out, _, code = run_script(script)
if code != 0:
    print("ERROR configuring Redis"); sys.exit(1)

print("\n" + "=" * 60)
print("PHASE 0: Configuring UFW Firewall")
print("=" * 60)
script = r"""
set -e
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 8080/tcp comment 'Sira API (temp)'
echo 'y' | ufw enable
ufw status verbose
echo "UFW_DONE"
"""
_, _, code = run_script(script)
if code != 0:
    print("ERROR configuring UFW"); sys.exit(1)

print("\n" + "=" * 60)
print("PHASE 0: Configuring fail2ban")
print("=" * 60)
script = r"""
set -e
cat > /etc/fail2ban/jail.local << 'F2BCONF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
backend = systemd

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
maxretry = 3
bantime = 24h
F2BCONF

systemctl enable fail2ban
systemctl restart fail2ban
sleep 1
fail2ban-client status
echo "FAIL2BAN_DONE"
"""
_, _, code = run_script(script)
if code != 0:
    print("ERROR configuring fail2ban"); sys.exit(1)

print("\n" + "=" * 60)
print("PHASE 0: Verifying all services")
print("=" * 60)
out, _, _ = run(r"""
export PATH=$PATH:/usr/local/go/bin
echo "=== Go ===" && go version
echo "=== PostgreSQL ===" && psql --version && systemctl is-active postgresql
echo "=== Redis ===" && redis-server --version && systemctl is-active redis-server
echo "=== Caddy ===" && caddy version && systemctl is-active caddy || echo "caddy not started yet (ok)"
echo "=== UFW ===" && ufw status | head -3
echo "=== Dirs ===" && ls -la /opt/sira-backend /var/log/sira
""")

print("\n✓ Phase 0 complete!")
print("Credentials saved to /root/.sira_db_creds and /root/.sira_redis_creds")
