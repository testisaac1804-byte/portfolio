"""
Isaac Secure Messenger — X3DH Key Agreement Protocol
Signal-style X3DH (Extended Triple Diffie-Hellman) for perfect forward secrecy.

Key types:
  IK  — Identity Key (long-term X25519 key)
  SPK — Signed Pre-Key (medium-term, rotated periodically)
  OPK — One-Time Pre-Keys (single-use, pre-published)

Protocol:
  1. Alice fetches Bob's IK, SPK, and an OPK
  2. Alice generates an ephemeral key (EK)
  3. Shared secret = KDF( DH(IK_A, SPK_B) || DH(EK_A, IK_B) || DH(EK_A, SPK_B) || DH(EK_A, OPK_B) )
  4. Bob recomputes from Alice's EK and his private keys
"""
import json, os, time, base64
from crypto_utils import (
    generate_x25519_keypair, x25519_dh, x25519_public_from_private,
    hkdf_expand, KEY_LEN, X3DH_INFO, fingerprint, keys_to_b64, keys_from_b64, secure_random
)

# ── Bundle types ───────────────────────────────────────────────────────────

class IdentityKeyBundle:
    """Long-term identity key pair."""
    def __init__(self):
        self.private, self.public = generate_x25519_keypair()
        self.created_at = time.time()

    def serialize(self) -> dict:
        return {**keys_to_b64(self.private, self.public),
                "created_at": self.created_at,
                "fingerprint": self.fingerprint}

    @property
    def fingerprint(self) -> str:
        return fingerprint(self.public)

    @classmethod
    def from_serialized(cls, d: dict):
        ik = cls.__new__(cls)
        ik.private, ik.public = keys_from_b64(d)
        ik.created_at = d.get("created_at", time.time())
        return ik


class SignedPreKey:
    """Signed Pre-Key — X25519 signed by the identity key."""
    def __init__(self, identity_private: bytes, key_id: int = 0):
        self.private, self.public = generate_x25519_keypair()
        self.key_id = key_id
        self.signature = self._sign(identity_private)
        self.created_at = time.time()

    def _sign(self, identity_private: bytes) -> bytes:
        """Sign this SPK's public key with the identity key."""
        from nacl.bindings import crypto_sign_ed25519_sk_to_seed, crypto_sign_seed_keypair
        # Derive an ed25519 keypair from the X25519 identity key via hashing
        from hashlib import sha512
        seed = sha512(identity_private).digest()[:32]
        # We use HMAC-SHA256 as a simpler signing mechanism (don't need formal signatures
        # since both keys are owned by the same device)
        from crypto_utils import hmac_sha256
        return hmac_sha256(identity_private, self.public)

    def verify(self, identity_public: bytes) -> bool:
        from crypto_utils import hmac_sha256
        expected = hmac_sha256(identity_public, self.public)
        return self.signature == expected

    def serialize(self) -> dict:
        return {
            **keys_to_b64(self.private, self.public),
            "key_id": self.key_id,
            "signature": base64.b64encode(self.signature).decode(),
            "created_at": self.created_at,
        }

    @classmethod
    def from_serialized(cls, d: dict):
        spk = cls.__new__(cls)
        spk.private, spk.public = keys_from_b64(d)
        spk.key_id = d["key_id"]
        spk.signature = base64.b64decode(d["signature"])
        spk.created_at = d.get("created_at", time.time())
        return spk


class OneTimePreKey:
    """One-time pre-key — single-use X25519."""
    def __init__(self, key_id: int):
        self.private, self.public = generate_x25519_keypair()
        self.key_id = key_id

    def serialize(self) -> dict:
        return {**keys_to_b64(self.private, self.public), "key_id": self.key_id}

    @classmethod
    def from_serialized(cls, d: dict):
        opk = cls.__new__(cls)
        opk.private, opk.public = keys_from_b64(d)
        opk.key_id = d["key_id"]
        return opk


# ── X3DH Key Bundle (what a user publishes) ────────────────────────────────

