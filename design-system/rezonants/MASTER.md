# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Rezonants
**Generated:** 2026-08-11 14:19:58
**Category:** B2B Service

---

## Global Rules

### Color Palette (Light Green + White)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Page Background | `#FFFFFF` | `--bg` |
| Alternate Section Background | `#F0FAF4` | `--bg-alt` |
| Hero Gradient | `#F0FAF4` -> `#DCF5E6` | `--hero-gradient` |
| Surface / Card | `#FFFFFF` | `--surface` |
| Card Border | `#D5EFDD` | `--border` |
| Navbar Surface / Border | `#FFFFFF` / `#E3F3E9` | `--nav-bg` / `--nav-border` |
| Footer Background | `#E6F6EC` | `--footer-bg` |
| Primary Accent / CTA | `#22A55B` | `--accent` |
| Accent Hover | `#178A49` | `--accent-hover` |
| Headings Text | `#12352A` | `--text-h` |
| Body Text | `#3F5A4D` | `--text` |
| Text on Primary Button | `#FFFFFF` | `--btn-text` |
| Destructive | `#DC2626` | `--error` |

**Color Notes:** Light green + white enterprise palette with high-contrast dark forest green typography (>= 4.5:1).

### Typography

- **Heading Font:** Outfit / Plus Jakarta Sans
- **Body Font:** Plus Jakarta Sans
- **Mood:** corporate, trustworthy, accessible, readable, professional, clean

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(18, 53, 42, 0.05)` | Subtle lift |
| `--shadow-md` | `0 6px 18px rgba(18, 53, 42, 0.08)` | Cards, buttons |
| `--shadow-lg` | `0 14px 32px rgba(18, 53, 42, 0.12)` | Modals, dropdowns |
| `--shadow-xl` | `0 22px 48px rgba(18, 53, 42, 0.14)` | Hero cards, popovers |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #22A55B;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: #178A49;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: #FFFFFF;
  color: #12352A;
  border: 1.5px solid #D5EFDD;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FFFFFF;
  border: 1px solid #D5EFDD;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  background: #FFFFFF;
  color: #12352A;
  padding: 12px 16px;
  border: 1px solid #D5EFDD;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #22A55B;
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 165, 91, 0.18);
}
```

---

## Pre-Delivery Checklist

- [x] No emojis used as primary UI icons (SVG icons used consistently)
- [x] `cursor-pointer` on all clickable elements
- [x] Hover states with smooth transitions (150-300ms)
- [x] Light mode: text contrast 4.5:1 minimum (`#12352A` and `#3F5A4D` on `#FFFFFF` / `#F0FAF4` / `#E6F6EC`)
- [x] Focus states visible for keyboard navigation
- [x] Responsive across mobile, tablet, and desktop
