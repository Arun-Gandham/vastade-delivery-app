# Theme, Design System, and UI Rules

## Design direction

The UI should feel like a modern grocery / quick-commerce app:

```txt
Clean
Smooth
Fast
Friendly
Mobile-first
Confident typography
Rounded cards
Soft enterprise shadows
Large touch targets
Clear status badges
High contrast CTAs
Premium dashboards
```

The design may be inspired by modern food/grocery apps, but it must not copy any brand exactly.

## Theme configuration file

Create one central file:

```txt
src/config/theme.config.ts
```

Example:

```ts
export const themeConfig = {
  brand: {
    name: "Quick Commerce",
    shortName: "QC",
  },
  colors: {
    primary: "#16A34A",
    primaryDark: "#15803D",
    secondary: "#111827",
    accent: "#F97316",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    muted: "#F1F5F9",
    border: "#E2E8F0",
    text: "#0F172A",
    textMuted: "#64748B",
    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    info: "#2563EB",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.25rem",
    full: "9999px",
  },
  shadow: {
    card: "0 10px 25px rgba(15, 23, 42, 0.08)",
    soft: "0 6px 18px rgba(15, 23, 42, 0.06)",
  },
};
```

## Tailwind theme requirement

Use CSS variables so colors can be changed globally.

Example:

```css
:root {
  --color-primary: #16A34A;
  --color-primary-dark: #15803D;
  --color-secondary: #111827;
  --color-accent: #F97316;
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-muted: #F1F5F9;
  --color-border: #E2E8F0;
  --color-text: #0F172A;
  --color-text-muted: #64748B;
}
```

Use Tailwind classes through these CSS variables:

```txt
bg-[var(--color-primary)]
text-[var(--color-text)]
border-[var(--color-border)]
```

## Component style rules

## Typography and spacing rules

The current visual language should follow the public landing page and shared role shells:

```txt
Hero headings: large, bold, high-contrast, tight tracking
Section headings: prominent but compact, usually around 1.75rem to 2rem
Card headings: medium-large, bold, readable in 1-2 lines
Body text: smaller and cleaner, usually muted gray with generous line height
Meta labels: uppercase, tight tracking, compact size
Avoid oversized footer or sidebar copy blocks
Prefer compact spacing with strong grouping over tall empty layouts
```

Recommended rhythm:

```txt
Header height: compact but premium, around 72-80px on desktop
Primary search inputs: around 48-54px tall
Buttons: 40-52px tall depending on context
Cards: rounded 20px to 30px, not sharp boxes
Footer: visually light, compact, and link-dense rather than tall
```

### Buttons

Required button variants:

```txt
primary
secondary
outline
ghost
danger
success
icon
```

Button states:

```txt
default
hover
active
disabled
loading
```

### Cards

Card variants:

```txt
product-card
shop-card
order-card
stat-card
dashboard-card
address-card
captain-task-card
```

Cards should use:

```txt
rounded 20px to 30px
soft shadow
subtle border
clear spacing
hover lift on desktop
tap feedback on mobile
```

### Forms

Inputs should use:

```txt
rounded-xl or rounded-2xl
soft border
clear label
error text
helper text
password visibility toggle
mobile keyboard-friendly input types
muted surface background for primary search bars
```

### Status badges

Create reusable status badges for:

```txt
OrderStatus
PaymentStatus
CaptainStatus
ShopStatus
InventoryStatus
```

## Motion and smoothness

Use subtle animations only:

```txt
page fade-in
card hover scale
button tap animation
drawer slide-in
bottom sheet slide-up
skeleton loading shimmer
toast enter/exit
```

Recommended:

```txt
framer-motion optional
CSS transitions required
```

## Mobile-first UI

Customer and captain views should feel like mobile apps:

```txt
Bottom navigation
Sticky cart bar
Sticky order action button
Swipe-friendly cards
Large buttons
Bottom sheets for filters and order updates
```

## Desktop dashboard UI

Admin and shop owner views should use:

```txt
Sidebar
Topbar
Stats cards
Tables
Filters
Date range selectors
Charts
Action menus
Enterprise spacing and calmer contrast than customer storefronts
```

## Branding rule

All colors, logo text, support phone, and company name must come from config files.

Do not hardcode brand values in pages.

## Current style direction

The current implementation is closest to:

```txt
Public page: premium storefront with strong hero typography, wide search bar, compact nav, and light footer
Customer pages: same storefront family, but simplified for signed-in browsing and cart flows
Dashboard roles: enterprise shell with softer backgrounds, stronger hierarchy, compact topbars, and stable side navigation
Mobile role flows: floating bottom navigation with rounded surfaces and stronger active states
```
