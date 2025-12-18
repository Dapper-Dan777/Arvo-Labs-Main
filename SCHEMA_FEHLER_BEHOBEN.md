# ✅ Schema-Fehler behoben

## Was war das Problem?

Du hast den Fehler bekommen:
```
ERROR: 42710: policy "Users can view own profile" for table "profiles" already exists
```

**Das bedeutet:** Die Policies existieren bereits (wahrscheinlich von einem vorherigen Versuch).

## ✅ Lösung

Ich habe das Script angepasst, damit es:
1. Zuerst die Policies/Trigger löscht (falls vorhanden)
2. Dann neu erstellt

**Das Script kann jetzt sicher mehrfach ausgeführt werden!**

## 🔄 Nächste Schritte

1. **Kopiere das aktualisierte Script** aus `supabase-complete-schema.sql`
2. **Führe es nochmal aus** im Supabase SQL Editor
3. **Es sollte jetzt ohne Fehler durchlaufen**

## ✅ Was passiert jetzt?

- ✅ Tabellen werden erstellt (falls nicht vorhanden)
- ✅ Policies werden gelöscht und neu erstellt
- ✅ Trigger werden gelöscht und neu erstellt
- ✅ Funktionen werden aktualisiert (`CREATE OR REPLACE`)

## 🎯 Prüfen ob es funktioniert hat

Nach dem Ausführen:

1. Gehe zu **Table Editor**
2. Prüfe, ob beide Tabellen existieren:
   - ✅ `profiles`
   - ✅ `subscriptions`

3. Prüfe eine Tabelle (z.B. `profiles`):
   - Klicke auf `profiles`
   - Du solltest alle Spalten sehen

## 🐛 Falls immer noch Fehler

Falls du immer noch Fehler bekommst:

1. **Lösche manuell die Policies** (falls nötig):
   ```sql
   DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
   DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
   DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
   DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
   ```

2. **Dann führe das komplette Script nochmal aus**

## ✅ Fertig!

Wenn das Script ohne Fehler durchläuft, ist alles bereit!



