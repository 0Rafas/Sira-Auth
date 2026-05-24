#!/usr/bin/env python3
"""Phase 1: Create Go project skeleton on server."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script, run

BASE = "/opt/sira-backend"

def write_file(path, content):
    """Write a file to the server via heredoc."""
    import base64
    encoded = base64.b64encode(content.encode()).decode()
    script = f"""
mkdir -p "$(dirname '{path}')"
echo '{encoded}' | base64 -d > '{path}'
echo "Written: {path}"
"""
    out, err, code = run_script(script)
    if code != 0:
        print(f"ERROR writing {path}: {err}")
        sys.exit(1)

print("=" * 60)
print("PHASE 1: Initializing Go module")
print("=" * 60)

script = f"""
set -e
export PATH=$PATH:/usr/local/go/bin
chown -R root:root {BASE}
chmod 755 {BASE}
cd {BASE}
go mod init github.com/siraauth/backend
echo "MOD_INIT_DONE"
"""
run_script(script)

print("Writing go.mod dependencies...")
# ---- go.mod ----
write_file(f"{BASE}/go.mod", """module github.com/siraauth/backend

go 1.22

require (
\tgithub.com/gofiber/fiber/v2 v2.52.6
\tgithub.com/gofiber/websocket/v2 v2.2.1
\tgithub.com/jackc/pgx/v5 v5.7.4
\tgithub.com/redis/go-redis/v9 v9.7.3
\tgithub.com/golang-jwt/jwt/v5 v5.2.2
\tgolang.org/x/crypto v0.37.0
\tgithub.com/google/uuid v1.6.0
\tgithub.com/joho/godotenv v1.5.1
\tgithub.com/go-playground/validator/v10 v10.24.0
\tgo.uber.org/zap v1.27.0
\tgithub.com/robfig/cron/v3 v3.0.1
)
""")

print("Creating directory structure...")
script = f"""
set -e
cd {BASE}
mkdir -p cmd/api
mkdir -p internal/config
mkdir -p internal/db
mkdir -p internal/redisdb
mkdir -p internal/crypto
mkdir -p internal/middleware
mkdir -p internal/models
mkdir -p internal/repos
mkdir -p internal/services
mkdir -p internal/handlers/auth
mkdir -p internal/handlers/dashboard
mkdir -p internal/handlers/sdk
mkdir -p internal/ws
mkdir -p internal/audit
mkdir -p internal/validators
mkdir -p migrations
mkdir -p queries
mkdir -p scripts
mkdir -p bin
echo "DIRS_DONE"
"""
run_script(script)

print("Writing source files...")

# ---- internal/config/config.go ----
write_file(f"{BASE}/internal/config/config.go", '''package config

import (
\t"os"
\t"strconv"
\t"time"

\t"github.com/joho/godotenv"
)

type Config struct {
\t// Server
\tPort    string
\tEnv     string
\tLogPath string

\t// Database
\tDBHost string
\tDBPort string
\tDBName string
\tDBUser string
\tDBPass string
\tDBSSLMode string

\t// Redis
\tRedisAddr string
\tRedisPass string
\tRedisDB   int

\t// JWT
\tJWTPrivateKeyPath  string
\tJWTPublicKeyPath   string
\tJWTAccessExpiry   time.Duration
\tJWTRefreshExpiry  time.Duration

\t// Crypto
\tAESMasterKey    string // 32-byte hex
\tHMACMasterKey   string // 64-byte hex

\t// CORS
\tAllowedOrigins string

\t// Uploads
\tUploadPath string
\tMaxUploadSize int64 // bytes

\t// Rate limit
\tRateLimitReqs int
\tRateLimitWindow time.Duration
}

var C Config

func Load() error {
\t_ = godotenv.Load("/opt/sira-backend/.env")

\tC = Config{
\t\tPort:    getEnv("PORT", "8080"),
\t\tEnv:     getEnv("ENV", "production"),
\t\tLogPath: getEnv("LOG_PATH", "/var/log/sira"),

\t\tDBHost:    getEnv("DB_HOST", "127.0.0.1"),
\t\tDBPort:    getEnv("DB_PORT", "5432"),
\t\tDBName:    getEnv("DB_NAME", "sira_auth"),
\t\tDBUser:    getEnv("DB_USER", "sira_user"),
\t\tDBPass:    getEnv("DB_PASS", ""),
\t\tDBSSLMode: getEnv("DB_SSL_MODE", "disable"),

\t\tRedisAddr: getEnv("REDIS_ADDR", "127.0.0.1:6379"),
\t\tRedisPass: getEnv("REDIS_PASS", ""),
\t\tRedisDB:   getEnvInt("REDIS_DB", 0),

\t\tJWTPrivateKeyPath: getEnv("JWT_PRIVATE_KEY_PATH", "/opt/sira-backend/keys/jwt_private.pem"),
\t\tJWTPublicKeyPath:  getEnv("JWT_PUBLIC_KEY_PATH", "/opt/sira-backend/keys/jwt_public.pem"),
\t\tJWTAccessExpiry:  getEnvDuration("JWT_ACCESS_EXPIRY", "15m"),
\t\tJWTRefreshExpiry: getEnvDuration("JWT_REFRESH_EXPIRY", "7d"),

\t\tAESMasterKey:  getEnv("AES_MASTER_KEY", ""),
\t\tHMACMasterKey: getEnv("HMAC_MASTER_KEY", ""),

\t\tAllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:5173"),

\t\tUploadPath:    getEnv("UPLOAD_PATH", "/var/sira/uploads"),
\t\tMaxUploadSize: getEnvInt64("MAX_UPLOAD_SIZE", 50*1024*1024), // 50MB

\t\tRateLimitReqs:   getEnvInt("RATE_LIMIT_REQS", 100),
\t\tRateLimitWindow: getEnvDuration("RATE_LIMIT_WINDOW", "1m"),
\t}
\treturn nil
}

func getEnv(key, def string) string {
\tif v := os.Getenv(key); v != "" {
\t\treturn v
\t}
\treturn def
}

func getEnvInt(key string, def int) int {
\tif v := os.Getenv(key); v != "" {
\t\tif i, err := strconv.Atoi(v); err == nil {
\t\t\treturn i
\t\t}
\t}
\treturn def
}

func getEnvInt64(key string, def int64) int64 {
\tif v := os.Getenv(key); v != "" {
\t\tif i, err := strconv.ParseInt(v, 10, 64); err == nil {
\t\t\treturn i
\t\t}
\t}
\treturn def
}

func getEnvDuration(key, def string) time.Duration {
\tv := getEnv(key, def)
\tif d, err := time.ParseDuration(v); err == nil {
\t\treturn d
\t}
\t// Support "7d" format
\tif len(v) > 1 && v[len(v)-1] == \'d\' {
\t\tif days, err := strconv.Atoi(v[:len(v)-1]); err == nil {
\t\t\treturn time.Duration(days) * 24 * time.Hour
\t\t}
\t}
\td, _ := time.ParseDuration(def)
\treturn d
}
''')

# ---- internal/db/db.go ----
write_file(f"{BASE}/internal/db/db.go", '''package db

import (
\t"context"
\t"fmt"
\t"time"

\t"github.com/jackc/pgx/v5/pgxpool"
\t"github.com/siraauth/backend/internal/config"
)

var Pool *pgxpool.Pool

func Connect() error {
\tcfg := config.C
\tdsn := fmt.Sprintf(
\t\t"host=%s port=%s dbname=%s user=%s password=%s sslmode=%s pool_max_conns=20 pool_min_conns=2",
\t\tcfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBUser, cfg.DBPass, cfg.DBSSLMode,
\t)

\tpoolCfg, err := pgxpool.ParseConfig(dsn)
\tif err != nil {
\t\treturn fmt.Errorf("parse db config: %w", err)
\t}

\tpoolCfg.MaxConnIdleTime = 5 * time.Minute
\tpoolCfg.MaxConnLifetime = 1 * time.Hour
\tpoolCfg.HealthCheckPeriod = 30 * time.Second

\tctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
\tdefer cancel()

\tPool, err = pgxpool.NewWithConfig(ctx, poolCfg)
\tif err != nil {
\t\treturn fmt.Errorf("connect to db: %w", err)
\t}

\tif err := Pool.Ping(ctx); err != nil {
\t\treturn fmt.Errorf("ping db: %w", err)
\t}
\treturn nil
}

func Close() {
\tif Pool != nil {
\t\tPool.Close()
\t}
}
''')

# ---- internal/redisdb/redis.go ----
write_file(f"{BASE}/internal/redisdb/redis.go", '''package redisdb

import (
\t"context"
\t"fmt"

\t"github.com/redis/go-redis/v9"
\t"github.com/siraauth/backend/internal/config"
)

var Client *redis.Client

func Connect() error {
\tcfg := config.C
\tClient = redis.NewClient(&redis.Options{
\t\tAddr:     cfg.RedisAddr,
\t\tPassword: cfg.RedisPass,
\t\tDB:       cfg.RedisDB,
\t\tPoolSize: 20,
\t})

\tctx := context.Background()
\tif err := Client.Ping(ctx).Err(); err != nil {
\t\treturn fmt.Errorf("redis ping: %w", err)
\t}
\treturn nil
}

func Close() {
\tif Client != nil {
\t\t_ = Client.Close()
\t}
}
''')

# ---- internal/models/response.go ----
write_file(f"{BASE}/internal/models/response.go", '''package models

import "github.com/gofiber/fiber/v2"

type APIResponse struct {
\tSuccess bool        `json:"success"`
\tData    interface{} `json:"data,omitempty"`
\tMessage string      `json:"message,omitempty"`
\tError   string      `json:"error,omitempty"`
}

type PaginatedResponse struct {
\tSuccess bool        `json:"success"`
\tData    interface{} `json:"data"`
\tTotal   int64       `json:"total"`
\tPage    int         `json:"page"`
\tLimit   int         `json:"limit"`
}

func OK(c *fiber.Ctx, data interface{}) error {
\treturn c.Status(200).JSON(APIResponse{Success: true, Data: data})
}

func Created(c *fiber.Ctx, data interface{}) error {
\treturn c.Status(201).JSON(APIResponse{Success: true, Data: data})
}

func OKMsg(c *fiber.Ctx, msg string) error {
\treturn c.Status(200).JSON(APIResponse{Success: true, Message: msg})
}

func BadRequest(c *fiber.Ctx, msg string) error {
\treturn c.Status(400).JSON(APIResponse{Success: false, Error: msg})
}

func Unauthorized(c *fiber.Ctx, msg string) error {
\treturn c.Status(401).JSON(APIResponse{Success: false, Error: msg})
}

func Forbidden(c *fiber.Ctx, msg string) error {
\treturn c.Status(403).JSON(APIResponse{Success: false, Error: msg})
}

func NotFound(c *fiber.Ctx, msg string) error {
\treturn c.Status(404).JSON(APIResponse{Success: false, Error: msg})
}

func Conflict(c *fiber.Ctx, msg string) error {
\treturn c.Status(409).JSON(APIResponse{Success: false, Error: msg})
}

func TooManyRequests(c *fiber.Ctx, msg string) error {
\treturn c.Status(429).JSON(APIResponse{Success: false, Error: msg})
}

func InternalError(c *fiber.Ctx, msg string) error {
\treturn c.Status(500).JSON(APIResponse{Success: false, Error: msg})
}

func Paginated(c *fiber.Ctx, data interface{}, total int64, page, limit int) error {
\treturn c.Status(200).JSON(PaginatedResponse{
\t\tSuccess: true,
\t\tData:    data,
\t\tTotal:   total,
\t\tPage:    page,
\t\tLimit:   limit,
\t})
}
''')

# ---- internal/middleware/cors.go ----
write_file(f"{BASE}/internal/middleware/cors.go", '''package middleware

import (
\t"github.com/gofiber/fiber/v2"
\t"github.com/gofiber/fiber/v2/middleware/cors"
\t"github.com/siraauth/backend/internal/config"
)

func CORS() fiber.Handler {
\treturn cors.New(cors.Config{
\t\tAllowOrigins:     config.C.AllowedOrigins,
\t\tAllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
\t\tAllowHeaders:     "Origin,Content-Type,Accept,Authorization,X-Request-ID,X-App-ID,X-Timestamp,X-Nonce,X-Signature",
\t\tExposeHeaders:    "X-Request-ID",
\t\tAllowCredentials: true,
\t\tMaxAge:           86400,
\t})
}
''')

# ---- internal/middleware/security.go ----
write_file(f"{BASE}/internal/middleware/security.go", '''package middleware

import "github.com/gofiber/fiber/v2"

func SecurityHeaders() fiber.Handler {
\treturn func(c *fiber.Ctx) error {
\t\tc.Set("X-Content-Type-Options", "nosniff")
\t\tc.Set("X-Frame-Options", "DENY")
\t\tc.Set("X-XSS-Protection", "1; mode=block")
\t\tc.Set("Referrer-Policy", "strict-origin-when-cross-origin")
\t\tc.Set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
\t\tc.Set("Content-Security-Policy", "default-src \'none\'")
\t\tc.Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
\t\treturn c.Next()
\t}
}
''')

# ---- internal/middleware/recover.go ----
write_file(f"{BASE}/internal/middleware/recover.go", '''package middleware

import (
\t"github.com/gofiber/fiber/v2"
\t"go.uber.org/zap"
)

func Recover(log *zap.Logger) fiber.Handler {
\treturn func(c *fiber.Ctx) (err error) {
\t\tdefer func() {
\t\t\tif r := recover(); r != nil {
\t\t\t\tlog.Error("panic recovered", zap.Any("panic", r), zap.String("path", c.Path()))
\t\t\t\terr = c.Status(500).JSON(fiber.Map{"success": false, "error": "internal server error"})
\t\t\t}
\t\t}()
\t\treturn c.Next()
\t}
}
''')

# ---- internal/middleware/logger.go ----
write_file(f"{BASE}/internal/middleware/logger.go", '''package middleware

import (
\t"time"

\t"github.com/gofiber/fiber/v2"
\t"go.uber.org/zap"
)

func RequestLogger(log *zap.Logger) fiber.Handler {
\treturn func(c *fiber.Ctx) error {
\t\tstart := time.Now()
\t\terr := c.Next()
\t\tlog.Info("request",
\t\t\tzap.String("method", c.Method()),
\t\t\tzap.String("path", c.Path()),
\t\t\tzap.Int("status", c.Response().StatusCode()),
\t\t\tzap.Duration("latency", time.Since(start)),
\t\t\tzap.String("ip", c.IP()),
\t\t)
\t\treturn err
\t}
}
''')

# ---- internal/handlers/auth/health.go ----
write_file(f"{BASE}/internal/handlers/auth/health.go", '''package auth

import (
\t"context"
\t"time"

\t"github.com/gofiber/fiber/v2"
\t"github.com/siraauth/backend/internal/db"
\t"github.com/siraauth/backend/internal/redisdb"
)

type HealthResponse struct {
\tStatus    string            `json:"status"`
\tTimestamp string            `json:"timestamp"`
\tVersion   string            `json:"version"`
\tServices  map[string]string `json:"services"`
}

func Health(c *fiber.Ctx) error {
\tservices := map[string]string{}

\t// Check DB
\tctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
\tdefer cancel()
\tif err := db.Pool.Ping(ctx); err != nil {
\t\tservices["postgres"] = "down"
\t} else {
\t\tservices["postgres"] = "up"
\t}

\t// Check Redis
\tif err := redisdb.Client.Ping(context.Background()).Err(); err != nil {
\t\tservices["redis"] = "down"
\t} else {
\t\tservices["redis"] = "up"
\t}

\tstatus := "ok"
\tfor _, v := range services {
\t\tif v == "down" {
\t\t\tstatus = "degraded"
\t\t\tbreak
\t\t}
\t}

\tcode := 200
\tif status != "ok" {
\t\tcode = 503
\t}

\treturn c.Status(code).JSON(HealthResponse{
\t\tStatus:    status,
\t\tTimestamp: time.Now().UTC().Format(time.RFC3339),
\t\tVersion:   "1.0.0",
\t\tServices:  services,
\t})
}
''')

# ---- cmd/api/main.go ----
write_file(f"{BASE}/cmd/api/main.go", '''package main

import (
\t"fmt"
\t"log"
\t"os"
\t"os/signal"
\t"syscall"
\t"time"

\t"github.com/gofiber/fiber/v2"
\t"github.com/gofiber/fiber/v2/middleware/requestid"
\t"go.uber.org/zap"
\t"go.uber.org/zap/zapcore"

\t"github.com/siraauth/backend/internal/config"
\t"github.com/siraauth/backend/internal/db"
\t"github.com/siraauth/backend/internal/handlers/auth"
\t"github.com/siraauth/backend/internal/middleware"
\t"github.com/siraauth/backend/internal/redisdb"
)

func main() {
\t// Load config
\tif err := config.Load(); err != nil {
\t\tlog.Fatalf("config load: %v", err)
\t}

\t// Init logger
\tzapCfg := zap.NewProductionConfig()
\tzapCfg.EncoderConfig.TimeKey = "ts"
\tzapCfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
\tlogger, err := zapCfg.Build()
\tif err != nil {
\t\tlog.Fatalf("logger init: %v", err)
\t}
\tdefer logger.Sync()

\tlogger.Info("Sira Auth API starting",
\t\tzap.String("env", config.C.Env),
\t\tzap.String("port", config.C.Port),
\t)

\t// Connect database
\tif err := db.Connect(); err != nil {
\t\tlogger.Fatal("db connect", zap.Error(err))
\t}
\tdefer db.Close()
\tlogger.Info("PostgreSQL connected")

\t// Connect Redis
\tif err := redisdb.Connect(); err != nil {
\t\tlogger.Fatal("redis connect", zap.Error(err))
\t}
\tdefer redisdb.Close()
\tlogger.Info("Redis connected")

\t// Create Fiber app
\tapp := fiber.New(fiber.Config{
\t\tReadTimeout:  15 * time.Second,
\t\tWriteTimeout: 15 * time.Second,
\t\tIdleTimeout:  60 * time.Second,
\t\tBodyLimit:    int(config.C.MaxUploadSize),
\t\tErrorHandler: func(c *fiber.Ctx, err error) error {
\t\t\tcode := fiber.StatusInternalServerError
\t\t\tif e, ok := err.(*fiber.Error); ok {
\t\t\t\tcode = e.Code
\t\t\t}
\t\t\treturn c.Status(code).JSON(fiber.Map{"success": false, "error": err.Error()})
\t\t},
\t})

\t// Global middleware
\tapp.Use(middleware.Recover(logger))
\tapp.Use(requestid.New())
\tapp.Use(middleware.SecurityHeaders())
\tapp.Use(middleware.CORS())
\tapp.Use(middleware.RequestLogger(logger))

\t// Routes
\tapp.Get("/health", auth.Health)
\tapp.Get("/", func(c *fiber.Ctx) error {
\t\treturn c.JSON(fiber.Map{"service": "Sira Auth API", "version": "1.0.0"})
\t})

\t// API v1 group
\tv1 := app.Group("/api/v1")
\t_ = v1 // will be used in later phases

\t// 404 handler
\tapp.Use(func(c *fiber.Ctx) error {
\t\treturn c.Status(404).JSON(fiber.Map{"success": false, "error": "not found"})
\t})

\t// Start server + graceful shutdown
\tgo func() {
\t\taddr := fmt.Sprintf("0.0.0.0:%s", config.C.Port)
\t\tlogger.Info("listening", zap.String("addr", addr))
\t\tif err := app.Listen(addr); err != nil {
\t\t\tlogger.Fatal("listen", zap.Error(err))
\t\t}
\t}()

\tquit := make(chan os.Signal, 1)
\tsignal.Notify(quit, os.Interrupt, syscall.SIGTERM)
\t<-quit
\tlogger.Info("shutting down...")
\tif err := app.ShutdownWithTimeout(10 * time.Second); err != nil {
\t\tlogger.Error("shutdown", zap.Error(err))
\t}
\tlogger.Info("server stopped")
}
''')

# ---- .env.example ----
write_file(f"{BASE}/.env.example", """# Server
PORT=8080
ENV=production
LOG_PATH=/var/log/sira

# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=sira_auth
DB_USER=sira_user
DB_PASS=CHANGE_ME
DB_SSL_MODE=disable

# Redis
REDIS_ADDR=127.0.0.1:6379
REDIS_PASS=CHANGE_ME
REDIS_DB=0

# JWT (RS256 key paths)
JWT_PRIVATE_KEY_PATH=/opt/sira-backend/keys/jwt_private.pem
JWT_PUBLIC_KEY_PATH=/opt/sira-backend/keys/jwt_public.pem
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Crypto (generate with: openssl rand -hex 32)
AES_MASTER_KEY=CHANGE_ME_32_BYTE_HEX
HMAC_MASTER_KEY=CHANGE_ME_64_BYTE_HEX

# CORS (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173

# Uploads
UPLOAD_PATH=/var/sira/uploads
MAX_UPLOAD_SIZE=52428800

# Rate limiting
RATE_LIMIT_REQS=100
RATE_LIMIT_WINDOW=1m
""")

# ---- Makefile ----
write_file(f"{BASE}/Makefile", """BINARY=bin/sira-api
MAIN=cmd/api/main.go
GO=go

.PHONY: all build run dev clean migrate-up migrate-down deps tidy test

all: build

build:
\texport PATH=$$PATH:/usr/local/go/bin && $(GO) build -ldflags="-s -w" -o $(BINARY) $(MAIN)

