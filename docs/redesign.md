# TimeCall UI/UX Layout & Design v2

## 1. Mode & Color Palette

### Dark Mode Only

- Default and only mode
- No light mode variant
- Based on `secondary-900` (`oklch(30.1% 0.043 258.448)`) as background

### Color Palette (Confirmed)

| Component      | Color             | Value                                                 |
| -------------- | ----------------- | ----------------------------------------------------- |
| Background     | secondary-900     | oklch(30.1% 0.043 258.448)                            |
| Primary Text   | foreground        | #ededed                                               |
| Secondary Text | secondary-400     | oklch(75.4% 0.089 255.823)                            |
| Primary Accent | primary-600       | oklch(57.7% 0.245 255.325)                            |
| Borders        | secondary-700/800 | oklch(46.3% 0.089 256.744) / oklch(37% 0.064 255.702) |

### Status Colors (from theme)

- Success: `success-600` oklch(62.7% 0.194 150.214)
- Warning: `warning-600` oklch(66.6% 0.179 60.318)
- Error: `error-600` oklch(57.7% 0.245 28.325)

---

## 2. Typography

### Font Family

- Sans Serif: Inter / -apple-system / Segoe UI (from theme: `--font-sans`)
- Monospace: Geist Mono (from theme: `--font-mono`)

### Type Scale (Confirmed from globals.css)

| Class        | Size      | Weight | Line Height | Usage               |
| ------------ | --------- | ------ | ----------- | ------------------- |
| text-xs      | 0.75rem   | 400    | 1rem        | Small labels        |
| text-sm      | 0.875rem  | 400    | 1.25rem     | Captions            |
| text-base    | 1rem      | 400    | 1.5rem      | Body text           |
| text-lg      | 1.125rem  | 500    | 1.75rem     | Larger body         |
| text-xl      | 1.25rem   | 600    | 1.75rem     | Emphasis            |
| text-2xl     | 1.5rem    | 700    | 2rem        | Section heading     |
| text-3xl     | 1.875rem  | 700    | 2.25rem     | Major heading       |
| text-4xl     | 2.25rem   | 700    | 2.5rem      | Page title          |
| text-5xl-9xl | 3rem-8rem | 700    | 1           | Extra large display |

### Semantic Typography Classes

- `.text-heading-1` → text-4xl
- `.text-heading-2` → text-3xl
- `.text-heading-3` → text-2xl
- `.text-body` → text-base
- `.text-caption` → text-xs

---

## 4. Redesigned Layout Structure (Pattern A)

### Design Goals

- Remove flat 3-card layout for more dynamic visual hierarchy
- Integrate timer and action button for minimal visual distance
- Minimize header, maximize main timer area
- Collapse low-frequency settings by default

### New Layout (Visual)

```
┌─────────────────────────────────────┐
│  Header (minimal, text-base/sm)     │ ← Reduced size
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Main Timer Area             │
│                                     │
│           47:00                     │ ← Large digital clock
│      (Digital Clock)                │
│                                     │
│     Next Call: 14:47                │ ← Next call time integrated
│                                     │
│     ┌─────────────────┐             │
│     │   ●  START      │             │ ← Button inside timer area
│     └─────────────────┘             │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [Interval: 5分 ▼] [Voice: Kyoko ▼] │ ← Horizontal, compact settings
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ▼ Audio Settings (Accordion)       │ ← Collapsible, default closed
└─────────────────────────────────────┘
```

### Component Hierarchy (New)

```
page.tsx (Server)
└── TimeCallService (Client Feature)
    ├── Header (minimal)
    ├── MainTimerSection
    │   ├── DigitalClock (large)
    │   ├── NextCallTimeDisplay (integrated)
    │   └── ControlButton (START/STOP, inside timer)
    ├── QuickSettings (horizontal bar)
    │   ├── IntervalSelector
    │   └── VoiceSelector
    ├── AudioSettings (Accordion, collapsed by default)
    │   ├── VoiceList
    │   └── VolumeSlider
    └── VoiceUnavailableDialog (Modal)
```

### Key Changes

1. **Header**: Reduced size (text-lg → text-base), minimal spacing
2. **Main Timer Section**:
   - Single unified card (50-60% viewport height)
   - Digital clock enlarged, centered
   - Next call time directly below clock
   - START/STOP button integrated inside timer area
   - Button positioned near bottom of timer card
   - Remove separate "Digital Clock Section" card
   - **Fixed height to prevent layout shift** when timer state changes
3. **Timer Controls → Quick Settings**:
   - Removed card background (flat or glassmorphism)
   - Horizontal layout: Interval and Voice selectors side-by-side
   - Compact, single row
   - Remove "CurrentIntervalDisplay" (redundant with selector)
   - **Fixed height to prevent layout shift** when selectors change
4. **Settings Panel → Audio Settings Accordion**:
   - Collapsible component (default: closed)
   - Click to expand: volume slider, voice list
   - Reduces visual clutter
   - **Reserve space for accordion expansion** to minimize shift

### Visual Improvements

- **Depth**: Enhanced shadows, gradient backgrounds
- **Spacing**: Increased whitespace between sections
- **Color**: Primary-600 accent on START button
- **Hierarchy**: Timer dominates, settings recede
- **Mobile**: Button large and easy to tap
- **Layout Stability**: No cumulative layout shift (CLS)
  - Use `min-h-[value]` for main timer section
  - Reserve button space even when hidden/disabled
  - Accordion animation with `grid-rows` instead of height
  - NextCallTimeDisplay maintains height regardless of state

### Future Enhancements (Not Now)

- Circular progress ring around timer (visual countdown)
- Animation on timer state change
- Glassmorphism effects on quick settings bar

---
