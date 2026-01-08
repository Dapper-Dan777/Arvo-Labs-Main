# Kunden-Datenbank - Implementierung

Die Kunden-Datenbank wurde erfolgreich in das Arvo Labs Dashboard integriert.

## ✅ Implementierte Features

### 1. Datenbank Schema
- ✅ SQL-Migration für `customers` Tabelle in `docs/SUPABASE_SETUP.md`
- ✅ Row Level Security (RLS) Policies
- ✅ Automatische Timestamp-Updates

### 2. Backend-Funktionen
- ✅ `src/lib/supabaseClient.ts` - Supabase Client Konfiguration
- ✅ `src/lib/customers.ts` - CRUD-Funktionen mit Supabase + lokaler Storage Fallback
- ✅ Automatischer Fallback zu lokalem Storage, falls Supabase nicht konfiguriert ist

### 3. UI & Frontend
- ✅ `src/pages/CustomersPage.tsx` - Vollständige CRUD-Oberfläche
- ✅ Responsive Design mit Shadcn/ui Komponenten
- ✅ Formular-Validierung
- ✅ Loading- und Error-States
- ✅ Statistik-Karten (Gesamt, Mit E-Mail, Mit Telefon)

### 4. Navigation & Routing
- ✅ Navigation-Menüpunkt "Kunden" in Sidebar
- ✅ Route `/customers` in App.tsx
- ✅ Seitentitel in Topbar

## 🚀 Setup-Anleitung

### Schritt 1: Supabase Projekt einrichten (Optional)

Falls du Supabase verwenden möchtest:

1. Erstelle ein Projekt auf [supabase.com](https://supabase.com)
2. Kopiere URL und Anon Key aus den Projekt-Einstellungen
3. Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-key
```

4. Führe das SQL-Script aus `docs/SUPABASE_SETUP.md` im Supabase SQL Editor aus

### Schritt 2: Lokaler Storage (Fallback)

Falls Supabase **nicht** konfiguriert ist, funktioniert die Kunden-Datenbank automatisch mit lokalem Storage. Die Daten werden verschlüsselt in `localStorage` gespeichert.

## 📋 Verwendete Technologien

- **Supabase**: Datenbank & Backend (optional)
- **React + TypeScript**: Frontend
- **Shadcn/ui**: UI-Komponenten
- **date-fns**: Datum-Formatierung
- **React Hook Form** (vorbereitet für zukünftige Erweiterungen)

## 🔒 Sicherheit

### Mit Supabase:
- Row Level Security (RLS) sorgt dafür, dass Benutzer nur ihre eigenen Kunden sehen/bearbeiten/löschen können
- Alle Queries prüfen `owner_id = auth.uid()`
- Policies für SELECT, INSERT, UPDATE, DELETE implementiert

### Mit lokalem Storage:
- Daten werden verschlüsselt gespeichert (über `crypto.ts`)
- Jeder Benutzer hat seinen eigenen Namespace im Storage

## 📝 Datenstruktur

```typescript
interface Customer {
  id: string;                    // UUID
  owner_id: string;              // User ID
  company_name: string;          // Pflichtfeld
  contact_name?: string;         // Optional
  email?: string;                // Optional
  phone?: string;                // Optional
  notes?: string;                // Optional
  created_at: string;            // ISO Timestamp
  updated_at: string;            // ISO Timestamp
}
```

## 🎨 UI-Features

- **Kundenliste**: Tabellenansicht mit allen Informationen
- **Statistik-Karten**: Übersicht über Gesamtanzahl, E-Mail- und Telefon-Kontakte
- **Create Dialog**: Formular zum Erstellen neuer Kunden
- **Edit Dialog**: Formular zum Bearbeiten bestehender Kunden
- **Delete Dialog**: Bestätigungs-Dialog zum Löschen
- **Validierung**: E-Mail-Format-Validierung, Pflichtfelder

## 🔄 Erweiterungen

Die Struktur ist erweiterbar für:
- Export-Funktionalität (CSV, PDF)
- Filter & Suche
- Pagination
- Bulk-Operationen
- Kunden-Tags/Kategorien
- Verknüpfungen mit anderen Modulen (Workflows, Rechnungen, etc.)

## 📌 Anpassungen

Wenn du die Kunden-Datenbank anpassen möchtest:

1. **Weitere Felder hinzufügen**:
   - Erweitere die SQL-Migration in `docs/SUPABASE_SETUP.md`
   - Aktualisiere `Customer` und `CustomerInput` Interfaces in `src/lib/supabaseClient.ts`
   - Füge Formularfelder in `src/pages/CustomersPage.tsx` hinzu

2. **Auth-Integration**:
   - Aktuell verwendet die App lokales Auth-System
   - Für Supabase Auth: Passe `src/contexts/AuthContext.tsx` an oder nutze Hybrid-Lösung

## ⚠️ Wichtige Hinweise

1. **Umgebungsvariablen**: Die `.env` Datei muss im Root-Verzeichnis liegen
2. **Supabase Auth**: Falls du Supabase Auth verwendest, muss der `owner_id` mit `auth.users(id)` verknüpft sein
3. **Lokaler Storage**: Daten im lokalen Storage sind pro Browser/Benutzer - bei Supabase werden sie serverseitig gespeichert

## 🐛 Troubleshooting

**Problem**: Kunden werden nicht gespeichert
- Prüfe Browser-Konsole auf Fehler
- Prüfe ob Supabase konfiguriert ist oder lokaler Storage verwendet wird
- Prüfe RLS Policies in Supabase (falls verwendet)

**Problem**: Keine Daten werden angezeigt
- Prüfe ob User eingeloggt ist (`user?.id` muss existieren)
- Prüfe Browser-Konsole auf Fehler
- Prüfe ob Daten im lokalen Storage oder Supabase vorhanden sind







