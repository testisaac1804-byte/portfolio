"""
Browser control for the Password Game solver.
Manages Playwright browser lifecycle and page interactions.
"""

import os
import sys
import time
from typing import Optional, Callable
from playwright.sync_api import sync_playwright, Page, BrowserContext


class BrowserController:
    """Manages Playwright browser for the Password Game."""
    
    GAME_URL = "https://neal.fun/password-game/"
    USER_DATA_DIR = os.path.expanduser(f"~/.password-game-solver-profile-{os.getpid()}")
    
    def __init__(self, headless: bool = False):
        self.headless = headless
        self.playwright = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self._running = False
        # Ensure unique profile per run
        self.user_data_dir = f"{self.USER_DATA_DIR}-{int(time.time())}"
    
    def start(self):
        """Launch browser and navigate to the game."""
        self.playwright = sync_playwright().start()
        
        os.makedirs(self.user_data_dir, exist_ok=True)
        
        # Use the REAL system Chrome (bypasses Cloudflare; bundled Chromium gets blocked)
        chrome_path = "/Applications/Installed Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        if not os.path.exists(chrome_path):
            chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        
        launch_kwargs = dict(
            user_data_dir=self.user_data_dir,
            headless=self.headless,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-dev-shm-usage',
            ],
            viewport={"width": 1280, "height": 900},
        )
        if os.path.exists(chrome_path):
            launch_kwargs['executable_path'] = chrome_path
        
        try:
            self.context = self.playwright.chromium.launch_persistent_context(**launch_kwargs)
        except Exception as e:
            print(f"⚠️ Chrome launch failed ({e}); falling back to bundled Chromium")
            launch_kwargs.pop('executable_path', None)
            self.context = self.playwright.chromium.launch_persistent_context(**launch_kwargs)
        
        # Apply stealth script
        self.context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
            // Override permissions
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
            );
        """)
        
        self.page = self.context.new_page()
        self._running = True
        
        # Navigate to game
        self.page.goto(self.GAME_URL, timeout=30000, wait_until="domcontentloaded")
        self._wait_for_game_load()
    
    def _wait_for_game_load(self, max_wait: float = 15.0):
        """Wait for the game to fully load."""
        start = time.time()
        while time.time() - start < max_wait:
            editor = self.page.query_selector('.ProseMirror')
            if editor:
                # Check we're not on Cloudflare
                title = self.page.title()
                if "security" not in title.lower() and "cloudflare" not in title.lower():
                    return True
            time.sleep(0.5)
        
        # If we got here, check if we hit Cloudflare
        title = self.page.title()
        if "cloudflare" in title.lower() or "security" in title.lower():
            raise Exception(
                "Cloudflare security check detected. "
                "Try running with headless=False or wait and retry."
            )
        
        return True
    
    def stop(self):
        """Close browser and clean up."""
        self._running = False
        try:
            if self.context:
                self.context.close()
            if self.playwright:
                self.playwright.stop()
        except Exception:
            pass
    
    @property
    def running(self) -> bool:
        return self._running and self.page is not None
    
    def type_password(self, text: str):
        """Type password into the editor. Handles ProseMirror contenteditable."""
        if not self.page:
            return
        
        editor = self.page.query_selector('.ProseMirror')
        if not editor:
            return
        
        # Focus the editor
        editor.click()
        self.page.wait_for_timeout(150)
        
        # Select all existing text
        self.page.keyboard.press('Meta+a')  # Cmd+A
        self.page.wait_for_timeout(50)
        
        # Type the new password
        self.page.keyboard.type(text, delay=15)
        self.page.wait_for_timeout(300)
    
    def get_current_password(self) -> str:
        """Get current password text from editor."""
        if not self.page:
            return ""
        return self.page.evaluate("""
            () => {
                const editor = document.querySelector('.ProseMirror');
                return editor ? editor.textContent || '' : '';
            }
        """)
    
    def wait_for_stability(self, ms: int = 500):
        """Wait for the page to settle after typing."""
        if self.page:
            self.page.wait_for_timeout(ms)
    
    def take_screenshot(self, path: str):
        """Take a screenshot of the current page."""
        if self.page:
            self.page.screenshot(path=path, full_page=True)
    
    def get_page_text(self) -> str:
        """Get all visible text on the page."""
        if not self.page:
            return ""
        return self.page.inner_text('body')
