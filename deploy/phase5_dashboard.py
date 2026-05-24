#!/usr/bin/env python3
"""Phase 5: Dashboard CRUD handlers for all 12 resources."""
import sys, os, base64
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script

BASE = "/opt/sira-backend"

def wf(path, content):
    enc = base64.b64encode(content.encode()).decode()
    run_script(f"mkdir -p \"$(dirname '{path}')\"\necho '{enc}' | base64 -d > '{path}'\necho 'Written: {path}'")

print("=" * 60)
print("PHASE 5: Dashboard CRUD Handlers")
print("=" * 60)

# ── internal/middleware/quota.go ─────────────────────────────
wf(f"{BASE}/internal/middleware/quota.go", r'''package middleware

import (
	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

// QuotaCheck checks if the user has not exceeded plan limits for a resource.
// resourceType: "apps", "tokens", "licenses", "users", "subs"
func QuotaCheck(resourceType string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := GetAuthClaims(c)
		if claims == nil {
			return models.Unauthorized(c, "not authenticated")
		}

		ctx := context.Background()

		// Get plan limits
		var maxVal int
		col := ""
		switch resourceType {
		case "apps":
			col = "max_apps"
		case "tokens":
			col = "max_tokens"
		case "licenses":
			col = "max_licenses"
		case "users":
			col = "max_users"
		case "subs":
			col = "max_subs"
		default:
			return c.Next()
		}

		err := db.Pool.QueryRow(ctx, fmt.Sprintf(`
			SELECT COALESCE(p.%s, 2)
			FROM users u
			LEFT JOIN plans p ON p.id = u.plan_id
			WHERE u.id = $1
		`, col), claims.UserID).Scan(&maxVal)
		if err != nil || maxVal == -1 {
			return c.Next() // -1 = unlimited or error = proceed
		}

		// Count current usage
		var current int
		switch resourceType {
		case "apps":
			db.Pool.QueryRow(ctx,
				"SELECT COUNT(*) FROM applications WHERE owner_id=$1", claims.UserID).Scan(&current)
		case "tokens":
			appID := c.Params("appId")
			if appID != "" {
				db.Pool.QueryRow(ctx,
					"SELECT COUNT(*) FROM tokens WHERE app_id=$1", appID).Scan(&current)
			}
		case "licenses":
			appID := c.Params("appId")
			if appID != "" {
				db.Pool.QueryRow(ctx,
					"SELECT COUNT(*) FROM licenses WHERE app_id=$1", appID).Scan(&current)
			}
		case "users":
			appID := c.Params("appId")
			if appID != "" {
				db.Pool.QueryRow(ctx,
					"SELECT COUNT(*) FROM app_users WHERE app_id=$1", appID).Scan(&current)
			}
		case "subs":
			appID := c.Params("appId")
			if appID != "" {
				db.Pool.QueryRow(ctx,
					"SELECT COUNT(*) FROM subscriptions WHERE app_id=$1", appID).Scan(&current)
			}
		}

		if current >= maxVal {
			return models.Forbidden(c, fmt.Sprintf("plan limit reached: max %d %s allowed", maxVal, resourceType))
		}
		return c.Next()
	}
}

// OwnsApp ensures the authenticated user owns the given app.
func OwnsApp() fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := GetAuthClaims(c)
		if claims == nil {
			return models.Unauthorized(c, "not authenticated")
		}
		appID := c.Params("appId")
		if appID == "" {
			return c.Next()
		}
		var ownerID string
		err := db.Pool.QueryRow(context.Background(),
			"SELECT owner_id FROM applications WHERE id=$1", appID).Scan(&ownerID)
		if err != nil {
			return models.NotFound(c, "application not found")
		}
		if ownerID != claims.UserID {
			return models.Forbidden(c, "access denied")
		}
		return c.Next()
	}
}
''')

