"""
Isaac Secure Messenger — Auto-Disappearing Messages
Snapchat-style message timer. Server-side deletion + client-side countdown.
"""
import time, json, threading, os
from typing import Callable, Optional


class DisappearingMessage:
    """A message with a self-destruct timer."""
    def __init__(self, message_id: str, content: str, sender: str,
                 timer_seconds: int, sent_at: float = None):
        self.message_id = message_id
        self.content = content
        self.sender = sender
        self.timer_seconds = timer_seconds
        self.sent_at = sent_at or time.time()
        self.expires_at = self.sent_at + timer_seconds
        self.is_expired = False

    def remaining(self) -> float:
        """Seconds remaining before deletion."""
        if self.is_expired:
            return 0
        remaining = self.expires_at - time.time()
        return max(0, remaining)

    def expire(self):
        self.is_expired = True

    def to_dict(self) -> dict:
        return {
            "id": self.message_id,
            "content": self.content,
            "sender": self.sender,
            "timer": self.timer_seconds,
            "sent_at": self.sent_at,
            "remaining": self.remaining(),
            "expired": self.is_expired,
        }


class DisappearingMessages:
    """
    Manages disappearing messages with per-message timers.
    Fires callbacks when a message expires.
    """
    def __init__(self, storage_path: str = None):
        self.messages = {}  # message_id -> DisappearingMessage
        self._timers = {}   # message_id -> threading.Timer
        self._lock = threading.Lock()
        self.storage_path = storage_path

        # Callbacks
        self.on_expire: Optional[Callable] = None
        self.on_schedule: Optional[Callable] = None

        # Load persisted messages
        if storage_path and os.path.exists(storage_path):
            self._load()

    def add_message(self, message_id: str, content: str, sender: str,
                    timer_seconds: int) -> DisappearingMessage:
        """Add a disappearing message with a timer."""
        msg = DisappearingMessage(message_id, content, sender, timer_seconds)

        with self._lock:
            self.messages[message_id] = msg
            self._schedule_expiry(message_id, timer_seconds)

        # Persist
        self._save()

        return msg

    def _schedule_expiry(self, message_id: str, delay: int):
        """Schedule a timer to expire the message."""
        def _expire():
            with self._lock:
                msg = self.messages.get(message_id)
                if msg:
                    msg.expire()
                    if self.on_expire:
                        self.on_expire(msg)
                    self.messages.pop(message_id, None)
                    self._save()

        timer = threading.Timer(delay, _expire)
        timer.daemon = True
        timer.start()
        self._timers[message_id] = timer

    def get_message(self, message_id: str) -> Optional[DisappearingMessage]:
        with self._lock:
            msg = self.messages.get(message_id)
            if msg and msg.is_expired:
                return None
            return msg

    def get_active_messages(self, sender: str = None) -> list:
        with self._lock:
            results = []
            for msg in self.messages.values():
                if not msg.is_expired:
                    if sender and msg.sender != sender:
                        continue
                    results.append(msg.to_dict())
            return results

    def remove_message(self, message_id: str):
        with self._lock:
            self.messages.pop(message_id, None)
            timer = self._timers.pop(message_id, None)
            if timer:
                timer.cancel()
        self._save()

    def clear_all(self):
        with self._lock:
            for timer in self._timers.values():
                timer.cancel()
            self.messages.clear()
            self._timers.clear()
        self._save()

    def cleanup_expired(self):
        """Remove all expired messages."""
        with self._lock:
            expired = [mid for mid, msg in self.messages.items()
                      if msg.is_expired or msg.remaining() <= 0]
            for mid in expired:
                timer = self._timers.pop(mid, None)
                if timer:
                    timer.cancel()
                self.messages.pop(mid, None)
        self._save()

    # ── Persistence ────────────────────────────────────────────────────

    def _save(self):
        if not self.storage_path:
            return
        with self._lock:
            data = {
                "messages": [
                    m.to_dict() for m in self.messages.values()
                    if not m.is_expired
                ]
            }
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
        with open(self.storage_path, "w") as f:
            json.dump(data, f, indent=2)

    def _load(self):
        try:
            with open(self.storage_path) as f:
                data = json.load(f)
            for m in data.get("messages", []):
                if not m.get("expired", False):
                    remaining = m.get("remaining", 0)
                    if remaining > 0:
                        msg = DisappearingMessage(
                            m["id"], m["content"], m["sender"],
                            m["timer"], m["sent_at"]
                        )
                        self.messages[msg.message_id] = msg
                        self._schedule_expiry(msg.message_id, int(remaining))
        except (json.JSONDecodeError, KeyError, FileNotFoundError):
            pass

    def get_all_timers(self) -> list:
        """Get list of all active timers for the UI."""
        with self._lock:
            return [
                {"id": msg.message_id, "remaining": msg.remaining(),
                 "sender": msg.sender, "timer": msg.timer_seconds,
                 "content": msg.content}
                for msg in self.messages.values()
                if not msg.is_expired
            ]
