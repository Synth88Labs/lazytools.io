# Builds Kuroop.exe as a background WinForms tray app (no console window).
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$csc  = "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
function Find-Gac($name) { (Get-ChildItem "$env:WINDIR\Microsoft.NET\assembly\GAC_MSIL\$name" -Recurse -Filter "$name.dll" -ErrorAction SilentlyContinue | Select-Object -First 1).FullName }
$speech = Find-Gac 'System.Speech'
# System.Windows.Forms, System.Drawing, System.Web.Extensions are default csc references.

& $csc /nologo /target:winexe /platform:x64 /optimize+ /codepage:65001 `
  "/out:$here\Kuroop.exe" `
  "/r:$speech" `
  "$here\KuroopApp.cs"

if ($LASTEXITCODE -eq 0) { Write-Host "Built tray app: $here\Kuroop.exe" }
