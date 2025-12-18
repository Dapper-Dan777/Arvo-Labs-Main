# Clerk Redirect-URLs Konfiguration

## Übersicht

Diese Dokumentation beschreibt die Redirect-URLs, die im Clerk Dashboard konfiguriert werden müssen, um die zentrale Redirect-Route `/auth/redirect` zu nutzen.

Die Route `/auth/redirect` liest den Plan (`publicMetadata.plan`) des eingeloggten Benutzers aus und leitet ihn automatisch zum passenden Dashboard weiter:

- `free` → `/dashboard/free`
- `pro` → `/dashboard/pro`
- `enterprise` → `/dashboard/enterprise`
- Fallback (kein Plan) → `/dashboard/free`

## Environment Variable

Stelle sicher, dass `NEXT_PUBLIC_APP_URL` in deiner `.env` oder in den Environment Variables deines Hosting-Providers gesetzt ist:

```env
NEXT_PUBLIC_APP_URL=https://arvo-labs.de
```

Für lokale Entwicklung:
```env
NEXT_PUBLIC_APP_URL=http://localhost:8080
```

## Clerk Dashboard Konfiguration

Die folgenden URLs müssen im Clerk Dashboard unter **Account Portal → Redirects** eingetragen werden.

**Wichtig**: Ersetze `${APP_URL}` mit dem tatsächlichen Wert von `NEXT_PUBLIC_APP_URL` (z.B. `https://arvo-labs.de` für Production).

| Kontext in Clerk | Beschreibung | URL-Beispiel |
|-----------------|--------------|--------------|
| **After sign-in fallback** | Fallback Redirect nach Sign-in, wenn keine spezifische Redirect-URL angegeben ist | `${APP_URL}/auth/redirect` |
| **After sign-up fallback** | Fallback Redirect nach Sign-up, wenn keine spezifische Redirect-URL angegeben ist | `${APP_URL}/auth/redirect` |
| **After logo click** (optional) | Klick auf Logo im Account Portal | `${APP_URL}/auth/redirect` |
| **Direct link redirect_url** | Wenn direkte Links zum Portal genutzt werden | `https://accounts.meine-domain.com/sign-in?redirect_url=${APP_URL}/auth/redirect` |

## Konkrete Beispiele

### Production (arvo-labs.de)

```
https://arvo-labs.de/auth/redirect
```

### Development (localhost)

```
http://localhost:8080/auth/redirect
```

## Schritt-für-Schritt Anleitung

1. Öffne das [Clerk Dashboard](https://dashboard.clerk.com)
2. Wähle dein Projekt aus
3. Gehe zu **User & Authentication** → **Account Portal** → **Redirects**
4. Trage die folgenden URLs ein (ersetze `${APP_URL}` mit deiner tatsächlichen Domain):
   - **After sign-in fallback**: `${APP_URL}/auth/redirect`
   - **After sign-up fallback**: `${APP_URL}/auth/redirect`
   - **After logo click** (optional): `${APP_URL}/auth/redirect`
5. Speichere die Änderungen

## Hinweise

- Die URLs müssen **exakt** so eingetragen werden, wie sie hier angegeben sind
- Für Production sollte `https://` verwendet werden
- Stelle sicher, dass `NEXT_PUBLIC_APP_URL` in deinen Environment Variables gesetzt ist
- Die Route funktioniert nur für eingeloggte Benutzer. Nicht eingeloggte Benutzer werden automatisch zu `/sign-in` weitergeleitet

## Troubleshooting

### Problem: Redirect funktioniert nicht

- ✅ Prüfe ob `NEXT_PUBLIC_APP_URL` gesetzt ist
- ✅ Prüfe ob die URLs im Clerk Dashboard korrekt eingetragen sind
- ✅ Prüfe ob der Benutzer eingeloggt ist
- ✅ Prüfe ob `publicMetadata.plan` im Clerk Dashboard gesetzt ist

### Problem: Falsche Weiterleitung

- ✅ Prüfe ob der Plan-Wert in `publicMetadata.plan` einem der erlaubten Werte entspricht (`free`, `pro`, `enterprise`)
- ✅ Prüfe die Browser-Konsole auf Fehler
- ✅ Prüfe die Server-Logs für Fehler in der Route

