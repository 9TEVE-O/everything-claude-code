---
name: frontend-design
description: UI design patterns for design systems, design tokens, CSS/Tailwind, responsive layout, dark mode, and visual hierarchy. Installed from claude-plugins-official.
origin: claude-plugins-official
---

# Frontend Design Patterns

Visual design patterns for building polished, consistent, accessible UIs with design systems, tokens, and CSS.

## When to Activate

- Building or extending a design system
- Implementing design tokens (colors, typography, spacing)
- Writing CSS or Tailwind utility classes
- Creating responsive layouts with Grid and Flexbox
- Implementing dark mode or theme switching
- Designing visual component states (hover, focus, disabled, loading)
- Reviewing or improving visual hierarchy and spacing
- Working with icons, illustrations, or imagery in UI

## Design Tokens

### Color System

```css
:root {
  /* Primitives */
  --color-blue-50:  #eff6ff;
  --color-blue-100: #dbeafe;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-blue-900: #1e3a8a;

  /* Semantic tokens */
  --color-brand-primary:    var(--color-blue-600);
  --color-brand-hover:      var(--color-blue-500);
  --color-text-primary:     #111827;
  --color-text-secondary:   #6b7280;
  --color-text-muted:       #9ca3af;
  --color-surface-base:     #ffffff;
  --color-surface-subtle:   #f9fafb;
  --color-border:           #e5e7eb;
}

.dark,
[data-theme="dark"] {
  --color-brand-primary:  var(--color-blue-500);
  --color-text-primary:   #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-surface-base:   #111827;
  --color-surface-subtle: #1f2937;
  --color-border:         #374151;
}
```

### Typography Scale

```css
:root {
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.875rem;  /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg:   1.125rem;  /* 18px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */
  --text-4xl:  2.25rem;   /* 36px */

  --leading-tight:   1.25;
  --leading-snug:    1.375;
  --leading-normal:  1.5;
  --leading-relaxed: 1.625;

  --font-normal:   400;
  --font-medium:   500;
  --font-semibold: 600;
  --font-bold:     700;
}
```

### Spacing Scale

```css
:root {
  /* 4px base unit */
  --space-1:  0.25rem;  /*  4px */
  --space-2:  0.5rem;   /*  8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
}
```

## Tailwind Patterns

### Component Variants with cva

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const button = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:     'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
        secondary:   'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400',
        ghost:       'hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-400',
        destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        outline:     'border border-gray-200 bg-white hover:bg-gray-50 focus-visible:ring-gray-400',
      },
      size: {
        sm:   'h-8 px-3 text-sm',
        md:   'h-10 px-4 text-sm',
        lg:   'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={button({ variant, size, className })} {...props} />
}
```

### Responsive Layout

```tsx
// Mobile-first responsive grid
export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map(item => <ProductCard key={item.id} product={item} />)}
    </div>
  )
}

// Sidebar + main shell
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r lg:block"><Sidebar /></aside>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}

// Max-width content wrapper
export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
  )
}
```

## Visual States

```tsx
// Clickable card with hover lift
export function ClickableCard({ children, onClick }: ClickableCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
    >
      {children}
    </div>
  )
}

// Skeleton loading placeholder
export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
      <div className="mb-2 h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-5/6 rounded bg-gray-200" />
    </div>
  )
}
```

## Dark Mode

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class', // or 'media' for OS preference
}

// Component supporting dark mode
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {children}
    </div>
  )
}

// Theme toggle hook
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return (
      (localStorage.getItem('theme') as 'light' | 'dark') ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    )
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return {
    theme,
    setTheme,
    toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light')),
  }
}
```

## Layout Patterns

```css
/* Auto-fill card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Holy grail layout */
.app-layout {
  display: grid;
  grid-template-areas:
    "header header"
    "nav    main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

/* Centered hero */
.hero {
  display: grid;
  place-items: center;
  min-height: 60vh;
  padding: 2rem;
}
```

## Visual Hierarchy

```tsx
// Clear typographic hierarchy
export function ArticleLayout() {
  return (
    <article className="prose max-w-none">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Page Title</h1>
      <p className="mt-2 text-lg leading-relaxed text-gray-600">Subtitle or lead text.</p>
      <h2 className="mt-10 text-2xl font-semibold text-gray-900">Section Heading</h2>
      <p className="mt-4 text-base leading-relaxed text-gray-700">Body copy...</p>
      <h3 className="mt-6 text-lg font-medium text-gray-800">Subsection</h3>
      <p className="mt-2 text-sm text-gray-600">Supporting text...</p>
    </article>
  )
}

// Dense data row
export function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  )
}
```

## Color Usage Rules

```
✅ Use semantic tokens — never hardcode primitive values in components
✅ Maintain 4.5:1 contrast ratio for normal text (WCAG AA)
✅ Use 3:1 for large text (18px+ regular or 14px+ bold)
✅ Never rely on color alone to convey meaning — pair with icons or labels
✅ Limit palette per component: brand + neutral + one status color

Color roles:
  Brand    — primary actions, links, focus rings
  Neutral  — text, borders, backgrounds, subtle fills
  Success  — confirmations, valid states          (green)
  Warning  — caution, pending states              (amber)
  Error    — failures, destructive actions        (red)
  Info     — informational callouts               (blue)
```

## Spacing Rules

```
✅ Use the 4px base grid for all spacing decisions
✅ Group related elements with tighter gaps (4–8px)
✅ Separate unrelated sections with larger gaps (24–48px)
✅ Add generous padding inside containers (16–24px minimum)

Layout breathing room:
  Inline gap:        4–8px
  Card internals:   12–16px padding
  Section spacing:  32–48px
  Page sections:    64–96px
```

**Remember**: Good design is invisible — consistent tokens, clear hierarchy, and sufficient breathing room create UIs that feel effortless.
