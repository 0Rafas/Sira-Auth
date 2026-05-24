#!/usr/bin/env python3
"""Fix: /auth/token should return user object. Add /auth/me/update endpoint."""
import sys, os, base64
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

BASE = "/opt/sira-backend"

def wf(path, content):
    enc = base64.b64encode(content.encode()).decode()
    run_script(f"mkdir -p \"$(dirname '{path}')\"\necho '{enc}' | base64 -d > '{path}'\necho 'Written: {path}'")

print("Fixing /auth/token to return user object + adding profile update...")

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
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
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
	var count int
	err := db.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM users WHERE username=$1 OR email=$2",
		req.Username, req.Email).Scan(&count)
	if err != nil {
		return models.InternalError(c, "database error")
	}
	if count > 0 {
		return models.Conflict(c, "username or email already taken")
	}

	hash, err := crypto.HashPassword(req.Password)
	if err != nil {
		return models.InternalError(c, "failed to hash password")
	}

	var planID *string
	var planExpiry *time.Time
	var bPlanID string
	if err2 := db.Pool.QueryRow(ctx, "SELECT id FROM plans WHERE slug='basic'").Scan(&bPlanID); err2 == nil {
		planID = &bPlanID
		t := time.Now().Add(14 * 24 * time.Hour)
		planExpiry = &t
	}

	userID := uuid.NewString()
	_, err = db.Pool.Exec(ctx, `
		INSERT INTO users (id, username, email, password_hash, role, plan_id, plan_expiry)
		VALUES ($1, $2, $3, $4, 'developer', $5, $6)
	`, userID, req.Username, req.Email, hash, planID, planExpiry)
	if err != nil {
		return models.InternalError(c, "failed to create user")
	}

	accessToken, err := crypto.GenerateAccessToken(userID, req.Username, "developer")
	if err != nil {
		return models.InternalError(c, "token generation failed")
	}
	sessionID := uuid.NewString()
	refreshToken, err := crypto.GenerateRefreshToken(userID, sessionID)
	if err != nil {
		return models.InternalError(c, "token generation failed")
	}

	_, _ = db.Pool.Exec(ctx, `
		INSERT INTO user_sessions (id, user_id, refresh_token, ip, expires_at)
		VALUES ($1, $2, $3, $4, $5)
	`, sessionID, userID, refreshToken, c.IP(), time.Now().Add(7*24*time.Hour))

	user := models.User{
		ID:        userID,
		Username:  req.Username,
		Email:     req.Email,
		Role:      "developer",
		IsActive:  true,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	pn := "Basic"
	user.PlanName = &pn
	if planExpiry != nil {
		user.PlanExpiry = planExpiry
	}
	if planID != nil {
		user.PlanID = planID
	}

	return models.Created(c, fiber.Map{
		"user":         user,
		"token":        accessToken,
		"refreshToken": refreshToken,
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

	locked, _ := crypto.IsLockedOut(c.IP())
	if locked {
		return models.TooManyRequests(c, "account temporarily locked due to too many failed attempts")
	}

	ctx := context.Background()
	var (
		userID, username, email, passwordHash, role string
		isActive                                    bool
		planName                                    *string
		planExpiry                                  *time.Time
		planID                                      *string
		avatarURL                                   *string
		createdAt, updatedAt                        time.Time
	)
	err := db.Pool.QueryRow(ctx, `
		SELECT u.id, u.username, u.email, u.password_hash, u.role, u.is_active,
		       p.name, u.plan_expiry, u.plan_id, u.avatar_url, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN plans p ON p.id = u.plan_id
		WHERE u.username=$1 OR u.email=$1
	`, req.Username).Scan(&userID, &username, &email, &passwordHash, &role, &isActive,
		&planName, &planExpiry, &planID, &avatarURL, &createdAt, &updatedAt)
	if err != nil {
		count, _ := crypto.IncrLoginAttempts(c.IP())
		if count >= 5 {
			_ = crypto.StoreLockout(c.IP(), 15*time.Minute)
		}
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

	crypto.ClearLoginAttempts(c.IP())
	db.Pool.Exec(ctx, "INSERT INTO login_attempts (identifier, ip, success) VALUES ($1, $2, true)",
		req.Username, c.IP())

	accessToken, err := crypto.GenerateAccessToken(userID, username, role)
	if err != nil {
		return models.InternalError(c, "token generation failed")
	}
	sessionID := uuid.NewString()
	refreshToken, err := crypto.GenerateRefreshToken(userID, sessionID)
	if err != nil {
		return models.InternalError(c, "token generation failed")
	}

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

	return models.OK(c, fiber.Map{
		"user": models.User{
			ID:         userID,
			Username:   username,
			Email:      email,
			Role:       role,
			PlanName:   planName,
			PlanExpiry: planExpiry,
			PlanID:     planID,
			AvatarURL:  avatarURL,
			IsActive:   isActive,
			CreatedAt:  createdAt,
			UpdatedAt:  updatedAt,
		},
		"token":        accessToken,
		"refreshToken": refreshToken,
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

// ── UpdateMe ─────────────────────────────────────────────────

func UpdateMe(c *fiber.Ctx) error {
	claims := middleware.GetAuthClaims(c)
	if claims == nil {
		return models.Unauthorized(c, "not authenticated")
	}
	var req struct {
		Username  string `json:"username"`
		Email     string `json:"email"`
		AvatarURL string `json:"avatarUrl"`
	}
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid body")
	}
	ctx := context.Background()

	// Check username uniqueness if changing
	if req.Username != "" {
		var count int
		db.Pool.QueryRow(ctx,
			"SELECT COUNT(*) FROM users WHERE username=$1 AND id!=$2",
			req.Username, claims.UserID).Scan(&count)
		if count > 0 {
			return models.Conflict(c, "username already taken")
		}
	}

	_, err := db.Pool.Exec(ctx, `
		UPDATE users SET
		  username  = COALESCE(NULLIF($1,''), username),
		  email     = COALESCE(NULLIF($2,''), email),
		  avatar_url = COALESCE(NULLIF($3,''), avatar_url),
		  updated_at = NOW()
		WHERE id=$4
	`, req.Username, req.Email, req.AvatarURL, claims.UserID)
	if err != nil {
		return models.InternalError(c, "update failed")
	}
	return GetMe(c)
}

// ── ChangePassword ────────────────────────────────────────────

func ChangePassword(c *fiber.Ctx) error {
	claims := middleware.GetAuthClaims(c)
	if claims == nil {
		return models.Unauthorized(c, "not authenticated")
	}
	var req struct {
		CurrentPassword string `json:"currentPassword"`
		NewPassword     string `json:"newPassword"`
	}
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid body")
	}
	if len(req.NewPassword) < 8 {
		return models.BadRequest(c, "new password must be at least 8 characters")
	}

	ctx := context.Background()
	var passHash string
	db.Pool.QueryRow(ctx, "SELECT password_hash FROM users WHERE id=$1", claims.UserID).Scan(&passHash)
	if !crypto.VerifyPassword(passHash, req.CurrentPassword) {
		return models.Unauthorized(c, "current password is incorrect")
	}

	newHash, err := crypto.HashPassword(req.NewPassword)
	if err != nil {
		return models.InternalError(c, "hash failed")
	}
	db.Pool.Exec(ctx, "UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2", newHash, claims.UserID)
	// Revoke all sessions
	db.Pool.Exec(ctx, "UPDATE user_sessions SET revoked=true WHERE user_id=$1", claims.UserID)
	return models.OKMsg(c, "password changed, please login again")
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
	var revoked bool
	err = db.Pool.QueryRow(ctx,
		"SELECT revoked FROM user_sessions WHERE refresh_token=$1 AND user_id=$2",
		req.RefreshToken, claims.UserID).Scan(&revoked)
	if err != nil || revoked {
		return models.Unauthorized(c, "refresh token revoked or not found")
	}

	var username, role string
	err = db.Pool.QueryRow(ctx, "SELECT username, role FROM users WHERE id=$1", claims.UserID).
		Scan(&username, &role)
	if err != nil {
		return models.Unauthorized(c, "user not found")
	}

	db.Pool.Exec(ctx, "UPDATE user_sessions SET revoked=true WHERE refresh_token=$1", req.RefreshToken)

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

	var tokenID, appID string
	err := db.Pool.QueryRow(ctx,
		"SELECT id, app_id FROM tokens WHERE token_hash=$1",
		tokenHash).Scan(&tokenID, &appID)
	if err != nil {
		return models.Unauthorized(c, "invalid API token")
	}

	db.Pool.Exec(ctx, "UPDATE tokens SET last_used_at=NOW() WHERE id=$1", tokenID)

	// Get app owner
	var ownerID, username, email, role string
	var isActive bool
	var planName *string
	var planExpiry *time.Time
	var planID *string
	var avatarURL *string
	var createdAt, updatedAt time.Time

	err = db.Pool.QueryRow(ctx, `
		SELECT u.id, u.username, u.email, u.role, u.is_active,
		       p.name, u.plan_expiry, u.plan_id, u.avatar_url, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN plans p ON p.id = u.plan_id
		JOIN applications a ON a.owner_id = u.id
		WHERE a.id = $1
	`, appID).Scan(&ownerID, &username, &email, &role, &isActive,
		&planName, &planExpiry, &planID, &avatarURL, &createdAt, &updatedAt)
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
		"user": models.User{
			ID:         ownerID,
			Username:   username,
			Email:      email,
			Role:       role,
			PlanName:   planName,
			PlanExpiry: planExpiry,
			PlanID:     planID,
			AvatarURL:  avatarURL,
			IsActive:   isActive,
			CreatedAt:  createdAt,
			UpdatedAt:  updatedAt,
		},
		"token":        accessToken,
		"refreshToken": refreshToken,
	})
}

// ── GoogleAuth (stub) ─────────────────────────────────────────

func GoogleAuth(c *fiber.Ctx) error {
	return models.BadRequest(c, "Google OAuth not yet configured")
}
''')

print("Updating main.go to add new auth routes...")
run_script(r"""
set -e
cd /opt/sira-backend

# Add the new routes to main.go using sed - find the authGroup routes and add new ones
python3 -c "
content = open('cmd/api/main.go').read()
# Add UpdateMe and ChangePassword routes after the GetMe route
old = 'authGroup.Post(\"/refresh\",  authHandler.Refresh)'
new = 'authGroup.Get(\"/me\",        middleware.RequireAuth(), authHandler.GetMe)\n\tauthGroup.Put(\"/me\",         middleware.RequireAuth(), authHandler.UpdateMe)\n\tauthGroup.Post(\"/me/password\", middleware.RequireAuth(), authHandler.ChangePassword)\n\tauthGroup.Post(\"/refresh\",  authHandler.Refresh)'
# Remove the existing GetMe route to avoid dup
content = content.replace('\tauthGroup.Get(\"/me\",        middleware.RequireAuth(), authHandler.GetMe)\n\t', '')
content = content.replace(old, new)
open('cmd/api/main.go', 'w').write(content)
print('main.go updated')
"
""")

print("Rebuilding...")
out, err, code = run_script(r"""
set -e
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go
echo "BUILD_OK"
""", timeout=120)
if code != 0:
    print(f"Build error:\n{err}")
    sys.exit(1)

run_script(r"""
chown -R siraapp:siraapp /opt/sira-backend
systemctl restart sira-api
sleep 3
systemctl is-active sira-api
""")

print("Backend updated!")
