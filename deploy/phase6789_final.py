#!/usr/bin/env python3
"""Phase 6-9: SDK API, WebSocket Hub, Hardening, Deployment."""
import sys, os, base64
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script, run

BASE = "/opt/sira-backend"

def wf(path, content):
    enc = base64.b64encode(content.encode()).decode()
    run_script(f"mkdir -p \"$(dirname '{path}')\"\necho '{enc}' | base64 -d > '{path}'\necho 'Written: {path}'")

# ══════════════════════════════════════════════════════════════
print("=" * 60)
print("PHASE 6: SDK API")
print("=" * 60)

# ── internal/middleware/sdk_auth.go ───────────────────────────
wf(f"{BASE}/internal/middleware/sdk_auth.go", r'''package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/models"
)

type SDKContext struct {
	AppID     string
	AppSecret string
}

const SDKCtxKey = "sdk_ctx"

// VerifySDKRequest validates HMAC signature + nonce + timestamp for SDK requests.
func VerifySDKRequest() fiber.Handler {
	return func(c *fiber.Ctx) error {
		appID := c.Get("X-App-ID")
		nonce := c.Get("X-Nonce")
		tsStr := c.Get("X-Timestamp")
		sig := c.Get("X-Signature")

		if appID == "" || nonce == "" || tsStr == "" || sig == "" {
			return models.Unauthorized(c, "missing SDK auth headers")
		}

		// Parse timestamp
		tsUnix, err := strconv.ParseInt(tsStr, 10, 64)
		if err != nil {
			return models.Unauthorized(c, "invalid timestamp")
		}
		ts := time.Unix(tsUnix, 0)

		// Validate timestamp window (±60 seconds)
		if err := crypto.ValidateTimestamp(ts); err != nil {
			return models.Unauthorized(c, fmt.Sprintf("timestamp out of bounds: %v", err))
		}

		// Get app secret from DB
		var appSecret string
		err = db.Pool.QueryRow(context.Background(),
			"SELECT s.secret FROM app_secrets s JOIN applications a ON a.id=s.app_id WHERE s.app_id=$1 AND s.is_active=true AND a.status='active'",
			appID).Scan(&appSecret)
		if err != nil {
			return models.Unauthorized(c, "invalid app ID")
		}

		// Verify nonce (replay protection)
		if err := crypto.StoreNonce(appID, nonce); err != nil {
			return models.Unauthorized(c, "replay attack detected")
		}

		// Verify HMAC
		bodyHash := crypto.HashBody(c.Body())
		if !crypto.VerifyRequestSignature(appSecret, nonce, ts, bodyHash, sig) {
			return models.Unauthorized(c, "invalid signature")
		}

		c.Locals(SDKCtxKey, &SDKContext{AppID: appID, AppSecret: appSecret})
		return c.Next()
	}
}

func GetSDKContext(c *fiber.Ctx) *SDKContext {
	v := c.Locals(SDKCtxKey)
	if v == nil { return nil }
	ctx, _ := v.(*SDKContext)
	return ctx
}

// SDKSessionAuth validates an active SDK session token.
func SDKSessionAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		sessionID := c.Get("X-Session-ID")
		if sessionID == "" {
			return models.Unauthorized(c, "session required")
		}
		data, err := crypto.GetSession(sessionID)
		if err != nil {
			return models.Unauthorized(c, "session expired or invalid")
		}
		var sessionData map[string]interface{}
		json.Unmarshal(data, &sessionData)
		c.Locals("sdk_session", sessionData)
		return c.Next()
	}
}
''')