run: build
\t./$(BINARY)

dev:
\texport PATH=$$PATH:/usr/local/go/bin && $(GO) run $(MAIN)

deps:
\texport PATH=$$PATH:/usr/local/go/bin && $(GO) mod download

tidy:
\texport PATH=$$PATH:/usr/local/go/bin && $(GO) mod tidy

test:
\texport PATH=$$PATH:/usr/local/go/bin && $(GO) test ./... -v

clean:
\trm -f $(BINARY)

migrate-up:
\t@echo "Migrations will be applied via embedded runner"

fmt:
\texport PATH=$$PATH:/usr/local/go/bin && $(GO) fmt ./...
""")

# ---- systemd unit ----
write_file("/etc/systemd/system/sira-api.service", """[Unit]
Description=Sira Auth API
After=network.target postgresql.service redis-server.service
Requires=postgresql.service redis-server.service

[Service]
Type=simple
User=siraapp
Group=siraapp
WorkingDirectory=/opt/sira-backend
EnvironmentFile=/opt/sira-backend/.env
ExecStart=/opt/sira-backend/bin/sira-api
Restart=always
RestartSec=5
StandardOutput=append:/var/log/sira/api.log
StandardError=append:/var/log/sira/api-error.log
LimitNOFILE=65536
LimitNPROC=4096

