---
name: frontend-design
description: Apply production-quality UI design patterns. Use when implementing visual design, choosing layout patterns, applying design tokens, or creating interface components that need to look polished and intentional rather than AI-generated.
---

# Frontend Design

## Overview

Apply design patterns and visual principles that produce interfaces that are polished, intentional, and communication-first. The goal is UI that reflects real design decisions — not defaults dressed up with gradients and rounded corners. This means proper visual hierarchy, purposeful layout, consistent token usage, and interaction patterns that match user expectations.

## When to Use

- Implementing a layout from a design file or spec
- Choosing component patterns (cards, modals, forms, navigation, empty states)
- Applying or extending a design system
- Building new UI with no design file
- Identifying and fixing visual quality issues in existing UI

## Layout Patterns

### Visual Hierarchy

Every layout communicates priority. Design to match:

- **Primary**: largest, highest contrast, most prominent position — the one thing users must notice
- **Secondary**: supporting content, accessible but not competing
- **Tertiary**: metadata and details — available without demanding attention

If everything looks equally important, nothing is.

### Layout Pattern Selection

```
Sidebar + Main         → App shells, dashboards, documentation
Vertical stack (list)  → Feeds, tasks, notifications, search results
Grid                   → Galleries, product cards, dashboard widgets
Centered narrow column → Forms, reading views, onboarding flows
Header + Hero + Body   → Marketing and landing pages
Two-column (60/40)     → Comparisons, split login/signup
```

### Responsive Patterns

| Desktop | Mobile |
|---------|--------|
| Sidebar + main content | Full-width with bottom nav or tabs |
| Multi-column grid | Single column, 2-col max |
| Inline form fields | Stacked form fields |
| Side-by-side comparison | Tabbed or sequential |
| Data table | Card list or horizontal scroll |

Always design mobile-first. Retrofitting responsive is 3× harder than starting from it.

## Component Patterns

### Cards

Use cards when content is browsable, actionable, and items are independent of each other. Do not use cards for sequential content (use a list) or a single piece of content (use a section).

**Anatomy:**
```
[Media or icon — optional]
[Title]
[Subtitle / metadata]
[Body — optional, 2-3 lines max]
[Primary action]
```

**Rules:**
- Consistent height within a grid — use `min-height` or clamp body text
- One primary action per card; secondary actions in a menu or on hover
- Avoid nesting cards — it destroys hierarchy

### Forms

Forms are conversion-critical. Every friction point loses submissions.

- **Layout**: Single column unless screen space makes it genuinely unusable
- **Labels**: Above the field, always. Never rely on placeholder as label — it disappears on focus
- **Errors**: Inline, below the field, shown on blur or submit — never only at the page top
- **Button copy**: Action-oriented — "Create account", "Save changes", not "Submit"
- **Required fields**: Mark optional fields when most are required; mark required when most are optional
- **Helper text**: Below the label, before the input — never below the error

```
[Label]           ← always visible
[Input field]
[Helper text]     ← optional, shown by default
[Error message]   ← replaces or follows helper text on error
```

### Navigation

| Pattern | Use When |
|---------|----------|
| Top nav bar | Global navigation, ≤7 items, content-focused sites |
| Sidebar | App navigation with hierarchy, persistent context needed |
| Tabs | Sub-navigation within a section, ≤6 items, peer-level content |
| Breadcrumbs | Deep hierarchy, documentation, editorial content |
| Bottom nav (mobile) | 3–5 primary destinations in mobile apps |

Rules:
- Always indicate the current location visually
- Never more than 2 levels of navigation visible at once
- Mobile primary nav: 3–5 items maximum
- Never use tabs for navigation that changes the URL path — use a sidebar or nav bar

### Modals

Use modals for: destructive confirmations, quick-entry forms that don't warrant a page, media viewers.

Do **not** use modals for: primary content, multi-step flows with more than 3 steps, notifications.

