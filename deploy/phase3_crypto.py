#!/usr/bin/env python3
"""Phase 3: Write all crypto layer files."""
import sys, os, base64
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ssh_helper import run_script, run

BASE = "/opt/sira-backend"

def wf(path, content):
    enc = base64.b64encode(content.encode()).decode()
    script = f"mkdir -p \"$(dirname '{path}')\"\necho '{enc}' | base64 -d > '{path}'\necho 'Written: {path}'"
    run_script(script)

print("=" * 60)
print("PHASE 3: Writing crypto package files")
print("=" * 60)

# ── internal/crypto/jwt.go ────────────────────────────────────
wf(f"{BASE}/internal/crypto/jwt.go", r'''package crypto

import (
	"crypto/rsa"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/siraauth/backend/internal/config"
)

var (
	jwtPrivateKey *rsa.PrivateKey
	jwtPublicKey  *rsa.PublicKey
)

type AccessClaims struct {
	UserID   string `json:"uid"`
	Username string `json:"usr"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

type RefreshClaims struct {
	UserID    string `json:"uid"`
	SessionID string `json:"sid"`
	jwt.RegisteredClaims
}

func LoadJWTKeys() error {
	privBytes, err := os.ReadFile(config.C.JWTPrivateKeyPath)
	if err != nil {
		return fmt.Errorf("read private key: %w", err)
	}
	jwtPrivateKey, err = jwt.ParseRSAPrivateKeyFromPEM(privBytes)
	if err != nil {
		return fmt.Errorf("parse private key: %w", err)
	}

	pubBytes, err := os.ReadFile(config.C.JWTPublicKeyPath)
	if err != nil {
		return fmt.Errorf("read public key: %w", err)
	}
	jwtPublicKey, err = jwt.ParseRSAPublicKeyFromPEM(pubBytes)
	if err != nil {
		return fmt.Errorf("parse public key: %w", err)
	}
	return nil
}

func GenerateAccessToken(userID, username, role string) (string, error) {
	claims := AccessClaims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ID:        uuid.NewString(),
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(config.C.JWTAccessExpiry)),
			Issuer:    "sira-auth",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	return token.SignedString(jwtPrivateKey)
}

func GenerateRefreshToken(userID, sessionID string) (string, error) {
	claims := RefreshClaims{
		UserID:    userID,
		SessionID: sessionID,
		RegisteredClaims: jwt.RegisteredClaims{
			ID:        uuid.NewString(),
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(config.C.JWTRefreshExpiry)),
			Issuer:    "sira-auth",
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	return token.SignedString(jwtPrivateKey)
}

func ValidateAccessToken(tokenStr string) (*AccessClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &AccessClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return jwtPublicKey, nil
	})
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}
	claims, ok := token.Claims.(*AccessClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid claims")
	}
	return claims, nil
}

func ValidateRefreshToken(tokenStr string) (*RefreshClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &RefreshClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return jwtPublicKey, nil
	})
	if err != nil {
		return nil, fmt.Errorf("invalid refresh token: %w", err)
	}
	claims, ok := token.Claims.(*RefreshClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid refresh claims")
	}
	return claims, nil
}
''')

# ── internal/crypto/hmac.go ──────────────────────────────────
wf(f"{BASE}/internal/crypto/hmac.go", r'''package crypto

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/siraauth/backend/internal/config"
)

// SignRequest creates an HMAC-SHA256 signature for SDK requests.
// message = appID + ":" + nonce + ":" + timestamp + ":" + bodyHash
func SignRequest(appSecret, nonce string, ts time.Time, bodyHash string) string {
	message := fmt.Sprintf("%s:%s:%d:%s", appSecret, nonce, ts.Unix(), bodyHash)
	mac := hmac.New(sha256.New, []byte(config.C.HMACMasterKey))
	mac.Write([]byte(message))
	return hex.EncodeToString(mac.Sum(nil))
}

// VerifyRequestSignature verifies an incoming SDK request signature.
func VerifyRequestSignature(appSecret, nonce string, ts time.Time, bodyHash, sig string) bool {
	expected := SignRequest(appSecret, nonce, ts, bodyHash)
	return hmac.Equal([]byte(expected), []byte(sig))
}

// HashBody returns SHA-256 hex hash of a payload.
func HashBody(body []byte) string {
	h := sha256.Sum256(body)
	return hex.EncodeToString(h[:])
}

// SignWebhook creates an HMAC-SHA256 signature for outbound webhooks.
func SignWebhook(secret string, payload []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(payload)
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}

// GenerateAPIToken creates a random API token with a prefix.
func GenerateAPIToken() (raw, prefix string, err error) {
	b, err := GenerateRandomBytes(32)
	if err != nil {
		return "", "", err
	}
	raw = "sira_" + hex.EncodeToString(b)
	prefix = raw[:12]
	return raw, prefix, nil
}

// HashAPIToken hashes an API token for storage (SHA-256, not bcrypt for speed).
func HashAPIToken(raw string) string {
	h := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(h[:])
}
''')

