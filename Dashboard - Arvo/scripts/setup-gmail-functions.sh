#!/bin/bash

# Gmail OAuth Edge Functions Setup Script
# Automatisiertes Setup für Supabase Edge Functions

set -e

PROJECT_REF=""
DEPLOY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --project-ref)
            PROJECT_REF="$2"
            shift 2
            ;;
        --deploy)
            DEPLOY=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Gmail OAuth Credentials
GMAIL_CLIENT_ID="633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com"
GMAIL_CLIENT_SECRET="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"

echo "🚀 Gmail OAuth Edge Functions Setup"
echo ""

# Prüfe Supabase CLI
echo "📋 Prüfe Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI nicht gefunden!"
    echo "   Installieren Sie es mit: npm install -g supabase"
    exit 1
fi

SUPABASE_VERSION=$(supabase --version)
echo "✅ Supabase CLI gefunden: $SUPABASE_VERSION"

# Prüfe ob bereits eingeloggt
echo ""
echo "🔐 Prüfe Supabase Login..."
if supabase projects list &> /dev/null; then
    echo "✅ Bereits bei Supabase eingeloggt"
else
    echo "⚠️  Nicht bei Supabase eingeloggt"
    echo "   Führen Sie aus: supabase login"
    read -p "   Jetzt einloggen? (j/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Jj]$ ]]; then
        supabase login
    else
        echo "❌ Setup abgebrochen"
        exit 1
    fi
fi

# Initialisiere Supabase (falls nötig)
echo ""
echo "📦 Initialisiere Supabase..."
if [ ! -f "supabase/config.toml" ]; then
    echo "   Erstelle Supabase Konfiguration..."
    supabase init
    echo "✅ Supabase initialisiert"
else
    echo "✅ Supabase bereits initialisiert"
fi

# Prüfe ob Functions bereits existieren
echo ""
echo "🔍 Prüfe Edge Functions..."

if [ ! -f "supabase/functions/gmail-oauth/index.ts" ]; then
    echo "   Erstelle gmail-oauth Function..."
    supabase functions new gmail-oauth
    echo "✅ gmail-oauth Function erstellt"
else
    echo "✅ gmail-oauth Function existiert bereits"
fi

if [ ! -f "supabase/functions/gmail-api/index.ts" ]; then
    echo "   Erstelle gmail-api Function..."
    supabase functions new gmail-api
    echo "✅ gmail-api Function erstellt"
else
    echo "✅ gmail-api Function existiert bereits"
fi

# Setze Secrets
echo ""
echo "🔑 Setze Secrets..."

if [ -n "$PROJECT_REF" ]; then
    echo "   Setze Secrets für Projekt: $PROJECT_REF"
    supabase secrets set --project-ref "$PROJECT_REF" GMAIL_CLIENT_ID="$GMAIL_CLIENT_ID"
    supabase secrets set --project-ref "$PROJECT_REF" GMAIL_CLIENT_SECRET="$GMAIL_CLIENT_SECRET"
    echo "✅ Secrets für Production gesetzt"
else
    echo "   Setze Secrets für lokales Development..."
    if supabase secrets set GMAIL_CLIENT_ID="$GMAIL_CLIENT_ID" &> /dev/null && \
       supabase secrets set GMAIL_CLIENT_SECRET="$GMAIL_CLIENT_SECRET" &> /dev/null; then
        echo "✅ Secrets für lokales Development gesetzt"
    else
        echo "⚠️  Secrets konnten nicht gesetzt werden (möglicherweise kein lokaler Supabase Stack)"
        echo "   Für Production verwenden Sie: ./scripts/setup-gmail-functions.sh --project-ref YOUR_PROJECT_REF"
    fi
fi

# Deploy Functions (optional)
if [ "$DEPLOY" = true ] && [ -n "$PROJECT_REF" ]; then
    echo ""
    echo "🚀 Deploye Functions..."
    echo "   Deploye gmail-oauth..."
    supabase functions deploy gmail-oauth --project-ref "$PROJECT_REF"
    echo "   Deploye gmail-api..."
    supabase functions deploy gmail-api --project-ref "$PROJECT_REF"
    echo "✅ Functions deployed"
elif [ "$DEPLOY" = true ] && [ -z "$PROJECT_REF" ]; then
    echo ""
    echo "⚠️  Deploy erfordert ProjectRef. Verwenden Sie: --project-ref YOUR_PROJECT_REF"
fi

# Zusammenfassung
echo ""
echo "✅ Setup abgeschlossen!"
echo ""
echo "📝 Nächste Schritte:"
echo "   1. Führen Sie das SQL Schema aus: docs/GMAIL_SETUP_SQL.sql"
echo "   2. Für lokales Testing: supabase functions serve"
if [ -n "$PROJECT_REF" ]; then
    echo "   3. Function URLs:"
    echo "      - https://$PROJECT_REF.supabase.co/functions/v1/gmail-oauth"
    echo "      - https://$PROJECT_REF.supackages/functions/v1/gmail-api"
else
    echo "   3. Für Production Deployment:"
    echo "      ./scripts/setup-gmail-functions.sh --project-ref YOUR_PROJECT_REF --deploy"
fi
echo ""