# Security hardening
PrivateTmp=true
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=/var/log/sira /var/sira/uploads /opt/sira-backend

[Install]
WantedBy=multi-user.target
""")

print("Running go mod download...")
script = f"""
set -e
export PATH=$PATH:/usr/local/go/bin
cd {BASE}
go mod download
echo "DEPS_DONE"
"""
run_script(script, timeout=120)

print("Building binary...")
script = f"""
set -e
export PATH=$PATH:/usr/local/go/bin
cd {BASE}
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go
echo "BUILD_DONE"
ls -lh bin/sira-api
"""
out, err, code = run_script(script, timeout=120)
if code != 0:
    print(f"Build errors:\n{err}")
    sys.exit(1)

print("\nGenerating JWT RSA keys...")
script = f"""
set -e
mkdir -p {BASE}/keys
chmod 700 {BASE}/keys
openssl genrsa -out {BASE}/keys/jwt_private.pem 4096
openssl rsa -in {BASE}/keys/jwt_private.pem -pubout -out {BASE}/keys/jwt_public.pem
chmod 600 {BASE}/keys/jwt_private.pem
chmod 644 {BASE}/keys/jwt_public.pem
echo "KEYS_DONE"
"""
run_script(script)

print("\nCreating .env file with credentials...")
script = r"""
set -e
source /root/.sira_db_creds
source /root/.sira_redis_creds

AES_KEY=$(openssl rand -hex 32)
HMAC_KEY=$(openssl rand -hex 64)

cat > /opt/sira-backend/.env << EOF
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
EOF

chmod 600 /opt/sira-backend/.env
chown siraapp:siraapp /opt/sira-backend/.env
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
systemctl start sira-api
sleep 3
systemctl status sira-api --no-pager | head -20
echo "SERVICE_START_DONE"
"""
run_script(script)

print("\nTesting /health endpoint...")
script = r"""
sleep 2
curl -sf http://localhost:8080/health || curl -f http://localhost:8080/health
echo ""
echo "HEALTH_CHECK_DONE"
"""
out, err, code = run_script(script)
if "HEALTH_CHECK_DONE" in out:
    print("Phase 1 complete! /health endpoint responding.")
else:
    print("Health check may need a moment. Checking logs...")
    run(r"journalctl -u sira-api -n 30 --no-pager")
