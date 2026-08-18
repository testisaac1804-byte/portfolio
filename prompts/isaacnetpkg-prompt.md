# IsaacNetPkg

**Category:** Software & Apps · **Status:** Done

Password-protected .pkg. AppleScript uninstall.

**Stack / Tools:** macOS, pkgbuild, AppleScript, launchd

**Build path:**
- V1 — AppleScript in bash heredocs. Broke.
- V2 — Fixed: AppleScript as real file.

**Location:** `~/projects/IsaacNetPkg/`

Password-protected .pkg installer. osacompile → Mach-O universal binary. The AppleScript startup dialog must be a real .scpt file (a bash heredoc broke). postinstall: chmod 644 files / 755 dirs, then clear quarantine (`xattr -dr com.apple.quarantine`).