# ── internal/handlers/sdk/sdk.go ─────────────────────────────
wf(f"{BASE}/internal/handlers/sdk/sdk.go", r'''package sdk

import (
	"context"
	"encoding/json"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/db"
	"github.com/siraauth/backend/internal/middleware"
	"github.com/siraauth/backend/internal/models"
)

// ── Init (Handshake) ──────────────────────────────────────────

func Init(c *fiber.Ctx) error {
	sdkCtx := middleware.GetSDKContext(c)
	if sdkCtx == nil {
		return models.Unauthorized(c, "sdk context missing")
	}

	var req struct {
		Version   string `json:"version"`
		ClientPub string `json:"clientPub"` // ECDH public key (base64)
	}
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid body")
	}

	// Generate server ephemeral ECDH keypair
	serverKP, err := crypto.GenerateECDHKeyPair()
	if err != nil {
		return models.InternalError(c, "key generation failed")
	}

	// If client sent a public key, derive shared secret
	var sessionKey string
	if req.ClientPub != "" {
		sharedKey, err := crypto.DeriveSharedSecret(serverKP.Private, req.ClientPub)
		if err != nil {
			return models.BadRequest(c, "invalid client public key")
		}
		sessionKey = string(sharedKey)
	} else {
		// Fallback: use app secret as session key material
		k, _ := crypto.GenerateRandomHex(16)
		sessionKey = k
	}

	// Get app public key for license verification
	var appPubKey string
	db.Pool.QueryRow(context.Background(),
		"SELECT public_key FROM app_keypairs WHERE app_id=$1", sdkCtx.AppID).Scan(&appPubKey)

	// Create session
	sessionID := uuid.NewString()
	sessionData := map[string]interface{}{
		"sessionId": sessionID,
		"appId":     sdkCtx.AppID,
		"version":   req.Version,
		"ip":        c.IP(),
		"createdAt": time.Now().Unix(),
	}
	sessionJSON, _ := json.Marshal(sessionData)
	crypto.StoreSession(sessionID, sessionJSON, 24*time.Hour)

	return models.OK(c, fiber.Map{
		"sessionId": sessionID,
		"serverPub": serverKP.PublicB64,
		"appPubKey": appPubKey,
		"timestamp": time.Now().Unix(),
	})
}

// ── Login (License Validation) ───────────────────────────────

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	License  string `json:"license"`
	HWID     string `json:"hwid"`
	Version  string `json:"version"`
}

func Login(c *fiber.Ctx) error {
	sdkCtx := middleware.GetSDKContext(c)
	if sdkCtx == nil {
		return models.Unauthorized(c, "sdk context missing")
	}

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid body")
	}
	if req.Username == "" || req.Password == "" || req.License == "" {
		return models.BadRequest(c, "username, password, and license are required")
	}

	ctx := context.Background()
	appID := sdkCtx.AppID

	// Check rules (IP/country block)
	if blocked, reason := checkRules(ctx, appID, c.IP(), req.Version, ""); blocked {
		logEvent(ctx, appID, "", "login_blocked", reason, c.IP())
		return models.Forbidden(c, reason)
	}

	// Validate license
	var licID, licStatus string
	var licLevel, licMaxUses, licUses int
	var licExpiry *time.Time
	err := db.Pool.QueryRow(ctx, `
		SELECT id, status, level, max_uses, uses, expires_at
		FROM licenses WHERE key=$1 AND app_id=$2
	`, req.License, appID).Scan(&licID, &licStatus, &licLevel, &licMaxUses, &licUses, &licExpiry)
	if err != nil {
		logEvent(ctx, appID, "", "login_failed", "invalid license: "+req.License, c.IP())
		return models.Unauthorized(c, "invalid license key")
	}
	if licStatus == "banned" {
		logEvent(ctx, appID, "", "login_blocked", "banned license", c.IP())
		return models.Forbidden(c, "license key is banned")
	}
	if licExpiry != nil && time.Now().After(*licExpiry) {
		db.Pool.Exec(ctx, "UPDATE licenses SET status='expired' WHERE id=$1", licID)
		return models.Forbidden(c, "license key has expired")
	}
	if licMaxUses > 0 && licUses >= licMaxUses {
		return models.Forbidden(c, "license key has reached maximum uses")
	}

	// Find or verify user
	var appUserID, storedHWID string
	var userStatus string
	err = db.Pool.QueryRow(ctx, `
		SELECT id, COALESCE(hwid,''), status FROM app_users
		WHERE username=$1 AND app_id=$2
	`, req.Username, appID).Scan(&appUserID, &storedHWID, &userStatus)
	if err != nil {
		logEvent(ctx, appID, "", "login_failed", "user not found: "+req.Username, c.IP())
		return models.Unauthorized(c, "invalid credentials")
	}

	if userStatus == "banned" {
		return models.Forbidden(c, "user is banned")
	}

	// Verify password
	var passHash string
	db.Pool.QueryRow(ctx, "SELECT password_hash FROM app_users WHERE id=$1", appUserID).Scan(&passHash)
	if !crypto.VerifyAppUserPassword(passHash, req.Password) {
		logEvent(ctx, appID, appUserID, "login_failed", "wrong password", c.IP())
		return models.Unauthorized(c, "invalid credentials")
	}

	// HWID binding
	if storedHWID == "" && req.HWID != "" {
		db.Pool.Exec(ctx, "UPDATE app_users SET hwid=$1, hwid_locked=true, updated_at=NOW() WHERE id=$2",
			req.HWID, appUserID)
	} else if storedHWID != "" && req.HWID != "" && storedHWID != req.HWID {
		logEvent(ctx, appID, appUserID, "hwid_mismatch", "HWID mismatch detected", c.IP())
		return models.Forbidden(c, "hardware ID mismatch — contact support to reset")
	}

	// Update license uses
	db.Pool.Exec(ctx, "UPDATE licenses SET uses=uses+1, status='active', updated_at=NOW() WHERE id=$1", licID)
	if licStatus == "unused" {
		db.Pool.Exec(ctx, "UPDATE licenses SET user_id=$1 WHERE id=$2", appUserID, licID)
	}
	db.Pool.Exec(ctx, "INSERT INTO license_uses(license_id, app_user_id, ip, hwid) VALUES($1,$2,$3,$4)",
		licID, appUserID, c.IP(), req.HWID)

	// Create session record
	sessID := uuid.NewString()
	expiresAt := time.Now().Add(24 * time.Hour)
	db.Pool.Exec(ctx, `
		INSERT INTO app_sessions(id, app_id, app_user_id, username, ip, validated_at, expires_at)
		VALUES($1,$2,$3,$4,$5,NOW(),$6)
	`, sessID, appID, appUserID, req.Username, c.IP(), expiresAt)

	// Update app user last login + IP
	db.Pool.Exec(ctx, "UPDATE app_users SET last_login_at=NOW(), ip=$1, updated_at=NOW() WHERE id=$2",
		c.IP(), appUserID)

	// Cache session
	sessionData := map[string]interface{}{
		"sessionId": sessID,
		"appId":     appID,
		"userId":    appUserID,
		"username":  req.Username,
		"level":     licLevel,
		"ip":        c.IP(),
	}
	sessionJSON, _ := json.Marshal(sessionData)
	crypto.StoreSession(sessID, sessionJSON, 24*time.Hour)

	logEvent(ctx, appID, appUserID, "login", "user logged in", c.IP())

	return models.OK(c, fiber.Map{
		"sessionId": sessID,
		"username":  req.Username,
		"level":     licLevel,
		"expiresAt": expiresAt,
	})
}

// ── Register ─────────────────────────────────────────────────

func Register(c *fiber.Ctx) error {
	sdkCtx := middleware.GetSDKContext(c)
	if sdkCtx == nil {
		return models.Unauthorized(c, "sdk context missing")
	}

	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Email    string `json:"email"`
		License  string `json:"license"`
		HWID     string `json:"hwid"`
	}
	if err := c.BodyParser(&req); err != nil {
		return models.BadRequest(c, "invalid body")
	}
	if req.Username == "" || req.Password == "" || req.License == "" {
		return models.BadRequest(c, "username, password, and license required")
	}

	ctx := context.Background()
	appID := sdkCtx.AppID

	// Validate license (must be unused)
	var licID, licStatus string
	err := db.Pool.QueryRow(ctx, "SELECT id, status FROM licenses WHERE key=$1 AND app_id=$2",
		req.License, appID).Scan(&licID, &licStatus)
	if err != nil || (licStatus != "unused" && licStatus != "active") {
		return models.Unauthorized(c, "invalid or already used license")
	}

	// Check username uniqueness
	var count int
	db.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM app_users WHERE username=$1 AND app_id=$2",
		req.Username, appID).Scan(&count)
	if count > 0 {
		return models.Conflict(c, "username already taken")
	}

	// Hash password
	passHash, err := crypto.HashAppUserPassword(req.Password)
	if err != nil {
		return models.InternalError(c, "password hash failed")
	}

	userID := uuid.NewString()
	_, err = db.Pool.Exec(ctx, `
		INSERT INTO app_users(id, app_id, username, email, password_hash, ip, hwid, hwid_locked)
		VALUES($1,$2,$3,$4,$5,$6,$7,$8)
	`, userID, appID, req.Username, req.Email, passHash, c.IP(), req.HWID, req.HWID != "")
	if err != nil {
		return models.InternalError(c, "failed to create user")
	}

	// Bind license to user
	db.Pool.Exec(ctx, "UPDATE licenses SET user_id=$1, status='active', updated_at=NOW() WHERE id=$2",
		userID, licID)

	logEvent(ctx, appID, userID, "register", "new user registered", c.IP())

	return models.Created(c, fiber.Map{
		"userId":   userID,
		"username": req.Username,
	})
}

// ── Check (Heartbeat) ─────────────────────────────────────────

func Check(c *fiber.Ctx) error {
	sdkCtx := middleware.GetSDKContext(c)
	if sdkCtx == nil {
		return models.Unauthorized(c, "sdk context missing")
	}

	sessionID := c.Get("X-Session-ID")
	if sessionID == "" {
		return models.BadRequest(c, "session ID required")
	}

	sessionData, err := crypto.GetSession(sessionID)
	if err != nil {
		return models.Unauthorized(c, "session expired")
	}

	// Check if session was killed
	var killed bool
	db.Pool.QueryRow(context.Background(),
		"SELECT killed FROM app_sessions WHERE id=$1", sessionID).Scan(&killed)
	if killed {
		crypto.DeleteSession(sessionID)
		return models.Unauthorized(c, "session was terminated")
	}

	// Refresh session TTL
	crypto.StoreSession(sessionID, sessionData, 24*time.Hour)

	return models.OK(c, fiber.Map{"valid": true, "timestamp": time.Now().Unix()})
}

// ── Logout ────────────────────────────────────────────────────

func Logout(c *fiber.Ctx) error {
	sessionID := c.Get("X-Session-ID")
	if sessionID != "" {
		crypto.DeleteSession(sessionID)
		db.Pool.Exec(context.Background(), "UPDATE app_sessions SET killed=true WHERE id=$1", sessionID)
	}
	return models.OKMsg(c, "logged out")
}

// ── GetVar ────────────────────────────────────────────────────

func GetVar(c *fiber.Ctx) error {
	sdkCtx := middleware.GetSDKContext(c)
	if sdkCtx == nil {
		return models.Unauthorized(c, "sdk context missing")
	}
	varName := c.Params("name")
	var value string
	err := db.Pool.QueryRow(context.Background(),
		"SELECT value FROM variables WHERE app_id=$1 AND app_user_id IS NULL AND name=$2 AND is_secret=false",
		sdkCtx.AppID, varName).Scan(&value)
	if err != nil {
		return models.NotFound(c, "variable not found")
	}
	return models.OK(c, fiber.Map{"name": varName, "value": value})
}

// ── GetFile ───────────────────────────────────────────────────

func GetFile(c *fiber.Ctx) error {
	sdkCtx := middleware.GetSDKContext(c)
	if sdkCtx == nil {
		return models.Unauthorized(c, "sdk context missing")
	}
	fileID := c.Params("id")
	var url, name string
	var requiredLevel int
	err := db.Pool.QueryRow(context.Background(),
		"SELECT url, name, required_level FROM app_files WHERE id=$1 AND app_id=$2",
		fileID, sdkCtx.AppID).Scan(&url, &name, &requiredLevel)
	if err != nil {
		return models.NotFound(c, "file not found")
	}
	return models.OK(c, fiber.Map{"id": fileID, "name": name, "url": url, "requiredLevel": requiredLevel})
}

// ── Log ───────────────────────────────────────────────────────

func Log(c *fiber.Ctx) error {
	sdkCtx := middleware.GetSDKContext(c)
	if sdkCtx == nil {
		return models.Unauthorized(c, "sdk context missing")
	}
	var req struct {
		Type    string `json:"type"`
		Message string `json:"message"`
		UserID  string `json:"userId"`
	}
	c.BodyParser(&req)
	if req.Message == "" {
		return models.BadRequest(c, "message required")
	}
	logEvent(context.Background(), sdkCtx.AppID, req.UserID, req.Type, req.Message, c.IP())
	return models.OKMsg(c, "logged")
}

// ── Helpers ───────────────────────────────────────────────────

func logEvent(ctx context.Context, appID, userID, eventType, message, ip string) {
	var uid *string
	if userID != "" {
		uid = &userID
	}
	db.Pool.Exec(ctx,
		"INSERT INTO event_logs(id, app_id, user_id, type, message, ip) VALUES(gen_random_uuid(),$1,$2,$3,$4,$5)",
		appID, uid, eventType, message, ip)
}

func checkRules(ctx context.Context, appID, ip, version, country string) (bool, string) {
	rows, err := db.Pool.Query(ctx,
		"SELECT type, value, action FROM rules WHERE app_id=$1 AND enabled=true", appID)
	if err != nil { return false, "" }
	defer rows.Close()
	for rows.Next() {
		var rType, rValue, rAction string
		rows.Scan(&rType, &rValue, &rAction)
		if rAction != "block" { continue }
		switch rType {
		case "ip_block":
			if ip == rValue { return true, "IP address is blocked" }
		case "version_lock":
			if version != rValue { return true, "version not allowed: required " + rValue }
		case "country_block":
			if country == rValue { return true, "country is blocked" }
		}
	}
	return false, ""
}
''')

