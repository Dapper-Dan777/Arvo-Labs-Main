# Custom Fields Schema für Customers

## Supabase Schema Erweiterung

Falls du Supabase verwendest, führe diese SQL-Befehle im Supabase SQL Editor aus, um das `custom_fields` JSONB-Feld zur `customers` Tabelle hinzuzufügen:

```sql
-- Füge custom_fields Spalte hinzu (JSONB für flexible Daten)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- Erstelle einen Index für bessere Performance bei JSONB-Queries
CREATE INDEX IF NOT EXISTS idx_customers_custom_fields 
ON customers USING GIN (custom_fields);

-- Optional: Kommentar hinzufügen
COMMENT ON COLUMN customers.custom_fields IS 'Benutzerdefinierte Felder als JSON-Objekt gespeichert';
```

## Funktionsweise

1. **Custom Fields Definitionen**: Werden pro User in lokalem Storage oder (optional) in einer separaten Supabase-Tabelle gespeichert
2. **Customer Custom Fields**: Werden im `custom_fields` JSONB-Feld gespeichert
3. **Dynamische UI**: Die Tabelle und Formulare passen sich automatisch an die definierten Felder an

## Unterstützte Feldtypen

- **text**: Text-Eingabe
- **number**: Zahlen-Eingabe
- **date**: Datums-Eingabe
- **boolean**: Ja/Nein (Dropdown)
- **dropdown**: Dropdown mit benutzerdefinierten Optionen







