# Sincroniza social/.env -> variables de usuario de Windows (sin imprimir valores).
# Uso: powershell -ExecutionPolicy Bypass -File tools/sync-env.ps1
$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\..\.env"
if (-not (Test-Path $envFile)) { Write-Host "No existe .env en social/"; exit 1 }

$count = 0
Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq "" -or $line.StartsWith("#")) { return }
  if ($line -notmatch "^([A-Za-z_][A-Za-z0-9_]*)=") { return }
  $k, $v = $line -split "=", 2
  if ($v -ne "") {
    [Environment]::SetEnvironmentVariable($k, $v, "User")
    $script:count++
  }
}
Write-Host "Listo: $script:count variables definidas como variables de usuario (valores no mostrados)."
Write-Host "Reinicia opencode desde social/ para que los MCP las hereden."