# ── internal/crypto/aes.go ───────────────────────────────────
wf(f"{BASE}/internal/crypto/aes.go", r'''package crypto

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"fmt"
)

// DeriveAESKey derives a 32-byte AES key from a master key + context string.
func DeriveAESKey(masterKeyHex, context string) ([]byte, error) {
	master, err := hex.DecodeString(masterKeyHex)
	if err != nil {
		return nil, fmt.Errorf("invalid master key hex: %w", err)
	}
	h := sha256.New()
	h.Write(master)
	h.Write([]byte(context))
	return h.Sum(nil), nil
}

// EncryptAESGCM encrypts plaintext using AES-256-GCM.
// Returns base64(nonce + ciphertext + tag).
func EncryptAESGCM(key, plaintext []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", fmt.Errorf("new cipher: %w", err)
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", fmt.Errorf("new gcm: %w", err)
	}
	nonce, err := GenerateRandomBytes(gcm.NonceSize())
	if err != nil {
		return "", fmt.Errorf("generate nonce: %w", err)
	}
	ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// DecryptAESGCM decrypts a base64-encoded AES-256-GCM ciphertext.
func DecryptAESGCM(key []byte, encoded string) ([]byte, error) {
	ciphertext, err := base64.StdEncoding.DecodeString(encoded)
	if err != nil {
		return nil, fmt.Errorf("decode base64: %w", err)
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, fmt.Errorf("new cipher: %w", err)
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, fmt.Errorf("new gcm: %w", err)
	}
	if len(ciphertext) < gcm.NonceSize() {
		return nil, fmt.Errorf("ciphertext too short")
	}
	nonce, ciphertext := ciphertext[:gcm.NonceSize()], ciphertext[gcm.NonceSize():]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return nil, fmt.Errorf("decrypt: %w", err)
	}
	return plaintext, nil
}

// EncryptString encrypts a string and returns base64 result.
func EncryptString(key []byte, s string) (string, error) {
	return EncryptAESGCM(key, []byte(s))
}

// DecryptString decrypts a base64-encoded encrypted string.
func DecryptString(key []byte, encoded string) (string, error) {
	b, err := DecryptAESGCM(key, encoded)
	if err != nil {
		return "", err
	}
	return string(b), nil
}
''')

# ── internal/crypto/ecdsa.go ─────────────────────────────────
wf(f"{BASE}/internal/crypto/ecdsa.go", r'''package crypto

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"math/big"
)

type ECDSAKeyPair struct {
	PrivatePEM string
	PublicPEM  string
}

// GenerateECDSAKeyPair generates a new ECDSA P-256 key pair.
func GenerateECDSAKeyPair() (*ECDSAKeyPair, error) {
	priv, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("generate key: %w", err)
	}

	privBytes, err := x509.MarshalECPrivateKey(priv)
	if err != nil {
		return nil, fmt.Errorf("marshal private key: %w", err)
	}
	privPEM := pem.EncodeToMemory(&pem.Block{Type: "EC PRIVATE KEY", Bytes: privBytes})

	pubBytes, err := x509.MarshalPKIXPublicKey(&priv.PublicKey)
	if err != nil {
		return nil, fmt.Errorf("marshal public key: %w", err)
	}
	pubPEM := pem.EncodeToMemory(&pem.Block{Type: "PUBLIC KEY", Bytes: pubBytes})

	return &ECDSAKeyPair{
		PrivatePEM: string(privPEM),
		PublicPEM:  string(pubPEM),
	}, nil
}

// SignLicense creates an ECDSA signature for a license key.
func SignLicense(privateKeyPEM, licenseKey string) (string, error) {
	block, _ := pem.Decode([]byte(privateKeyPEM))
	if block == nil {
		return "", fmt.Errorf("invalid PEM")
	}
	priv, err := x509.ParseECPrivateKey(block.Bytes)
	if err != nil {
		return "", fmt.Errorf("parse private key: %w", err)
	}

	hash := sha256.Sum256([]byte(licenseKey))
	r, s, err := ecdsa.Sign(rand.Reader, priv, hash[:])
	if err != nil {
		return "", fmt.Errorf("sign: %w", err)
	}

	sig := append(r.Bytes(), s.Bytes()...)
	return base64.StdEncoding.EncodeToString(sig), nil
}

// VerifyLicense verifies an ECDSA license signature.
func VerifyLicense(publicKeyPEM, licenseKey, signature string) (bool, error) {
	block, _ := pem.Decode([]byte(publicKeyPEM))
	if block == nil {
		return false, fmt.Errorf("invalid PEM")
	}
	pub, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return false, fmt.Errorf("parse public key: %w", err)
	}
	ecPub, ok := pub.(*ecdsa.PublicKey)
	if !ok {
		return false, fmt.Errorf("not an ECDSA key")
	}

	sigBytes, err := base64.StdEncoding.DecodeString(signature)
	if err != nil {
		return false, fmt.Errorf("decode signature: %w", err)
	}
	if len(sigBytes) != 64 {
		return false, fmt.Errorf("invalid signature length: %d", len(sigBytes))
	}

	r := new(big.Int).SetBytes(sigBytes[:32])
	s := new(big.Int).SetBytes(sigBytes[32:])

	hash := sha256.Sum256([]byte(licenseKey))
	return ecdsa.Verify(ecPub, hash[:], r, s), nil
}
''')