# ── internal/handlers/dashboard/apps.go ─────────────────────
wf(f"{BASE}/internal/handlers/dashboard/apps.go", r'''package dashboard

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/middleware"
	"github.com/siraauth/backend/internal/models"
)

// ── Stats ────────────────────────────────────────────────────

func GetStats(c *fiber.Ctx) error {
	claims := middleware.GetAuthClaims(c)
	ctx := context.Background()

	var totalApps, totalLicenses, activeLicenses, totalUsers, activeSessions int
	db.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM applications WHERE owner_id=$1", claims.UserID).Scan(&totalApps)
	db.Pool.QueryRow(ctx, `SELECT COUNT(*) FROM licenses l JOIN applications a ON a.id=l.app_id WHERE a.owner_id=$1`, claims.UserID).Scan(&totalLicenses)
	db.Pool.QueryRow(ctx, `SELECT COUNT(*) FROM licenses l JOIN applications a ON a.id=l.app_id WHERE a.owner_id=$1 AND l.status='active'`, claims.UserID).Scan(&activeLicenses)
	db.Pool.QueryRow(ctx, `SELECT COUNT(*) FROM app_users u JOIN applications a ON a.id=u.app_id WHERE a.owner_id=$1`, claims.UserID).Scan(&totalUsers)
	db.Pool.QueryRow(ctx, `SELECT COUNT(*) FROM app_sessions s JOIN applications a ON a.id=s.app_id WHERE a.owner_id=$1 AND s.killed=false AND s.expires_at > NOW()`, claims.UserID).Scan(&activeSessions)

	// Recent events
	rows, _ := db.Pool.Query(ctx, `
		SELECT e.id, e.app_id, e.type, e.message, e.created_at
		FROM event_logs e
		JOIN applications a ON a.id = e.app_id
		WHERE a.owner_id=$1
		ORDER BY e.created_at DESC LIMIT 10
	`, claims.UserID)
	defer rows.Close()
	type Event struct {
		ID        string    `json:"id"`
		AppID     string    `json:"appId"`
		Type      string    `json:"type"`
		Message   string    `json:"message"`
		CreatedAt time.Time `json:"timestamp"`
	}
	var events []Event
	for rows.Next() {
		var e Event
		rows.Scan(&e.ID, &e.AppID, &e.Type, &e.Message, &e.CreatedAt)
		events = append(events, e)
	}
	if events == nil {
		events = []Event{}
	}

	return models.OK(c, fiber.Map{
		"totalApps":       totalApps,
		"totalLicenses":   totalLicenses,
		"activeLicenses":  activeLicenses,
		"totalUsers":      totalUsers,
		"activeSessions":  activeSessions,
		"recentEvents":    events,
		"activityChart":   []fiber.Map{},
	})
}

// ── App CRUD ─────────────────────────────────────────────────

type AppRow struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	Version        string    `json:"version"`
	Description    *string   `json:"description,omitempty"`
	Secret         string    `json:"secret"`
	OwnerID        string    `json:"ownerId"`
	Status         string    `json:"status"`
	TotalUsers     int       `json:"totalUsers"`
	ActiveSessions int       `json:"activeSessions"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

func GetApps(c *fiber.Ctx) error {
	claims := middleware.GetAuthClaims(c)
	ctx := context.Background()

	rows, err := db.Pool.Query(ctx, `
		SELECT a.id, a.name, a.version, a.description, s.secret,
		       a.owner_id, a.status, a.total_users, a.active_sessions, a.created_at, a.updated_at
		FROM applications a
		LEFT JOIN app_secrets s ON s.app_id=a.id AND s.is_active=true
		WHERE a.owner_id=$1
		ORDER BY a.created_at DESC
	`, claims.UserID)
	if err != nil {
		return models.InternalError(c, "database error")
	}
	defer rows.Close()

	var apps []AppRow
	for rows.Next() {
		var a AppRow
		if err := rows.Scan(&a.ID, &a.Name, &a.Version, &a.Description, &a.Secret,
			&a.OwnerID, &a.Status, &a.TotalUsers, &a.ActiveSessions, &a.CreatedAt, &a.UpdatedAt); err == nil {
			apps = append(apps, a)
		}
	}
	if apps == nil {
		apps = []AppRow{}
	}
	return models.OK(c, apps)
}

func GetApp(c *fiber.Ctx) error {
	appID := c.Params("appId")
	var a AppRow
	err := db.Pool.QueryRow(context.Background(), `
		SELECT a.id, a.name, a.version, a.description, s.secret,
		       a.owner_id, a.status, a.total_users, a.active_sessions, a.created_at, a.updated_at
		FROM applications a
		LEFT JOIN app_secrets s ON s.app_id=a.id AND s.is_active=true
		WHERE a.id=$1
	`, appID).Scan(&a.ID, &a.Name, &a.Version, &a.Description, &a.Secret,
		&a.OwnerID, &a.Status, &a.TotalUsers, &a.ActiveSessions, &a.CreatedAt, &a.UpdatedAt)
	if err != nil {
		return models.NotFound(c, "application not found")
	}
	return models.OK(c, a)
}

type CreateAppRequest struct {
	Name        string `json:"name"`
	Version     string `json:"version"`
	Description string `json:"description"`
}

func CreateApp(c *fiber.Ctx) error {
	var req CreateAppRequest
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid body")
	}
	if req.Name == "" {
		return models.BadRequest(c, "name is required")
	}
	claims := middleware.GetAuthClaims(c)
	if req.Version == "" {
		req.Version = "1.0.0"
	}

	ctx := context.Background()
	appID := uuid.NewString()

	_, err := db.Pool.Exec(ctx, `
		INSERT INTO applications (id, owner_id, name, version, description)
		VALUES ($1, $2, $3, $4, $5)
	`, appID, claims.UserID, req.Name, req.Version, req.Description)
	if err != nil {
		return models.InternalError(c, "failed to create application")
	}

	// Create app secret
	secret, _ := crypto.GenerateAppSecret()
	db.Pool.Exec(ctx, "INSERT INTO app_secrets (app_id, secret) VALUES ($1, $2)", appID, secret)

	// Generate ECDSA keypair for license signing
	kp, err := crypto.GenerateECDSAKeyPair()
	if err == nil {
		db.Pool.Exec(ctx, `
			INSERT INTO app_keypairs (app_id, private_key, public_key)
			VALUES ($1, $2, $3)
		`, appID, kp.PrivatePEM, kp.PublicPEM)
	}

	// Create default chat channel
	db.Pool.Exec(ctx, `
		INSERT INTO chat_channels (app_id, name, is_default) VALUES ($1, 'General', true)
	`, appID)

	return models.Created(c, AppRow{
		ID:        appID,
		Name:      req.Name,
		Version:   req.Version,
		Secret:    secret,
		OwnerID:   claims.UserID,
		Status:    "active",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	})
}

func UpdateApp(c *fiber.Ctx) error {
	appID := c.Params("appId")
	var req struct {
		Name        string `json:"name"`
		Version     string `json:"version"`
		Description string `json:"description"`
	}
	c.BodyParser(&req)

	_, err := db.Pool.Exec(context.Background(), `
		UPDATE applications SET name=COALESCE(NULLIF($1,''), name),
		  version=COALESCE(NULLIF($2,''), version),
		  description=COALESCE(NULLIF($3,''), description),
		  updated_at=NOW()
		WHERE id=$4
	`, req.Name, req.Version, req.Description, appID)
	if err != nil {
		return models.InternalError(c, "update failed")
	}
	return GetApp(c)
}

func DeleteApp(c *fiber.Ctx) error {
	appID := c.Params("appId")
	db.Pool.Exec(context.Background(), "DELETE FROM applications WHERE id=$1", appID)
	return models.OKMsg(c, "application deleted")
}

func PauseApp(c *fiber.Ctx) error {
	appID := c.Params("appId")
	var status string
	db.Pool.QueryRow(context.Background(), "SELECT status FROM applications WHERE id=$1", appID).Scan(&status)
	newStatus := "paused"
	if status == "paused" {
		newStatus = "active"
	}
	db.Pool.Exec(context.Background(), "UPDATE applications SET status=$1, updated_at=NOW() WHERE id=$2", newStatus, appID)
	return models.OK(c, fiber.Map{"status": newStatus})
}

func RefreshSecret(c *fiber.Ctx) error {
	appID := c.Params("appId")
	ctx := context.Background()
	secret, _ := crypto.GenerateAppSecret()
	db.Pool.Exec(ctx, "UPDATE app_secrets SET is_active=false WHERE app_id=$1", appID)
	db.Pool.Exec(ctx, "INSERT INTO app_secrets (app_id, secret) VALUES ($1, $2)", appID, secret)
	return models.OK(c, fiber.Map{"secret": secret})
}
''')