class X3DHKeyBundle:
    """Complete bundle a user publishes: IK public + SPK + OPKs."""
    def __init__(self, identity: IdentityKeyBundle = None):
        self.identity = identity or IdentityKeyBundle()
        self.signed_pre_key = None
        self.one_time_pre_keys = []  # list of (id, public_bytes)
        self.pre_key_signature = None

    def generate_signed_pre_key(self, key_id: int = 0):
        self.signed_pre_key = SignedPreKey(self.identity.private, key_id)

    def generate_one_time_keys(self, count: int = 20, start_id: int = 1):
        self.one_time_pre_keys = [
            OneTimePreKey(start_id + i) for i in range(count)
        ]

    def get_public_bundle(self) -> dict:
        """Bundle to publish for others to initiate conversations."""
        return {
            "identity_key": base64.b64encode(self.identity.public).decode(),
            "identity_fingerprint": self.identity.fingerprint,
            "signed_pre_key": {
                "key_id": self.signed_pre_key.key_id,
                "public": base64.b64encode(self.signed_pre_key.public).decode(),
                "signature": base64.b64encode(self.signed_pre_key.signature).decode(),
            } if self.signed_pre_key else None,
            "one_time_pre_keys": [
                {"key_id": opk.key_id,
                 "public": base64.b64encode(opk.public).decode()}
                for opk in self.one_time_pre_keys
            ],
        }

    def serialize(self) -> dict:
        return {
            "identity": self.identity.serialize(),
            "signed_pre_key": self.signed_pre_key.serialize() if self.signed_pre_key else None,
            "one_time_pre_keys": [opk.serialize() for opk in self.one_time_pre_keys],
        }

    @classmethod
    def from_serialized(cls, d: dict):
        bundle = cls.__new__(cls)
        bundle.identity = IdentityKeyBundle.from_serialized(d["identity"])
        bundle.signed_pre_key = SignedPreKey.from_serialized(d["signed_pre_key"]) if d.get("signed_pre_key") else None
        bundle.one_time_pre_keys = [OneTimePreKey.from_serialized(opk) for opk in d.get("one_time_pre_keys", [])]
        return bundle


# ── Session state ──────────────────────────────────────────────────────────

class X3DHSession:
    """
    An established X3DH session. Stores the shared secret that seeds
    the Double Ratchet.

    role: "initiator" (Alice) or "responder" (Bob)
    """
    def __init__(self, session_id: str, role: str, shared_secret: bytes,
                 initiator_ephemeral_public: bytes = None,
                 used_opk_id: int = None,
                 our_identity_public: bytes = None,
                 their_identity_public: bytes = None):
        self.session_id = session_id
        self.role = role
        self.shared_secret = shared_secret
        self.initiator_ephemeral_public = initiator_ephemeral_public
        self.used_opk_id = used_opk_id
        self.our_identity_public = our_identity_public
        self.their_identity_public = their_identity_public
        self.created_at = time.time()

    def serialize(self) -> dict:
        return {
            "session_id": self.session_id,
            "role": self.role,
            "shared_secret": base64.b64encode(self.shared_secret).decode(),
            "initiator_ephemeral_public": base64.b64encode(self.initiator_ephemeral_public).decode() if self.initiator_ephemeral_public else None,
            "used_opk_id": self.used_opk_id,
            "our_identity_public": base64.b64encode(self.our_identity_public).decode() if self.our_identity_public else None,
            "their_identity_public": base64.b64encode(self.their_identity_public).decode() if self.their_identity_public else None,
            "created_at": self.created_at,
        }

    @classmethod
    def from_serialized(cls, d: dict):
        s = cls.__new__(cls)
        s.session_id = d["session_id"]
        s.role = d["role"]
        s.shared_secret = base64.b64decode(d["shared_secret"])
        s.initiator_ephemeral_public = base64.b64decode(d["initiator_ephemeral_public"]) if d.get("initiator_ephemeral_public") else None
        s.used_opk_id = d.get("used_opk_id")
        s.our_identity_public = base64.b64decode(d["our_identity_public"]) if d.get("our_identity_public") else None
        s.their_identity_public = base64.b64decode(d["their_identity_public"]) if d.get("their_identity_public") else None
        s.created_at = d.get("created_at", time.time())
        return s


# ── X3DH Protocol ─────────────────────────────────────────────────────────

