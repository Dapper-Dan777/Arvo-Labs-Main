# Section-spezifische Gradient-System Dokumentation

## Übersicht

Das Dashboard verwendet section-spezifische Gradients für die Sidebar-Navigation im Active-State. Jede Haupt-Section hat einen eigenen, entsättigten Gradient, der auf rein schwarzem (#000000) bzw. rein weißem (#FFFFFF) Hintergrund optimal aussieht.

## Theme-System

### Basis-Farben

**Dark Mode:**
- Hintergrund: `#000000`
- Text Primär: `#FFFFFF`

**Light Mode:**
- Hintergrund: `#FFFFFF`
- Text Primär: `#000000`

### Section-Gradients

Alle Gradients sind als CSS-Variablen in `src/index.css` definiert:

```css
/* Standard-Gradients */
--gradient-primary: linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%);
--gradient-neutral: linear-gradient(135deg, #4B5563 0%, #6B7280 50%, #9CA3AF 100%);

/* Section-spezifische Gradients */
--gradient-dashboard: linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #0D9488 100%);
--gradient-automations: linear-gradient(135deg, #F97316 0%, #EA580C 50%, #DB2777 100%);
--gradient-workflows: linear-gradient(135deg, #38BDF8 0%, #0EA5E9 50%, #6366F1 100%);
/* ... weitere Sections */
```

**Hinweis:** Im Dark Mode sind die Gradients leicht entsättigt (10-15% weniger Sättigung) für bessere Lesbarkeit auf #000.

## Route-zu-Gradient-Mapping

Das Mapping erfolgt in `src/components/layout/AppSidebar.tsx`:

```typescript
const routeGradientMap: Record<string, string> = {
  "/dashboard": "var(--gradient-dashboard)",
  "/automations": "var(--gradient-automations)",
  "/workflows": "var(--gradient-workflows)",
  // ... weitere Routes
};
```

Die Funktion `getGradientForRoute()` ermittelt automatisch den passenden Gradient:
1. Prüft exakte Route-Matches
2. Prüft Route-Prefixes (z.B. `/workflows/marketing` → `/workflows`)
3. Fallback auf `--gradient-primary`

## Sidebar-Navigation

### Inaktive Items

- **Dark Mode:** Transparenter Hintergrund, weißer Text
- **Light Mode:** Transparenter Hintergrund, schwarzer Text
- **Hover:** Leichtes Glass-Effekt-Highlight

### Aktive Items

- **Background:** Section-spezifischer Gradient (via inline `style`)
- **Text & Icons:** Immer weiß (#FFFFFF) mit Text-Shadow für Lesbarkeit
- **Border-Radius:** Pill-Form (`9999px` / `var(--radius-pill)`)
- **Shadow:** Subtiler Schatten für Tiefe

### Implementierung

```tsx
<Link
  to={item.href}
  className={cn(
    "nav-item text-sm h-9",
    active && "nav-item-active"
  )}
  style={active ? { background: gradient } : undefined}
>
  <Icon className="h-4 w-4 shrink-0" />
  <span>{item.label}</span>
</Link>
```

## Neue Sections hinzufügen

### 1. CSS-Variable definieren

In `src/index.css` unter `@layer base`:

```css
[data-theme="light"] {
  --gradient-neue-section: linear-gradient(135deg, #FARBE1 0%, #FARBE2 50%, #FARBE3 100%);
}

[data-theme="dark"] {
  /* Leicht entsättigt für Dark Mode */
  --gradient-neue-section: linear-gradient(135deg, #FARBE1_ENTSAETTIGT 0%, #FARBE2_ENTSAETTIGT 50%, #FARBE3_ENTSAETTIGT 100%);
}
```

### 2. Route-Mapping erweitern

In `src/components/layout/AppSidebar.tsx`:

```typescript
const routeGradientMap: Record<string, string> = {
  // ... bestehende Einträge
  "/neue-section": "var(--gradient-neue-section)",
};
```

### 3. Nav-Item hinzufügen

Im `navItems` Array:

```typescript
{ icon: IconComponent, label: "Neue Section", href: "/neue-section" },
```

## Verwendung in anderen Komponenten

### Primary-Buttons pro Section

```tsx
<button
  className="glass-button-primary"
  style={{ background: "var(--gradient-dashboard)" }}
>
  Dashboard Action
</button>
```

### Badges/Chips

```tsx
<div
  className="px-3 py-1 rounded-full text-white font-medium"
  style={{ background: "var(--gradient-analytics)" }}
>
  Analytics Badge
</div>
```

### Highlight-Cards

```tsx
<div
  className="p-4 rounded-lg text-white"
  style={{ background: "var(--gradient-workflows)" }}
>
  <h3>Workflow Highlight</h3>
</div>
```

## Best Practices

1. **Konsistenz:** Nutze immer die CSS-Variablen, nie harte Farben
2. **Lesbarkeit:** Text auf Gradients immer weiß mit Text-Shadow
3. **Entsättigung:** Im Dark Mode Gradients leicht entsättigen (10-15%)
4. **Pill-Form:** Sidebar-Items nutzen `border-radius: 9999px` für modernen Look
5. **Smooth Transitions:** Alle Hover/Active-States mit `transition-all duration-200`

## Technische Details

- **Theme-Toggle:** `data-theme="dark"` / `data-theme="light"` auf `<html>`
- **CSS-Variablen:** Alle in `src/index.css` unter `@layer base`
- **Tailwind-Integration:** Variablen sind über `var(--variable-name)` nutzbar
- **Glass-Effekte:** `backdrop-filter: blur()` für Sidebar und Cards