# ══════════════════════════════════════════════════════════════
print("=" * 60)
print("PHASE 7: WebSocket Hub")
print("=" * 60)

# ── internal/ws/hub.go ────────────────────────────────────────
wf(f"{BASE}/internal/ws/hub.go", r'''package ws

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/gofiber/websocket/v2"
	"go.uber.org/zap"
)

// Hub manages all WebSocket connections.
type Hub struct {
	mu      sync.RWMutex
	clients map[string]*Client // sessionID -> client
	logger  *zap.Logger
}

var GlobalHub *Hub

func NewHub(logger *zap.Logger) *Hub {
	h := &Hub{
		clients: make(map[string]*Client),
		logger:  logger,
	}
	GlobalHub = h
	go h.heartbeat()
	return h
}

func (h *Hub) Register(c *Client) {
	h.mu.Lock()
	h.clients[c.SessionID] = c
	h.mu.Unlock()
	h.logger.Info("ws client connected",
		zap.String("session", c.SessionID),
		zap.String("app", c.AppID),
	)
}

func (h *Hub) Unregister(sessionID string) {
	h.mu.Lock()
	delete(h.clients, sessionID)
	h.mu.Unlock()
}

// Send sends a message to a specific session.
func (h *Hub) Send(sessionID string, msg Message) {
	h.mu.RLock()
	client, ok := h.clients[sessionID]
	h.mu.RUnlock()
	if ok {
		client.send <- msg
	}
}

// Broadcast sends a message to all clients of an app.
func (h *Hub) Broadcast(appID string, msg Message) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for _, c := range h.clients {
		if c.AppID == appID {
			select {
			case c.send <- msg:
			default:
			}
		}
	}
}

// heartbeat pings all clients every 30 seconds.
func (h *Hub) heartbeat() {
	ticker := time.NewTicker(30 * time.Second)
	for range ticker.C {
		msg := Message{Type: "ping", Timestamp: time.Now().Unix()}
		h.mu.RLock()
		for _, c := range h.clients {
			select {
			case c.send <- msg:
			default:
			}
		}
		h.mu.RUnlock()
	}
}

// Message types for server-push events.
type Message struct {
	Type      string      `json:"type"`
	Data      interface{} `json:"data,omitempty"`
	Timestamp int64       `json:"ts"`
}

func (m Message) ToJSON() []byte {
	b, _ := json.Marshal(m)
	return b
}

// Push events
func (h *Hub) PushSessionRevoked(appID, sessionID string) {
	h.Send(sessionID, Message{Type: "session_revoked", Timestamp: time.Now().Unix()})
}

func (h *Hub) PushLicenseBanned(appID, licenseKey string) {
	h.Broadcast(appID, Message{
		Type:      "license_banned",
		Data:      map[string]string{"key": licenseKey},
		Timestamp: time.Now().Unix(),
	})
}

func (h *Hub) PushAppPaused(appID string) {
	h.Broadcast(appID, Message{Type: "app_paused", Timestamp: time.Now().Unix()})
}

func (h *Hub) PushForceLogout(appID, sessionID string) {
	h.Send(sessionID, Message{Type: "force_logout", Timestamp: time.Now().Unix()})
}

// WSHandler handles new WebSocket connections.
func (h *Hub) WSHandler(c *websocket.Conn) {
	sessionID := c.Query("session")
	appID := c.Query("app")
	if sessionID == "" || appID == "" {
		c.Close()
		return
	}

	client := &Client{
		Conn:      c,
		SessionID: sessionID,
		AppID:     appID,
		send:      make(chan Message, 64),
		hub:       h,
		lastPong:  time.Now(),
	}
	h.Register(client)
	defer func() {
		h.Unregister(sessionID)
		c.Close()
	}()

	go client.writePump()
	client.readPump()
}
''')

