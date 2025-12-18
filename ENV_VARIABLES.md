# Environment Variables Setup

## Frontend (.env Datei)

Erstelle eine `.env` Datei im Root-Verzeichnis mit folgenden Variablen:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SfROMPgo9Kimm8x...

# Stripe Price IDs
VITE_STRIPE_PRICE_STARTER=price_1SfRXkPgo9Kimm8xHNLvrWVR
VITE_STRIPE_PRICE_PRO=price_1SfRY5Pgo9Kimm8x04VoyShG
VITE_STRIPE_PRICE_ENTERPRISE=price_1SfRYXPgo9Kimm8xe9LWxFwj
VITE_STRIPE_PRICE_INDIVIDUAL=price_1SfRW1Pgo9Kimm8xGy8fUex1

# App Configuration
VITE_BASE_URL=https://arvo-labs.de
```

## Backend (Vercel Environment Variables)

Setze diese Variablen in Vercel Dashboard → Settings → Environment Variables:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_... (oder sk_live_... für Production)
STRIPE_WEBHOOK_SECRET=whsec_... (aus Stripe Dashboard → Webhooks)

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (Service Role Key, NICHT der anon key!)

# App
APP_URL=https://arvo-labs.de
```

## Wichtige Hinweise

1. **Frontend-Variablen** (VITE_*) werden beim Build in den Code eingebettet
2. **Backend-Variablen** (ohne VITE_) sind nur auf dem Server verfügbar
3. **Service Role Key** hat Admin-Rechte - NIEMALS im Frontend verwenden!
4. Test-Keys beginnen mit "test_" oder "pk_test_" / "sk_test_"
5. Production-Keys beginnen mit "live_" oder "pk_live_" / "sk_live_"

## Wo finde ich die Werte?

### Supabase
- **URL & Anon Key**: Supabase Dashboard → Project Settings → API
- **Service Role Key**: Supabase Dashboard → Project Settings → API → service_role key

### Stripe
- **Publishable Key**: Stripe Dashboard → Developers → API keys
- **Secret Key**: Stripe Dashboard → Developers → API keys
- **Price IDs**: Stripe Dashboard → Products → [Product] → Pricing
- **Webhook Secret**: Stripe Dashboard → Webhooks → [Webhook] → Signing secret

