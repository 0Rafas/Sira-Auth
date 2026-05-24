#!/usr/bin/env python3
"""Phase 4: Auth system - register, login, logout, me, refresh, token login."""
import sys, os, base64
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

BASE = "/opt/sira-backend"

def wf(path, content):
    enc = base64.b64encode(content.encode()).decode()
    run_script(f"mkdir -p \"$(dirname '{path}')\"\necho '{enc}' | base64 -d > '{path}'\necho 'Written: {path}'")

print("=" * 60)
print("PHASE 4: Auth System")
print("=" * 60)

# ── internal/models/user.go ──────────────────────────────────
wf(f"{BASE}/internal/models/user.go", r'''package models

import "time"

type User struct {
	ID            string     `json:"id"`
	Username      string     `json:"username"`
	Email         string     `json:"email"`
	Role          string     `json:"role"`
	PlanID        *string    `json:"planId,omitempty"`
	PlanName      *string    `json:"plan,omitempty"`
	PlanExpiry    *time.Time `json:"planExpiry,omitempty"`
	AvatarURL     *string    `json:"avatar,omitempty"`
	IsActive      bool       `json:"isActive"`
	EmailVerified bool       `json:"emailVerified"`
	TOTPEnabled   bool       `json:"totpEnabled"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
}

type AuthData struct {
	User         User   `json:"user"`
	AccessToken  string `json:"token"`
	RefreshToken string `json:"refreshToken"`
}
''')

# ── internal/middleware/auth_jwt.go ──────────────────────────
wf(f"{BASE}/internal/middleware/auth_jwt.go", r'''package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/models"
)

const UserKey = "auth_user"

// RequireAuth validates the JWT Bearer token.
func RequireAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		header := c.Get("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			return models.Unauthorized(c, "missing or invalid authorization header")
		}
		tokenStr := strings.TrimPrefix(header, "Bearer ")
		claims, err := crypto.ValidateAccessToken(tokenStr)
		if err != nil {
			return models.Unauthorized(c, "invalid or expired token")
		}
		c.Locals(UserKey, claims)
		return c.Next()
	}
}

// RequireRole ensures the user has one of the given roles.
func RequireRole(roles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := GetAuthClaims(c)
		if claims == nil {
			return models.Unauthorized(c, "not authenticated")
		}
		for _, r := range roles {
			if claims.Role == r {
				return c.Next()
			}
		}
		return models.Forbidden(c, "insufficient permissions")
	}
}

func GetAuthClaims(c *fiber.Ctx) *crypto.AccessClaims {
	v := c.Locals(UserKey)
	if v == nil {
		return nil
	}
	claims, _ := v.(*crypto.AccessClaims)
	return claims
}
''')

# ── internal/middleware/ratelimit.go ─────────────────────────
wf(f"{BASE}/internal/middleware/ratelimit.go", r'''package middleware

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/siraauth/backend/internal/models"
	"github.com/siraauth/backend/internal/redisdb"
)

// RateLimit implements a simple sliding window rate limiter using Redis.
func RateLimit(maxReqs int, window time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		key := fmt.Sprintf("ratelimit:%s:%s", c.IP(), c.Path())
		ctx := context.Background()

		count, err := redisdb.Client.Incr(ctx, key).Result()
		if err != nil {
			return c.Next() // fail open on Redis error
		}
		if count == 1 {
			redisdb.Client.Expire(ctx, key, window)
		}
		if count > int64(maxReqs) {
			c.Set("Retry-After", strconv.Itoa(int(window.Seconds())))
			return models.TooManyRequests(c, "rate limit exceeded")
		}
		return c.Next()
	}
}

// RateLimitStrict — stricter limit for auth endpoints (anti-brute-force).
func RateLimitStrict(maxReqs int, window time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		key := fmt.Sprintf("ratelimit_strict:%s", c.IP())
		ctx := context.Background()
		count, err := redisdb.Client.Incr(ctx, key).Result()
		if err != nil {
			return c.Next()
		}
		if count == 1 {
			redisdb.Client.Expire(ctx, key, window)
		}
		if count > int64(maxReqs) {
			c.Set("Retry-After", "900")
			return models.TooManyRequests(c, "too many attempts, try again later")
		}
		return c.Next()
	}
}
''')

