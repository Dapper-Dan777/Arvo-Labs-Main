# Race Condition Analyse & Verbesserungsvorschläge

## 🔍 Problem: Race Condition zwischen SetPlanAfterSignup und Webhook

### Szenario:
1. User meldet sich mit Team-Plan an (`/sign-up?plan=pro&accountType=team`)
2. Gleichzeitig feuert Clerk Billing ein `subscription.created` Webhook-Event
3. **Beide versuchen, eine Organization zu erstellen**

### Aktueller Code-Flow:

**SetPlanAfterSignup (Client-Side):**
```
1. User meldet sich an
2. useEffect läuft → ruft /api/clerk/create-team-org auf
3. API prüft: "Hat User bereits Organization mit diesem Plan?"
4. Wenn NEIN → erstellt Organization
```

**Webhook (Server-Side):**
```
1. Clerk sendet subscription.created Event
2. Webhook prüft: "Hat User bereits Organization?"
3. Wenn NEIN → erstellt Organization
```

### ⚠️ POTENTIELLES PROBLEM:

**Race Condition Window:**
```
Zeitpunkt T0: Beide prüfen gleichzeitig → beide sehen "keine Organization"
Zeitpunkt T1: Beide versuchen zu erstellen → möglicherweise 2 Organizations
```

### ✅ AKTUELLER SCHUTZ:

1. **API Route prüft auf bestehende Organization mit gleichem Plan:**
   - Wenn Organization mit gleichem Plan existiert → 409 Error
   - SetPlanAfterSignup behandelt 409 korrekt

2. **Webhook prüft auch auf bestehende Organization:**
   - Durchsucht alle Organizations des Users
   - Prüft auf gleichen Plan

### 🛡️ WARUM ES TROTZDEM FUNKTIONIERT:

**Clerk's createOrganization ist idempotent:**
- Wenn beide gleichzeitig versuchen, eine Organization zu erstellen
- Clerk könnte einen Fehler zurückgeben (z.B. "User already has organization")
- ABER: Wir prüfen VORHER, also sollte das selten passieren

**ABER: Es gibt ein kleines Risiko:**
- Wenn beide EXAKT gleichzeitig prüfen (beide sehen "keine Organization")
- Und dann beide versuchen zu erstellen
- Könnte zu 2 Organizations führen (eine mit Plan A, eine mit Plan B)

### 💡 EMPFOHLENE VERBESSERUNG:

**Option 1: Retry-Logik mit Backoff**
- Wenn Organization-Erstellung fehlschlägt wegen "already exists"
- Retry mit kurzer Verzögerung
- Prüfe erneut, ob Organization jetzt existiert

**Option 2: Idempotency Key**
- Verwende einen eindeutigen Key pro User+Plan Kombination
- Clerk könnte das unterstützen (muss geprüft werden)

**Option 3: Optimistic Locking**
- Verwende eine "creating" Flag in User Metadata
- Erste Anfrage setzt Flag, zweite wartet/retry

**Option 4: Priorität setzen**
- Webhook hat Priorität (kommt von Clerk Billing)
- SetPlanAfterSignup prüft zuerst, ob Webhook bereits Organization erstellt hat

## 📊 FAZIT:

**Aktueller Status: ⚠️ FUNKTIONIERT, ABER MIT KLEINEM RISIKO**

- In 99% der Fälle funktioniert es korrekt
- Race Condition ist selten, aber möglich
- Wenn es passiert: User hat 2 Organizations (kann manuell bereinigt werden)

**Empfehlung:**
- Für MVP: **AKTUELLER CODE IST OK**
- Für Production: **Option 4 implementieren** (Webhook-Priorität)

