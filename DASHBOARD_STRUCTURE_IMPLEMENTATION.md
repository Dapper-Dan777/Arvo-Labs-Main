# Dashboard-Struktur Implementation

## Übersicht

Diese Implementierung erstellt eine saubere Dashboard-Struktur für alle Pläne (User + Team) mit plan-spezifischen Features und Navigation.

**Status**: ✅ Vollständig implementiert

## Wichtige Hinweise

⚠️ **Bestehender Code unverändert**: 
- Das `EnterpriseTeamDashboard` wurde **nicht verändert**, nur wiederverwendet
- Alle bestehenden Routen und Komponenten bleiben erhalten
- Alle neuen Komponenten sind **additiv** hinzugefügt worden

✅ **Plan-Logik**: 
- Die bestehende Plan-Logik in `get-current-plan.ts` wird verwendet
- Keine Änderungen an bestehender Auth/Routing-Logik

## Routing-Struktur

### User-Dashboards
- `/dashboard/user/starter` - Basis-Features
- `/dashboard/user/pro` - Erweiterte Features
- `/dashboard/user/enterprise` - Alle Features

### Team-Dashboards
- `/dashboard/team/starter` - Basis-Features
- `/dashboard/team/pro` - Erweiterte Features
- `/dashboard/team/enterprise` - Alle Features (bereits vorhanden)

## Zentrale Route

Die Route `/dashboard` (in `src/app/(app)/dashboard/page.tsx`) leitet automatisch um basierend auf:
1. Ob der User in einer Organization ist (Team) oder nicht (User)
2. Dem Plan aus `user.publicMetadata.plan` oder `organization.publicMetadata.plan`

## Implementierte Komponenten

### User-Dashboard-Komponenten
- `UserDashboardStarter` - Starter Plan Features
- `UserDashboardPro` - Pro Plan Features
- `UserDashboardEnterprise` - Enterprise Plan Features

### Team-Dashboard-Komponenten
- `TeamDashboardStarter` - Team Starter Plan Features
- `TeamDashboardPro` - Team Pro Plan Features
- `EnterpriseTeamDashboard` - Team Enterprise Plan (bereits vorhanden, unverändert)

### Layout-Komponenten
- `UserDashboardLayout` - Server Component Layout für User-Dashboards
- `UserDashboardLayoutClient` - Client Component für User-Dashboard-Layout
- `UserDashboardSidebar` - Sidebar mit plan-spezifischer Navigation
- `UserDashboardHeader` - Header mit Theme-Toggle, Notifications, User-Menu
- `UserDashboardProvider` - Context Provider für User-Dashboard

## Feature-Matrix

### User Starter
- ✅ Dashboard
- ✅ Analytics
- ✅ Whiteboards
- ✅ Ziele
- ✅ Zeiterfassung
- ✅ AI Assistant
- ✅ Mehr (Upgrade-Hinweis)

### User Pro
- ✅ Dashboard
- ✅ Automations
- ✅ Analytics
- ✅ Integrations
- ✅ Dokumente
- ✅ Whiteboards
- ✅ Ziele
- ✅ Zeiterfassung
- ✅ AI Assistant
- ✅ Chatbots
- ✅ Mehr (Upgrade-Hinweis)

### User Enterprise
- ✅ Dashboard
- ✅ Workflows
- ✅ Automations
- ✅ Triggers
- ✅ Analytics
- ✅ Integrations
- ✅ Posteingang
- ✅ Dokumente
- ✅ Whiteboards
- ✅ Formulare
- ✅ Kunden
- ✅ Mail
- ✅ Ziele
- ✅ Zeiterfassung
- ✅ AI Assistant
- ✅ Chatbots
- ✅ Mehr

### Team Starter
- ✅ Dashboard
- ✅ Analytics
- ✅ Whiteboards
- ✅ Ziele
- ✅ Zeiterfassung
- ✅ Teams
- ✅ AI Assistant
- ✅ Mehr (Upgrade-Hinweis)

### Team Pro
- ✅ Dashboard
- ✅ Automations
- ✅ Analytics
- ✅ Integrations
- ✅ Dokumente
- ✅ Whiteboards
- ✅ Ziele
- ✅ Zeiterfassung
- ✅ Teams
- ✅ AI Assistant
- ✅ Chatbots
- ✅ Mehr (Upgrade-Hinweis)