# ── internal/handlers/dashboard/licenses.go ─────────────────
wf(f"{BASE}/internal/handlers/dashboard/licenses.go", r'''package dashboard

import (
	"context"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type LicenseRow struct {
	ID        string     `json:"id"`
	Key       string     `json:"key"`
	AppID     string     `json:"appId"`
	UserID    *string    `json:"userId,omitempty"`
	Username  *string    `json:"username,omitempty"`
	Level     int        `json:"level"`
	Status    string     `json:"status"`
	ExpiresAt *time.Time `json:"expiresAt,omitempty"`
	Duration  *int       `json:"duration,omitempty"`
	Uses      int        `json:"uses"`
	MaxUses   int        `json:"maxUses"`
	Note      *string    `json:"note,omitempty"`
	IP        *string    `json:"ip,omitempty"`
	HWID      *string    `json:"hwid,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
}

func GetLicenses(c *fiber.Ctx) error {
	appID := c.Params("appId")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "50"))
	if page < 1 { page = 1 }
	if limit > 200 { limit = 200 }
	offset := (page - 1) * limit

	ctx := context.Background()
	var total int64
	db.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM licenses WHERE app_id=$1", appID).Scan(&total)

	rows, err := db.Pool.Query(ctx, `
		SELECT l.id, l.key, l.app_id, l.user_id, u.username, l.level, l.status,
		       l.expires_at, l.duration, l.uses, l.max_uses, l.note, u.ip, u.hwid, l.created_at
		FROM licenses l
		LEFT JOIN app_users u ON u.id = l.user_id
		WHERE l.app_id=$1
		ORDER BY l.created_at DESC
		LIMIT $2 OFFSET $3
	`, appID, limit, offset)
	if err != nil {
		return models.InternalError(c, "database error")
	}
	defer rows.Close()

	var licenses []LicenseRow
	for rows.Next() {
		var l LicenseRow
		rows.Scan(&l.ID, &l.Key, &l.AppID, &l.UserID, &l.Username, &l.Level, &l.Status,
			&l.ExpiresAt, &l.Duration, &l.Uses, &l.MaxUses, &l.Note, &l.IP, &l.HWID, &l.CreatedAt)
		licenses = append(licenses, l)
	}
	if licenses == nil {
		licenses = []LicenseRow{}
	}
	return models.Paginated(c, licenses, total, page, limit)
}

type CreateLicenseRequest struct {
	Amount   int    `json:"amount"`
	Level    int    `json:"level"`
	Duration int    `json:"duration"`
	MaxUses  int    `json:"maxUses"`
	Note     string `json:"note"`
}

func CreateLicenses(c *fiber.Ctx) error {
	appID := c.Params("appId")
	var req CreateLicenseRequest
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid body")
	}
	if req.Amount < 1 {
		req.Amount = 1
	}
	if req.Amount > 100 {
		req.Amount = 100
	}
	if req.Level < 1 {
		req.Level = 1
	}
	if req.MaxUses < 1 {
		req.MaxUses = 1
	}

	ctx := context.Background()

	// Get app keypair for signing
	var privKey string
	db.Pool.QueryRow(ctx, "SELECT private_key FROM app_keypairs WHERE app_id=$1", appID).Scan(&privKey)

	var created []LicenseRow
	for i := 0; i < req.Amount; i++ {
		key, err := crypto.GenerateLicenseKey()
		if err != nil {
			continue
		}
		licID := uuid.NewString()

		// Sign the license
		var sig *string
		if privKey != "" {
			s, err := crypto.SignLicense(privKey, key)
			if err == nil {
				sig = &s
			}
		}

		var expiresAt *time.Time
		if req.Duration > 0 {
			t := time.Now().Add(time.Duration(req.Duration) * 24 * time.Hour)
			expiresAt = &t
		}

		var note *string
		if req.Note != "" {
			note = &req.Note
		}

		dur := req.Duration
		_, err = db.Pool.Exec(ctx, `
			INSERT INTO licenses (id, app_id, key, signature, level, max_uses, duration, expires_at, note)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		`, licID, appID, key, sig, req.Level, req.MaxUses, dur, expiresAt, note)
		if err != nil {
			continue
		}
		created = append(created, LicenseRow{
			ID:        licID,
			Key:       key,
			AppID:     appID,
			Level:     req.Level,
			Status:    "unused",
			Duration:  &dur,
			ExpiresAt: expiresAt,
			MaxUses:   req.MaxUses,
			Note:      note,
			CreatedAt: time.Now(),
		})
	}
	if created == nil {
		created = []LicenseRow{}
	}
	return models.Created(c, created)
}

func DeleteLicense(c *fiber.Ctx) error {
	licID := c.Params("licenseId")
	db.Pool.Exec(context.Background(), "DELETE FROM licenses WHERE id=$1", licID)
	return models.OKMsg(c, "license deleted")
}

func BanLicense(c *fiber.Ctx) error {
	licID := c.Params("licenseId")
	db.Pool.Exec(context.Background(),
		"UPDATE licenses SET status='banned', updated_at=NOW() WHERE id=$1", licID)
	return models.OKMsg(c, "license banned")
}
''')

# ── internal/handlers/dashboard/users.go ────────────────────
wf(f"{BASE}/internal/handlers/dashboard/users.go", r'''package dashboard

import (
	"context"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/middleware"
	"github.com/siraauth/backend/internal/models"
)

type AppUserRow struct {
	ID                 string     `json:"id"`
	AppID              string     `json:"appId"`
	Username           string     `json:"username"`
	Email              *string    `json:"email,omitempty"`
	IP                 *string    `json:"ip,omitempty"`
	HWID               *string    `json:"hwid,omitempty"`
	Status             string     `json:"status"`
	TwoFactor          bool       `json:"twoFactor"`
	HWIDAffected       bool       `json:"hwidAffected"`
	SubscriptionExpiry *time.Time `json:"subscriptionExpiry,omitempty"`
	LastLogin          *time.Time `json:"lastLogin,omitempty"`
	CreatedAt          time.Time  `json:"createdAt"`
}

func GetUsers(c *fiber.Ctx) error {
	appID := c.Params("appId")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "50"))
	if page < 1 { page = 1 }
	if limit > 200 { limit = 200 }
	offset := (page - 1) * limit

	ctx := context.Background()
	var total int64
	db.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM app_users WHERE app_id=$1", appID).Scan(&total)

	rows, _ := db.Pool.Query(ctx, `
		SELECT id, app_id, username, email, ip, hwid, status, two_factor,
		       hwid_locked, subscription_expiry, last_login_at, created_at
		FROM app_users WHERE app_id=$1
		ORDER BY created_at DESC LIMIT $2 OFFSET $3
	`, appID, limit, offset)
	defer rows.Close()

	var users []AppUserRow
	for rows.Next() {
		var u AppUserRow
		rows.Scan(&u.ID, &u.AppID, &u.Username, &u.Email, &u.IP, &u.HWID, &u.Status, &u.TwoFactor,
			&u.HWIDAffected, &u.SubscriptionExpiry, &u.LastLogin, &u.CreatedAt)
		users = append(users, u)
	}
	if users == nil { users = []AppUserRow{} }
	return models.Paginated(c, users, total, page, limit)
}

func BanUser(c *fiber.Ctx) error {
	userID := c.Params("userId")
	var req struct { Reason string `json:"reason"` }
	c.BodyParser(&req)
	db.Pool.Exec(context.Background(),
		"UPDATE app_users SET status='banned', ban_reason=$1, updated_at=NOW() WHERE id=$2",
		req.Reason, userID)
	return models.OKMsg(c, "user banned")
}

func UnbanUser(c *fiber.Ctx) error {
	userID := c.Params("userId")
	db.Pool.Exec(context.Background(),
		"UPDATE app_users SET status='active', ban_reason=NULL, updated_at=NOW() WHERE id=$1", userID)
	return models.OKMsg(c, "user unbanned")
}

func ResetHWID(c *fiber.Ctx) error {
	userID := c.Params("userId")
	claims := middleware.GetAuthClaims(c)
	ctx := context.Background()
	var oldHWID *string
	db.Pool.QueryRow(ctx, "SELECT hwid FROM app_users WHERE id=$1", userID).Scan(&oldHWID)
	db.Pool.Exec(ctx, "UPDATE app_users SET hwid=NULL, hwid_locked=false, updated_at=NOW() WHERE id=$1", userID)
	db.Pool.Exec(ctx, `INSERT INTO hwid_history (app_user_id, old_hwid, reset_by, reason) VALUES ($1,$2,$3,$4)`,
		userID, oldHWID, claims.UserID, "admin reset")
	return models.OKMsg(c, "hwid reset")
}

func DeleteUser(c *fiber.Ctx) error {
	userID := c.Params("userId")
	db.Pool.Exec(context.Background(), "DELETE FROM app_users WHERE id=$1", userID)
	return models.OKMsg(c, "user deleted")
}
''')