**Anatomy:**
```
[Title — describes the action, not the object]
[Body — context or form]
[Actions — right-aligned; primary action rightmost, destructive action leftmost]
[Close — top-right X or explicit Cancel]
```

**Sizing:** Width 400–600px for confirmations, up to 800px for forms. Full-screen on mobile.

### Empty States

Empty states are the first thing new users see. Treat them as design opportunities.

```
[Illustration or contextual icon]
[Heading — names what's empty, e.g. "No tasks yet"]
[Body — why it's empty and what the user can do]
[CTA — primary action to fill it, e.g. "Create your first task"]
```

Never use generic "No data" or "No items found" copy. Make empty states contextual, helpful, and encouraging.

### Loading States

| Type | Use When |
|------|----------|
| Skeleton screen | Page or section-level content loads (text, images, cards) |
| Inline spinner | Small, contained updates (button loading, a single field) |
| Progress bar | Long operations where % progress is knowable |
| Optimistic UI | High-confidence mutations (toggle, like, reorder) |

Skeleton screens beat spinners for anything larger than a single element.

## Design Tokens

Always use tokens. Raw hex values and arbitrary pixel numbers bypass the design system and create inconsistency.

### Token Hierarchy

```
Global tokens    → Raw values: #1a1a2e, 16px, 200ms
Alias tokens     → Semantic: color-text-primary, spacing-md, duration-fast
Component tokens → Scoped: button-bg, card-padding, modal-max-width
```

### Core Token Categories

```
Color
  --color-bg              Page background
  --color-surface         Cards, panels (slightly elevated)
  --color-border          Dividers, input outlines
  --color-text-primary    Main body text
  --color-text-secondary  Labels, supporting copy
  --color-text-muted      Timestamps, metadata
  --color-accent          Brand / primary interactive
  --color-accent-hover    Hover state of accent
  --color-danger          Errors, destructive actions
  --color-success         Confirmations, completed states
  --color-warning         Caution states

Spacing (4px base grid)
  --space-1   4px
  --space-2   8px
  --space-3   12px
  --space-4   16px
  --space-6   24px
  --space-8   32px
  --space-12  48px
  --space-16  64px

Typography
  --text-xs    12px
  --text-sm    14px
  --text-base  16px
  --text-lg    18px
  --text-xl    20px
  --text-2xl   24px
  --text-3xl   30px
  --text-4xl   36px

Border radius
  --radius-sm    4px
  --radius-md    8px
  --radius-lg    12px
  --radius-xl    16px
  --radius-full  9999px

Shadow
  --shadow-sm   Subtle card lift
  --shadow-md   Dropdown, popover
  --shadow-lg   Modal, drawer

Motion
  --duration-fast    100ms
  --duration-base    200ms
  --duration-slow    400ms
  --ease-out         cubic-bezier(0, 0, 0.2, 1)
  --ease-in          cubic-bezier(0.4, 0, 1, 1)
```

## Typography Patterns

### Type Scale Application

```
Display / Hero  → Marketing page titles only
H1              → One per page, main page title
H2              → Section headings
H3              → Subsection or card title
Body            → Default paragraph text
Small / Caption → Metadata, labels, helper text, badges
```

Never skip heading levels. Never use heading styles on non-heading content for visual effect — adjust the scale instead.

### Readability

- **Line length**: 60–80 characters for body text. Enforce with `max-width: 65ch`.
- **Line height**: 1.4–1.6 for body, 1.1–1.3 for headings.
- **Weight**: Use 2–3 weights. Regular + Medium + Semibold is sufficient.
- **Alignment**: Left-align paragraphs. Center-align only 1–3 line headings or hero copy.
- **All-caps**: Labels, badges, and short nav items only — never body text.

## Color Patterns

### Color Roles

Every color has an assigned role. Do not use brand/accent color for decoration — reserve it for interactive elements and selected states.