# ── internal/handlers/auth/auth.go ───────────────────────────
wf(f"{BASE}/internal/handlers/auth/auth.go", r'''package auth

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/middleware"
	"github.com/siraauth/backend/internal/models"
)

// ── Register ─────────────────────────────────────────────────

type RegisterRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50,alphanum"`
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required,min=8,max=128"`
}

func Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid request body")
	}
	req.Username = strings.TrimSpace(req.Username)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if len(req.Username) < 3 {
		return models.BadRequest(c, "username must be at least 3 characters")
	}
	if len(req.Password) < 8 {
		return models.BadRequest(c, "password must be at least 8 characters")
	}

	ctx := context.Background()

	// Check duplicates
	var count int
	err := db.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM users WHERE username=$1 OR email=$2",
		req.Username, req.Email).Scan(&count)
	if err != nil {
		return models.InternalError(c, "database error")
	}
	if count > 0 {
		return models.Conflict(c, "username or email already taken")
	}

	// Hash password
	hash, err := crypto.HashPassword(req.Password)
	if err != nil {
		return models.InternalError(c, "failed to hash password")
	}

	// Get Basic plan ID
	var planID *string
	var planExpiry *time.Time
	var bPlanID string
	if err2 := db.Pool.QueryRow(ctx, "SELECT id FROM plans WHERE slug='basic'").Scan(&bPlanID); err2 == nil {
		planID = &bPlanID
		t := time.Now().Add(14 * 24 * time.Hour) // 14-day trial
		planExpiry = &t
	}

	// Create user
	userID := uuid.NewString()
	_, err = db.Pool.Exec(ctx, `
		INSERT INTO users (id, username, email, password_hash, role, plan_id, plan_expiry)
		VALUES ($1, $2, $3, $4, 'developer', $5, $6)
	`, userID, req.Username, req.Email, hash, planID, planExpiry)
	if err != nil {
		return models.InternalError(c, "failed to create user")
	}

	// Generate tokens
	accessToken, err := crypto.GenerateAccessToken(userID, req.Username, "developer")
	if err != nil {
		return models.InternalError(c, "token generation failed")
	}
	sessionID := uuid.NewString()
	refreshToken, err := crypto.GenerateRefreshToken(userID, sessionID)
	if err != nil {
		return models.InternalError(c, "token generation failed")
	}

	// Store refresh token
	_, _ = db.Pool.Exec(ctx, `
		INSERT INTO user_sessions (id, user_id, refresh_token, ip, expires_at)
		VALUES ($1, $2, $3, $4, $5)
	`, sessionID, userID, refreshToken, c.IP(), time.Now().Add(7*24*time.Hour))

	user := models.User{
		ID:       userID,
		Username: req.Username,
		Email:    req.Email,
		Role:     "developer",
		IsActive: true,
	}
	if planExpiry != nil {
		user.PlanExpiry = planExpiry
	}
	pn := "Basic"
	user.PlanName = &pn

	return models.Created(c, models.AuthData{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})
}

// ── Login ────────────────────────────────────────────────────

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid request body")
	}
	req.Username = strings.TrimSpace(req.Username)

	// Check lockout
	locked, _ := crypto.IsLockedOut(c.IP())
	if locked {
		return models.TooManyRequests(c, "account temporarily locked due to too many failed attempts")
	}

	ctx := context.Background()

	// Fetch user (by username or email)
	var (
		userID, username, email, passwordHash, role string
		isActive                                    bool
		planName                                    *string
		planExpiry                                  *time.Time
		planID                                      *string
	)
	err := db.Pool.QueryRow(ctx, `
		SELECT u.id, u.username, u.email, u.password_hash, u.role, u.is_active,
		       p.name, u.plan_expiry, u.plan_id
		FROM users u
		LEFT JOIN plans p ON p.id = u.plan_id
		WHERE u.username=$1 OR u.email=$1
	`, req.Username).Scan(&userID, &username, &email, &passwordHash, &role, &isActive,
		&planName, &planExpiry, &planID)
	if err != nil {
		// Record failed attempt
		count, _ := crypto.IncrLoginAttempts(c.IP())
		if count >= 5 {
			_ = crypto.StoreLockout(c.IP(), 15*time.Minute)
		}
		// Log attempt
		db.Pool.Exec(ctx, "INSERT INTO login_attempts (identifier, ip, success) VALUES ($1, $2, false)",
			req.Username, c.IP())
		return models.Unauthorized(c, "invalid credentials")
	}

	if !isActive {
		return models.Forbidden(c, "account is disabled")
	}

	if !crypto.VerifyPassword(passwordHash, req.Password) {
		count, _ := crypto.IncrLoginAttempts(c.IP())
		if count >= 5 {
			_ = crypto.StoreLockout(c.IP(), 15*time.Minute)
		}
		db.Pool.Exec(ctx, "INSERT INTO login_attempts (identifier, ip, success) VALUES ($1, $2, false)",
			req.Username, c.IP())
		return models.Unauthorized(c, "invalid credentials")
	}

	// Clear failed attempts
	crypto.ClearLoginAttempts(c.IP())

	// Log success
	db.Pool.Exec(ctx, "INSERT INTO login_attempts (identifier, ip, success) VALUES ($1, $2, true)",
		req.Username, c.IP())

	// Generate tokens
	accessToken, err := crypto.GenerateAccessToken(userID, username, role)
	if err != nil {
		return models.InternalError(c, "token generation failed")
	}
	sessionID := uuid.NewString()
	refreshToken, err := crypto.GenerateRefreshToken(userID, sessionID)
	if err != nil {
		return models.InternalError(c, "token generation failed")
	}

	// Revoke old sessions (keep last 3)
	db.Pool.Exec(ctx, `
		UPDATE user_sessions SET revoked=true
		WHERE user_id=$1 AND revoked=false
		AND id NOT IN (
			SELECT id FROM user_sessions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 2
		)
	`, userID)

	_, _ = db.Pool.Exec(ctx, `
		INSERT INTO user_sessions (id, user_id, refresh_token, ip, expires_at)
		VALUES ($1, $2, $3, $4, $5)
	`, sessionID, userID, refreshToken, c.IP(), time.Now().Add(7*24*time.Hour))

	user := models.User{
		ID:            userID,
		Username:      username,
		Email:         email,
		Role:          role,
		PlanName:      planName,
		PlanExpiry:    planExpiry,
		PlanID:        planID,
		IsActive:      isActive,
	}

	return models.OK(c, models.AuthData{
		User:         user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})
}

// ── Logout ───────────────────────────────────────────────────

func Logout(c *fiber.Ctx) error {
	claims := middleware.GetAuthClaims(c)
	if claims != nil {
		db.Pool.Exec(context.Background(),
			"UPDATE user_sessions SET revoked=true WHERE user_id=$1", claims.UserID)
	}
	return models.OKMsg(c, "logged out successfully")
}

// ── GetMe ────────────────────────────────────────────────────

func GetMe(c *fiber.Ctx) error {
	claims := middleware.GetAuthClaims(c)
	if claims == nil {
		return models.Unauthorized(c, "not authenticated")
	}

	ctx := context.Background()
	var (
		userID, username, email, role string
		isActive, emailVerified       bool
		planName                      *string
		planExpiry                    *time.Time
		planID                        *string
		avatarURL                     *string
		createdAt, updatedAt          time.Time
	)
	err := db.Pool.QueryRow(ctx, `
		SELECT u.id, u.username, u.email, u.role, u.is_active, u.email_verified,
		       p.name, u.plan_expiry, u.plan_id, u.avatar_url, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN plans p ON p.id = u.plan_id
		WHERE u.id=$1
	`, claims.UserID).Scan(&userID, &username, &email, &role, &isActive, &emailVerified,
		&planName, &planExpiry, &planID, &avatarURL, &createdAt, &updatedAt)
	if err != nil {
		return models.NotFound(c, "user not found")
	}

	return models.OK(c, models.User{
		ID:            userID,
		Username:      username,
		Email:         email,
		Role:          role,
		PlanName:      planName,
		PlanExpiry:    planExpiry,
		PlanID:        planID,
		AvatarURL:     avatarURL,
		IsActive:      isActive,
		EmailVerified: emailVerified,
		CreatedAt:     createdAt,
		UpdatedAt:     updatedAt,
	})
}

// ── Refresh ──────────────────────────────────────────────────

type RefreshRequest struct {
	RefreshToken string `json:"refreshToken"`
}

func Refresh(c *fiber.Ctx) error {
	var req RefreshRequest
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid request body")
	}

	claims, err := crypto.ValidateRefreshToken(req.RefreshToken)
	if err != nil {
		return models.Unauthorized(c, "invalid refresh token")
	}

	ctx := context.Background()

	// Check session not revoked
	var revoked bool
	err = db.Pool.QueryRow(ctx,
		"SELECT revoked FROM user_sessions WHERE refresh_token=$1 AND user_id=$2",
		req.RefreshToken, claims.UserID).Scan(&revoked)
	if err != nil || revoked {
		return models.Unauthorized(c, "refresh token revoked or not found")
	}

	// Get user
	var username, role string
	err = db.Pool.QueryRow(ctx, "SELECT username, role FROM users WHERE id=$1", claims.UserID).
		Scan(&username, &role)
	if err != nil {
		return models.Unauthorized(c, "user not found")
	}

	// Revoke old session
	db.Pool.Exec(ctx, "UPDATE user_sessions SET revoked=true WHERE refresh_token=$1", req.RefreshToken)

	// New tokens
	accessToken, _ := crypto.GenerateAccessToken(claims.UserID, username, role)
	sessionID := uuid.NewString()
	newRefresh, _ := crypto.GenerateRefreshToken(claims.UserID, sessionID)

	db.Pool.Exec(ctx, `
		INSERT INTO user_sessions (id, user_id, refresh_token, ip, expires_at)
		VALUES ($1, $2, $3, $4, $5)
	`, sessionID, claims.UserID, newRefresh, c.IP(), time.Now().Add(7*24*time.Hour))

	return models.OK(c, fiber.Map{
		"token":        accessToken,
		"refreshToken": newRefresh,
	})
}

// ── LoginWithToken ────────────────────────────────────────────

type TokenLoginRequest struct {
	Token string `json:"token"`
}

func LoginWithToken(c *fiber.Ctx) error {
	var req TokenLoginRequest
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid request body")
	}
	if req.Token == "" {
		return models.BadRequest(c, "token is required")
	}

	tokenHash := crypto.HashAPIToken(req.Token)
	ctx := context.Background()

	var (
		tokenID, appID string
		permissions    []byte
	)
	err := db.Pool.QueryRow(ctx,
		"SELECT id, app_id, permissions FROM tokens WHERE token_hash=$1",
		tokenHash).Scan(&tokenID, &appID, &permissions)
	if err != nil {
		return models.Unauthorized(c, "invalid API token")
	}

	// Update last used
	db.Pool.Exec(ctx, "UPDATE tokens SET last_used_at=NOW() WHERE id=$1", tokenID)

	// Get app owner for the user context
	var ownerID, username, role string
	err = db.Pool.QueryRow(ctx, `
		SELECT u.id, u.username, u.role FROM users u
		JOIN applications a ON a.owner_id = u.id
		WHERE a.id = $1
	`, appID).Scan(&ownerID, &username, &role)
	if err != nil {
		return models.Unauthorized(c, "token app not found")
	}

	accessToken, _ := crypto.GenerateAccessToken(ownerID, username, role)
	sessionID := uuid.NewString()
	refreshToken, _ := crypto.GenerateRefreshToken(ownerID, sessionID)

	db.Pool.Exec(ctx, `
		INSERT INTO user_sessions (id, user_id, refresh_token, ip, expires_at)
		VALUES ($1, $2, $3, $4, $5)
	`, sessionID, ownerID, refreshToken, c.IP(), time.Now().Add(24*time.Hour))

	return models.OK(c, fiber.Map{
		"token":        accessToken,
		"refreshToken": refreshToken,
		"tokenId":      tokenID,
		"permissions":  string(permissions),
	})
}

// ── GoogleAuth (stub) ─────────────────────────────────────────

func GoogleAuth(c *fiber.Ctx) error {
	return models.BadRequest(c, "Google OAuth not yet configured")
}
''')