# ── internal/crypto/ecdh.go ──────────────────────────────────
wf(f"{BASE}/internal/crypto/ecdh.go", r'''package crypto

import (
	"crypto/ecdh"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
)

type ECDHKeyPair struct {
	Private *ecdh.PrivateKey
	PublicB64 string
}

// GenerateECDHKeyPair generates an ephemeral ECDH P-256 key pair for session handshake.
func GenerateECDHKeyPair() (*ECDHKeyPair, error) {
	curve := ecdh.P256()
	priv, err := curve.GenerateKey(rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("generate ecdh key: %w", err)
	}
	pubB64 := base64.StdEncoding.EncodeToString(priv.PublicKey().Bytes())
	return &ECDHKeyPair{Private: priv, PublicB64: pubB64}, nil
}

// DeriveSharedSecret derives a shared AES-256 key from our private key and client's public key bytes.
func DeriveSharedSecret(ourPrivate *ecdh.PrivateKey, theirPublicB64 string) ([]byte, error) {
	theirPubBytes, err := base64.StdEncoding.DecodeString(theirPublicB64)
	if err != nil {
		return nil, fmt.Errorf("decode client pubkey: %w", err)
	}
	curve := ecdh.P256()
	theirPub, err := curve.NewPublicKey(theirPubBytes)
	if err != nil {
		return nil, fmt.Errorf("parse client pubkey: %w", err)
	}
	sharedSecret, err := ourPrivate.ECDH(theirPub)
	if err != nil {
		return nil, fmt.Errorf("ecdh: %w", err)
	}
	// Hash the shared secret to get a 32-byte AES key
	h := sha256.Sum256(sharedSecret)
	return h[:], nil
}
''')

# ── internal/crypto/argon.go ─────────────────────────────────
wf(f"{BASE}/internal/crypto/argon.go", r'''package crypto

import (
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes a dashboard user password with bcrypt (cost 12).
func HashPassword(password string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

// VerifyPassword verifies a bcrypt hash.
func VerifyPassword(hash, password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

// HashArgon2 hashes sensitive data with Argon2id.
func HashArgon2(data string, salt []byte) string {
	hash := argon2.IDKey([]byte(data), salt, 1, 64*1024, 4, 32)
	return base64.StdEncoding.EncodeToString(hash)
}

// VerifyArgon2 verifies an Argon2id hash (constant-time comparison).
func VerifyArgon2(data string, salt []byte, encoded string) bool {
	expected := HashArgon2(data, salt)
	return subtle.ConstantTimeCompare([]byte(encoded), []byte(expected)) == 1
}

// HashAppUserPassword hashes an app user's password for SDK authentication.
func HashAppUserPassword(password string) (string, error) {
	salt, err := GenerateRandomBytes(16)
	if err != nil {
		return "", err
	}
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	saltB64 := base64.StdEncoding.EncodeToString(salt)
	hashB64 := base64.StdEncoding.EncodeToString(hash)
	return fmt.Sprintf("argon2id$%s$%s", saltB64, hashB64), nil
}

// VerifyAppUserPassword verifies an app user's Argon2id password.
func VerifyAppUserPassword(encoded, password string) bool {
	parts := strings.SplitN(encoded, "$", 3)
	if len(parts) != 3 || parts[0] != "argon2id" {
		// Fallback to bcrypt for legacy
		return bcrypt.CompareHashAndPassword([]byte(encoded), []byte(password)) == nil
	}
	salt, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return false
	}
	expectedHash, err := base64.StdEncoding.DecodeString(parts[2])
	if err != nil {
		return false
	}
	hash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)
	return subtle.ConstantTimeCompare(hash, expectedHash) == 1
}
''')