| Role | Purpose |
|------|--------|
| Brand / Accent | CTAs, links, selected/active states |
| Neutral | Text, borders, backgrounds — the majority of any UI |
| Success | Completed, confirmed, positive |
| Warning | Needs attention, caution |
| Danger | Errors, destructive actions |
| Info | Tips, informational content |

### Color Rules

- **Never use color as the only indicator of state.** Pair with text, icon, or pattern.
- **Interactive elements need a distinct hover state** — not just opacity change.
- **Define dark mode via tokens**, not CSS `invert()` or filters.
- **One accent color** unless the design system explicitly defines multiple.
- **Minimum contrast**: 4.5:1 for body text, 3:1 for large text (18px+ or 14px bold), 3:1 for UI components and focus indicators.

## Interaction Patterns

### Hover and Focus States

Every interactive element needs four states: default, hover, active/pressed, disabled.
Form inputs additionally need: focus, error, success.

```css
/* Never remove focus outline without a visible replacement */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* Disabled: visually distinct and non-interactive */
[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Motion

- **Purposeful only**: Animate to guide attention or communicate state change — not for decoration.
- **Duration**: 100–200ms for micro-interactions (hover, toggle), 200–400ms for transitions (page elements entering), 400ms+ only for deliberate reveals.
- **Easing**: `ease-out` for elements entering, `ease-in` for elements leaving.
- **Always respect `prefers-reduced-motion`**:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Feedback Timing

| Delay | User Perception | Response |
|-------|----------------|----------|
| 0–100ms | Instantaneous | Ideal for toggle/hover |
| 100–300ms | Slight pause | Acceptable for transitions |
| 300ms–1s | Noticeable delay | Show inline spinner |
| 1s+ | Slow | Show progress indicator |
| 10s+ | Broken | Show progress + cancel option |

## Visual Hierarchy Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Everything bold | Bold signals emphasis; when everything is bold, nothing is | Reserve bold/semibold for 1–2 items per section |
| Competing CTAs | Users freeze when two actions have equal visual weight | One primary CTA per section; subordinate secondary actions |
| All-caps body text | Reduces readability; feels like shouting | All-caps only for labels, badges, short nav items |
| Icon-only actions | Unclear for new users and screen readers | Add `aria-label`; prefer icon + label for primary actions |
| Nested cards | Unclear hierarchy, visual clutter | Flatten the structure or use indentation instead |
| Misaligned elements | Creates visual tension and looks unpolished | Align to the 4px or 8px grid; use consistent gutters |
| Oversized padding | Wastes space, destroys hierarchy | Follow the spacing scale; vary padding by component context |
| Shadow everywhere | Competing depth levels reduce clarity | Reserve elevation for interactive overlays (dropdowns, modals) |

## Red Flags

- No visual hierarchy — every element has equal visual weight
- Inconsistent spacing — mix of arbitrary pixel values not on a scale
- More than 3 type sizes in a single component
- Interactive elements with no hover or focus state
- Empty states that just say "No items found"
- Form errors only shown at the top, not inline
- Color as the only state indicator (no text or icon backup)
- Animations that ignore `prefers-reduced-motion`
- Modal used for primary content or multi-step flows
- Placeholder text used as the only form label

## Verification

After implementing UI:

- [ ] Visual hierarchy is clear — the primary action or content draws the eye first
- [ ] Spacing follows the token scale — no arbitrary pixel values
- [ ] All interactive elements have visible hover and focus states
- [ ] Colors reference semantic tokens, not raw hex values
- [ ] Empty states include a heading, helpful body copy, and a CTA
- [ ] Form errors are inline, below the relevant field
- [ ] Button copy is action-oriented, not generic ("Submit", "OK")
- [ ] Typography respects line length (≤80ch) and contrast ratios
- [ ] Motion respects `prefers-reduced-motion`
- [ ] No state is communicated by color alone
- [ ] Loading states use skeleton screens for content, spinners only for small updates
