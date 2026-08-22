# Installs Kuroop so it starts at login and listens for "Hey Kuroop".
# Copies the exe to a stable location and adds a (minimized) Startup shortcut.
# Undo any time with uninstall-autostart.ps1.
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$src  = Join-Path $here 'Kuroop.exe'
if (-not (Test-Path $src)) { & (Join-Path $here 'build-app.ps1') }

$dest = Join-Path $env:LOCALAPPDATA 'Kuroop'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item $src (Join-Path $dest 'Kuroop.exe') -Force

$startup = [Environment]::GetFolderPath('Startup')
$lnk = Join-Path $startup 'Kuroop.lnk'
$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($lnk)
$sc.TargetPath = (Join-Path $dest 'Kuroop.exe')
$sc.WorkingDirectory = $dest
$sc.WindowStyle = 7           # start minimized; pops to front on wake
$sc.Description = 'Kuroop voice assistant (wake word: Hey Kuroop)'
$sc.Save()

Write-Host "Installed. Kuroop will start at next login and listen for 'Hey Kuroop'."
Write-Host "Starting it now..."
Start-Process (Join-Path $dest 'Kuroop.exe') -WindowStyle Minimized
Write-Host "Done. Say 'Hey Kuroop'. To remove: run uninstall-autostart.ps1"
