# GitHub Setup Anleitung

## Schritt 1: GitHub Repository erstellen

1. Gehe zu [GitHub.com](https://github.com) und logge dich ein
2. Klicke auf das "+" Symbol oben rechts → "New repository"
3. Gib einen Repository-Namen ein (z.B. `arvo-labs-website`)
4. Wähle **Public** oder **Private**
5. **WICHTIG:** Füge KEINE README, .gitignore oder License hinzu (das haben wir schon)
6. Klicke auf "Create repository"

## Schritt 2: Lokales Repository mit GitHub verbinden

Nachdem du das Repository auf GitHub erstellt hast, führe diese Befehle aus:

```bash
# Ersetze USERNAME und REPO_NAME mit deinen GitHub-Daten
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Beispiel:
# git remote add origin https://github.com/adrianthome/arvo-labs-website.git
```

## Schritt 3: Code zu GitHub pushen

```bash
# Branch auf 'main' umbenennen (falls nötig)
git branch -M main

# Code zu GitHub pushen
git push -u origin main
```

## Alternative: Mit SSH (wenn du SSH-Keys eingerichtet hast)

```bash
git remote add origin git@github.com:USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Nächste Schritte

Nach dem ersten Push kannst du zukünftige Änderungen so pushen:

```bash
# Änderungen hinzufügen
git add .

# Commit erstellen
git commit -m "Beschreibung deiner Änderungen"

# Zu GitHub pushen
git push
```

## Git-Konfiguration (optional, aber empfohlen)

Falls du deine Git-Identität noch nicht konfiguriert hast:

```bash
git config --global user.name "Dein Name"
git config --global user.email "deine.email@example.com"
```

