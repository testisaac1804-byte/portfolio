"""
Isaac Secure Messenger — Encrypted File Transfer
Chunked file transfer over the secure channel.
Files are encrypted with a per-file AES-256-GCM key.
"""
import os, time, json, base64, hashlib, threading
from typing import Callable, Optional
from crypto_utils import aes_encrypt, aes_decrypt, secure_random


class FileTransfer:
    """
    Handles sending and receiving files over the secure channel.
    Files are split into chunks and sent as individual messages.
    """
    CHUNK_SIZE = 64 * 1024  # 64KB chunks

    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.incoming_dir = os.path.join(data_dir, "incoming")
        self.outgoing_dir = os.path.join(data_dir, "outgoing")
        os.makedirs(self.incoming_dir, exist_ok=True)
        os.makedirs(self.outgoing_dir, exist_ok=True)

        # Active transfers
        self.incoming = {}   # transfer_id -> metadata
        self.outgoing = {}   # transfer_id -> metadata

        # Callbacks
        self.on_progress: Optional[Callable] = None
        self.on_complete: Optional[Callable] = None
        self.on_chunk: Optional[Callable] = None

    def prepare_send(self, filepath: str, filename: str = None) -> dict:
        """
        Prepare a file for encrypted transfer.
        Generates a per-file key and encrypts the file.
        Returns metadata for sending.
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")

        filename = filename or os.path.basename(filepath)
        filesize = os.path.getsize(filepath)
        file_hash = self._hash_file(filepath)

        # Generate file encryption key
        file_key = secure_random(32)

        # Read and encrypt file
        transfer_id = hashlib.sha256(
            f"{filepath}{time.time()}".encode()
        ).hexdigest()[:16]

        encrypted_path = os.path.join(
            self.outgoing_dir, f"{transfer_id}_{filename}.enc"
        )

        chunk_count = 0
        with open(filepath, "rb") as fin, \
             open(encrypted_path, "wb") as fout:
            # Write file key prefix (will be encrypted separately via ratchet)
            while True:
                chunk = fin.read(self.CHUNK_SIZE)
                if not chunk:
                    break
                encrypted_chunk = aes_encrypt(chunk, file_key)
                fout.write(encrypted_chunk)
                chunk_count += 1

        metadata = {
            "filename": filename,
            "filesize": filesize,
            "file_hash": base64.b64encode(file_hash).decode(),
            "chunk_count": chunk_count,
            "chunk_size": self.CHUNK_SIZE,
            "transfer_id": transfer_id,
            "encrypted_path": encrypted_path,
            "file_key": file_key,
        }

        self.outgoing[transfer_id] = metadata
        return metadata

    def get_outgoing_chunk(self, transfer_id: str,
                           chunk_index: int) -> Optional[bytes]:
        """Get a specific encrypted chunk for sending."""
        meta = self.outgoing.get(transfer_id)
        if not meta:
            return None

        enc_path = meta["encrypted_path"]
        if not os.path.exists(enc_path):
            return None

        with open(enc_path, "rb") as f:
            # AES-GCM output is 12 (nonce) + N (data) + 16 (tag) = data + 28 per chunk
            chunk_size_raw = meta["chunk_size"] + 28
            f.seek(chunk_index * chunk_size_raw)
            return f.read(chunk_size_raw)

    def receive_chunk(self, metadata: dict, chunk_data: bytes,
                      chunk_index: int, file_key: bytes):
        """
        Receive and decrypt a file chunk.
        Accumulates into the incoming file.
        """
        transfer_id = metadata["transfer_id"]

        if transfer_id not in self.incoming:
            # Start new incoming transfer
            incoming_path = os.path.join(
                self.incoming_dir,
                f"{transfer_id}_{metadata['filename']}"
            )
            self.incoming[transfer_id] = {
                "path": incoming_path,
                "received_chunks": 0,
                "total_chunks": metadata["chunk_count"],
                "metadata": metadata,
                "file_key": file_key,
                "started_at": time.time(),
            }

        incoming = self.incoming[transfer_id]
        path = incoming["path"]

        # Decrypt and write chunk
        plain_chunk = aes_decrypt(chunk_data, file_key)

        with open(path, "ab") as f:
            f.write(plain_chunk)

        incoming["received_chunks"] += 1

        if self.on_progress:
            self.on_progress(transfer_id,
                            incoming["received_chunks"],
                            incoming["total_chunks"])

        # Check if complete
        if incoming["received_chunks"] >= incoming["total_chunks"]:
            # Verify hash
            file_hash = self._hash_file(path)
            expected_hash = base64.b64decode(metadata["file_hash"])

            if file_hash != expected_hash:
                if self.on_complete:
                    self.on_complete(transfer_id, path, False, "Hash mismatch")
                return False

            if self.on_complete:
                self.on_complete(transfer_id, path, True, "Complete")
            return True

        return None  # Still in progress

    @staticmethod
    def _hash_file(filepath: str) -> bytes:
        """SHA-256 hash of a file."""
        h = hashlib.sha256()
        with open(filepath, "rb") as f:
            while True:
                chunk = f.read(65536)
                if not chunk:
                    break
                h.update(chunk)
        return h.digest()

    @staticmethod
    def format_size(size: int) -> str:
        for unit in ["B", "KB", "MB", "GB"]:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} TB"
