# Removes Kuroop autostart and the installed copy. Leaves the source repo alone.
$ErrorActionPreference = 'SilentlyContinue'
$lnk = Join-Path ([Environment]::GetFolderPath('Startup')) 'Kuroop.lnk'
Remove-Item $lnk -Force
Get-Process Kuroop -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item (Join-Path $env:LOCALAPPDATA 'Kuroop') -Recurse -Force
Write-Host "Kuroop autostart removed."
