# Environment Variables Troubleshooting

## Problem: "VITE_GMAIL_CLIENT_ID ist nicht gesetzt"

### Lösung 1: Dev Server neu starten

**WICHTIG**: Nach dem Erstellen oder Ändern der `.env.local` Datei muss der Dev Server **neu gestartet** werden!

```bash
# 1. Stoppen Sie den Server (Ctrl+C)
# 2. Starten Sie ihn neu:
npm run dev
```

### Lösung 2: Prüfen Sie die Datei

Die `.env.local` Datei muss im **Projekt-Root** liegen (gleiche Ebene wie `package.json`):

```
C:\Users\adria\Dashboard - Arvo\.env.local
```

**Inhalt sollte sein:**
```env
VITE_GMAIL_CLIENT_ID=633089084422-67a2qns2jkv7etqg9r88sm6boca3skp2.apps.googleusercontent.com
VITE_GMAIL_REDIRECT_URI=http://localhost:5173/auth/callback
```

### Lösung 3: Prüfen Sie die Syntax

- ✅ **Richtig**: `VITE_GMAIL_CLIENT_ID=wert`
- ❌ **Falsch**: `VITE_GMAIL_CLIENT_ID = wert` (Leerzeichen um `=`)
- ❌ **Falsch**: `VITE_GMAIL_CLIENT_ID="wert"` (Anführungszeichen nicht nötig)
- ❌ **Falsch**: `GMAIL_CLIENT_ID=wert` (fehlt `VITE_` Präfix)

### Lösung 4: Browser Cache leeren

Manchmal werden alte Environment Variables gecacht:

1. Öffnen Sie DevTools (F12)
2. Gehen Sie zu "Application" → "Clear storage"
3. Klicken Sie auf "Clear site data"
4. Laden Sie die Seite neu

### Lösung 5: Prüfen Sie die Konsole

Öffnen Sie die Browser-Konsole (F12) und prüfen Sie:

```javascript
// In der Konsole eingeben:
console.log(import.meta.env.VITE_GMAIL_CLIENT_ID)
```

Wenn `undefined` ausgegeben wird, wurde die Variable nicht geladen.

### Lösung 6: Hard Refresh

Drücken Sie `Ctrl+Shift+R` (Windows) oder `Cmd+Shift+R` (Mac) für einen Hard Refresh.

## Häufige Fehler

### Fehler: "NEXT_PUBLIC_" statt "VITE_"

**Problem**: Sie haben `NEXT_PUBLIC_SUPABASE_URL` statt `VITE_SUPABASE_URL` verwendet.

**Lösung**: In Vite müssen alle Environment Variables mit `VITE_` beginnen, nicht `NEXT_PUBLIC_`.

### Fehler: Datei heißt `.env` statt `.env.local`

**Problem**: Vite lädt `.env.local` automatisch, aber nicht `.env`.

**Lösung**: Benennen Sie die Datei um zu `.env.local`.

### Fehler: Datei ist im falschen Verzeichnis

**Problem**: Die `.env.local` Datei ist nicht im Projekt-Root.

**Lösung**: Die Datei muss im gleichen Verzeichnis wie `package.json` liegen.

## Debug-Modus

Fügen Sie temporär diesen Code hinzu, um alle Environment Variables zu sehen:

```typescript
if (import.meta.env.DEV) {
  console.log('🔍 Environment Variables:');
  console.log('VITE_GMAIL_CLIENT_ID:', import.meta.env.VITE_GMAIL_CLIENT_ID);
  console.log('VITE_GMAIL_REDIRECT_URI:', import.meta.env.VITE_GMAIL_REDIRECT_URI);
  console.log('Alle VITE_ Variablen:', 
    Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
  );
}
```

## Noch immer Probleme?

1. Prüfen Sie ob die Datei wirklich `.env.local` heißt (nicht `.env.local.txt`)
2. Prüfen Sie ob keine versteckten Zeichen in der Datei sind
3. Erstellen Sie die Datei neu:
   ```bash
   # Windows PowerShell
   Remove-Item .env.local -ErrorAction SilentlyContinue
   # Dann neu erstellen mit den korrekten Werten
   ```
4. Prüfen Sie die Vite Konsole beim Start - dort sollten keine Fehler sein

