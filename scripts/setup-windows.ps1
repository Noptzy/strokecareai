# scripts/setup-windows.ps1
# Bring up dev dependencies (Postgres + Redis) via docker compose and prepare .env.
# Safe to re-run.

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot\..

Write-Host "==> Starting Postgres + Redis via docker compose..."
docker compose -f docker-compose.dev.yml up -d db redis

Write-Host "==> Waiting for healthchecks..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
  $status = docker compose -f docker-compose.dev.yml ps --format json 2>$null | ConvertFrom-Json -ErrorAction SilentlyContinue
  if ($status) {
    $healthy = ($status | Where-Object { $_.Health -eq "healthy" }).Count
    if ($healthy -ge 2) { $ready = $true; break }
  }
  Start-Sleep -Seconds 2
}
if (-not $ready) {
  Write-Warning "Services did not become healthy in 60s. Check `docker compose -f docker-compose.dev.yml ps`."
}

if (-not (Test-Path .env)) {
  Copy-Item .env.example .env -Force
  Write-Host "==> Created .env from .env.example"
} else {
  Write-Host "==> .env exists, leaving untouched"
}

# Generate BETTER_AUTH_SECRET if missing
$envContent = Get-Content .env -Raw
if ($envContent -notmatch "BETTER_AUTH_SECRET=.+") {
  $secret = -join ((1..32) | ForEach-Object { "{0:x2}" -f (Get-Random -Maximum 256) })
  Add-Content .env "BETTER_AUTH_SECRET=$secret"
  Write-Host "==> Generated BETTER_AUTH_SECRET"
}

Write-Host "==> Installing deps..."
pnpm install

Write-Host "==> Pushing schema to DB..."
pnpm db:push

Write-Host "==> Done. Run `pnpm dev` to start the app."
