"""
Chat room manager — tracks all connected users with device info.
"""
import json
import time
from dataclasses import dataclass, field
from typing import Optional

from user_agents import parse as ua_parse


@dataclass
class ChatUser:
    session_id: str
    name: str = ""
    ip: str = ""
    user_agent: str = ""
    device_type: str = "unknown"
    device_brand: str = ""
    browser: str = ""
    os: str = ""
    connected_at: float = field(default_factory=time.time)
    is_host: bool = False

    def detect_device(self) -> None:
        """Parse user-agent to detect device type."""
        ua = ua_parse(self.user_agent)

        if ua.is_mobile:
            self.device_type = "phone"
        elif ua.is_tablet:
            self.device_type = "tablet"
        elif ua.is_pc:
            self.device_type = "desktop"

        self.os = f"{ua.os.family} {ua.os.version_string}".strip()
        self.browser = f"{ua.browser.family} {ua.browser.version_string}".strip()

        # Refine: iOS family
        os_lower = self.os.lower()
        if "ios" in os_lower or "iphone" in os_lower:
            self.device_brand = "Apple"
            if self.device_type == "tablet":
                self.device_type = "iPad"
            else:
                self.device_type = "iPhone"
            self.os = f"iOS {ua.os.version_string}".strip()
        elif "android" in os_lower:
            self.device_brand = ua.device.brand or "Android"
            self.device_type = "Android Phone" if ua.is_mobile else ("Android Tablet" if ua.is_tablet else "Android")
            self.os = f"Android {ua.os.version_string}".strip()
        elif "mac" in os_lower:
            self.device_brand = "Apple"
            self.device_type = "Mac"
            self.os = f"macOS {ua.os.version_string}".strip()
        elif "windows" in os_lower:
            self.device_brand = "Microsoft"
            self.device_type = "Windows"
        elif "linux" in os_lower:
            self.device_brand = "Linux"
            self.device_type = "Linux"

    def display_label(self) -> str:
        """How this user appears in the host's admin list."""
        name_part = self.name if self.name else "Anonymous"
        device = self.device_type or "unknown"
        return f"{name_part} ({device})"

    def public_name(self) -> str:
        """Name shown to other users in chat."""
        return self.name if self.name else "Anonymous"


class ChatManager:
    def __init__(self):
        self.users: dict[str, ChatUser] = {}

    def add_user(self, session_id: str, ip: str, user_agent: str) -> ChatUser:
        user = ChatUser(session_id=session_id, ip=ip, user_agent=user_agent)
        user.detect_device()
        self.users[session_id] = user
        return user

    def remove_user(self, session_id: str) -> Optional[ChatUser]:
        return self.users.pop(session_id, None)

    def set_name(self, session_id: str, name: str) -> bool:
        user = self.users.get(session_id)
        if user:
            user.name = name.strip()[:30]
            return True
        return False

    def get_user(self, session_id: str) -> Optional[ChatUser]:
        return self.users.get(session_id)

    def get_all_users(self) -> list[ChatUser]:
        return list(self.users.values())

    def user_list_for_admin(self) -> list[dict]:
        """Full user list with device info — only the host sees this."""
        return [
            {
                "name": u.public_name(),
                "device_type": u.device_type,
                "device_brand": u.device_brand,
                "os": u.os,
                "browser": u.browser,
                "ip": u.ip,
                "connected_sec": int(time.time() - u.connected_at),
                "label": u.display_label(),
            }
            for u in self.users.values()
        ]

    def user_count(self) -> int:
        return len(self.users)
