# Theme-System Dokumentation

## Übersicht

Das Dashboard verwendet ein semantisches Design-Token-System basierend auf CSS-Variablen und dem `data-theme`-Attribut. Das System unterstützt Dark- und Light-Mode ohne Änderungen an der Komponentenlogik.

## Theme-Toggle

Der Theme-Wechsel erfolgt über das `data-theme`-Attribut auf dem `<html>`-Element:
- `data-theme="light"` für Light Mode
- `data-theme="dark"` für Dark Mode

### Implementierung

Der Theme-Toggle befindet sich in der Topbar (`src/components/layout/Topbar.tsx`):

```typescript
const toggleTheme = () => {
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};
```

Die Theme-Präferenz wird im `localStorage` gespeichert und beim App-Start automatisch geladen (`src/main.tsx`).

## Design Tokens

Alle Theme-Farben sind als semantische CSS-Variablen in `src/index.css` definiert.

### Hintergrund-Farben

```css
--color-bg-page        /* Haupt-Hintergrund */
--color-bg-panel       /* Panel-Hintergrund */
```

### Text-Farben

```css
--color-text-primary    /* Primärer Text */
--color-text-secondary  /* Sekundärer Text */
--color-text-disabled   /* Deaktivierter/Hint-Text */
```

### Glass-Effekte

```css
--glass-card-bg        /* Glass-Hintergrund für Cards */
--glass-sidebar-bg     /* Glass-Hintergrund für Sidebar/Navbar */
--color-border-glass   /* Glass-Border-Farbe */
```

### Brand-Farben

```css
--color-brand-primary        /* Primäre Brand-Farbe */
--color-brand-primary-soft   /* Weiche Variante */
--color-brand-secondary      /* Sekundäre Brand-Farbe */
```

### Status-Farben

```css
--color-success  /* Erfolg */
--color-warning  /* Warnung */
--color-error    /* Fehler */
--color-info     /* Information */
```

### Gradients

```css
--gradient-bg          /* Hintergrund-Gradient */
--gradient-brand-glow  /* Brand-Glow-Gradient */
```

## Verwendung in Komponenten

### CSS/SCSS

Verwende direkt die CSS-Variablen:

```css
.my-component {
  background: var(--color-bg-panel);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-glass);
}
```

### Tailwind CSS

Die Tokens sind bereits in Tailwind integriert. Verwende die Standard-Tailwind-Klassen:

```tsx
<div className="bg-background text-foreground border-border">
  {/* Inhalt */}
</div>
```

### Glass-Effekte

Für Glassmorphism-Effekte nutze die vordefinierten Klassen:

```tsx
<div className="glass-card">
  {/* Card-Inhalt */}
</div>

<div className="glass-panel">
  {/* Panel-Inhalt */}
</div>
```

### Direkte Token-Verwendung in Inline-Styles

```tsx
<div style={{ 
  background: 'var(--glass-card-bg)',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border-glass)'
}}>
  {/* Inhalt */}
</div>
```

## Neue Komponenten erstellen

### 1. Verwende semantische Tokens

**❌ Falsch:**
```tsx
<div className="bg-[#050712] text-[#F9FAFB]">
  {/* Harte Farben */}
</div>
```

**✅ Richtig:**
```tsx
<div className="bg-background text-foreground">
  {/* Semantische Tokens */}
</div>
```

### 2. Glass-Effekte nutzen

**✅ Empfohlen:**
```tsx
<div className="glass-card">
  <h3 className="text-foreground">Titel</h3>
  <p className="text-muted-foreground">Beschreibung</p>
</div>
```

### 3. Status-Farben

**✅ Empfohlen:**
```tsx
<div className="bg-success text-success-foreground">
  Erfolg
</div>

<div className="bg-warning text-warning-foreground">
  Warnung
</div>

<div className="bg-destructive text-destructive-foreground">
  Fehler
</div>
```

## Theme-spezifische Anpassungen

Falls du theme-spezifische Styles benötigst, nutze den `data-theme`-Selector:

```css
[data-theme="dark"] .my-component {
  /* Dark Mode spezifische Styles */
}

[data-theme="light"] .my-component {
  /* Light Mode spezifische Styles */
}
```

**Hinweis:** Vermeide theme-spezifische Styles, wenn möglich. Nutze stattdessen die semantischen Tokens, die automatisch für beide Themes funktionieren.

## Best Practices

1. **Keine harten Farben**: Verwende immer die CSS-Variablen oder Tailwind-Klassen
2. **Semantische Namen**: Nutze `--color-text-primary` statt `--color-white`
3. **Glass-Effekte**: Nutze die vordefinierten `.glass-card` und `.glass-panel` Klassen
4. **Konsistenz**: Halte dich an die definierten Tokens für ein konsistentes Design

## Token-Übersicht

### Dark Theme Werte

- `--color-bg-page`: `#050712`
- `--color-bg-panel`: `#070b18`
- `--color-text-primary`: `#F9FAFB`
- `--color-text-secondary`: `#9CA3AF`
- `--color-text-disabled`: `#6B7280`
- `--glass-card-bg`: `rgba(255,255,255,0.10)`
- `--glass-sidebar-bg`: `rgba(5,7,18,0.70)`
- `--color-border-glass`: `rgba(255,255,255,0.25)`
- `--color-brand-primary`: `#3B82F6`
- `--color-brand-primary-soft`: `#1D4ED8`
- `--color-brand-secondary`: `#14B8A6`

### Light Theme Werte

- `--color-bg-page`: `#F3F4F6`
- `--color-bg-panel`: `#E5E7EB`
- `--color-text-primary`: `#111827`
- `--color-text-secondary`: `#4B5563`
- `--color-text-disabled`: `#9CA3AF`
- `--glass-card-bg`: `rgba(255,255,255,0.75)`
- `--glass-sidebar-bg`: `rgba(243,244,246,0.85)`
- `--color-border-glass`: `rgba(148,163,184,0.55)`
- `--color-brand-primary`: `#2563EB`
- `--color-brand-primary-soft`: `#93C5FD`
- `--color-brand-secondary`: `#0D9488`

## Migration bestehender Komponenten

Wenn du bestehende Komponenten migrieren möchtest:

1. **Suche nach harten Farben**: `#050712`, `#F9FAFB`, etc.
2. **Ersetze durch Tokens**: Nutze die entsprechenden CSS-Variablen
3. **Prüfe `.dark` Klassen**: Ersetze durch `data-theme` Selektoren oder entferne, wenn Tokens verwendet werden
4. **Teste beide Themes**: Stelle sicher, dass alles in Dark und Light Mode funktioniert

## Support

Bei Fragen zum Theme-System, siehe `src/index.css` für alle verfügbaren Tokens.

