# Pure Craft — AI Appointment Setting

**samipkc.com.np**

Premium, minimalist white-themed website for Pure Craft AI Appointment Setting service.

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#FFFFFF` | Main background |
| `--foreground` | `#0B0B0B` | Primary text |
| `--surface-1/2/3` | White to light gray | Layered surfaces |
| `--text-primary/secondary/tertiary/muted` | Gray scale | Text hierarchy |
| `--charcoal` | `#1F1F1F` | Accent elements |
| `--glass-bg` | `rgba(255,255,255,0.6)` | Glass surfaces |

### Shadows
| Token | Usage |
|-------|-------|
| `shadow-depth-1` | Subtle elevation |
| `shadow-depth-2` | Cards, buttons |
| `shadow-depth-3` | Hover states |
| `shadow-depth-4` | Prominent elements |
| `shadow-glow` | Ambient glow |

### Typography
| Token | Font | Usage |
|-------|------|-------|
| `font-serif` | Playfair Display | Headlines, display |
| `font-sans` | Inter | Body, UI |

### Motion
| Token | Duration | Usage |
|-------|----------|-------|
| `--duration-short` | 160ms | Micro-interactions |
| `--duration-medium` | 320ms | Transitions |
| `--duration-long` | 640ms | Complex animations |

### Easings
- `--ease-out-cubic`: Smooth deceleration
- `--ease-in-out-quad`: Balanced transitions

### Bento Grid
- `.bento-2x2`: 2-column grid
- `.bento-3x3`: 3-column grid
- `.bento-asymmetric`: Feature layout (2:1 ratio)

## Accessibility Features

- ✅ Skip to main content link
- ✅ Proper heading hierarchy
- ✅ Focus-visible outlines
- ✅ `prefers-reduced-motion` respected
- ✅ Base font-size 16px
- ✅ ARIA labels on interactive elements
- ✅ Semantic HTML structure

## Acceptance Checklist

- [x] Design tokens exist in `index.css` and `tailwind.config.ts`
- [x] Fonts load via Google Fonts with `display=swap`
- [x] `useReducedMotion` hook implemented and used
- [x] No inline hex colors (all via CSS variables)
- [x] Glass effects use blur + opacity
- [x] Shadows provide layered depth
- [x] Bento grid with multiple variants
- [x] SiteShell provides consistent layout
- [x] All animations respect reduced motion preference

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── SiteShell.tsx    # Global layout wrapper
│   │   ├── Navigation.tsx   # Fixed header with glass effect
│   │   └── Footer.tsx       # Site footer
│   └── sections/
│       ├── Hero.tsx         # Landing hero section
│       ├── BentoGrid.tsx    # Feature grid showcase
│       ├── TwoColumn.tsx    # About/benefits section
│       └── Contact.tsx      # CTA contact section
├── hooks/
│   └── useReducedMotion.ts  # Accessibility hook
├── lib/
│   └── design-tokens.ts     # Exported token values
├── pages/
│   └── Index.tsx            # Main page composition
└── index.css                # Global styles & CSS variables
```

## Performance Notes

- Fonts preconnected for faster loading
- CSS variables for minimal runtime style recalculation
- Framer Motion animations skip when reduced motion preferred
- Shadow tokens use optimized rgba values
- Glassmorphism used sparingly for GPU efficiency