# ── internal/handlers/dashboard/sessions.go ─────────────────
wf(f"{BASE}/internal/handlers/dashboard/sessions.go", r'''package dashboard

import (
	"context"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type SessionRow struct {
	ID          string    `json:"id"`
	AppID       string    `json:"appId"`
	UserID      *string   `json:"userId,omitempty"`
	Username    string    `json:"username"`
	IP          *string   `json:"ip,omitempty"`
	Country     *string   `json:"country,omitempty"`
	ValidatedAt time.Time `json:"validatedAt"`
	ExpiresAt   time.Time `json:"expiresAt"`
}

func GetSessions(c *fiber.Ctx) error {
	appID := c.Params("appId")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "50"))
	if page < 1 { page = 1 }
	offset := (page - 1) * limit

	ctx := context.Background()
	var total int64
	db.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM app_sessions WHERE app_id=$1 AND killed=false AND expires_at>NOW()", appID).Scan(&total)

	rows, _ := db.Pool.Query(ctx, `
		SELECT id, app_id, app_user_id, username, ip, country, validated_at, expires_at
		FROM app_sessions WHERE app_id=$1 AND killed=false AND expires_at>NOW()
		ORDER BY validated_at DESC LIMIT $2 OFFSET $3
	`, appID, limit, offset)
	defer rows.Close()

	var sessions []SessionRow
	for rows.Next() {
		var s SessionRow
		rows.Scan(&s.ID, &s.AppID, &s.UserID, &s.Username, &s.IP, &s.Country, &s.ValidatedAt, &s.ExpiresAt)
		sessions = append(sessions, s)
	}
	if sessions == nil { sessions = []SessionRow{} }
	return models.Paginated(c, sessions, total, page, limit)
}

func KillSession(c *fiber.Ctx) error {
	sessID := c.Params("sessionId")
	db.Pool.Exec(context.Background(), "UPDATE app_sessions SET killed=true WHERE id=$1", sessID)
	return models.OKMsg(c, "session killed")
}

func KillAllSessions(c *fiber.Ctx) error {
	appID := c.Params("appId")
	db.Pool.Exec(context.Background(), "UPDATE app_sessions SET killed=true WHERE app_id=$1 AND killed=false", appID)
	return models.OKMsg(c, "all sessions killed")
}
''')

# ── internal/handlers/dashboard/tokens.go ───────────────────
wf(f"{BASE}/internal/handlers/dashboard/tokens.go", r'''package dashboard

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type TokenRow struct {
	ID          string     `json:"id"`
	AppID       string     `json:"appId"`
	Name        string     `json:"name"`
	Token       string     `json:"token,omitempty"`
	TokenPrefix string     `json:"tokenPrefix"`
	Permissions []string   `json:"permissions"`
	LastUsed    *time.Time `json:"lastUsed,omitempty"`
	CreatedAt   time.Time  `json:"createdAt"`
}

func GetTokens(c *fiber.Ctx) error {
	appID := c.Params("appId")
	rows, _ := db.Pool.Query(context.Background(), `
		SELECT id, app_id, name, token_prefix, permissions, last_used_at, created_at
		FROM tokens WHERE app_id=$1 ORDER BY created_at DESC
	`, appID)
	defer rows.Close()

	var tokens []TokenRow
	for rows.Next() {
		var t TokenRow
		var permsJSON []byte
		rows.Scan(&t.ID, &t.AppID, &t.Name, &t.TokenPrefix, &permsJSON, &t.LastUsed, &t.CreatedAt)
		t.Permissions = parseJSONArray(permsJSON)
		tokens = append(tokens, t)
	}
	if tokens == nil { tokens = []TokenRow{} }
	return models.OK(c, tokens)
}

func CreateToken(c *fiber.Ctx) error {
	appID := c.Params("appId")
	var req struct {
		Name        string   `json:"name"`
		Permissions []string `json:"permissions"`
	}
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid body")
	}
	if req.Name == "" {
		return models.BadRequest(c, "name required")
	}

	raw, prefix, err := crypto.GenerateAPIToken()
	if err != nil {
		return models.InternalError(c, "token generation failed")
	}
	hash := crypto.HashAPIToken(raw)
	id := uuid.NewString()

	permsJSON := toJSONArray(req.Permissions)
	db.Pool.Exec(context.Background(), `
		INSERT INTO tokens (id, app_id, name, token_hash, token_prefix, permissions)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, id, appID, req.Name, hash, prefix, permsJSON)

	return models.Created(c, TokenRow{
		ID:          id,
		AppID:       appID,
		Name:        req.Name,
		Token:       raw,
		TokenPrefix: prefix,
		Permissions: req.Permissions,
		CreatedAt:   time.Now(),
	})
}

func DeleteToken(c *fiber.Ctx) error {
	tokenID := c.Params("tokenId")
	db.Pool.Exec(context.Background(), "DELETE FROM tokens WHERE id=$1", tokenID)
	return models.OKMsg(c, "token deleted")
}
''')

