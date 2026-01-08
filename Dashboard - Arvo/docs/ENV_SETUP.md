# Environment Variables Setup

Diese Anleitung erklärt, wie Sie die Environment Variables für die Gmail Integration einrichten.

## 📋 Schnellstart

Die `.env.local` Datei wurde bereits erstellt mit den Gmail Credentials.

## 🔧 Environment Variables

### Gmail OAuth 2.0

Die folgenden Variablen müssen in `.env.local` gesetzt sein:

```env
VITE_GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
VITE_GMAIL_REDIRECT_URI=http://localhost:5173/auth/callback
```

### Supabase (falls noch nicht gesetzt)

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📝 Wichtige Hinweise

1. **Dateiname**: `.env.local` (wird automatisch von Vite geladen)
2. **VITE_ Präfix**: Alle Environment Variables müssen mit `VITE_` beginnen, damit sie im Frontend verfügbar sind
3. **Neustart erforderlich**: Nach dem Erstellen/Ändern der `.env.local` Datei muss der Dev Server neu gestartet werden

## 🚀 Nach dem Setup

1. **Dev Server neu starten**:
   ```bash
   # Stoppen Sie den laufenden Server (Ctrl+C)
   # Starten Sie ihn neu:
   npm run dev
   ```

2. **Prüfen Sie die Konsole**: 
   - Keine Fehler bezüglich `VITE_GMAIL_CLIENT_ID`
   - Die Gmail Integration sollte jetzt funktionieren

## 🔒 Sicherheit

- `.env.local` ist bereits in `.gitignore` (über `*.local`)
- **NIEMALS** `.env.local` committen
- Das Client Secret wird NUR in Supabase Edge Functions verwendet, nicht im Frontend

## 🌐 Production

Für Production müssen Sie die Environment Variables in Ihrer Hosting-Plattform setzen:

- **Vercel**: Settings → Environment Variables
- **Netlify**: Site settings → Environment variables
- **Andere**: Je nach Plattform in den Settings

**WICHTIG**: Für Production muss `VITE_GMAIL_REDIRECT_URI` auf Ihre Production URL zeigen:
```env
VITE_GMAIL_REDIRECT_URI=https://yourdomain.com/auth/callback
```

## 🐛 Troubleshooting

### "VITE_GMAIL_CLIENT_ID ist nicht gesetzt"

1. Prüfen Sie ob `.env.local` im Projekt-Root existiert
2. Prüfen Sie ob die Variable korrekt geschrieben ist (mit `VITE_` Präfix)
3. **Starten Sie den Dev Server neu** (wichtig!)
4. Prüfen Sie die Datei auf Tippfehler

### Variables werden nicht geladen

- Stellen Sie sicher, dass die Datei `.env.local` heißt (nicht `.env`)
- Prüfen Sie ob keine Leerzeichen um das `=` sind
- Keine Anführungszeichen um die Werte (außer wenn nötig)