# ── Update main.go to register auth routes ───────────────────
wf(f"{BASE}/cmd/api/main.go", r'''package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/siraauth/backend/internal/config"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/db"
	authHandler "github.com/siraauth/backend/internal/handlers/auth"
	"github.com/siraauth/backend/internal/middleware"
	"github.com/siraauth/backend/internal/redisdb"
)

func main() {
	if err := config.Load(); err != nil {
		log.Fatalf("config load: %v", err)
	}

	zapCfg := zap.NewProductionConfig()
	zapCfg.EncoderConfig.TimeKey = "ts"
	zapCfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	logger, err := zapCfg.Build()
	if err != nil {
		log.Fatalf("logger init: %v", err)
	}
	defer logger.Sync()

	logger.Info("Sira Auth API starting",
		zap.String("env", config.C.Env),
		zap.String("port", config.C.Port),
	)

	if err := db.Connect(); err != nil {
		logger.Fatal("db connect", zap.Error(err))
	}
	defer db.Close()

	if err := redisdb.Connect(); err != nil {
		logger.Fatal("redis connect", zap.Error(err))
	}
	defer redisdb.Close()

	if err := crypto.LoadJWTKeys(); err != nil {
		logger.Fatal("jwt keys", zap.Error(err))
	}
	logger.Info("JWT RS256 keys loaded")

	app := fiber.New(fiber.Config{
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
		BodyLimit:    int(config.C.MaxUploadSize),
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{"success": false, "error": err.Error()})
		},
	})

	app.Use(middleware.Recover(logger))
	app.Use(requestid.New())
	app.Use(middleware.SecurityHeaders())
	app.Use(middleware.CORS())
	app.Use(middleware.RequestLogger(logger))

	// ── Public routes ─────────────────────────────────────────
	app.Get("/health", authHandler.Health)
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"service": "Sira Auth API", "version": "1.0.0"})
	})

	// ── Auth routes ───────────────────────────────────────────
	authRoutes := app.Group("/auth")
	strictLimit := middleware.RateLimitStrict(10, 15*time.Minute)
	authRoutes.Post("/register", strictLimit, authHandler.Register)
	authRoutes.Post("/login",    strictLimit, authHandler.Login)
	authRoutes.Post("/logout",   middleware.RequireAuth(), authHandler.Logout)
	authRoutes.Get("/me",        middleware.RequireAuth(), authHandler.GetMe)
	authRoutes.Post("/refresh",  authHandler.Refresh)
	authRoutes.Post("/token",    authHandler.LoginWithToken)
	authRoutes.Post("/google",   authHandler.GoogleAuth)

	// ── Dashboard routes (placeholder for phase 5) ────────────
	dashboard := app.Group("/dashboard", middleware.RequireAuth())
	_ = dashboard

	// ── SDK routes (placeholder for phase 6) ─────────────────
	sdk := app.Group("/sdk")
	_ = sdk

	app.Use(func(c *fiber.Ctx) error {
		return c.Status(404).JSON(fiber.Map{"success": false, "error": "not found"})
	})

	go func() {
		addr := fmt.Sprintf("0.0.0.0:%s", config.C.Port)
		logger.Info("listening", zap.String("addr", addr))
		if err := app.Listen(addr); err != nil {
			logger.Fatal("listen", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit
	logger.Info("shutting down...")
	if err := app.ShutdownWithTimeout(10 * time.Second); err != nil {
		logger.Error("shutdown", zap.Error(err))
	}
	logger.Info("server stopped")
}
''')