# ── internal/handlers/dashboard/helpers.go ──────────────────
wf(f"{BASE}/internal/handlers/dashboard/helpers.go", r'''package dashboard

import "encoding/json"

func parseJSONArray(data []byte) []string {
	if data == nil {
		return []string{}
	}
	var arr []string
	json.Unmarshal(data, &arr)
	if arr == nil {
		return []string{}
	}
	return arr
}

func toJSONArray(arr []string) []byte {
	if arr == nil {
		arr = []string{}
	}
	b, _ := json.Marshal(arr)
	return b
}
''')

# ── internal/handlers/dashboard/subscriptions.go ────────────
wf(f"{BASE}/internal/handlers/dashboard/subscriptions.go", r'''package dashboard

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type SubscriptionRow struct {
	ID          string    `json:"id"`
	AppID       string    `json:"appId"`
	Name        string    `json:"name"`
	Level       int       `json:"level"`
	Price       float64   `json:"price"`
	Duration    int       `json:"duration"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
}

func GetSubscriptions(c *fiber.Ctx) error {
	appID := c.Params("appId")
	rows, _ := db.Pool.Query(context.Background(),
		"SELECT id,app_id,name,level,price,duration,description,created_at FROM subscriptions WHERE app_id=$1 ORDER BY level", appID)
	defer rows.Close()
	var subs []SubscriptionRow
	for rows.Next() {
		var s SubscriptionRow
		rows.Scan(&s.ID, &s.AppID, &s.Name, &s.Level, &s.Price, &s.Duration, &s.Description, &s.CreatedAt)
		subs = append(subs, s)
	}
	if subs == nil { subs = []SubscriptionRow{} }
	return models.OK(c, subs)
}

func CreateSubscription(c *fiber.Ctx) error {
	appID := c.Params("appId")
	var req struct {
		Name        string  `json:"name"`
		Level       int     `json:"level"`
		Price       float64 `json:"price"`
		Duration    int     `json:"duration"`
		Description string  `json:"description"`
	}
	c.BodyParser(&req)
	id := uuid.NewString()
	db.Pool.Exec(context.Background(),
		"INSERT INTO subscriptions(id,app_id,name,level,price,duration,description) VALUES($1,$2,$3,$4,$5,$6,$7)",
		id, appID, req.Name, req.Level, req.Price, req.Duration, req.Description)
	return models.Created(c, fiber.Map{"id": id})
}

func DeleteSubscription(c *fiber.Ctx) error {
	subID := c.Params("subId")
	db.Pool.Exec(context.Background(), "DELETE FROM subscriptions WHERE id=$1", subID)
	return models.OKMsg(c, "subscription deleted")
}
''')

# ── internal/handlers/dashboard/webhooks.go ─────────────────
wf(f"{BASE}/internal/handlers/dashboard/webhooks.go", r'''package dashboard

import (
	"bytes"
	"context"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type WebhookRow struct {
	ID        string    `json:"id"`
	AppID     string    `json:"appId"`
	URL       string    `json:"url"`
	Secret    *string   `json:"secret,omitempty"`
	Events    []string  `json:"events"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}

func GetWebhooks(c *fiber.Ctx) error {
	appID := c.Params("appId")
	rows, _ := db.Pool.Query(context.Background(),
		"SELECT id,app_id,url,secret,events,status,created_at FROM webhooks WHERE app_id=$1 ORDER BY created_at DESC", appID)
	defer rows.Close()
	var hooks []WebhookRow
	for rows.Next() {
		var h WebhookRow
		var eventsJSON []byte
		rows.Scan(&h.ID, &h.AppID, &h.URL, &h.Secret, &eventsJSON, &h.Status, &h.CreatedAt)
		h.Events = parseJSONArray(eventsJSON)
		hooks = append(hooks, h)
	}
	if hooks == nil { hooks = []WebhookRow{} }
	return models.OK(c, hooks)
}

func CreateWebhook(c *fiber.Ctx) error {
	appID := c.Params("appId")
	var req struct {
		URL    string   `json:"url"`
		Secret string   `json:"secret"`
		Events []string `json:"events"`
	}
	c.BodyParser(&req)
	if req.URL == "" {
		return models.BadRequest(c, "url required")
	}
	id := uuid.NewString()
	eventsJSON := toJSONArray(req.Events)
	db.Pool.Exec(context.Background(),
		"INSERT INTO webhooks(id,app_id,url,secret,events) VALUES($1,$2,$3,$4,$5)",
		id, appID, req.URL, req.Secret, eventsJSON)
	return models.Created(c, fiber.Map{"id": id})
}

func UpdateWebhook(c *fiber.Ctx) error {
	hookID := c.Params("webhookId")
	var req struct {
		URL    string   `json:"url"`
		Secret string   `json:"secret"`
		Events []string `json:"events"`
		Status string   `json:"status"`
	}
	c.BodyParser(&req)
	eventsJSON := toJSONArray(req.Events)
	db.Pool.Exec(context.Background(), `
		UPDATE webhooks SET
		  url=COALESCE(NULLIF($1,''),url),
		  secret=COALESCE(NULLIF($2,''),secret),
		  events=$3,
		  status=COALESCE(NULLIF($4,''),status),
		  updated_at=NOW()
		WHERE id=$5
	`, req.URL, req.Secret, eventsJSON, req.Status, hookID)
	return models.OKMsg(c, "webhook updated")
}

func DeleteWebhook(c *fiber.Ctx) error {
	hookID := c.Params("webhookId")
	db.Pool.Exec(context.Background(), "DELETE FROM webhooks WHERE id=$1", hookID)
	return models.OKMsg(c, "webhook deleted")
}

func TestWebhook(c *fiber.Ctx) error {
	hookID := c.Params("webhookId")
	ctx := context.Background()
	var url, secret string
	err := db.Pool.QueryRow(ctx, "SELECT url, COALESCE(secret,'') FROM webhooks WHERE id=$1", hookID).
		Scan(&url, &secret)
	if err != nil {
		return models.NotFound(c, "webhook not found")
	}

	payload := []byte(`{"event":"test","timestamp":"` + time.Now().UTC().Format(time.RFC3339) + `"}`)
	sig := crypto.SignWebhook(secret, payload)

	req, _ := http.NewRequest("POST", url, bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Sira-Signature", sig)
	req.Header.Set("X-Sira-Event", "test")

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return models.OK(c, fiber.Map{"success": false, "error": err.Error()})
	}
	defer resp.Body.Close()
	return models.OK(c, fiber.Map{"success": true, "statusCode": resp.StatusCode})
}
''')

