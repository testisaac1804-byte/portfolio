"""
Isaac Secure Messenger — Voice Notes
Record and playback voice notes using macOS AVFoundation via PyObjC.
Falls back to osascript -e 'beep' recording via sox/rec if PyObjC unavailable.
"""
import os, time, json, base64, threading, tempfile, subprocess
from typing import Callable, Optional


class VoiceRecorder:
    """
    Records voice notes using system audio tools.
    Prefers `rec` (sox), falls back to `ffmpeg`, then to afplay + say.
    """
    def __init__(self, output_dir: str = None):
        self.output_dir = output_dir or tempfile.gettempdir()
        os.makedirs(self.output_dir, exist_ok=True)
        self._recording = False
        self._process: Optional[subprocess.Popen] = None
        self._current_file: Optional[str] = None

        # Detect available recorder
        self._recorder = self._detect_recorder()

    def _detect_recorder(self) -> str:
        """Detect which recorder is available: rec (sox) or ffmpeg."""
        for cmd in ["rec", "sox", "ffmpeg"]:
            try:
                subprocess.run([cmd, "--version"],
                               capture_output=True, timeout=3)
                return cmd
            except (FileNotFoundError, subprocess.TimeoutExpired):
                continue
        # Fall back to macOS's built-in say+afplay (recording not supported)
        # We'll use AVFoundation in the .app bundle
        return "avfoundation"

    def start_recording(self, filename: str = None) -> str:
        """Start recording a voice note. Returns the file path."""
        if self._recording:
            raise RuntimeError("Already recording")

        if filename is None:
            filename = f"voice_{int(time.time())}.wav"

        filepath = os.path.join(self.output_dir, filename)
        self._current_file = filepath
        self._recording = True

        if self._recorder == "rec":
            self._process = subprocess.Popen(
                ["rec", "-r", "44100", "-b", "16", "-c", "1",
                 filepath, "silence", "1", "0.5", "1%", "1", "3.0", "1%"],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                start_new_session=True,
            )
        elif self._recorder == "sox":
            self._process = subprocess.Popen(
                ["sox", "-d", "-r", "44100", "-b", "16", "-c", "1",
                 filepath],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                start_new_session=True,
            )
        elif self._recorder == "ffmpeg":
            self._process = subprocess.Popen(
                ["ffmpeg", "-f", "avfoundation", "-i", ":0",
                 "-acodec", "pcm_s16le", "-ar", "44100", "-ac", "1",
                 filepath],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                start_new_session=True,
            )
        else:
            # AVFoundation fallback — will be implemented in the .app
            self._recording = False
            self._current_file = None
            raise RuntimeError("No audio recorder found. Install sox: brew install sox")

        return filepath

    def stop_recording(self) -> Optional[str]:
        """Stop recording and return the file path."""
        if not self._recording:
            return None

        self._recording = False
        if self._process:
            try:
                self._process.terminate()
                self._process.wait(timeout=3)
            except (subprocess.TimeoutExpired, ProcessLookupError):
                try:
                    self._process.kill()
                except ProcessLookupError:
                    pass
            self._process = None

        fp = self._current_file
        self._current_file = None
        return fp

    def get_recording_file(self) -> Optional[str]:
        """Get current recording file path (while recording)."""
        return self._current_file

    def is_recording(self) -> bool:
        return self._recording

    @staticmethod
    def play_audio(filepath: str):
        """Play an audio file using afplay."""
        try:
            subprocess.run(["afplay", filepath],
                           timeout=300, start_new_session=True)
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass

    @staticmethod
    def get_file_size(filepath: str) -> int:
        return os.path.getsize(filepath) if os.path.exists(filepath) else 0

    @staticmethod
    def read_audio_data(filepath: str) -> Optional[bytes]:
        """Read audio file data for transmission."""
        if not os.path.exists(filepath):
            return None
        with open(filepath, "rb") as f:
            return f.read()


class VoiceNoteMessage:
    """Represents a voice note to be sent/received."""
    def __init__(self, data: bytes = None, duration: float = 0,
                 filepath: str = None):
        self.data = data
        self.duration = duration
        self.filepath = filepath
        self.timestamp = time.time()

    def to_message(self) -> dict:
        return {
            "type": "voice_note",
            "data": base64.b64encode(self.data).decode() if self.data else None,
            "duration": self.duration,
            "timestamp": self.timestamp,
            "mime_type": "audio/wav",
        }

    @classmethod
    def from_message(cls, msg: dict):
        vn = cls.__new__(cls)
        raw = base64.b64decode(msg["data"]) if msg.get("data") else None
        vn.data = raw
        vn.duration = msg.get("duration", 0)
        vn.timestamp = msg.get("timestamp", time.time())

        # Save to temp file
        if raw:
            temp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
            temp.write(raw)
            temp.close()
            vn.filepath = temp.name
        return vn
