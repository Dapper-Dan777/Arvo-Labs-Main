# Git-Befehle zum Pushen

## Alle Änderungen pushen:

```bash
cd "/Users/adrianthome/Test - WEbsite"

# Alle geänderten Dateien hinzufügen
git add .

# Commit erstellen (mit Beschreibung)
git commit -m "Beschreibung deiner Änderungen"

# Zu GitHub pushen
git push
```

## Schritt für Schritt:

### 1. Status prüfen (was wurde geändert?)
```bash
git status
```

### 2. Bestimmte Dateien hinzufügen
```bash
git add dateiname.tsx
# oder mehrere Dateien:
git add src/pages/Index.tsx src/components/Header.tsx
```

### 3. Alle Änderungen hinzufügen
```bash
git add .
```

### 4. Commit erstellen
```bash
git commit -m "Kurze Beschreibung der Änderungen"
```

### 5. Zu GitHub pushen
```bash
git push
```

## Beispiel-Workflow:

```bash
# 1. Ins Projekt-Verzeichnis wechseln
cd "/Users/adrianthome/Test - WEbsite"

# 2. Status anzeigen
git status

# 3. Alle Änderungen hinzufügen
git add .

# 4. Commit erstellen
git commit -m "Update: Neue Features hinzugefügt"

# 5. Zu GitHub pushen
git push
```

## Nützliche Zusatz-Befehle:

### Änderungen anzeigen (vor dem Commit)
```bash
git diff
```

### Commit-Historie anzeigen
```bash
git log --oneline
```

### Letzten Commit rückgängig machen (aber Änderungen behalten)
```bash
git reset --soft HEAD~1
```

### Remote-Repository prüfen
```bash
git remote -v
```