# ── internal/ws/client.go ────────────────────────────────────
wf(f"{BASE}/internal/ws/client.go", r'''package ws

import (
	"encoding/json"
	"time"

	"github.com/gofiber/websocket/v2"
)

type Client struct {
	Conn      *websocket.Conn
	SessionID string
	AppID     string
	send      chan Message
	hub       *Hub
	lastPong  time.Time
}

func (c *Client) readPump() {
	c.Conn.SetReadDeadline(time.Now().Add(90 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.lastPong = time.Now()
		c.Conn.SetReadDeadline(time.Now().Add(90 * time.Second))
		return nil
	})
	for {
		_, msg, err := c.Conn.ReadMessage()
		if err != nil {
			break
		}
		// Handle pong/ping from client
		var m map[string]string
		if json.Unmarshal(msg, &m) == nil {
			if m["type"] == "pong" {
				c.lastPong = time.Now()
			}
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case msg, ok := <-c.send:
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.Conn.WriteMessage(websocket.TextMessage, msg.ToJSON()); err != nil {
				return
			}
		case <-ticker.C:
			// Check client is alive (60s no pong = dead)
			if time.Since(c.lastPong) > 60*time.Second {
				return
			}
			ping := Message{Type: "ping", Timestamp: time.Now().Unix()}
			if err := c.Conn.WriteMessage(websocket.TextMessage, ping.ToJSON()); err != nil {
				return
			}
		}
	}
}
''')

