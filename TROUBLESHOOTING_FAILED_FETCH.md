# 🔧 Troubleshooting: "Failed to fetch" Fehler

## 🐛 Problem
Bei Anmeldung oder Registrierung erscheint der Fehler: **"Failed to fetch"**

## 🔍 Mögliche Ursachen

### 1. .env Datei wird nicht geladen
**Lösung:**
1. Stelle sicher, dass die `.env` Datei im **Root-Verzeichnis** liegt (nicht in `src/`)
2. **Starte den Dev-Server neu**:
   ```bash
   # Stoppe den Server (Strg+C)
   # Dann starte neu:
   npm run dev
   ```
3. Vite lädt `.env` Dateien nur beim Start

### 2. Supabase URL oder Key ist falsch
**Prüfen:**
1. Öffne die `.env` Datei
2. Prüfe, ob die Werte korrekt sind:
   ```env
   VITE_SUPABASE_URL=https://wncuwnignndwooeazhwr.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. **Wichtig:** Keine Leerzeichen vor/nach dem `=`
4. **Wichtig:** Keine Anführungszeichen um die Werte

### 3. Supabase Projekt ist nicht erreichbar
**Prüfen:**
1. Gehe zu [supabase.com](https://supabase.com)
2. Prüfe, ob dein Projekt aktiv ist
3. Prüfe, ob die URL korrekt ist: `https://wncuwnignndwooeazhwr.supabase.co`

### 4. CORS-Problem
**Lösung:**
1. Gehe zu **Supabase Dashboard** → **Settings** → **API**
2. Prüfe die **Allowed Origins**
3. Füge deine Domain hinzu:
   - `http://localhost:5173` (für Development)
   - `https://arvo-labs.de` (für Production)

### 5. Browser Console prüfen
**Schritte:**
1. Öffne Browser Console (F12)
2. Gehe zu **Console** Tab
3. Versuche dich anzumelden
4. Prüfe die Fehlermeldungen:
   - `🔍 Supabase Config:` → Zeigt die Konfiguration
   - `SignIn error:` oder `SignUp error:` → Zeigt den genauen Fehler

## ✅ Schnelle Lösung

### Schritt 1: Dev-Server neu starten
```bash
# Stoppe den Server
# Dann:
npm run dev
```

### Schritt 2: Browser Console prüfen
1. Öffne F12
2. Gehe zu Console
3. Prüfe die `🔍 Supabase Config:` Meldung
4. Prüfe ob URL und Key gesetzt sind

### Schritt 3: Supabase Dashboard prüfen
1. Gehe zu Supabase Dashboard
2. Prüfe, ob das Projekt aktiv ist
3. Kopiere die URL und Key nochmal
4. Vergleiche mit `.env` Datei

## 🧪 Test

Nach den Änderungen:
1. Öffne Browser Console (F12)
2. Gehe zu `/auth/sign-in`
3. Prüfe die Console für:
   - `🔍 Supabase Config:` → Sollte URL und Key zeigen
4. Versuche dich anzumelden
5. Prüfe die Fehlermeldung in der Console

## 📝 Debug-Informationen

Die App zeigt jetzt bessere Fehlermeldungen:
- **"Netzwerkfehler"** → Prüfe Internetverbindung und Supabase-Konfiguration
- **"Ungültige E-Mail-Adresse oder Passwort"** → Login-Daten sind falsch
- **"Diese E-Mail-Adresse ist bereits registriert"** → User existiert bereits

## 🔗 Weitere Hilfe

Falls das Problem weiterhin besteht:
1. Prüfe die Browser Console für detaillierte Fehler
2. Prüfe die Network-Tab für fehlgeschlagene Requests
3. Prüfe Supabase Dashboard → Logs für Server-Fehler