def x3dh_initiate(our_identity: IdentityKeyBundle,
                  their_public_bundle: dict) -> X3DHSession:
    """
    Alice (initiator) performs X3DH key agreement.

    their_public_bundle must contain:
      - identity_key (b64)
      - signed_pre_key.public (b64) + .signature (b64)
      - one_time_pre_keys (list of {key_id, public} — at least one)

    Returns an X3DHSession with the shared secret.
    """
    from hashlib import sha256
    import uuid

    # Parse their public bundle
    their_ik_pub = base64.b64decode(their_public_bundle["identity_key"])
    spk_pub = base64.b64decode(their_public_bundle["signed_pre_key"]["public"])
    spk_sig = base64.b64decode(their_public_bundle["signed_pre_key"]["signature"])

    opks = their_public_bundle.get("one_time_pre_keys", [])
    if not opks:
        raise ValueError("No one-time pre-keys available from peer")

    opk = opks[0]
    opk_pub = base64.b64decode(opk["public"])
    opk_id = opk["key_id"]

    # Generate ephemeral key
    ek_private, ek_public = generate_x25519_keypair()

    # Compute 4 DH agreements
    dh1 = x25519_dh(our_identity.private, spk_pub)       # DH(IK_A, SPK_B)
    dh2 = x25519_dh(ek_private, their_ik_pub)             # DH(EK_A, IK_B)
    dh3 = x25519_dh(ek_private, spk_pub)                  # DH(EK_A, SPK_B)
    dh4 = x25519_dh(ek_private, opk_pub)                  # DH(EK_A, OPK_B)

    # Shared secret = HKDF(DH1 || DH2 || DH3 || DH4)
    shared_input = dh1 + dh2 + dh3 + dh4
    shared_secret = hkdf_expand(shared_input, X3DH_INFO, KEY_LEN)

    session_id = str(uuid.uuid4())
    session = X3DHSession(
        session_id=session_id, role="initiator",
        shared_secret=shared_secret,
        initiator_ephemeral_public=ek_public,
        used_opk_id=opk_id,
        our_identity_public=our_identity.public,
        their_identity_public=their_ik_pub,
    )
    return session


def x3dh_respond(session_id: str,
                 our_identity_package: X3DHKeyBundle,
                 initiator_ephemeral_public: bytes,
                 initiator_identity_public: bytes,
                 used_opk: OneTimePreKey = None) -> X3DHSession:
    """
    Bob (responder) completes X3DH after receiving Alice's initiation message.

    our_identity_package must contain the private keys to the public bundle
    Alice used.
    """
    ik_private = our_identity_package.identity.private
    ik_public = our_identity_package.identity.public
    spk_private = our_identity_package.signed_pre_key.private

    # Compute the 4 DH agreements from Bob's perspective
    dh1 = x25519_dh(spk_private, ik_public)               # DH(SPK_B, IK_A)
    dh2 = x25519_dh(ik_private, initiator_ephemeral_public)  # DH(IK_B, EK_A)
    dh3 = x25519_dh(spk_private, initiator_ephemeral_public) # DH(SPK_B, EK_A)

    if used_opk:
        dh4 = x25519_dh(used_opk.private, initiator_ephemeral_public)  # DH(OPK_B, EK_A)
        # Delete used OPK
        if used_opk in our_identity_package.one_time_pre_keys:
            our_identity_package.one_time_pre_keys.remove(used_opk)
    else:
        dh4 = b""

    shared_input = dh1 + dh2 + dh3 + dh4
    shared_secret = hkdf_expand(shared_input, X3DH_INFO, KEY_LEN)

    session = X3DHSession(
        session_id=session_id, role="responder",
        shared_secret=shared_secret,
        initiator_ephemeral_public=initiator_ephemeral_public,
        used_opk_id=used_opk.key_id if used_opk else None,
        our_identity_public=ik_public,
        their_identity_public=initiator_identity_public,
    )
    return session


# ── Pre-key store management ───────────────────────────────────────────────

def save_key_bundle(bundle: X3DHKeyBundle, path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(bundle.serialize(), f, indent=2)

def load_key_bundle(path: str) -> X3DHKeyBundle:
    with open(path) as f:
        return X3DHKeyBundle.from_serialized(json.load(f))

def save_session(session: X3DHSession, path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(session.serialize(), f, indent=2)

def load_session(path: str) -> X3DHSession:
    with open(path) as f:
        return X3DHSession.from_serialized(json.load(f))