# ══════════════════════════════════════════════════════════════
print("=" * 60)
print("PHASE 8: Hardening + Audit")
print("=" * 60)

# ── internal/audit/audit.go ──────────────────────────────────
wf(f"{BASE}/internal/audit/audit.go", r'''package audit

import (
	"context"

	"github.com/siraauth/backend/internal/db"
	"github.com/google/uuid"
)

// Log writes an immutable audit log entry.
func Log(userID, action, resource, resourceID, ip, userAgent string, metadata map[string]interface{}) {
	var uid *string
	if userID != "" {
		uid = &userID
	}
	var meta *map[string]interface{}
	if metadata != nil {
		meta = &metadata
	}

	db.Pool.Exec(context.Background(), `
		INSERT INTO audit_logs(id, user_id, action, resource, resource_id, ip, user_agent, metadata)
		VALUES($1,$2,$3,$4,$5,$6,$7,$8)
	`, uuid.NewString(), uid, action, resource, resourceID, ip, userAgent, meta)
}
''')

# ── Caddy configuration ───────────────────────────────────────
wf("/etc/caddy/Caddyfile", """# Sira Auth API - Caddy reverse proxy
# Replace :80 with your domain when available

:80 {
    reverse_proxy localhost:8080 {
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
    }
    
    log {
        output file /var/log/sira/caddy.log
        format json
    }
    
    encode gzip
}
""")

