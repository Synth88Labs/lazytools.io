# Kuroop — background voice assistant for LazyTools.io

A Jarvis-style Windows **tray app** that runs quietly in the background and
reports live LazyTools status from the git ledger. Offline speech
(Windows `System.Speech`); optional Claude brain for free-form questions.

## Run it

Double-click **`Kuroop.exe`**. It starts **in the system tray** (no window) and
shows a "Running in the tray" balloon. Summon it three ways:

- **Global hotkey `Ctrl+Alt+K`** — 100% reliable, works from anywhere.
- **Say "Hey Kuroop"** — offline wake word (best-effort; invented names are hard
  for offline recognition, so the hotkey is the sure thing).
- **Double-click the tray icon.**

Then ask by **voice**, **type** in the box, or click a **button**:
Status · Health · Team · Research · Tokens · Build · Privacy · **📊 Dashboard**.
The Dashboard button opens the live command deck in a **chromeless in-app
window** (via Edge app-mode). Closing the window hides Kuroop back to the tray;
right-click the tray icon → **Quit** to exit.

## Ask him anything (optional Claude brain)

Common questions are answered instantly offline. Free-form questions go to a
Claude brain that reasons over the live data. Set a key (never stored in the
repo):

```powershell
setx ANTHROPIC_API_KEY "sk-ant-..."
```

Or drop it in `%LOCALAPPDATA%\Kuroop\apikey.txt`. Model defaults to
`claude-haiku-4-5` (override `KUROOP_MODEL`).

## Build

```powershell
./build-app.ps1      # background tray app (WinForms) -> Kuroop.exe
```

(`build.ps1` builds the older console version; the app uses `build-app.ps1`.)

## Start at login (always in the tray)

```powershell
./install-autostart.ps1     # copies to %LOCALAPPDATA%\Kuroop + Startup shortcut
./uninstall-autostart.ps1   # removes it
```

## Notes

- Wake-word confidence gate is tunable via `KUROOP_WAKE_CONF` (default 0.35).
- Speech recognition is fully on-device; nothing leaves the machine except
  fetching the public ledger and (if enabled) Claude API calls.
- Built for .NET Framework 4 / C# 5 (compiles with the built-in `csc`), so it
  runs on any Windows 10/11 with zero dependencies.
