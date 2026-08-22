# Builds LazyBotVoice.exe with the built-in .NET Framework compiler (no installs).
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$csc  = "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe"

function Find-Gac($name) {
  $base = "$env:WINDIR\Microsoft.NET\assembly\GAC_MSIL\$name"
  (Get-ChildItem -Path $base -Recurse -Filter "$name.dll" | Select-Object -First 1).FullName
}
$speech = Find-Gac 'System.Speech'
# System.Web.Extensions (JavaScriptSerializer) is already in the default csc response file.

& $csc /nologo /target:exe /platform:x64 /optimize+ /codepage:65001 `
  "/out:$here\Kuroop.exe" `
  "/r:$speech" `
  "$here\LazyBotVoice.cs"

if ($LASTEXITCODE -eq 0) { Write-Host "Built: $here\Kuroop.exe" }