# ── internal/handlers/dashboard/files.go ─────────────────────
wf(f"{BASE}/internal/handlers/dashboard/files.go", r'''package dashboard

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/config"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type FileRow struct {
	ID            string    `json:"id"`
	AppID         string    `json:"appId"`
	Name          string    `json:"name"`
	URL           string    `json:"url"`
	Size          int64     `json:"size"`
	MimeType      string    `json:"mimeType"`
	RequiredLevel int       `json:"requiredLevel"`
	CreatedAt     time.Time `json:"createdAt"`
}

func GetFiles(c *fiber.Ctx) error {
	appID := c.Params("appId")
	rows, _ := db.Pool.Query(context.Background(),
		"SELECT id,app_id,name,url,size,mime_type,required_level,created_at FROM app_files WHERE app_id=$1 ORDER BY created_at DESC", appID)
	defer rows.Close()
	var files []FileRow
	for rows.Next() {
		var f FileRow
		rows.Scan(&f.ID, &f.AppID, &f.Name, &f.URL, &f.Size, &f.MimeType, &f.RequiredLevel, &f.CreatedAt)
		files = append(files, f)
	}
	if files == nil { files = []FileRow{} }
	return models.OK(c, files)
}

func UploadFile(c *fiber.Ctx) error {
	appID := c.Params("appId")
	file, err := c.FormFile("file")
	if err != nil {
		return models.BadRequest(c, "file required")
	}
	requiredLevel := c.FormValue("requiredLevel", "0")
	var level int
	fmt.Sscan(requiredLevel, &level)

	uploadDir := filepath.Join(config.C.UploadPath, appID)
	os.MkdirAll(uploadDir, 0750)

	fileID := uuid.NewString()
	ext := filepath.Ext(file.Filename)
	dest := filepath.Join(uploadDir, fileID+ext)
	if err := c.SaveFile(file, dest); err != nil {
		return models.InternalError(c, "file save failed")
	}

	url := fmt.Sprintf("http://%s/uploads/%s/%s%s", c.Hostname(), appID, fileID, ext)
	db.Pool.Exec(context.Background(),
		"INSERT INTO app_files(id,app_id,name,path,url,size,mime_type,required_level) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
		fileID, appID, file.Filename, dest, url, file.Size, file.Header.Get("Content-Type"), level)

	return models.Created(c, FileRow{
		ID: fileID, AppID: appID, Name: file.Filename,
		URL: url, Size: file.Size, RequiredLevel: level, CreatedAt: time.Now(),
	})
}

func DeleteFile(c *fiber.Ctx) error {
	fileID := c.Params("fileId")
	var path string
	db.Pool.QueryRow(context.Background(), "SELECT path FROM app_files WHERE id=$1", fileID).Scan(&path)
	if path != "" {
		os.Remove(path)
	}
	db.Pool.Exec(context.Background(), "DELETE FROM app_files WHERE id=$1", fileID)
	return models.OKMsg(c, "file deleted")
}
''')

# ── internal/handlers/dashboard/variables.go ────────────────
wf(f"{BASE}/internal/handlers/dashboard/variables.go", r'''package dashboard

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type VariableRow struct {
	ID        string    `json:"id"`
	AppID     string    `json:"appId"`
	UserID    *string   `json:"userId,omitempty"`
	Name      string    `json:"name"`
	Value     string    `json:"value"`
	IsSecret  bool      `json:"isSecret"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func GetVariables(c *fiber.Ctx) error {
	appID := c.Params("appId")
	rows, _ := db.Pool.Query(context.Background(),
		"SELECT id,app_id,app_user_id,name,value,is_secret,updated_at FROM variables WHERE app_id=$1 ORDER BY name", appID)
	defer rows.Close()
	var vars []VariableRow
	for rows.Next() {
		var v VariableRow
		rows.Scan(&v.ID, &v.AppID, &v.UserID, &v.Name, &v.Value, &v.IsSecret, &v.UpdatedAt)
		if v.IsSecret {
			v.Value = "***"
		}
		vars = append(vars, v)
	}
	if vars == nil { vars = []VariableRow{} }
	return models.OK(c, vars)
}

func UpsertVariable(c *fiber.Ctx) error {
	appID := c.Params("appId")
	var req struct {
		UserID   *string `json:"userId"`
		Name     string  `json:"name"`
		Value    string  `json:"value"`
		IsSecret bool    `json:"isSecret"`
	}
	c.BodyParser(&req)
	if req.Name == "" {
		return models.BadRequest(c, "name required")
	}
	id := uuid.NewString()
	ctx := context.Background()
	// Try update first
	var count int
	db.Pool.QueryRow(ctx,
		"SELECT COUNT(*) FROM variables WHERE app_id=$1 AND app_user_id IS NOT DISTINCT FROM $2 AND name=$3",
		appID, req.UserID, req.Name).Scan(&count)
	if count > 0 {
		db.Pool.Exec(ctx,
			"UPDATE variables SET value=$1, is_secret=$2, updated_at=NOW() WHERE app_id=$3 AND app_user_id IS NOT DISTINCT FROM $4 AND name=$5",
			req.Value, req.IsSecret, appID, req.UserID, req.Name)
	} else {
		db.Pool.Exec(ctx,
			"INSERT INTO variables(id,app_id,app_user_id,name,value,is_secret) VALUES($1,$2,$3,$4,$5,$6)",
			id, appID, req.UserID, req.Name, req.Value, req.IsSecret)
	}
	return models.OKMsg(c, "variable saved")
}

func DeleteVariable(c *fiber.Ctx) error {
	varID := c.Params("varId")
	db.Pool.Exec(context.Background(), "DELETE FROM variables WHERE id=$1", varID)
	return models.OKMsg(c, "variable deleted")
}
''')

# ── internal/handlers/dashboard/rules.go ────────────────────
wf(f"{BASE}/internal/handlers/dashboard/rules.go", r'''package dashboard

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type RuleRow struct {
	ID        string    `json:"id"`
	AppID     string    `json:"appId"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	Value     string    `json:"value"`
	Action    string    `json:"action"`
	Enabled   bool      `json:"enabled"`
	CreatedAt time.Time `json:"createdAt"`
}

func GetRules(c *fiber.Ctx) error {
	appID := c.Params("appId")
	rows, _ := db.Pool.Query(context.Background(),
		"SELECT id,app_id,name,type,value,action,enabled,created_at FROM rules WHERE app_id=$1 ORDER BY created_at DESC", appID)
	defer rows.Close()
	var rules []RuleRow
	for rows.Next() {
		var r RuleRow
		rows.Scan(&r.ID, &r.AppID, &r.Name, &r.Type, &r.Value, &r.Action, &r.Enabled, &r.CreatedAt)
		rules = append(rules, r)
	}
	if rules == nil { rules = []RuleRow{} }
	return models.OK(c, rules)
}

func CreateRule(c *fiber.Ctx) error {
	appID := c.Params("appId")
	var req struct {
		Name   string `json:"name"`
		Type   string `json:"type"`
		Value  string `json:"value"`
		Action string `json:"action"`
	}
	c.BodyParser(&req)
	id := uuid.NewString()
	db.Pool.Exec(context.Background(),
		"INSERT INTO rules(id,app_id,name,type,value,action) VALUES($1,$2,$3,$4,$5,$6)",
		id, appID, req.Name, req.Type, req.Value, req.Action)
	return models.Created(c, fiber.Map{"id": id})
}

func ToggleRule(c *fiber.Ctx) error {
	ruleID := c.Params("ruleId")
	var enabled bool
	db.Pool.QueryRow(context.Background(), "SELECT enabled FROM rules WHERE id=$1", ruleID).Scan(&enabled)
	db.Pool.Exec(context.Background(), "UPDATE rules SET enabled=$1 WHERE id=$2", !enabled, ruleID)
	return models.OK(c, fiber.Map{"enabled": !enabled})
}

func DeleteRule(c *fiber.Ctx) error {
	ruleID := c.Params("ruleId")
	db.Pool.Exec(context.Background(), "DELETE FROM rules WHERE id=$1", ruleID)
	return models.OKMsg(c, "rule deleted")
}
''')

