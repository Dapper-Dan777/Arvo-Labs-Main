# E-Mail-Service Einrichtung

Dieses Dokument erklärt, wie Sie den E-Mail-Service für das Dashboard konfigurieren.

## 📧 Überblick

Das Dashboard verwendet **Resend** für den E-Mail-Versand und benötigt einen E-Mail-Service, um:
- Bestätigungs-E-Mails bei Registrierung zu versenden
- Update-E-Mails bei Profiländerungen zu versenden
- Passwort-Änderungs-Benachrichtigungen zu senden
- 2FA-Einrichtungs-Bestätigungen zu versenden

## 🔧 Konfiguration

### Schritt 1: Resend Account einrichten

1. **Account erstellen**: Gehen Sie zu https://resend.com und erstellen Sie einen Account
2. **API Key erstellen**: 
   - Navigieren Sie zu Dashboard > API Keys
   - Klicken Sie auf "Create API Key"
   - Kopieren Sie den API Key (beginnt mit `re_`)
3. **Domain verifizieren** (wichtig für Produktion):
   - Gehen Sie zu Dashboard > Domains
   - Fügen Sie Ihre Domain hinzu (z.B. `arvo-labs.de`)
   - Folgen Sie den DNS-Anweisungen zur Verifizierung

### Schritt 2: Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env` Datei im Projekt-Root:

```env
# Resend API Key (erforderlich für echten E-Mail-Versand)
VITE_RESEND_API_KEY=re_your_api_key_here

# Absender-Konfiguration
VITE_EMAIL_FROM=info@arvo-labs.de
VITE_EMAIL_FROM_NAME=Arvo Dashboard
```

**Hinweis**: Die Absender-E-Mail-Adresse muss in Resend verifiziert sein (entweder über Domain-Verifizierung oder Einzel-E-Mail-Verifizierung).

### Schritt 3: Entwicklung (Mock-Modus)

Falls kein API-Key konfiguriert ist, läuft das System im Mock-Modus:
- E-Mails werden in `localStorage` gespeichert (nur zur Entwicklung)
- Sie können sie in der Browser-Konsole sehen
- Keine echten E-Mails werden versendet


## ⚠️ Wichtige Hinweise

1. **Absender-E-Mail verifizieren**: Die Absender-E-Mail-Adresse (`info@arvo-labs.de`) muss in Resend verifiziert sein
   - Entweder über Domain-Verifizierung (empfohlen für Produktion)
   - Oder über Einzel-E-Mail-Verifizierung (für Tests)
2. **Rate Limits**: Resend hat folgende Limits:
   - Free Plan: 100 E-Mails/Tag, 3.000 E-Mails/Monat
   - Pro Plan: Mehrere Limits je nach Paket
3. **Domain-Setup**: Für Produktion empfohlen - fügen Sie Ihre Domain in Resend hinzu und verifizieren Sie sie über DNS
4. **Sicherheit**: Speichern Sie den API-Key niemals im Code, nur in `.env` und fügen Sie `.env` zu `.gitignore` hinzu

## 🔍 E-Mails prüfen (Mock-Modus)

Im Mock-Modus können Sie versendete E-Mails im Browser prüfen:

```javascript
// In der Browser-Konsole:
const emails = JSON.parse(localStorage.getItem('sent_emails') || '[]');
console.table(emails);
```

## 📝 E-Mail-Templates

Die E-Mail-Templates befinden sich in `src/services/emailService.ts`:
- `sendVerificationEmail()` - Bestätigungs-E-Mail
- `sendProfileUpdateEmail()` - Profil-Update-E-Mail
- `sendPasswordChangeEmail()` - Passwort-Änderung
- `send2FASetupEmail()` - 2FA-Einrichtung

Sie können diese Templates nach Bedarf anpassen.


