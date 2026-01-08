# Gmail OAuth Edge Functions Setup Script
# Automatisiertes Setup für Supabase Edge Functions

param(
    [string]$ProjectRef = "",
    [switch]$Deploy = $false
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Gmail OAuth Edge Functions Setup" -ForegroundColor Cyan
Write-Host ""

# Gmail OAuth Credentials
$GMAIL_CLIENT_ID = "633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com"
$GMAIL_CLIENT_SECRET = "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"

# Prüfe Supabase CLI
Write-Host "📋 Prüfe Supabase CLI..." -ForegroundColor Yellow
try {
    $supabaseVersion = supabase --version 2>&1
    Write-Host "✅ Supabase CLI gefunden: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI nicht gefunden!" -ForegroundColor Red
    Write-Host "   Installieren Sie es mit: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Prüfe ob bereits eingeloggt
Write-Host ""
Write-Host "🔐 Prüfe Supabase Login..." -ForegroundColor Yellow
try {
    supabase projects list 2>&1 | Out-Null
    Write-Host "✅ Bereits bei Supabase eingeloggt" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Nicht bei Supabase eingeloggt" -ForegroundColor Yellow
    Write-Host "   Führen Sie aus: supabase login" -ForegroundColor Yellow
    $login = Read-Host "   Jetzt einloggen? (j/n)"
    if ($login -eq "j" -or $login -eq "J") {
        supabase login
    } else {
        Write-Host "❌ Setup abgebrochen" -ForegroundColor Red
        exit 1
    }
}

# Initialisiere Supabase (falls nötig)
Write-Host ""
Write-Host "📦 Initialisiere Supabase..." -ForegroundColor Yellow
if (-not (Test-Path "supabase/config.toml")) {
    Write-Host "   Erstelle Supabase Konfiguration..." -ForegroundColor Gray
    supabase init
    Write-Host "✅ Supabase initialisiert" -ForegroundColor Green
} else {
    Write-Host "✅ Supabase bereits initialisiert" -ForegroundColor Green
}

# Prüfe ob Functions bereits existieren
Write-Host ""
Write-Host "🔍 Prüfe Edge Functions..." -ForegroundColor Yellow

$gmailOAuthExists = Test-Path "supabase/functions/gmail-oauth/index.ts"
$gmailApiExists = Test-Path "supabase/functions/gmail-api/index.ts"

if (-not $gmailOAuthExists) {
    Write-Host "   Erstelle gmail-oauth Function..." -ForegroundColor Gray
    supabase functions new gmail-oauth
    Write-Host "✅ gmail-oauth Function erstellt" -ForegroundColor Green
} else {
    Write-Host "✅ gmail-oauth Function existiert bereits" -ForegroundColor Green
}

if (-not $gmailApiExists) {
    Write-Host "   Erstelle gmail-api Function..." -ForegroundColor Gray
    supabase functions new gmail-api
    Write-Host "✅ gmail-api Function erstellt" -ForegroundColor Green
} else {
    Write-Host "✅ gmail-api Function existiert bereits" -ForegroundColor Green
}

# Setze Secrets
Write-Host ""
Write-Host "🔑 Setze Secrets..." -ForegroundColor Yellow

if ($ProjectRef) {
    Write-Host "   Setze Secrets für Projekt: $ProjectRef" -ForegroundColor Gray
    supabase secrets set --project-ref $ProjectRef GMAIL_CLIENT_ID=$GMAIL_CLIENT_ID
    supabase secrets set --project-ref $ProjectRef GMAIL_CLIENT_SECRET=$GMAIL_CLIENT_SECRET
    Write-Host "✅ Secrets für Production gesetzt" -ForegroundColor Green
} else {
    Write-Host "   Setze Secrets für lokales Development..." -ForegroundColor Gray
    try {
        supabase secrets set GMAIL_CLIENT_ID=$GMAIL_CLIENT_ID 2>&1 | Out-Null
        supabase secrets set GMAIL_CLIENT_SECRET=$GMAIL_CLIENT_SECRET 2>&1 | Out-Null
        Write-Host "✅ Secrets für lokales Development gesetzt" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Secrets konnten nicht gesetzt werden (möglicherweise kein lokaler Supabase Stack)" -ForegroundColor Yellow
        Write-Host "   Für Production verwenden Sie: .\scripts\setup-gmail-functions.ps1 -ProjectRef YOUR_PROJECT_REF" -ForegroundColor Yellow
    }
}

# Deploy Functions (optional)
if ($Deploy -and $ProjectRef) {
    Write-Host ""
    Write-Host "🚀 Deploye Functions..." -ForegroundColor Yellow
    Write-Host "   Deploye gmail-oauth..." -ForegroundColor Gray
    supabase functions deploy gmail-oauth --project-ref $ProjectRef
    Write-Host "   Deploye gmail-api..." -ForegroundColor Gray
    supabase functions deploy gmail-api --project-ref $ProjectRef
    Write-Host "✅ Functions deployed" -ForegroundColor Green
} elseif ($Deploy -and -not $ProjectRef) {
    Write-Host ""
    Write-Host "⚠️  Deploy erfordert ProjectRef. Verwenden Sie: -ProjectRef YOUR_PROJECT_REF" -ForegroundColor Yellow
}

# Zusammenfassung
Write-Host ""
Write-Host "✅ Setup abgeschlossen!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Nächste Schritte:" -ForegroundColor Cyan
Write-Host "   1. Führen Sie das SQL Schema aus: docs/GMAIL_SETUP_SQL.sql" -ForegroundColor White
Write-Host "   2. Für lokales Testing: supabase functions serve" -ForegroundColor White
if ($ProjectRef) {
    Write-Host "   3. Function URLs:" -ForegroundColor White
    Write-Host "      - https://$ProjectRef.supabase.co/functions/v1/gmail-oauth" -ForegroundColor Gray
    Write-Host "      - https://$ProjectRef.supabase.co/functions/v1/gmail-api" -ForegroundColor Gray
} else {
    Write-Host "   3. Für Production Deployment:" -ForegroundColor White
    Write-Host "      .\scripts\setup-gmail-functions.ps1 -ProjectRef YOUR_PROJECT_REF -Deploy" -ForegroundColor Gray
}
Write-Host ""

