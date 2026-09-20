$ErrorActionPreference = "Stop"

if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.example" ".env.local"
    Write-Host "Created .env.local from .env.example. Add SVV_API_KEY before vehicle lookups."
}

docker compose --env-file .env.local up --build