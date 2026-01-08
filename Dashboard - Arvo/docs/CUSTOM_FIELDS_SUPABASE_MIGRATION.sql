-- Migration: Custom Fields für Customers Tabelle
-- Führe diese SQL-Befehle im Supabase SQL Editor aus

-- Füge custom_fields Spalte hinzu (JSONB für flexible Daten)
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- Erstelle einen Index für bessere Performance bei JSONB-Queries
CREATE INDEX IF NOT EXISTS idx_customers_custom_fields 
ON customers USING GIN (custom_fields);

-- Optional: Kommentar hinzufügen
COMMENT ON COLUMN customers.custom_fields IS 'Benutzerdefinierte Felder als JSON-Objekt gespeichert (z.B. prio, ziel_preis, notiz)';

-- Beispiel-Werte für custom_fields:
-- {
--   "prio": "Hoch",
--   "ziel_preis": 5000,
--   "notiz": "Wichtiger Kunde"
-- }







