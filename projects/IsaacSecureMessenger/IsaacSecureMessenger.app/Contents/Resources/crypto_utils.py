"""
Isaac Secure Messenger — Cryptographic Utilities
AES-256-GCM, X25519, key generation, HKDF, salt management.
Uses cryptography (for AES-GCM) + PyNaCl (for X25519).
"""
import os, base64, json, hashlib, hmac
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes

# ── Constants ──────────────────────────────────────────────────────────────
SALT_LEN = 16        # HKDF salt length
NONCE_LEN = 12       # AES-GCM nonce
KEY_LEN = 32         # AES-256 / X25519 shared secret length
CHAIN_KEY_LEN = 32   # Double Ratchet chain key length
MAX_UINT32 = 0xFFFFFFFF

# Fixed info strings for HKDF contexts
X3DH_INFO = b"IsaacSecureMessenger-X3DH-v1"
RATCHET_INFO = b"IsaacSecureMessenger-DoubleRatchet-v1"
MSG_KEY_INFO = b"IsaacSecureMessenger-MessageKey-v1"

# ── AES-256-GCM ────────────────────────────────────────────────────────────

def aes_encrypt(plaintext: bytes, key: bytes) -> bytes:
    """AES-256-GCM encrypt. Returns nonce (12) + ciphertext + tag."""
    if len(key) != 32:
        raise ValueError(f"Key must be 32 bytes, got {len(key)}")
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    return nonce + aesgcm.encrypt(nonce, plaintext, None)

def aes_decrypt(data: bytes, key: bytes) -> bytes:
    """AES-256-GCM decrypt. Expects nonce (12) + ciphertext + tag."""
    if len(data) < 13:
        raise ValueError("Ciphertext too short")
    nonce, ct = data[:12], data[12:]
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ct, None)

def aes_encrypt_str(plaintext: str, key: bytes) -> str:
    """Encrypt string -> base64."""
    return base64.b64encode(aes_encrypt(plaintext.encode("utf-8"), key)).decode()

def aes_decrypt_str(data_b64: str, key: bytes) -> str:
    """Decrypt base64 -> string."""
    return aes_decrypt(base64.b64decode(data_b64), key).decode("utf-8")

# ── HKDF ───────────────────────────────────────────────────────────────────

def hkdf_expand(ikm: bytes, info: bytes, length: int = KEY_LEN,
                salt: bytes = None) -> bytes:
    """HKDF-expand key material."""
    if salt is None:
        salt = b"\\x00" * SALT_LEN
    hkdf = HKDF(algorithm=hashes.SHA256(), length=length, salt=salt, info=info)
    return hkdf.derive(ikm)

# ── HMAC-SHA256 chain KDF (for Double Ratchet) ─────────────────────────────

def hmac_sha256(key: bytes, data: bytes) -> bytes:
    return hmac.new(key, data, hashlib.sha256).digest()

def ratchet_kdf_ck(ck: bytes) -> tuple:
    """
    Derive message key and next chain key from a chain key.
    Returns (message_key, next_chain_key).
    """
    mk = hmac_sha256(ck, b"\\x01")  # Message key
    nck = hmac_sha256(ck, b"\\x00")  # Next chain key
    return mk, nck

def ratchet_kdf_root(rk: bytes, dh_output: bytes) -> tuple:
    """
    Derive new root key and a new chain key from a DH output.
    Returns (new_root_key, new_chain_key).
    """
    rk_out = hmac_sha256(rk, dh_output + b"\\x01")
    ck_out = hmac_sha256(rk, dh_output + b"\\x00")
    return rk_out, ck_out

# ── X25519 (wraps PyNaCl) ──────────────────────────────────────────────────

def generate_x25519_keypair() -> tuple:
    """Generate (private_key_bytes, public_key_bytes) — 32 bytes each."""
    from nacl.bindings import crypto_scalarmult_base, crypto_scalarmult
    private = os.urandom(32)
    # Clamp per RFC 7748
    private = bytearray(private)
    private[0] &= 248
    private[31] &= 127
    private[31] |= 64
    private = bytes(private)
    public = crypto_scalarmult_base(private)
    return private, public

def x25519_dh(private_key: bytes, public_key: bytes) -> bytes:
    """DH shared secret (32 bytes)."""
    from nacl.bindings import crypto_scalarmult
    return crypto_scalarmult(private_key, public_key)

def x25519_public_from_private(private_key: bytes) -> bytes:
    """Derive public key from private key."""
    from nacl.bindings import crypto_scalarmult_base
    return crypto_scalarmult_base(private_key)

# ── Key serialization ──────────────────────────────────────────────────────

def keys_to_b64(private: bytes, public: bytes) -> dict:
    return {"private": base64.b64encode(private).decode(),
            "public": base64.b64encode(public).decode()}

def keys_from_b64(d: dict) -> tuple:
    return base64.b64decode(d["private"]), base64.b64decode(d["public"])

# ── Secure random ──────────────────────────────────────────────────────────

def secure_random(n: int = 32) -> bytes:
    return os.urandom(n)

# ── Fingerprint (for visual identity verification) ─────────────────────────

def fingerprint(public_key: bytes) -> str:
    """Generate a human-readable hex fingerprint."""
    h = hashlib.sha256(public_key).hexdigest().upper()
    return ":".join(h[i:i+4] for i in range(0, 40, 4))