# ── internal/crypto/random.go ────────────────────────────────
wf(f"{BASE}/internal/crypto/random.go", r'''package crypto

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"
)

// GenerateRandomBytes returns n cryptographically random bytes.
func GenerateRandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		return nil, fmt.Errorf("generate random bytes: %w", err)
	}
	return b, nil
}

// GenerateRandomHex returns a hex-encoded random string of n bytes.
func GenerateRandomHex(n int) (string, error) {
	b, err := GenerateRandomBytes(n)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// GenerateLicenseKey generates a formatted license key like XXXX-XXXX-XXXX-XXXX.
func GenerateLicenseKey() (string, error) {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b, err := GenerateRandomBytes(16)
	if err != nil {
		return "", err
	}
	var parts [4]string
	for i := 0; i < 4; i++ {
		seg := make([]byte, 4)
		for j := 0; j < 4; j++ {
			seg[j] = chars[int(b[i*4+j])%len(chars)]
		}
		parts[i] = string(seg)
	}
	return strings.Join(parts[:], "-"), nil
}

// GenerateAppSecret generates a random app secret token.
func GenerateAppSecret() (string, error) {
	b, err := GenerateRandomBytes(32)
	if err != nil {
		return "", err
	}
	return "sk_" + hex.EncodeToString(b), nil
}

// GenerateNonce generates a unique nonce for replay protection.
func GenerateNonce() (string, error) {
	return GenerateRandomHex(16)
}
''')

# ── internal/crypto/nonce.go ─────────────────────────────────
wf(f"{BASE}/internal/crypto/nonce.go", r'''package crypto

import (
	"context"
	"fmt"
	"time"

	"github.com/siraauth/backend/internal/redisdb"
)

const nonceTTL = 5 * time.Minute

// StoreNonce stores a nonce in Redis with TTL to prevent replay attacks.
func StoreNonce(appID, nonce string) error {
	key := fmt.Sprintf("nonce:%s:%s", appID, nonce)
	ctx := context.Background()
	ok, err := redisdb.Client.SetNX(ctx, key, "1", nonceTTL).Result()
	if err != nil {
		return fmt.Errorf("store nonce: %w", err)
	}
	if !ok {
		return fmt.Errorf("nonce already used (replay attack detected)")
	}
	return nil
}

// ValidateTimestamp checks that the request timestamp is within ±60 seconds.
func ValidateTimestamp(ts time.Time) error {
	diff := time.Since(ts)
	if diff < -60*time.Second || diff > 60*time.Second {
		return fmt.Errorf("timestamp out of bounds: diff=%v", diff)
	}
	return nil
}

// StoreLockout stores a brute-force lockout in Redis.
func StoreLockout(identifier string, duration time.Duration) error {
	key := fmt.Sprintf("lockout:%s", identifier)
	return redisdb.Client.Set(context.Background(), key, "1", duration).Err()
}

// IsLockedOut checks if an identifier (IP or username) is locked out.
func IsLockedOut(identifier string) (bool, error) {
	key := fmt.Sprintf("lockout:%s", identifier)
	exists, err := redisdb.Client.Exists(context.Background(), key).Result()
	if err != nil {
		return false, err
	}
	return exists > 0, nil
}

// IncrLoginAttempts increments failed login attempts and returns the count.
func IncrLoginAttempts(identifier string) (int64, error) {
	key := fmt.Sprintf("attempts:%s", identifier)
	ctx := context.Background()
	count, err := redisdb.Client.Incr(ctx, key).Result()
	if err != nil {
		return 0, err
	}
	// Set expiry on first attempt
	if count == 1 {
		redisdb.Client.Expire(ctx, key, 15*time.Minute)
	}
	return count, nil
}

// ClearLoginAttempts clears failed attempts after successful login.
func ClearLoginAttempts(identifier string) {
	redisdb.Client.Del(context.Background(), fmt.Sprintf("attempts:%s", identifier))
}

// StoreSession stores an active SDK session in Redis cache.
func StoreSession(sessionID string, data []byte, ttl time.Duration) error {
	key := fmt.Sprintf("session:%s", sessionID)
	return redisdb.Client.Set(context.Background(), key, data, ttl).Err()
}

// GetSession retrieves an active SDK session from cache.
func GetSession(sessionID string) ([]byte, error) {
	key := fmt.Sprintf("session:%s", sessionID)
	return redisdb.Client.Get(context.Background(), key).Bytes()
}

// DeleteSession removes an SDK session from cache.
func DeleteSession(sessionID string) {
	redisdb.Client.Del(context.Background(), fmt.Sprintf("session:%s", sessionID))
}
''')

print("\nVerifying crypto package compiles...")
script = f"""
set -e
export PATH=$PATH:/usr/local/go/bin:/root/go/bin
export GOPATH=/root/go
cd {BASE}
go build ./internal/crypto/...
echo "CRYPTO_BUILD_OK"
"""
out, err, code = run_script(script)
if code != 0:
    print(f"Crypto build error:\n{err}")
    sys.exit(1)

print("\nPhase 3: Crypto layer complete!")
print("JWT RS256 | HMAC-SHA256 | AES-256-GCM | ECDSA-P256 | ECDH | Argon2id | Nonce store - all implemented.")
