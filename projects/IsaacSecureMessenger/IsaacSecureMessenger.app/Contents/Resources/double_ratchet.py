"""
Isaac Secure Messenger — Double Ratchet Algorithm
Provides forward secrecy and post-compromise security.

State machine:
  - Root Key (RK): seeds the ratchet, updated on each DH ratchet step
  - Sending Chain Key (CKs): symmetric ratchet for outgoing messages
  - Receiving Chain Key (CKr): symmetric ratchet for incoming messages
  - DH Ratchet keys (DHRs, DHRr): Diffie-Hellman key pair for ratchet steps

Each message produces a unique Message Key (MK) derived from the chain key.
The chain key is then ratcheted forward (one-way).
After N messages or on receiving a new DH public key, a DH ratchet step occurs.
"""
import json, os, time, base64, uuid
from crypto_utils import (
    generate_x25519_keypair, x25519_dh,
    ratchet_kdf_ck, ratchet_kdf_root,
    aes_encrypt, aes_decrypt,
    KEY_LEN, RATCHET_INFO, MSG_KEY_INFO,
    hkdf_expand, hmac_sha256,
    keys_to_b64, keys_from_b64,
)


class DoubleRatchet:
    """
    Double Ratchet state machine.

    After an X3DH key exchange, seed this with:
      - shared_secret (from X3DHSession)
      - their_public_key (the first DH public key from peer)
    """
    MAX_SKIP = 1000  # Max skipped messages (out-of-order delivery)

    def __init__(self, shared_secret: bytes, their_public_key: bytes,
                 our_private_key: bytes = None, our_public_key: bytes = None,
                 is_initiator: bool = True):
        """
        Initialize the ratchet from an X3DH shared secret.

        If is_initiator=True, we generate our DH key pair and start sending.
        If is_initiator=False, we receive first and need our key pair ready.
        """
        self.RK = shared_secret  # Root Key (32 bytes)
        self.DHRr = their_public_key  # Peer's DH ratchet public key
        self.Ns = 0   # Number of messages sent in current sending chain
        self.Nr = 0   # Number of messages received in current receiving chain
        self.PN = 0   # Number of messages sent in previous chain
        self.MKSKIPPED = {}  # Skipped message keys: {(DHRr, N): MK}

        if is_initiator:
            # Generate our DH ratchet key pair
            self.DHs_private, self.DHs_public = generate_x25519_keypair()
            # Perform initial DH ratchet
            self._dh_ratchet(their_public_key)
        else:
            # Responder: generate key pair but don't ratchet yet (wait for first msg)
            self.DHs_private, self.DHs_public = generate_x25519_keypair()
            self.CKs = None  # No sending chain yet
            self.CKr = None  # No receiving chain yet

        self.peer_identity_fingerprint = None

    def _dh_ratchet(self, new_dhr_public: bytes):
        """Perform a DH ratchet step: update root key and derive new chains."""
        # Calculate DH shared secret
        dh_out = x25519_dh(self.DHs_private, new_dhr_public)

        # Derive new root key and receiving chain key
        self.RK, self.CKr = ratchet_kdf_root(self.RK, dh_out)
        self.DHRr = new_dhr_public
        self.PN = self.Ns
        self.Nr = 0

        # Generate new DH key pair for the next ratchet step
        self.DHs_private, self.DHs_public = generate_x25519_keypair()

        # Derive new root key and sending chain key with new key pair
        dh_out2 = x25519_dh(self.DHs_private, self.DHRr)
        self.RK, self.CKs = ratchet_kdf_root(self.RK, dh_out2)
        self.Ns = 0

    def encrypt_message(self, plaintext: bytes,
                        associated_data: bytes = b"") -> dict:
        """
        Encrypt a message. Returns:
          {"ciphertext": b64, "header": {"dh": b64, "pn": int, "n": int}}
        """
        if self.CKs is None:
            raise RuntimeError("No sending chain available")

        # Derive message key and advance chain
        mk, self.CKs = ratchet_kdf_ck(self.CKs)
        self.Ns += 1

        # Encrypt with message key
        ciphertext = aes_encrypt(plaintext + associated_data, mk)

        return {
            "ciphertext": base64.b64encode(ciphertext).decode(),
            "header": {
                "dh": base64.b64encode(self.DHs_public).decode(),
                "pn": self.PN,
                "n": self.Ns - 1,  # message number in this chain
            }
        }

    def decrypt_message(self, msg: dict) -> bytes:
        """
        Decrypt a message. msg has:
          {"ciphertext": b64, "header": {"dh": b64, "pn": int, "n": int}}

        Returns plaintext bytes (associated_data stripped).
        """
        import base64 as b64_module
        header = msg["header"]
        ciphertext = base64.b64decode(msg["ciphertext"])
        dh_public = base64.b64decode(header["dh"])
        pn = header["pn"]
        n = header["n"]

        # Check if we need to perform a DH ratchet
        if dh_public != self.DHRr:
            # Check for skipped message keys first
            self._skip_message_keys(dh_public, pn)
            # Perform DH ratchet
            self._dh_ratchet(dh_public)

        # Check for skipped messages in the receiving chain
        self._skip_message_keys(dh_public, n)

        if (dh_public, n) in self.MKSKIPPED:
            mk = self.MKSKIPPED.pop((dh_public, n))
        else:
            if self.CKr is None:
                raise RuntimeError("No receiving chain available")
            # Advance receiving chain to the right message number
            while self.Nr < n:
                mk_skip, self.CKr = ratchet_kdf_ck(self.CKr)
                self.MKSKIPPED[(dh_public, self.Nr)] = mk_skip
                self.Nr += 1
                if len(self.MKSKIPPED) > self.MAX_SKIP:
                    raise RuntimeError("Too many skipped messages")
            mk, self.CKr = ratchet_kdf_ck(self.CKr)
            self.Nr += 1

        # Decrypt with message key
        plaintext = aes_decrypt(ciphertext, mk)
        # Strip associated_data suffix
        if len(plaintext) > 0:
            # Assume last 32 bytes are AD (sha256 hash), strip them
            ad_len = 32 if len(plaintext) > 32 else 0
            if ad_len:
                return plaintext[:-ad_len]
        return plaintext

    def _skip_message_keys(self, dh_public: bytes, until_n: int):
        """Pre-compute skipped message keys for out-of-order messages."""
        if self.CKr is None:
            return
        while self.Nr < until_n:
            mk_tmp, self.CKr = ratchet_kdf_ck(self.CKr)
            self.MKSKIPPED[(dh_public, self.Nr)] = mk_tmp
            self.Nr += 1
            if len(self.MKSKIPPED) > self.MAX_SKIP:
                raise RuntimeError("Too many skipped messages")

    def serialize(self) -> dict:
        return {
            "RK": base64.b64encode(self.RK).decode(),
            "DHRr": base64.b64encode(self.DHRr).decode(),
            "DHs_private": base64.b64encode(self.DHs_private).decode(),
            "DHs_public": base64.b64encode(self.DHs_public).decode(),
            "CKs": base64.b64encode(self.CKs).decode() if self.CKs else None,
            "CKr": base64.b64encode(self.CKr).decode() if self.CKr else None,
            "Ns": self.Ns,
            "Nr": self.Nr,
            "PN": self.PN,
            "MKSKIPPED": {f"{b64_module.b64encode(k[0]).decode()}:{k[1]}":
                           base64.b64encode(v).decode()
                          for k, v in self.MKSKIPPED.items()},
        }

    @classmethod
    def from_serialized(cls, d: dict):
        import base64 as b64_module
        dr = cls.__new__(cls)
        dr.RK = base64.b64decode(d["RK"])
        dr.DHRr = base64.b64decode(d["DHRr"])
        dr.DHs_private = base64.b64decode(d["DHs_private"])
        dr.DHs_public = base64.b64decode(d["DHs_public"])
        dr.CKs = base64.b64decode(d["CKs"]) if d.get("CKs") else None
        dr.CKr = base64.b64decode(d["CKr"]) if d.get("CKr") else None
        dr.Ns = d["Ns"]
        dr.Nr = d["Nr"]
        dr.PN = d["PN"]
        dr.MKSKIPPED = {}
        for k, v in d.get("MKSKIPPED", {}).items():
            key_id, key_n = k.rsplit(":", 1)
            dr.MKSKIPPED[(base64.b64decode(key_id), int(key_n))] = base64.b64decode(v)
        dr.peer_identity_fingerprint = d.get("peer_fp")
        return dr


def save_ratchet(ratchet: DoubleRatchet, path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(ratchet.serialize(), f, indent=2)

def load_ratchet(path: str) -> DoubleRatchet:
    with open(path) as f:
        return DoubleRatchet.from_serialized(json.load(f))