# ── internal/handlers/dashboard/chats.go ────────────────────
wf(f"{BASE}/internal/handlers/dashboard/chats.go", r'''package dashboard

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/middleware"
	"github.com/siraauth/backend/internal/models"
)

type ChannelRow struct {
	ID        string    `json:"id"`
	AppID     string    `json:"appId"`
	Name      string    `json:"name"`
	IsDefault bool      `json:"isDefault"`
	CreatedAt time.Time `json:"createdAt"`
}

type MessageRow struct {
	ID        string    `json:"id"`
	AppID     string    `json:"appId"`
	ChannelID string    `json:"channelId"`
	UserID    *string   `json:"userId,omitempty"`
	Username  string    `json:"username"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"timestamp"`
}

func GetChannels(c *fiber.Ctx) error {
	appID := c.Params("appId")
	rows, _ := db.Pool.Query(context.Background(),
		"SELECT id,app_id,name,is_default,created_at FROM chat_channels WHERE app_id=$1 ORDER BY created_at", appID)
	defer rows.Close()
	var channels []ChannelRow
	for rows.Next() {
		var ch ChannelRow
		rows.Scan(&ch.ID, &ch.AppID, &ch.Name, &ch.IsDefault, &ch.CreatedAt)
		channels = append(channels, ch)
	}
	if channels == nil { channels = []ChannelRow{} }
	return models.OK(c, channels)
}

func GetMessages(c *fiber.Ctx) error {
	channelID := c.Params("channelId")
	rows, _ := db.Pool.Query(context.Background(),
		"SELECT id,app_id,channel_id,user_id,username,content,created_at FROM chat_messages WHERE channel_id=$1 ORDER BY created_at DESC LIMIT 100", channelID)
	defer rows.Close()
	var msgs []MessageRow
	for rows.Next() {
		var m MessageRow
		rows.Scan(&m.ID, &m.AppID, &m.ChannelID, &m.UserID, &m.Username, &m.Content, &m.CreatedAt)
		msgs = append(msgs, m)
	}
	if msgs == nil { msgs = []MessageRow{} }
	return models.OK(c, msgs)
}

func SendMessage(c *fiber.Ctx) error {
	appID := c.Params("appId")
	channelID := c.Params("channelId")
	claims := middleware.GetAuthClaims(c)
	var req struct{ Content string `json:"content"` }
	c.BodyParser(&req)
	if req.Content == "" {
		return models.BadRequest(c, "content required")
	}
	id := uuid.NewString()
	db.Pool.Exec(context.Background(),
		"INSERT INTO chat_messages(id,app_id,channel_id,user_id,username,content) VALUES($1,$2,$3,$4,$5,$6)",
		id, appID, channelID, claims.UserID, claims.Username, req.Content)
	return models.Created(c, fiber.Map{"id": id})
}
''')

# ── internal/handlers/dashboard/eventlogs.go ────────────────
wf(f"{BASE}/internal/handlers/dashboard/eventlogs.go", r'''package dashboard

import (
	"context"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type EventRow struct {
	ID        string    `json:"id"`
	AppID     string    `json:"appId"`
	UserID    *string   `json:"userId,omitempty"`
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	IP        *string   `json:"ip,omitempty"`
	CreatedAt time.Time `json:"timestamp"`
}

func GetEventLogs(c *fiber.Ctx) error {
	appID := c.Params("appId")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "50"))
	if page < 1 { page = 1 }
	offset := (page - 1) * limit
	ctx := context.Background()
	var total int64
	db.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM event_logs WHERE app_id=$1", appID).Scan(&total)
	rows, _ := db.Pool.Query(ctx,
		"SELECT id,app_id,user_id,type,message,ip,created_at FROM event_logs WHERE app_id=$1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
		appID, limit, offset)
	defer rows.Close()
	var logs []EventRow
	for rows.Next() {
		var e EventRow
		rows.Scan(&e.ID, &e.AppID, &e.UserID, &e.Type, &e.Message, &e.IP, &e.CreatedAt)
		logs = append(logs, e)
	}
	if logs == nil { logs = []EventRow{} }
	return models.Paginated(c, logs, total, page, limit)
}
''')

