# Section-spezifische Box Colors und Secondary Colors

## Übersicht

Jede Funktionsseite hat jetzt drei spezifische Design-Tokens:
1. **Gradient** - Für Buttons, Highlights, Active-States
2. **Box Color** - Für Card-Hintergründe (subtile Farbakzente)
3. **Secondary Color** - Für Hover-States, Borders, Accents

## Verfügbare Tokens

### CSS-Variablen

#### Light Mode
- `--box-dashboard`, `--box-automations`, `--box-workflows`, etc.
- `--secondary-dashboard`, `--secondary-automations`, `--secondary-workflows`, etc.

#### Dark Mode
- Gleiche Variablennamen, aber mit angepassten Werten für bessere Lesbarkeit

## Verwendung in Komponenten

### React Hooks

```typescript
import { 
  useSectionGradient, 
  useSectionBoxColor, 
  useSectionSecondaryColor 
} from "@/lib/sectionGradients";

function MyComponent() {
  const gradient = useSectionGradient();        // Für Buttons
  const boxColor = useSectionBoxColor();        // Für Card-Backgrounds
  const secondaryColor = useSectionSecondaryColor(); // Für Hover/Borders
  
  return (
    <Card style={{ background: boxColor }}>
      <Button style={{ background: gradient }}>
        Action
      </Button>
    </Card>
  );
}
```

### Direkte CSS-Variablen

```tsx
<div className="section-box-card" style={{ 
  background: "var(--box-analytics)",
  borderColor: "var(--secondary-analytics)"
}}>
  Content
</div>
```

### Utility-Funktionen

```typescript
import { 
  getSectionBoxColor, 
  getSectionSecondaryColor 
} from "@/lib/sectionGradients";

const boxColor = getSectionBoxColor("/analytics");
const secondaryColor = getSectionSecondaryColor("/analytics");
```

## Beispiele

### Card mit Section-Box-Color

```tsx
import { useSectionBoxColor } from "@/lib/sectionGradients";

function AnalyticsCard() {
  const boxColor = useSectionBoxColor();
  
  return (
    <Card style={{ background: boxColor }}>
      <CardContent>
        Analytics Content
      </CardContent>
    </Card>
  );
}
```

### Button mit Hover-Effekt (Secondary Color)

```tsx
import { useSectionSecondaryColor } from "@/lib/sectionGradients";

function SectionButton() {
  const secondaryColor = useSectionSecondaryColor();
  
  return (
    <Button 
      className="hover:border-2 transition-colors"
      style={{ 
        borderColor: secondaryColor 
      }}
    >
      Click me
    </Button>
  );
}
```

### Border mit Secondary Color

```tsx
import { useSectionSecondaryColor } from "@/lib/sectionGradients";

function HighlightedBox() {
  const secondaryColor = useSectionSecondaryColor();
  
  return (
    <div 
      className="p-4 rounded-lg"
      style={{ 
        border: `2px solid ${secondaryColor}`,
        background: "var(--glass-card-bg)"
      }}
    >
      Highlighted Content
    </div>
  );
}
```

## Design-Prinzipien

1. **Box Colors**: Subtile Hintergrundfarben (8-12% Opacity) für Cards
2. **Secondary Colors**: Stärkere Akzente (15-20% Opacity) für Hover, Borders
3. **Gradients**: Für primäre Aktionen (Buttons, Active-States)

## Alle verfügbaren Sections

- `/dashboard` - Grün
- `/automations` - Orange
- `/workflows` - Blau
- `/triggers` - Gelb
- `/analytics` - Lila
- `/integrations` - Türkis
- `/inbox` - Blau
- `/documents` - Lila-Grün
- `/whiteboard` - Orange-Grün
- `/forms` - Pink
- `/customers` - Grün-Blau
- `/mail` - Blau-Pink
- `/goals` - Gelb-Grün
- `/timesheets` - Orange-Pink
- `/team` - Blau-Grün