### Team Enterprise
- ✅ Dashboard (bereits vorhanden, unverändert)
- ✅ Workflows
- ✅ Automations
- ✅ Triggers
- ✅ Analytics
- ✅ Integrations
- ✅ Posteingang
- ✅ Dokumente
- ✅ Whiteboards
- ✅ Formulare
- ✅ Kunden
- ✅ Mail
- ✅ Ziele
- ✅ Zeiterfassung
- ✅ Teams
- ✅ AI Assistant
- ✅ Chatbots
- ✅ Mehr

## Neue Dateien

### User-Dashboard
- `src/app/(app)/dashboard/user/config.ts`
- `src/app/(app)/dashboard/user/layout.tsx`
- `src/app/(app)/dashboard/user/_components/UserDashboardProvider.tsx`
- `src/app/(app)/dashboard/user/_components/UserDashboardLayoutClient.tsx`
- `src/app/(app)/dashboard/user/_components/UserDashboardSidebar.tsx`
- `src/app/(app)/dashboard/user/_components/UserDashboardHeader.tsx`
- `src/app/(app)/dashboard/user/_components/UserDashboardStarter.tsx`
- `src/app/(app)/dashboard/user/_components/UserDashboardPro.tsx`
- `src/app/(app)/dashboard/user/_components/UserDashboardEnterprise.tsx`

### Team-Dashboard
- `src/app/(app)/dashboard/team/_components/TeamDashboardStarter.tsx`
- `src/app/(app)/dashboard/team/_components/TeamDashboardPro.tsx`

### Geänderte Dateien
- `src/app/(app)/dashboard/user/starter/page.tsx` - Verwendet jetzt `UserDashboardStarter`
- `src/app/(app)/dashboard/user/pro/page.tsx` - Verwendet jetzt `UserDashboardPro`
- `src/app/(app)/dashboard/user/enterprise/page.tsx` - Verwendet jetzt `UserDashboardEnterprise`
- `src/app/(app)/dashboard/team/starter/page.tsx` - Verwendet jetzt `TeamDashboardStarter`
- `src/app/(app)/dashboard/team/pro/page.tsx` - Verwendet jetzt `TeamDashboardPro`

## Test-Anleitung

### 1. User mit Starter-Plan testen

**In Clerk Dashboard:**
1. Gehe zu einem User
2. Setze `publicMetadata.plan` auf `"starter"`
3. Setze `publicMetadata.isTeam` auf `false` (oder entferne es)

**Erwartetes Verhalten:**
- User wird zu `/dashboard/user/starter` weitergeleitet
- Sidebar zeigt nur Starter-Features: Dashboard, Analytics, Whiteboards, Ziele, Zeiterfassung, AI Assistant, Mehr, Einstellungen
- Upgrade-Hinweis wird angezeigt

### 2. User mit Pro-Plan testen

**In Clerk Dashboard:**
1. Gehe zu einem User
2. Setze `publicMetadata.plan` auf `"pro"`
3. Setze `publicMetadata.isTeam` auf `false`

**Erwartetes Verhalten:**
- User wird zu `/dashboard/user/pro` weitergeleitet
- Sidebar zeigt Pro-Features: Dashboard, Automations, Integrations, Analytics, Dokumente, Whiteboards, Ziele, Zeiterfassung, AI Assistant, Chatbots, Mehr, Einstellungen
- Upgrade-Hinweis auf Enterprise wird angezeigt

### 3. User mit Enterprise-Plan testen

**In Clerk Dashboard:**
1. Gehe zu einem User
2. Setze `publicMetadata.plan` auf `"enterprise"`
3. Setze `publicMetadata.isTeam` auf `false`

**Erwartetes Verhalten:**
- User wird zu `/dashboard/user/enterprise` weitergeleitet
- Sidebar zeigt alle Features, gruppiert nach Kategorien
- Kein Upgrade-Hinweis

### 4. Team mit Starter-Plan testen

**In Clerk Dashboard:**
1. Erstelle eine Organization
2. Setze `publicMetadata.plan` auf `"team_starter"` oder `"starter"`
3. Füge einen User zur Organization hinzu

