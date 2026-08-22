# Kuroop — voice assistant for LazyTools.io

A tiny, Jarvis-style Windows voice assistant. Say **"Hey Kuroop"** and ask about
the site — he reads the **live** audit ledger from GitHub and speaks the answer.
Offline speech (Windows `System.Speech`), no API keys, no installs; the only
network calls are fetching the public ledger JSON and opening the dashboard.

## Use it

Say **"Hey Kuroop"** to wake him, then ask (or type) any of:

| Ask… | Kuroop tells you |
|---|---|
| **status** / update / briefing | today's run: tools checked, avg score, issues, open/fixed/challenged, build progress |
| **health** / how are we doing | overall health rating + high-priority + privacy flags |
| **score** / quality | latest average quality score |
| **build progress** / how many left | tools built vs the 1,500 target, how many to go |
| **coverage** / how many audited | rolling audit coverage |
| **privacy** / trackers | open privacy findings |
| **findings** / issues | open findings by severity + top area |
| **what needs me** / challenged | anything stuck that needs a human |
| **open the dashboard** | opens the visual control room in your browser |
| **log a task** (then speak it) | writes it to `tasks-inbox.md` for Claude Code |
| **go to sleep** / **exit** | standby / close |

You can also **type** any command in the window (handy without a mic). Typed
shortcut: `task: <something>` logs a task directly.

## Task relay → Claude Code

When you say **"log a task"** (or type `task: …`), Kuroop appends it to
`tasks-inbox.md`. In your Claude Code chat, say **"check the task inbox"** and
Claude will read the open items and action them.

## Build

```powershell
./build.ps1        # produces Kuroop.exe (uses the built-in .NET Framework compiler)
```

## Start at login (wake word always available)

```powershell
./install-autostart.ps1     # copies to %LOCALAPPDATA%\Kuroop and adds a Startup shortcut
./uninstall-autostart.ps1   # removes it
```

## Notes

- The wake-word listener keeps the microphone open locally; recognition is
  fully on-device (no audio leaves the machine).
- Built for .NET Framework 4 / C# 5 so it runs on any Windows 10/11 with zero
  dependencies.