print("Building with auth routes...")
script = r"""
set -e
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go
echo "BUILD_OK"
ls -lh bin/sira-api
"""
out, err, code = run_script(script, timeout=120)
if code != 0:
    print(f"Build error:\n{err}")
    sys.exit(1)

print("\nRestarting service...")
run_script(r"""
set -e
chown -R siraapp:siraapp /opt/sira-backend
systemctl restart sira-api
sleep 3
systemctl is-active sira-api
""")

print("\nTesting auth endpoints...")
script = r"""
set -e
BASE="http://localhost:8080"

# Test health
echo "=== Health ===" 
curl -sf $BASE/health

echo ""
echo "=== Register ==="
RESP=$(curl -sf -X POST $BASE/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"testadmin","email":"admin@sira.local","password":"Sup3rS3cur3!"}')
echo $RESP

echo ""
echo "=== Login ==="
LOGIN=$(curl -sf -X POST $BASE/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"testadmin","password":"Sup3rS3cur3!"}')
echo $LOGIN

TOKEN=$(echo $LOGIN | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['token'])" 2>/dev/null || echo "")
echo ""
echo "=== GetMe ==="
curl -sf $BASE/auth/me -H "Authorization: Bearer $TOKEN"
echo ""
echo "AUTH_TEST_DONE"
"""
out, err, code = run_script(script)
if "AUTH_TEST_DONE" in out:
    print("\nPhase 4 complete! Auth endpoints working.")
else:
    print(f"\nAuth test output:\n{out}\n{err}")
    import sys
    run_script("journalctl -u sira-api -n 30 --no-pager")
