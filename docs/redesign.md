# TimeCall UI/UX Layout & Design v3 - Dark Neumorphism

## 1. Design Philosophy

### Dark Neumorphism / Soft UI

- **Style**: Dark Neumorphism (Soft UI for dark backgrounds)
- **Principle**: Tactile, physical depth through subtle shadows
- **Mood**: Sophisticated, modern, calm
- **No light mode**: Dark only for optimal neumorphic effect

---

## 2. Color Palette - Dark Neumorphism

### Base Colors

| Component         | Color       | Value                         |
| ----------------- | ----------- | ----------------------------- |
| Background (Base) | neuro-base  | #2d3748 (dark slate)          |
| Shadow Light      | neuro-light | #3e4c5e (highlight, top-left) |
| Shadow Dark       | neuro-dark  | #1a202c (depth, bottom-right) |
| Primary Text      | text-light  | #e2e8f0 (light gray)          |
| Secondary Text    | text-muted  | #94a3b8 (medium gray)         |
| Disabled Text     | text-dim    | #64748b (dimmed gray)         |

### Accent Colors (Gradient)

| Usage            | Colors                            |
| ---------------- | --------------------------------- |
| Primary Gradient | Cyan → Purple (#06b6d4 → #a855f7) |
| Success          | Emerald (#10b981)                 |
| Warning          | Amber (#f59e0b)                   |
| Error            | Rose (#f43f5e)                    |

### Color Usage Guidelines

- **Background**: Single color `#2d3748`, no gradients on base
- **Text**: Light colors (`#e2e8f0`) with good contrast (WCAG AA+)
- **Accents**: Vibrant gradients for buttons, progress bars
- **Shadows**: Always use both light and dark shadows for depth

---

## 3. Shadow System - Neumorphic Depth

### Shadow Types

#### Raised Elements (Buttons, Cards)

```css
box-shadow:
  8px 8px 16px #1a202c,
  /* dark shadow (bottom-right) */ -8px -8px 16px #3e4c5e; /* light shadow (top-left) */
```

**Usage**: Main timer card, raised buttons, floating elements

#### Inset/Pressed Elements (Inputs, Depressed areas)

```css
box-shadow:
  inset 6px 6px 12px #1a202c,
  inset -6px -6px 12px #3e4c5e;
```

**Usage**: Next call display, input fields, pressed states

#### Flat Elements (Subtle depth)

```css
box-shadow:
  4px 4px 8px #1a202c,
  -4px -4px 8px #3e4c5e;
```

**Usage**: Selectors, secondary controls, accordion header

#### Hover States

```css
/* Enhance shadows on hover */
box-shadow:
  10px 10px 20px #1a202c,
  -10px -10px 20px #3e4c5e;
```

#### Active/Pressed States

```css
/* Use inset shadows when pressed */
box-shadow:
  inset 4px 4px 8px #1a202c,
  inset -4px -4px 8px #3e4c5e;
```

### Tailwind Shadow Utilities

```js
// tailwind.config.ts
boxShadow: {
  'neuro-raised': '8px 8px 16px #1a202c, -8px -8px 16px #3e4c5e',
  'neuro-raised-lg': '12px 12px 24px #1a202c, -12px -12px 24px #3e4c5e',
  'neuro-pressed': 'inset 6px 6px 12px #1a202c, inset -6px -6px 12px #3e4c5e',
  'neuro-flat': '4px 4px 8px #1a202c, -4px -4px 8px #3e4c5e',
  'neuro-hover': '10px 10px 20px #1a202c, -10px -10px 20px #3e4c5e',
}
```

---

## 4. Typography

### Font Family

- Sans Serif: Inter / -apple-system / Segoe UI (from theme: `--font-sans`)
- Monospace: Geist Mono (from theme: `--font-mono`)

### Type Scale

| Element         | Size      | Weight | Color   | Shadow      |
| --------------- | --------- | ------ | ------- | ----------- |
| Digital Clock   | text-8xl+ | 700    | #e2e8f0 | Subtle soft |
| Page Title      | text-lg   | 600    | #e2e8f0 | None        |
| Section Heading | text-base | 600    | #e2e8f0 | None        |
| Body Text       | text-sm   | 400    | #94a3b8 | None        |
| Labels          | text-xs   | 600    | #94a3b8 | None        |
| Captions        | text-xs   | 400    | #64748b | None        |

### Typography Guidelines

- **Clock**: Extra large (text-8xl or text-9xl), bold but not black
- **Text shadows**: Very subtle, only for clock (`text-shadow: 2px 2px 4px rgba(0,0,0,0.3)`)
- **Contrast**: Minimum WCAG AA (4.5:1 for normal text, 3:1 for large)
- **Spacing**: `tracking-tight` for clock, `tracking-normal` for body

---

## 5. Component Design Specifications

### Main Timer Card (Raised)

```tsx
className="
  bg-neuro-base
  shadow-neuro-raised-lg
  rounded-[32px]
  min-h-[50vh]
  border-0
  p-8
"
```

**Visual**: Large raised card, most prominent element on page

### Digital Clock (Flat/Subtle)

```tsx
className="
  text-8xl sm:text-9xl
  font-bold
  tracking-tight
  text-[#e2e8f0]
"
style={{
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
}}
```

**Visual**: Massive, clean numbers with subtle shadow

### Next Call Display (Inset/Pressed)

```tsx
className="
  bg-neuro-base
  shadow-neuro-pressed
  rounded-2xl
  px-6 py-3
  min-h-[4rem]
"
```

**Visual**: Depressed area, recessed into card

### START/STOP Button (Raised + Gradient)

```tsx
className="
  bg-gradient-to-br from-cyan-500 to-purple-600
  shadow-neuro-raised
  hover:shadow-neuro-hover
  active:shadow-neuro-pressed
  rounded-full
  px-12 py-4
  text-white
  font-semibold
  text-lg
  transition-all duration-200
"
```

**Visual**: Bold gradient button with strong raised effect

### Interval/Voice Selectors (Flat)

```tsx
className="
  bg-neuro-base
  shadow-neuro-flat
  rounded-xl
  px-4 py-2
  border-0
  text-[#e2e8f0]
  focus:shadow-neuro-pressed
"
```

**Visual**: Subtle depth, becomes pressed on focus

### Accordion Header (Flat → Raised on hover)

```tsx
className="
  bg-neuro-base
  shadow-neuro-flat
  hover:shadow-neuro-raised
  rounded-2xl
  transition-shadow duration-300
"
```

**Visual**: Subtle by default, lifts on hover

---

## 6. Layout Structure (Unchanged)

### Visual Hierarchy

```
┌─────────────────────────────────────┐
│  Header (minimal)                   │ ← text-base, #e2e8f0
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Main Timer Card (neuro-raised-lg)  │
│                                     │
│         47:00 (text-9xl)            │ ← Digital clock
│                                     │
│   ╔═══════════════════════════╗     │
│   ║ Next: 14:47 (pressed)     ║     │ ← Inset area
│   ╚═══════════════════════════╝     │
│                                     │
│   ┌─────────────────────────┐       │
│   │ ● START (gradient)      │       │ ← Raised button
│   └─────────────────────────┘       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ [Interval ▼] [Voice ▼] (flat)       │ ← Selectors
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ▼ Audio Settings (flat→raised)      │ ← Accordion
└─────────────────────────────────────┘
```

### Component Hierarchy

```
page.tsx (Server)
└── TimeCallService (Client Feature)
    ├── Header (minimal, text-base)
    ├── MainTimerSection (shadow-neuro-raised-lg)
    │   ├── DigitalClock (text-9xl, text-shadow)
    │   ├── NextCallTimeDisplay (shadow-neuro-pressed)
    │   └── ControlButton (gradient + shadow-neuro-raised)
    ├── QuickSettings (horizontal, shadow-neuro-flat)
    │   ├── IntervalSelector
    │   └── VoiceSelector
    ├── AudioSettings (Accordion, shadow-neuro-flat)
    │   ├── VolumeSlider
    │   └── TestPlayButton
    └── VoiceUnavailableDialog (Modal)
```

---

## 7. Border Radius System

| Element           | Border Radius  | Purpose                  |
| ----------------- | -------------- | ------------------------ |
| Main Timer Card   | rounded-[32px] | Soft, organic feel       |
| Buttons (pill)    | rounded-full   | Smooth, friendly         |
| Next Call Display | rounded-2xl    | Medium soft corners      |
| Selectors         | rounded-xl     | Subtle rounding          |
| Accordion         | rounded-2xl    | Cohesive with card style |

**Guideline**: Larger elements = larger radius for consistency

---

## 8. Spacing System (8px grid)

| Context            | Spacing   | Value |
| ------------------ | --------- | ----- |
| Between sections   | space-y-8 | 32px  |
| Card padding       | p-8       | 32px  |
| Button padding (X) | px-12     | 48px  |
| Button padding (Y) | py-4      | 16px  |
| Element gap        | gap-6     | 24px  |
| Compact gap        | gap-4     | 16px  |

---

## 9. Interaction States

### Button States

```tsx
// Default
className = "shadow-neuro-raised bg-gradient-to-br from-cyan-500 to-purple-600";

// Hover
className = "shadow-neuro-hover scale-105";

// Active/Pressed
className = "shadow-neuro-pressed scale-95";

// Disabled
className = "opacity-50 cursor-not-allowed shadow-neuro-flat";
```

### Input/Select States

```tsx
// Default
className = "shadow-neuro-flat";

// Focus
className = "shadow-neuro-pressed ring-2 ring-cyan-500/30";

// Disabled
className = "opacity-50 cursor-not-allowed";
```

---

## 10. Layout Shift Prevention

### Fixed Heights

- **Main Timer Section**: `min-h-[50vh]`
- **Next Call Display**: `min-h-[4rem]`
- **Control Button Area**: `min-h-[3.5rem]`

### Accordion Animation

```tsx
// Use grid-rows for smooth expansion without layout shift
className={`
  grid transition-all duration-300
  ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
`}
```

---

## 11. Accessibility Considerations

### Contrast Requirements

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **All text on `#2d3748`**: Use `#e2e8f0` or lighter

### Focus Indicators

```tsx
// Visible focus ring for keyboard navigation
className =
  "focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neuro-base";
```

### ARIA Labels

- All interactive elements have proper `aria-label`
- SVG icons include `role="img"` and `aria-label`
- Dynamic IDs use React's `useId()` hook

---

## 12. Implementation Checklist

### Phase 1: Foundation ✅ COMPLETED

- [x] Update `globals.css` with neuro colors and shadows
- [x] Add base background color (#2d3748)
- [x] Remove old dark mode color references
- [x] Add neumorphic shadow utilities (raised, pressed, flat, hover)
- [x] Add accent gradient colors (cyan, purple, emerald, amber, rose)

### Phase 2: Main Components ✅ COMPLETED

- [x] Main Timer Card - apply raised-lg shadow, rounded-[32px]
- [x] Digital Clock - text-9xl, tracking-tight, text-[#e2e8f0], subtle text-shadow
- [x] Next Call Display - inset shadow (shadow-neuro-pressed), rounded-2xl
- [x] START/STOP Button - gradient (cyan→purple / rose→red), rounded-full, raised shadow with hover/active states

**Files modified:**

- `app/globals.css` - color system and shadow utilities
- `app/_features/TimeCallService/index.tsx` - main layout
- `app/_components/DigitalClock.tsx` - typography and colors
- `app/_components/NextCallTimeDisplay.tsx` - pressed style
- `app/_components/ControlButton.tsx` - gradient button with neumorphic shadows

### Phase 3: Secondary Components ✅ COMPLETED

- [x] Interval Selector - flat shadow, neumorphic button style with pressed state
- [x] Voice Selector - flat shadow, focus pressed state
- [x] Accordion - flat to raised transition on hover
- [x] Input/Select focus states with pressed shadow

**Files modified:**

- `app/_components/IntervalSelector.tsx` - neumorphic radio buttons
- `app/_components/VoiceSelector.tsx` - flat shadow select with focus state
- `app/_features/TimeCallService/AudioSettings.tsx` - accordion hover transition

### Phase 4: Polish ✅ COMPLETED

- [x] Hover states on all interactive elements
- [x] Active/pressed states refinement
- [x] Focus indicators with ring (focus-visible)
- [x] Smooth transitions (200-300ms)

**Files modified:**

- `app/_components/IntervalSelector.tsx` - added focus-within ring for keyboard navigation
- `app/_components/VolumeControl.tsx` - applied neumorphic style (pressed shadow, cyan accent, proper text colors)
- `app/_components/TestPlayButton.tsx` - applied gradient button with neumorphic shadows and hover/active/focus states

### Phase 5: Testing (TODO)

- [ ] Contrast ratio verification (WCAG AA)
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Visual regression testing

---

## 13. Future Enhancements

- Circular progress indicator with neumorphic style
- Smooth pulsing animation on active timer
- Haptic feedback simulation with shadow animations
- Advanced glassmorphism overlay effects