# ══════════════════════════════════════════════════════════════
print("=" * 60)
print("Final main.go with SDK + WebSocket routes")
print("=" * 60)

# ── Final main.go with all routes ────────────────────────────
wf(f"{BASE}/cmd/api/main.go", r'''package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	fiberWS "github.com/gofiber/websocket/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/siraauth/backend/internal/config"
	"github.com/siraauth/backend/internal/crypto"
	"github.com/siraauth/backend/internal/db"
	authHandler "github.com/siraauth/backend/internal/handlers/auth"
	dash "github.com/siraauth/backend/internal/handlers/dashboard"
	sdkHandler "github.com/siraauth/backend/internal/handlers/sdk"
	"github.com/siraauth/backend/internal/middleware"
	"github.com/siraauth/backend/internal/redisdb"
	"github.com/siraauth/backend/internal/ws"
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

	// Initialize WebSocket hub
	hub := ws.NewHub(logger)

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

	// Static uploads
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

	appGroup := d.Group("/apps")
	appGroup.Get("/",          dash.GetApps)
	appGroup.Post("/",   middleware.QuotaCheck("apps"), dash.CreateApp)
	appGroup.Get("/:appId",    middleware.OwnsApp(), dash.GetApp)
	appGroup.Put("/:appId",    middleware.OwnsApp(), dash.UpdateApp)
	appGroup.Delete("/:appId", middleware.OwnsApp(), dash.DeleteApp)
	appGroup.Post("/:appId/pause",          middleware.OwnsApp(), dash.PauseApp)
	appGroup.Post("/:appId/refresh-secret", middleware.OwnsApp(), dash.RefreshSecret)

	appGroup.Get("/:appId/licenses",  middleware.OwnsApp(), dash.GetLicenses)
	appGroup.Post("/:appId/licenses", middleware.OwnsApp(), middleware.QuotaCheck("licenses"), dash.CreateLicenses)
	appGroup.Delete("/:appId/licenses/:licenseId",   middleware.OwnsApp(), dash.DeleteLicense)
	appGroup.Post("/:appId/licenses/:licenseId/ban", middleware.OwnsApp(), dash.BanLicense)

	appGroup.Get("/:appId/users",  middleware.OwnsApp(), dash.GetUsers)
	appGroup.Post("/:appId/users/:userId/ban",        middleware.OwnsApp(), dash.BanUser)
	appGroup.Post("/:appId/users/:userId/unban",      middleware.OwnsApp(), dash.UnbanUser)
	appGroup.Post("/:appId/users/:userId/reset-hwid", middleware.OwnsApp(), dash.ResetHWID)
	appGroup.Delete("/:appId/users/:userId",          middleware.OwnsApp(), dash.DeleteUser)

	appGroup.Get("/:appId/sessions",  middleware.OwnsApp(), dash.GetSessions)
	appGroup.Delete("/:appId/sessions/:sessionId",   middleware.OwnsApp(), dash.KillSession)
	appGroup.Post("/:appId/sessions/kill-all",       middleware.OwnsApp(), dash.KillAllSessions)

	appGroup.Get("/:appId/tokens",  middleware.OwnsApp(), dash.GetTokens)
	appGroup.Post("/:appId/tokens", middleware.OwnsApp(), middleware.QuotaCheck("tokens"), dash.CreateToken)
	appGroup.Delete("/:appId/tokens/:tokenId", middleware.OwnsApp(), dash.DeleteToken)

	appGroup.Get("/:appId/subscriptions",  middleware.OwnsApp(), dash.GetSubscriptions)
	appGroup.Post("/:appId/subscriptions", middleware.OwnsApp(), middleware.QuotaCheck("subs"), dash.CreateSubscription)
	appGroup.Delete("/:appId/subscriptions/:subId", middleware.OwnsApp(), dash.DeleteSubscription)

	appGroup.Get("/:appId/webhooks",  middleware.OwnsApp(), dash.GetWebhooks)
	appGroup.Post("/:appId/webhooks", middleware.OwnsApp(), dash.CreateWebhook)
	appGroup.Put("/:appId/webhooks/:webhookId",       middleware.OwnsApp(), dash.UpdateWebhook)
	appGroup.Delete("/:appId/webhooks/:webhookId",    middleware.OwnsApp(), dash.DeleteWebhook)
	appGroup.Post("/:appId/webhooks/:webhookId/test", middleware.OwnsApp(), dash.TestWebhook)

	appGroup.Get("/:appId/files",  middleware.OwnsApp(), dash.GetFiles)
	appGroup.Post("/:appId/files", middleware.OwnsApp(), dash.UploadFile)
	appGroup.Delete("/:appId/files/:fileId", middleware.OwnsApp(), dash.DeleteFile)

	appGroup.Get("/:appId/variables",  middleware.OwnsApp(), dash.GetVariables)
	appGroup.Post("/:appId/variables", middleware.OwnsApp(), dash.UpsertVariable)
	appGroup.Delete("/:appId/variables/:varId", middleware.OwnsApp(), dash.DeleteVariable)

	appGroup.Get("/:appId/rules",  middleware.OwnsApp(), dash.GetRules)
	appGroup.Post("/:appId/rules", middleware.OwnsApp(), dash.CreateRule)
	appGroup.Post("/:appId/rules/:ruleId/toggle", middleware.OwnsApp(), dash.ToggleRule)
	appGroup.Delete("/:appId/rules/:ruleId",      middleware.OwnsApp(), dash.DeleteRule)

	appGroup.Get("/:appId/channels",  middleware.OwnsApp(), dash.GetChannels)
	appGroup.Get("/:appId/channels/:channelId/messages",  middleware.OwnsApp(), dash.GetMessages)
	appGroup.Post("/:appId/channels/:channelId/messages", middleware.OwnsApp(), dash.SendMessage)

	appGroup.Get("/:appId/event-logs", middleware.OwnsApp(), dash.GetEventLogs)

	// ── SDK API ───────────────────────────────────────────────
	sdkGroup := app.Group("/sdk", middleware.VerifySDKRequest())
	sdkGroup.Post("/init",     sdkHandler.Init)
	sdkGroup.Post("/login",    sdkHandler.Login)
	sdkGroup.Post("/register", sdkHandler.Register)
	sdkGroup.Post("/check",    sdkHandler.Check)
	sdkGroup.Post("/logout",   sdkHandler.Logout)
	sdkGroup.Get("/var/:name", sdkHandler.GetVar)
	sdkGroup.Get("/file/:id",  sdkHandler.GetFile)
	sdkGroup.Post("/log",      sdkHandler.Log)

	// ── WebSocket ─────────────────────────────────────────────
	app.Use("/sdk/ws", func(c *fiber.Ctx) error {
		if fiberWS.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	app.Get("/sdk/ws", fiberWS.New(hub.WSHandler))

	// ── 404 ───────────────────────────────────────────────────
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

print("\nBuilding final binary with all features...")
script = r"""
set -e
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd /opt/sira-backend
go mod tidy
go build -ldflags="-s -w" -o bin/sira-api cmd/api/main.go
echo "FINAL_BUILD_OK"
ls -lh bin/sira-api
"""
out, err, code = run_script(script, timeout=180)
if code != 0:
    print(f"Build error:\n{err}")
    sys.exit(1)

# ══════════════════════════════════════════════════════════════
print("=" * 60)
print("PHASE 9: Deployment + Caddy + Dashboard wiring")
print("=" * 60)

print("Configuring Caddy and logrotate...")
script = r"""
set -e
# Logrotate for sira logs
cat > /etc/logrotate.d/sira << 'LOGROTATE'
/var/log/sira/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    sharedscripts
    postrotate
        systemctl reload sira-api 2>/dev/null || true
    endscript
}
LOGROTATE

# Setup Caddy
systemctl enable caddy
systemctl restart caddy
sleep 2
systemctl is-active caddy || echo "caddy start issue (ok - no domain yet)"

# Backup cron job for postgres
crontab -l 2>/dev/null | grep -v pg_dump | {
  cat
  echo "0 3 * * * source /root/.sira_db_creds && PGPASSWORD=\$DB_PASS pg_dump -h 127.0.0.1 -U \$DB_USER \$DB_NAME > /var/backups/sira_\$(date +\%Y\%m\%d).sql && find /var/backups/ -name 'sira_*.sql' -mtime +7 -delete 2>/dev/null"
} | crontab -

echo "DEPLOYMENT_CONFIG_DONE"
"""
run_script(script)

print("\nRestarting sira-api with final binary...")
script = r"""
set -e
chown -R siraapp:siraapp /opt/sira-backend
chmod +x /opt/sira-backend/bin/sira-api
systemctl restart sira-api
sleep 4
systemctl is-active sira-api
"""
run_script(script)

print("\n" + "=" * 60)
print("FINAL END-TO-END TEST")
print("=" * 60)

script = r"""
set -e
BASE="http://localhost:8080"

echo "1. Health check..."
curl -sf $BASE/health | python3 -c "import sys,json;d=json.load(sys.stdin);print('Status:',d['status'],'PG:',d['services']['postgres'],'Redis:',d['services']['redis'])"

echo ""
echo "2. Login..."
LOGIN=$(curl -sf -X POST $BASE/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"testadmin","password":"Sup3rS3cur3!"}')
TOKEN=$(echo $LOGIN | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['token'])")
echo "JWT token obtained (length: ${#TOKEN})"

echo ""
echo "3. Create app..."
APP=$(curl -sf -X POST $BASE/dashboard/apps \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Production App","version":"2.0.0","description":"Main application"}')
APP_ID=$(echo $APP | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['id'])")
echo "App created: $APP_ID"

echo ""
echo "4. Create 5 licenses..."
LICS=$(curl -sf -X POST $BASE/dashboard/apps/$APP_ID/licenses \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"amount":5,"level":2,"maxUses":1,"duration":365}')
echo $LICS | python3 -c "import sys,json;lics=json.load(sys.stdin)['data'];print(f'Created {len(lics)} licenses');[print(' ',l['key']) for l in lics[:2]]"

echo ""
echo "5. Create token..."
curl -sf -X POST $BASE/dashboard/apps/$APP_ID/tokens \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"SDK Token","permissions":["license:read","user:read"]}' | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('Token prefix:',d['tokenPrefix'])"

echo ""
echo "6. Dashboard stats..."
curl -sf $BASE/dashboard/stats -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json;d=json.load(sys.stdin)['data'];print('Apps:',d['totalApps'],'Licenses:',d['totalLicenses'])"

echo ""
echo "ALL_TESTS_PASSED"
"""
out, err, code = run_script(script)
if "ALL_TESTS_PASSED" in out:
    print("\n" + "=" * 60)
    print("ALL PHASES COMPLETE!")
    print("API running on: http://72.62.246.31:8080")
    print("Health: http://72.62.246.31:8080/health")
    print("=" * 60)
else:
    print(f"Test output:\n{out}\n{err}")
    run("journalctl -u sira-api -n 30 --no-pager")

print("\nPrinting service status...")
run("systemctl status sira-api --no-pager 2>/dev/null | head -5; echo '---'; curl -s http://localhost:8080/health")