**Erwartetes Verhalten:**
- User wird zu `/dashboard/team/starter` weitergeleitet
- Sidebar zeigt Team Starter-Features: Dashboard, Analytics, Whiteboards, Ziele, Zeiterfassung, Teams, AI Assistant, Mehr, Team-Einstellungen
- Upgrade-Hinweis wird angezeigt

### 5. Team mit Pro-Plan testen

**In Clerk Dashboard:**
1. Gehe zu einer Organization
2. Setze `publicMetadata.plan` auf `"team_pro"` oder `"pro"`
3. Stelle sicher, dass ein User Mitglied ist

**Erwartetes Verhalten:**
- User wird zu `/dashboard/team/pro` weitergeleitet
- Sidebar zeigt Team Pro-Features: Dashboard, Automations, Integrations, Analytics, Dokumente, Whiteboards, Ziele, Zeiterfassung, Teams, AI Assistant, Chatbots, Mehr, Team-Einstellungen
- Upgrade-Hinweis auf Enterprise wird angezeigt

### 6. Team mit Enterprise-Plan testen

**In Clerk Dashboard:**
1. Gehe zu einer Organization
2. Setze `publicMetadata.plan` auf `"team_enterprise"` oder `"enterprise"`
3. Stelle sicher, dass ein User Mitglied ist

**Erwartetes Verhalten:**
- User wird zu `/dashboard/team/enterprise` weitergeleitet
- Das bestehende `EnterpriseTeamDashboard` wird angezeigt (unverändert)
- Alle Features sind verfügbar

### 7. Zwischen User- und Team-Plan wechseln

**Option 1: Organization Switcher (wenn implementiert)**
- Verwende den Clerk Organization Switcher, um zwischen User- und Team-Kontext zu wechseln

**Option 2: Manuell in Clerk**
- Entferne User aus Organization → User-Dashboard
- Füge User zu Organization hinzu → Team-Dashboard

## Wichtige Hinweise

1. **Bestehender Code unverändert**: Das `EnterpriseTeamDashboard` wurde nicht verändert, nur wiederverwendet
2. **Additive Implementierung**: Alle neuen Komponenten sind zusätzlich zu bestehenden hinzugefügt worden
3. **Plan-Logik**: Die bestehende Plan-Logik in `get-current-plan.ts` wird verwendet, keine Änderungen
4. **Routing**: Die zentrale `/dashboard` Route leitet automatisch um basierend auf Plan und Account-Type

## Feature-Seiten

Alle Feature-Seiten für User-Dashboards wurden als Platzhalter erstellt:
- `/dashboard/user/analytics` ✅
- `/dashboard/user/whiteboards` ✅
- `/dashboard/user/goals` ✅
- `/dashboard/user/timesheets` ✅
- `/dashboard/user/ai-assistant` ✅
- `/dashboard/user/automations` ✅
- `/dashboard/user/integrations` ✅
- `/dashboard/user/documents` ✅
- `/dashboard/user/chatbots` ✅
- `/dashboard/user/workflows` ✅
- `/dashboard/user/triggers` ✅
- `/dashboard/user/inbox` ✅
- `/dashboard/user/forms` ✅
- `/dashboard/user/customers` ✅
- `/dashboard/user/mail` ✅
- `/dashboard/user/settings` ✅
- `/dashboard/user/more` ✅

Diese Seiten zeigen Platzhalter-Inhalte und können später mit echter Business-Logik gefüllt werden.

## Nächste Schritte

1. **Feature-Logik implementieren**: Die Platzhalter-Seiten können jetzt mit echter Business-Logik gefüllt werden
2. **Testing**: Alle Routen und Features sollten getestet werden
3. **Team-Feature-Seiten**: Falls Team-Feature-Seiten noch fehlen, können diese analog erstellt werden

## Bekannte Einschränkungen

- Die Feature-Seiten zeigen Platzhalter-Inhalte, die später mit echter Business-Logik gefüllt werden können
- Die Upgrade-CTAs verlinken auf `/preise` - diese Route sollte existieren
- Team-Feature-Seiten existieren bereits (z.B. `/dashboard/team/analytics`), da sie bereits im Team-Dashboard verwendet werden