# ── Update main.go with all dashboard routes ─────────────────
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
	dash "github.com/siraauth/backend/internal/handlers/dashboard"
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

	app := fiber.New(fiber.Config{
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
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

	// ── Static uploads ────────────────────────────────────────
	app.Static("/uploads", config.C.UploadPath)

	// ── Public ────────────────────────────────────────────────
	app.Get("/health", authHandler.Health)
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"service": "Sira Auth API", "version": "1.0.0"})
	})

	// ── Auth ──────────────────────────────────────────────────
	authGroup := app.Group("/auth")
	strictLimit := middleware.RateLimitStrict(10, 15*time.Minute)
	authGroup.Post("/register", strictLimit, authHandler.Register)
	authGroup.Post("/login",    strictLimit, authHandler.Login)
	authGroup.Post("/logout",   middleware.RequireAuth(), authHandler.Logout)
	authGroup.Get("/me",        middleware.RequireAuth(), authHandler.GetMe)
	authGroup.Post("/refresh",  authHandler.Refresh)
	authGroup.Post("/token",    authHandler.LoginWithToken)
	authGroup.Post("/google",   authHandler.GoogleAuth)

	// ── Dashboard ─────────────────────────────────────────────
	d := app.Group("/dashboard", middleware.RequireAuth())
	d.Get("/stats", dash.GetStats)

	// Apps
	appGroup := d.Group("/apps")
	appGroup.Get("/",                          dash.GetApps)
	appGroup.Post("/",   middleware.QuotaCheck("apps"), dash.CreateApp)
	appGroup.Get("/:appId",                    middleware.OwnsApp(), dash.GetApp)
	appGroup.Put("/:appId",                    middleware.OwnsApp(), dash.UpdateApp)
	appGroup.Delete("/:appId",                 middleware.OwnsApp(), dash.DeleteApp)
	appGroup.Post("/:appId/pause",             middleware.OwnsApp(), dash.PauseApp)
	appGroup.Post("/:appId/refresh-secret",    middleware.OwnsApp(), dash.RefreshSecret)

	// Licenses
	appGroup.Get("/:appId/licenses",           middleware.OwnsApp(), dash.GetLicenses)
	appGroup.Post("/:appId/licenses",          middleware.OwnsApp(), middleware.QuotaCheck("licenses"), dash.CreateLicenses)
	appGroup.Delete("/:appId/licenses/:licenseId", middleware.OwnsApp(), dash.DeleteLicense)
	appGroup.Post("/:appId/licenses/:licenseId/ban", middleware.OwnsApp(), dash.BanLicense)

	// Users
	appGroup.Get("/:appId/users",              middleware.OwnsApp(), dash.GetUsers)
	appGroup.Post("/:appId/users/:userId/ban", middleware.OwnsApp(), dash.BanUser)
	appGroup.Post("/:appId/users/:userId/unban", middleware.OwnsApp(), dash.UnbanUser)
	appGroup.Post("/:appId/users/:userId/reset-hwid", middleware.OwnsApp(), dash.ResetHWID)
	appGroup.Delete("/:appId/users/:userId",   middleware.OwnsApp(), dash.DeleteUser)

	// Sessions
	appGroup.Get("/:appId/sessions",           middleware.OwnsApp(), dash.GetSessions)
	appGroup.Delete("/:appId/sessions/:sessionId", middleware.OwnsApp(), dash.KillSession)
	appGroup.Post("/:appId/sessions/kill-all", middleware.OwnsApp(), dash.KillAllSessions)

	// Tokens
	appGroup.Get("/:appId/tokens",             middleware.OwnsApp(), dash.GetTokens)
	appGroup.Post("/:appId/tokens",            middleware.OwnsApp(), middleware.QuotaCheck("tokens"), dash.CreateToken)
	appGroup.Delete("/:appId/tokens/:tokenId", middleware.OwnsApp(), dash.DeleteToken)

	// Subscriptions
	appGroup.Get("/:appId/subscriptions",      middleware.OwnsApp(), dash.GetSubscriptions)
	appGroup.Post("/:appId/subscriptions",     middleware.OwnsApp(), middleware.QuotaCheck("subs"), dash.CreateSubscription)
	appGroup.Delete("/:appId/subscriptions/:subId", middleware.OwnsApp(), dash.DeleteSubscription)

	// Webhooks
	appGroup.Get("/:appId/webhooks",           middleware.OwnsApp(), dash.GetWebhooks)
	appGroup.Post("/:appId/webhooks",          middleware.OwnsApp(), dash.CreateWebhook)
	appGroup.Put("/:appId/webhooks/:webhookId",middleware.OwnsApp(), dash.UpdateWebhook)
	appGroup.Delete("/:appId/webhooks/:webhookId", middleware.OwnsApp(), dash.DeleteWebhook)
	appGroup.Post("/:appId/webhooks/:webhookId/test", middleware.OwnsApp(), dash.TestWebhook)

	// Files
	appGroup.Get("/:appId/files",              middleware.OwnsApp(), dash.GetFiles)
	appGroup.Post("/:appId/files",             middleware.OwnsApp(), dash.UploadFile)
	appGroup.Delete("/:appId/files/:fileId",   middleware.OwnsApp(), dash.DeleteFile)

	// Variables
	appGroup.Get("/:appId/variables",          middleware.OwnsApp(), dash.GetVariables)
	appGroup.Post("/:appId/variables",         middleware.OwnsApp(), dash.UpsertVariable)
	appGroup.Delete("/:appId/variables/:varId",middleware.OwnsApp(), dash.DeleteVariable)

	// Rules
	appGroup.Get("/:appId/rules",              middleware.OwnsApp(), dash.GetRules)
	appGroup.Post("/:appId/rules",             middleware.OwnsApp(), dash.CreateRule)
	appGroup.Post("/:appId/rules/:ruleId/toggle", middleware.OwnsApp(), dash.ToggleRule)
	appGroup.Delete("/:appId/rules/:ruleId",   middleware.OwnsApp(), dash.DeleteRule)

	// Chats
	appGroup.Get("/:appId/channels",           middleware.OwnsApp(), dash.GetChannels)
	appGroup.Get("/:appId/channels/:channelId/messages", middleware.OwnsApp(), dash.GetMessages)
	appGroup.Post("/:appId/channels/:channelId/messages", middleware.OwnsApp(), dash.SendMessage)

	// Event Logs
	appGroup.Get("/:appId/event-logs",         middleware.OwnsApp(), dash.GetEventLogs)

	// ── SDK (placeholder) ─────────────────────────────────────
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
	app.ShutdownWithTimeout(10 * time.Second)
}
''')

print("\nBuilding with all dashboard routes...")
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

print("\nTesting dashboard endpoints...")
script = r"""
set -e
BASE="http://localhost:8080"

# Login
LOGIN=$(curl -sf -X POST $BASE/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"testadmin","password":"Sup3rS3cur3!"}')
TOKEN=$(echo $LOGIN | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

# Create app
echo "=== Create App ==="
APP=$(curl -sf -X POST $BASE/dashboard/apps \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"My Test App","version":"1.0.0"}')
echo $APP | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('App ID:',d['id'],'Secret prefix:',d['secret'][:10])"

APP_ID=$(echo $APP | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['id'])")

# Create licenses
echo "=== Create 3 Licenses ==="
LICS=$(curl -sf -X POST $BASE/dashboard/apps/$APP_ID/licenses \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"amount":3,"level":1,"maxUses":1}')
echo $LICS | python3 -c "import sys,json;lics=json.load(sys.stdin)['data'];[print('License:',l['key']) for l in lics]"

# Stats
echo "=== Stats ==="
curl -sf $BASE/dashboard/stats -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('Apps:',d['totalApps'],'Licenses:',d['totalLicenses'])"

echo ""
echo "DASHBOARD_TEST_DONE"
"""
out, err, code = run_script(script)
if "DASHBOARD_TEST_DONE" in out:
    print("\nPhase 5 complete! All dashboard CRUD endpoints working.")
else:
    print(f"\nTest output:\n{out}\n{err}")
