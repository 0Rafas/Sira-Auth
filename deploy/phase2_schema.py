#!/usr/bin/env python3
"""Phase 2: Create all database migrations and run them."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script, run

BASE = "/opt/sira-backend"

def write_migration(num, name, up_sql, down_sql=""):
    import base64
    up_path = f"{BASE}/migrations/{num:04d}_{name}.up.sql"
    dn_path = f"{BASE}/migrations/{num:04d}_{name}.down.sql"
    enc_up = base64.b64encode(up_sql.encode()).decode()
    enc_dn = base64.b64encode((down_sql or f"-- drop {name}").encode()).decode()
    script = f"""
echo '{enc_up}' | base64 -d > '{up_path}'
echo '{enc_dn}' | base64 -d > '{dn_path}'
echo "Written migration {num:04d}_{name}"
"""
    run_script(script)

print("=" * 60)
print("PHASE 2: Writing migration files")
print("=" * 60)

# ── 0001: extensions ─────────────────────────────────────────
write_migration(1, "extensions", """
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
""")

# ── 0002: plans ──────────────────────────────────────────────
write_migration(2, "plans", """
CREATE TABLE plans (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(50)  NOT NULL UNIQUE,
    slug          VARCHAR(50)  NOT NULL UNIQUE,
    price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
    price_yearly  NUMERIC(10,2) NOT NULL DEFAULT 0,
    max_apps      INTEGER NOT NULL DEFAULT 2,
    max_tokens    INTEGER NOT NULL DEFAULT 1,
    max_licenses  INTEGER NOT NULL DEFAULT 100,
    max_users     INTEGER NOT NULL DEFAULT 130,
    max_subs      INTEGER NOT NULL DEFAULT 5,
    anti_crack    BOOLEAN NOT NULL DEFAULT FALSE,
    promotion     BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
""")

# ── 0003: users ──────────────────────────────────────────────
write_migration(3, "users", """
CREATE TABLE users (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username       VARCHAR(50)  NOT NULL UNIQUE,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  TEXT         NOT NULL,
    role           VARCHAR(20)  NOT NULL DEFAULT 'developer',
    plan_id        UUID REFERENCES plans(id) ON DELETE SET NULL,
    plan_expiry    TIMESTAMPTZ,
    avatar_url     TEXT,
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    totp_secret    TEXT,
    totp_enabled   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email    ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_plan_id  ON users(plan_id);
""")

# ── 0004: user_sessions ──────────────────────────────────────
write_migration(4, "user_sessions", """
CREATE TABLE user_sessions (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL UNIQUE,
    ip            INET,
    user_agent    TEXT,
    expires_at    TIMESTAMPTZ NOT NULL,
    revoked       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token   ON user_sessions(refresh_token);
""")

# ── 0005: login_attempts ─────────────────────────────────────
write_migration(5, "login_attempts", """
CREATE TABLE login_attempts (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(255) NOT NULL,
    ip         INET,
    success    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_identifier ON login_attempts(identifier, created_at);
CREATE INDEX idx_login_attempts_ip         ON login_attempts(ip, created_at);
""")

# ── 0006: audit_logs ─────────────────────────────────────────
write_migration(6, "audit_logs", """
CREATE TABLE audit_logs (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    action     VARCHAR(100) NOT NULL,
    resource   VARCHAR(100),
    resource_id TEXT,
    ip         INET,
    user_agent TEXT,
    metadata   JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id    ON audit_logs(user_id, created_at);
CREATE INDEX idx_audit_logs_action     ON audit_logs(action, created_at);
CREATE INDEX idx_audit_logs_resource   ON audit_logs(resource, resource_id);
""")

# ── 0007: applications ───────────────────────────────────────
write_migration(7, "applications", """
CREATE TABLE applications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    version         VARCHAR(50)  NOT NULL DEFAULT '1.0.0',
    description     TEXT,
    status          VARCHAR(20)  NOT NULL DEFAULT 'active',
    total_users     INTEGER NOT NULL DEFAULT 0,
    active_sessions INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_owner_id ON applications(owner_id);
""")

# ── 0008: app_secrets ────────────────────────────────────────
write_migration(8, "app_secrets", """
CREATE TABLE app_secrets (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id     UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    secret     TEXT NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_app_secrets_app_id ON app_secrets(app_id);
CREATE INDEX idx_app_secrets_active ON app_secrets(app_id, is_active);
""")

# ── 0009: app_keypairs ───────────────────────────────────────
write_migration(9, "app_keypairs", """
CREATE TABLE app_keypairs (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id       UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE UNIQUE,
    private_key  TEXT NOT NULL,
    public_key   TEXT NOT NULL,
    algorithm    VARCHAR(20) NOT NULL DEFAULT 'ECDSA-P256',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
""")

# ── 0010: tokens ─────────────────────────────────────────────
write_migration(10, "tokens", """
CREATE TABLE tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id      UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    token_hash  TEXT NOT NULL UNIQUE,
    token_prefix VARCHAR(20) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]',
    last_used_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tokens_app_id    ON tokens(app_id);
CREATE INDEX idx_tokens_hash      ON tokens(token_hash);
""")

# ── 0011: subscriptions ──────────────────────────────────────
write_migration(11, "subscriptions", """
CREATE TABLE subscriptions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id      UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    level       INTEGER NOT NULL DEFAULT 1,
    price       NUMERIC(10,2) NOT NULL DEFAULT 0,
    duration    INTEGER NOT NULL DEFAULT 30,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_app_id ON subscriptions(app_id);
""")

# ── 0012: app_users ──────────────────────────────────────────
write_migration(12, "app_users", """
CREATE TABLE app_users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id              UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    username            VARCHAR(100) NOT NULL,
    email               VARCHAR(255),
    password_hash       TEXT NOT NULL,
    ip                  INET,
    hwid                TEXT,
    hwid_locked         BOOLEAN NOT NULL DEFAULT FALSE,
    status              VARCHAR(20) NOT NULL DEFAULT 'active',
    ban_reason          TEXT,
    subscription_id     UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    subscription_expiry TIMESTAMPTZ,
    two_factor          BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(app_id, username)
);

CREATE INDEX idx_app_users_app_id   ON app_users(app_id);
CREATE INDEX idx_app_users_username ON app_users(app_id, username);
CREATE INDEX idx_app_users_hwid     ON app_users(hwid) WHERE hwid IS NOT NULL;
""")

# ── 0013: hwid_history ───────────────────────────────────────
write_migration(13, "hwid_history", """
CREATE TABLE hwid_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    old_hwid    TEXT,
    new_hwid    TEXT,
    reset_by    UUID REFERENCES users(id) ON DELETE SET NULL,
    reason      TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hwid_history_user ON hwid_history(app_user_id);
""")

# ── 0014: licenses ───────────────────────────────────────────
write_migration(14, "licenses", """
CREATE TABLE licenses (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id      UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    key         TEXT NOT NULL UNIQUE,
    signature   TEXT,
    level       INTEGER NOT NULL DEFAULT 1,
    status      VARCHAR(20) NOT NULL DEFAULT 'unused',
    user_id     UUID REFERENCES app_users(id) ON DELETE SET NULL,
    max_uses    INTEGER NOT NULL DEFAULT 1,
    uses        INTEGER NOT NULL DEFAULT 0,
    expires_at  TIMESTAMPTZ,
    duration    INTEGER,
    note        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_licenses_app_id ON licenses(app_id);
CREATE INDEX idx_licenses_key    ON licenses(key);
CREATE INDEX idx_licenses_user   ON licenses(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_licenses_status ON licenses(app_id, status);
""")

# ── 0015: license_uses ───────────────────────────────────────
write_migration(15, "license_uses", """
CREATE TABLE license_uses (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id  UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    app_user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
    ip          INET,
    hwid        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_license_uses_license ON license_uses(license_id);
""")

# ── 0016: app_sessions ───────────────────────────────────────
write_migration(16, "app_sessions", """
CREATE TABLE app_sessions (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id       UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    app_user_id  UUID REFERENCES app_users(id) ON DELETE SET NULL,
    username     VARCHAR(100) NOT NULL,
    ip           INET,
    country      VARCHAR(5),
    session_key  TEXT,
    validated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at   TIMESTAMPTZ NOT NULL,
    killed       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_app_sessions_app_id  ON app_sessions(app_id);
CREATE INDEX idx_app_sessions_user    ON app_sessions(app_user_id) WHERE app_user_id IS NOT NULL;
CREATE INDEX idx_app_sessions_active  ON app_sessions(app_id, killed, expires_at);
""")

# ── 0017: webhooks ───────────────────────────────────────────
write_migration(17, "webhooks", """
CREATE TABLE webhooks (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id     UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    url        TEXT NOT NULL,
    secret     TEXT,
    events     JSONB NOT NULL DEFAULT '[]',
    status     VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_deliveries (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id  UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event       VARCHAR(100) NOT NULL,
    payload     JSONB,
    status_code INTEGER,
    response    TEXT,
    attempts    INTEGER NOT NULL DEFAULT 0,
    next_retry  TIMESTAMPTZ,
    delivered   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhooks_app_id ON webhooks(app_id);
CREATE INDEX idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_retry   ON webhook_deliveries(next_retry) WHERE NOT delivered;
""")

# ── 0018: app_files ──────────────────────────────────────────
write_migration(18, "app_files", """
CREATE TABLE app_files (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id         UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    name           VARCHAR(255) NOT NULL,
    path           TEXT NOT NULL,
    url            TEXT NOT NULL,
    size           BIGINT NOT NULL DEFAULT 0,
    mime_type      VARCHAR(100),
    required_level INTEGER NOT NULL DEFAULT 0,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_app_files_app_id ON app_files(app_id);
""")

# ── 0019: variables ──────────────────────────────────────────
write_migration(19, "variables", """
CREATE TABLE variables (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id      UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    app_user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    value       TEXT NOT NULL,
    is_secret   BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(app_id, app_user_id, name)
);

CREATE INDEX idx_variables_app_id ON variables(app_id);
CREATE INDEX idx_variables_user   ON variables(app_user_id) WHERE app_user_id IS NOT NULL;
""")

# ── 0020: rules ──────────────────────────────────────────────
write_migration(20, "rules", """
CREATE TABLE rules (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id     UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,
    type       VARCHAR(50) NOT NULL,
    value      TEXT NOT NULL,
    action     VARCHAR(20) NOT NULL DEFAULT 'block',
    enabled    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rules_app_id  ON rules(app_id);
CREATE INDEX idx_rules_enabled ON rules(app_id, enabled, type);
""")

# ── 0021: chat ───────────────────────────────────────────────
write_migration(21, "chat", """
CREATE TABLE chat_channels (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id     UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(app_id, name)
);

CREATE TABLE chat_messages (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id     UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
    username   VARCHAR(100) NOT NULL,
    content    TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_channels_app    ON chat_channels(app_id);
CREATE INDEX idx_chat_messages_channel ON chat_messages(channel_id, created_at);
""")

# ── 0022: event_logs ─────────────────────────────────────────
write_migration(22, "event_logs", """
CREATE TABLE event_logs (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    app_id     UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id    UUID REFERENCES app_users(id) ON DELETE SET NULL,
    type       VARCHAR(100) NOT NULL,
    message    TEXT NOT NULL,
    ip         INET,
    metadata   JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_logs_app_id ON event_logs(app_id, created_at DESC);
CREATE INDEX idx_event_logs_type   ON event_logs(app_id, type);
""")

print("\nRunning migrations against PostgreSQL...")
script = r"""
set -e
source /root/.sira_db_creds
export PGPASSWORD=${DB_PASS}

PG="psql -h 127.0.0.1 -U sira_user -d sira_auth"

run_migration() {
    local file=$1
    echo "Running: $(basename $file)"
    $PG -f "$file" -q
}

cd /opt/sira-backend/migrations

for f in $(ls *.up.sql | sort); do
    run_migration "$f"
done

echo "ALL_MIGRATIONS_DONE"
$PG -c "\dt" | grep -v "^$"
"""
out, err, code = run_script(script)
if code != 0:
    print(f"Migration error: {err}")
    sys.exit(1)

print("\nSeeding plans...")
script = r"""
set -e
source /root/.sira_db_creds
export PGPASSWORD=${DB_PASS}
PG="psql -h 127.0.0.1 -U sira_user -d sira_auth"

$PG << 'SEED'
-- Seed plans
INSERT INTO plans (name, slug, price_monthly, price_yearly, max_apps, max_tokens, max_licenses, max_users, max_subs, anti_crack, promotion, sort_order)
VALUES
  ('Basic',            'basic',     3.99,   44.00,  2,   1,   100,  130,    5, false, false, 1),
  ('Pro',              'pro',      15.99,  192.00, 15,  10,   400,  480,   20, false, false, 2),
  ('Ultra',            'ultra',    39.99,  480.00, 80,  35,   750, 1000,   60, true,  false, 3),
  ('Unlimited Edition','unlimited',149.00, 1800.00,-1,  -1,    -1,   -1,   -1, true,  true,  4)
ON CONFLICT (slug) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  price_yearly  = EXCLUDED.price_yearly;

SELECT name, slug, price_monthly, price_yearly, max_apps FROM plans ORDER BY sort_order;
SEED

echo "PLANS_SEEDED"
"""
run_script(script)

print("\nCreating migration runner in Go (embedded)...")

import base64
runner_code = '''package db

import (
\t"context"
\t"fmt"
\t"os"
\t"path/filepath"
\t"sort"
\t"strings"
)

// RunMigrations applies all .up.sql files in the migrations dir in order.
func RunMigrations(migrationsPath string) error {
\tentries, err := os.ReadDir(migrationsPath)
\tif err != nil {
\t\treturn fmt.Errorf("read migrations dir: %w", err)
\t}

\tvar files []string
\tfor _, e := range entries {
\t\tif !e.IsDir() && strings.HasSuffix(e.Name(), ".up.sql") {
\t\t\tfiles = append(files, filepath.Join(migrationsPath, e.Name()))
\t\t}
\t}
\tsort.Strings(files)

\tconn, err := Pool.Acquire(context.Background())
\tif err != nil {
\t\treturn fmt.Errorf("acquire conn: %w", err)
\t}
\tdefer conn.Release()

\t// Create migrations table
\t_, err = conn.Exec(context.Background(), `
\t\tCREATE TABLE IF NOT EXISTS schema_migrations (
\t\t\tfilename   TEXT PRIMARY KEY,
\t\t\tapplied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
\t\t)
\t`)
\tif err != nil {
\t\treturn fmt.Errorf("create migrations table: %w", err)
\t}

\tfor _, f := range files {
\t\tname := filepath.Base(f)
\t\tvar exists bool
\t\t_ = conn.QueryRow(context.Background(),
\t\t\t"SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE filename=$1)", name,
\t\t).Scan(&exists)
\t\tif exists {
\t\t\tcontinue
\t\t}

\t\tsql, err := os.ReadFile(f)
\t\tif err != nil {
\t\t\treturn fmt.Errorf("read %s: %w", name, err)
\t\t}

\t\t_, err = conn.Exec(context.Background(), string(sql))
\t\tif err != nil {
\t\t\treturn fmt.Errorf("run %s: %w", name, err)
\t\t}

\t\t_, err = conn.Exec(context.Background(),
\t\t\t"INSERT INTO schema_migrations(filename) VALUES($1)", name)
\t\tif err != nil {
\t\t\treturn fmt.Errorf("record migration %s: %w", name, err)
\t\t}
\t\tfmt.Printf("  Applied: %s\\n", name)
\t}
\tfmt.Println("Migrations up to date.")
\treturn nil
}
'''
enc = base64.b64encode(runner_code.encode()).decode()
run_script(f"echo '{enc}' | base64 -d > /opt/sira-backend/internal/db/migrate.go && echo 'migrate.go written'")

print("\nPhase 2 schema complete!")
print("All 22 tables created, plans seeded.")
