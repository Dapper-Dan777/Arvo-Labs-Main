// ============================================================
// PREMIUM DESIGN TOKENS - 100.000€ Design System
// ============================================================

export const designTokens = {
  colors: {
    // Primary Gradient
    primary: {
      start: '#6366f1', // Indigo
      middle: '#8b5cf6', // Purple
      end: '#ec4899', // Pink
    },
    // Text Colors
    text: {
      primary: '#0f172a', // Dark slate
      primaryDark: '#f8fafc', // Light slate
      secondary: '#64748b', // Slate 500
      secondaryDark: '#94a3b8', // Slate 400
      muted: '#94a3b8', // Slate 400
    },
    // Background Colors
    background: {
      light: '#fafbfc',
      lightSecondary: '#f8fafc',
      lightTertiary: '#f1f5f9',
      dark: '#050505',
      darkSecondary: '#0a0a0a',
      darkTertiary: '#0f172a',
    },
    // Card Colors
    card: {
      light: 'rgba(255, 255, 255, 0.8)',
      lightHover: 'rgba(255, 255, 255, 0.9)',
      dark: 'rgba(10, 10, 10, 0.8)',
      darkHover: 'rgba(10, 10, 10, 0.9)',
    },
    // Border Colors
    border: {
      light: 'rgba(0, 0, 0, 0.02)',
      lightHover: 'rgba(0, 0, 0, 0.06)',
      dark: 'rgba(255, 255, 255, 0.02)',
      darkHover: 'rgba(255, 255, 255, 0.06)',
    },
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },
  typography: {
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      base: ['1rem', { lineHeight: '1.5rem' }], // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      '5xl': ['3rem', { lineHeight: '1' }], // 48px
      '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
      '7xl': ['4.5rem', { lineHeight: '1' }], // 72px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: '-0.05em',
      tighter: '-0.08em',
      wide: '0.1em',
      wider: '0.15em',
      widest: '0.2em',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    premium: '0 32px 100px rgba(0, 0, 0, 0.18)',
    premiumDark: '0 32px 100px rgba(0, 0, 0, 0.7)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  borderRadius: {
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '1.75rem', // 28px
    '3xl': '2rem', // 32px
  },
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
  blur: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    '3xl': '40px',
  },
} as const;
