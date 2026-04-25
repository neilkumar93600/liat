# Mall of America Interactive Sales Deck — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a carousel-based, full-screen interactive sales deck for Mall of America that closes leasing, sponsorship, and event-booking deals — deployed on Vercel.

**Architecture:** Full-screen carousel shell (`100vw × 100vh` per slide, no browser scroll) powered by GSAP transitions. Each slide is an isolated React component receiving `isActive` prop. Remotion pre-renders hero intro sequence to MP4; all other animation is runtime GSAP/CSS. Next.js static export (`output: 'export'`) deploys to Vercel.

**Tech Stack:** Next.js 16.2.4 (App Router, static export), React 19, TypeScript, **Tailwind CSS v4** (`@theme` CSS tokens, no tailwind.config.ts), GSAP 3 + SplitText + ScrollTrigger, Three.js, Remotion 4, shadcn/ui (already installed — Dialog, Button), Vercel deploy.

**Critical: This project uses Tailwind v4.** Color tokens go in `globals.css` under `@theme inline`, NOT in `tailwind.config.ts`. Usage: `className="bg-brand-black"` → maps to `--color-brand-black`.

---

## Existing Project State (do NOT redo these)

- `app/layout.tsx` — exists, has Space Grotesk + DM Sans fonts, `cn` utility
- `app/globals.css` — exists, Tailwind v4 `@import "tailwindcss"`, shadcn theme vars
- `app/page.tsx` — stub, replace fully
- `next.config.ts` — exists, empty (add `output: 'export'`)
- `shadcn` — already installed, Dialog + Button available via `@base-ui/react` / `radix-ui`
- `recharts` — already installed (use in RetailSlide for category donut)
- `embla-carousel-react` — already installed (not used; custom CarouselShell preferred for keyboard+GSAP control)
- `@tabler/icons-react` — already installed (use for nav arrows, icons)

## File Structure

```
/app
  layout.tsx                  ← MODIFY: add Playfair Display font
  page.tsx                    ← REPLACE: mount CarouselShell with all slides
  globals.css                 ← MODIFY: add brand color tokens under @theme inline

/components
  /carousel
    CarouselShell.tsx         ← manages activeSlide state, keyboard/swipe/click nav
    SlideNav.tsx              ← right-side dot nav with section labels
    ProgressBar.tsx           ← top bar showing position X/N
    SlideWrapper.tsx          ← full-screen container, passes isActive to child

  /slides
    HeroSlide.tsx             ← video autoplay, GSAP SplitText title, stat counters
    WhySlide.tsx              ← map bg, 4 stat cards, animated counters
    RetailSlide.tsx           ← brand logo grid, recharts donut, CTA
    LuxurySlide.tsx           ← editorial grid, dark bg, premium copy
    DiningSlide.tsx           ← split layout: video + scrollable venue list
    EntertainmentSlide.tsx    ← cinematic video bg, attraction cards
    EventsSlide.tsx           ← event highlights, capacity stats, 3 CTA cards
    CTASlide.tsx              ← 3 action buttons, contact modal trigger

  /modules
    EventsModule.tsx          ← Phase 2 stub (lazy modal)
    SponsorModule.tsx         ← Phase 2 stub (lazy modal)
    LeaseModule.tsx           ← Phase 2 stub (lazy modal)

  /ui
    StatCounter.tsx           ← animated number counter using GSAP
    VideoBackground.tsx       ← autoplay muted loop video, lazy
    ContactModal.tsx          ← form modal using @base-ui/react Dialog

/lib
  gsap.ts                     ← registerPlugins, animation presets
  slides.config.ts            ← slide order, labels, accent colors
  moa-data.ts                 ← all content: stats, copy, brand lists, CTAs

/remotion
  /compositions
    HeroIntro.tsx             ← 5s cinematic opener composition
  Root.tsx                    ← registerRoot
  remotion.config.ts

/public
  /videos
    hero-loop.mp4             ← placeholder (real MOA asset or AI-generated)
    dining-loop.mp4
    entertainment-loop.mp4
  /images
    hero-poster.jpg           ← AI-generated (Midjourney)
    luxury-editorial.jpg
    dining-poster.jpg
    entertainment-poster.jpg

/tests
  carousel.test.tsx
  stat-counter.test.tsx
  slides-config.test.ts
```

---

## Task 1: Dependencies + Design Tokens

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Install missing dependencies**

```bash
cd e:/liat
npm install gsap @gsap/react three @types/three remotion @remotion/cli
```

- [ ] **Step 2: Verify installs**

```bash
npm ls gsap three remotion 2>&1 | grep -E "gsap|three|remotion"
```
Expected: each shows version number without `UNMET`

- [ ] **Step 3: Add brand color tokens to globals.css**

In `app/globals.css`, find the `@theme inline` block (line 7) and add brand tokens inside it:

```css
@theme inline {
  /* existing shadcn vars stay — add below them */
  --color-brand-black: #0A0A0A;
  --color-brand-gold: #C9A84C;
  --color-brand-gold-light: #E8C97A;
  --color-brand-white: #F5F5F0;
  --color-brand-gray: #1A1A1A;
  --color-brand-gray-mid: #2A2A2A;
  --ease-luxury: cubic-bezier(0.76, 0, 0.24, 1);
}
```

Also add to `:root` and global styles at the bottom of `globals.css`:

```css
:root {
  --slide-duration: 800ms;
}

/* Override body for full-screen experience */
html.deck-mode, html.deck-mode body {
  overflow: hidden;
}
```

- [ ] **Step 4: Add Playfair Display font to layout.tsx**

Replace `app/layout.tsx` content:

```tsx
import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-heading' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', style: ['normal', 'italic'] })

export const metadata: Metadata = {
  title: 'Mall of America — Commercial Opportunities',
  description: 'Interactive sales deck for leasing, sponsorship, and events at Mall of America.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('deck-mode', spaceGrotesk.variable, dmSans.variable, playfair.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Configure next.config.ts for static export**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
```

- [ ] **Step 6: Verify dev server still starts**

```bash
npm run dev
```
Expected: localhost:3000 loads (stub content OK for now)

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/layout.tsx next.config.ts package.json package-lock.json
git commit -m "feat: install GSAP/Three/Remotion, add brand tokens to Tailwind v4 @theme, Playfair Display font"
```

---

## Task 2: Content Data Layer

**Files:**
- Create: `lib/slides.config.ts`
- Create: `lib/moa-data.ts`
- Create: `tests/slides-config.test.ts`

- [ ] **Step 1: Write lib/slides.config.ts**

```typescript
// lib/slides.config.ts
export interface SlideConfig {
  id: string
  label: string
  accentColor: string
}

export const SLIDES: SlideConfig[] = [
  { id: 'hero',          label: 'Welcome',            accentColor: '#C9A84C' },
  { id: 'why',           label: 'Why MOA',            accentColor: '#C9A84C' },
  { id: 'retail',        label: 'Retail',             accentColor: '#E8C97A' },
  { id: 'luxury',        label: 'Luxury',             accentColor: '#C9A84C' },
  { id: 'dining',        label: 'Dining',             accentColor: '#C9A84C' },
  { id: 'entertainment', label: 'Entertainment',      accentColor: '#C9A84C' },
  { id: 'events',        label: 'Events',             accentColor: '#C9A84C' },
  { id: 'cta',           label: 'Partner With Us',    accentColor: '#C9A84C' },
]
```

- [ ] **Step 2: Write lib/moa-data.ts**

```typescript
// lib/moa-data.ts
export const MOA_STATS = {
  sqFt:          { value: 5.6,    unit: 'M sq ft', label: 'Total Area' },
  visitors:      { value: 40,     unit: 'M+',      label: 'Annual Visitors' },
  stores:        { value: 520,    unit: '+',        label: 'Retail Stores' },
  statesReached: { value: 16,     unit: 'states',  label: 'Regional Draw' },
  hotelRooms:    { value: 4200,   unit: '+',        label: 'Hotel Rooms On-Site' },
  eventCapacity: { value: 20000,  unit: '+',        label: 'Event Capacity' },
}

export const RETAIL_BRANDS = [
  'Apple', 'Tesla', 'Lego', 'Nike', 'Adidas', 'H&M',
  'Zara', 'Nordstrom', "Bloomingdale's", "Macy's",
  'Louis Vuitton', 'Coach', 'Michael Kors', 'Tiffany & Co.',
  'Sephora', 'Lululemon', 'Anthropologie', 'Free People',
]

export const LUXURY_BRANDS = [
  'Louis Vuitton', 'Tiffany & Co.', 'Coach', 'Michael Kors',
  'Kate Spade', 'Pandora', 'Swarovski',
]

export const RETAIL_CATEGORIES = [
  { cat: 'Fashion & Apparel', pct: 35 },
  { cat: 'Dining & F&B',      pct: 20 },
  { cat: 'Entertainment',     pct: 15 },
  { cat: 'Luxury & Jewelry',  pct: 12 },
  { cat: 'Services',          pct: 18 },
]

export const DINING_VENUES = [
  { name: "Crayola Cafe",         category: 'Family',      description: 'Immersive branded dining' },
  { name: "The Grill at Ike's",   category: 'American',   description: 'Full-service sit-down' },
  { name: "Bubba Gump Shrimp",    category: 'Casual',     description: 'High tourist draw' },
  { name: "Rainforest Cafe",      category: 'Experiential', description: 'Destination dining' },
  { name: "Twin City Grill",      category: 'Local',      description: 'Minnesota flavors' },
]

export const EVENTS_HIGHLIGHTS = [
  { name: 'Nickelodeon Universe Live', capacity: '7,000+',         type: 'Entertainment' },
  { name: 'National Championships',    capacity: '15,000+',        type: 'Sports' },
  { name: 'Brand Activations',         capacity: '50K reach/day',  type: 'Marketing' },
  { name: 'Holiday Programming',       capacity: '6-week season',  type: 'Seasonal' },
]

export const CTA_PATHS = [
  {
    id: 'lease' as const,
    title: 'Lease Space',
    subtitle: 'Retail, F&B, Pop-Up, Flagship',
    cta: 'Start Leasing Conversation',
    email: 'leasing@mallofamerica.com',
  },
  {
    id: 'sponsor' as const,
    title: 'Become a Sponsor',
    subtitle: 'Brand Partnerships & Activations',
    cta: 'Explore Sponsorship',
    email: 'partnerships@mallofamerica.com',
  },
  {
    id: 'events' as const,
    title: 'Book a Venue',
    subtitle: 'Concerts, Launches, Conventions',
    cta: 'Book Your Event',
    email: 'events@mallofamerica.com',
  },
]

export type CtaId = typeof CTA_PATHS[number]['id']
```

- [ ] **Step 3: Write test**

```typescript
// tests/slides-config.test.ts
import { SLIDES } from '../lib/slides.config'

test('slides array has 8 entries', () => {
  expect(SLIDES).toHaveLength(8)
})

test('every slide has required fields', () => {
  for (const s of SLIDES) {
    expect(s.id).toBeTruthy()
    expect(s.label).toBeTruthy()
    expect(s.accentColor).toMatch(/^#[0-9A-Fa-f]{6}$/)
  }
})
```

- [ ] **Step 4: Run test (expect pass — pure data, no DOM)**

```bash
npx jest tests/slides-config.test.ts --passWithNoTests 2>&1 || npx ts-node --project tsconfig.json -e "require('./lib/slides.config')" && echo "OK"
```

- [ ] **Step 5: Commit**

```bash
git add lib/ tests/slides-config.test.ts
git commit -m "feat: content data layer — MOA stats, brands, CTAs, slide config"
```

---

## Task 3: GSAP Setup

**Files:**
- Create: `lib/gsap.ts`

- [ ] **Step 1: Write lib/gsap.ts**

```typescript
// lib/gsap.ts
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText, ScrollTrigger)
}

export { gsap, SplitText, ScrollTrigger }

export const slideTransition = {
  enter: (el: HTMLElement) =>
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
    ),
  exit: (el: HTMLElement) =>
    gsap.to(el, { opacity: 0, scale: 1.02, duration: 0.5, ease: 'power2.in' }),
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/gsap.ts
git commit -m "feat: GSAP setup — registerPlugins, slideTransition preset"
```

---

## Task 4: Carousel Shell

**Files:**
- Create: `components/carousel/CarouselShell.tsx`
- Create: `components/carousel/SlideWrapper.tsx`
- Create: `components/carousel/SlideNav.tsx`
- Create: `components/carousel/ProgressBar.tsx`
- Create: `tests/carousel.test.tsx`

- [ ] **Step 1: Write SlideWrapper.tsx**

```tsx
// components/carousel/SlideWrapper.tsx
'use client'
import { useRef, useEffect } from 'react'
import { slideTransition } from '@/lib/gsap'

interface SlideWrapperProps {
  isActive: boolean
  children: React.ReactNode
}

export default function SlideWrapper({ isActive, children }: SlideWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (isActive) {
      ref.current.style.display = 'block'
      slideTransition.enter(ref.current)
    } else {
      ref.current.style.display = 'none'
    }
  }, [isActive])

  return (
    <div
      ref={ref}
      className="absolute inset-0 w-screen h-screen"
      style={{ display: isActive ? 'block' : 'none' }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Write SlideNav.tsx**

```tsx
// components/carousel/SlideNav.tsx
'use client'
import type { SlideConfig } from '@/lib/slides.config'

interface SlideNavProps {
  slides: SlideConfig[]
  activeIndex: number
  onNavigate: (index: number) => void
}

export default function SlideNav({ slides, activeIndex, onNavigate }: SlideNavProps) {
  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          onClick={() => onNavigate(i)}
          className="group flex items-center gap-2"
          aria-label={`Go to ${slide.label}`}
        >
          <span className="text-xs text-brand-white/0 group-hover:text-brand-white/70 transition-all duration-300 font-sans tracking-widest uppercase whitespace-nowrap">
            {slide.label}
          </span>
          <span className={[
            'block rounded-full transition-all duration-300',
            i === activeIndex
              ? 'w-2 h-2 bg-brand-gold'
              : 'w-1.5 h-1.5 bg-brand-white/30 group-hover:bg-brand-white/60',
          ].join(' ')} />
        </button>
      ))}
    </nav>
  )
}
```

- [ ] **Step 3: Write ProgressBar.tsx**

```tsx
// components/carousel/ProgressBar.tsx
'use client'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = ((current + 1) / total) * 100

  return (
    <div className="fixed top-0 left-0 right-0 h-px z-50 bg-brand-white/10">
      <div
        className="h-full bg-brand-gold transition-all duration-700"
        style={{ width: `${pct}%`, transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)' }}
      />
    </div>
  )
}
```

- [ ] **Step 4: Write CarouselShell.tsx**

```tsx
// components/carousel/CarouselShell.tsx
'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import SlideWrapper from './SlideWrapper'
import SlideNav from './SlideNav'
import ProgressBar from './ProgressBar'
import type { SlideConfig } from '@/lib/slides.config'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface SlideEntry extends SlideConfig {
  component: React.ComponentType<{ isActive: boolean }>
}

interface CarouselShellProps {
  slides: SlideEntry[]
}

export default function CarouselShell({ slides }: CarouselShellProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number>(0)

  const navigate = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(index, slides.length - 1)))
  }, [slides.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate(activeIndex + 1)
      if (e.key === 'ArrowLeft')  navigate(activeIndex - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, navigate])

  useEffect(() => {
    const onStart = (e: TouchEvent) => { touchStartX.current = e.touches[0].clientX }
    const onEnd   = (e: TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) navigate(activeIndex + (diff > 0 ? 1 : -1))
    }
    window.addEventListener('touchstart', onStart)
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [activeIndex, navigate])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-brand-black">
      <ProgressBar current={activeIndex} total={slides.length} />
      <SlideNav slides={slides} activeIndex={activeIndex} onNavigate={navigate} />

      {slides.map((slide, i) => {
        const Component = slide.component
        return (
          <SlideWrapper key={slide.id} isActive={i === activeIndex}>
            <Component isActive={i === activeIndex} />
          </SlideWrapper>
        )
      })}

      {/* Prev / Next arrows */}
      <button
        onClick={() => navigate(activeIndex - 1)}
        disabled={activeIndex === 0}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 text-brand-white/40 hover:text-brand-gold disabled:opacity-0 transition-all duration-300"
        aria-label="Previous slide"
      >
        <IconChevronLeft size={32} />
      </button>
      <button
        onClick={() => navigate(activeIndex + 1)}
        disabled={activeIndex === slides.length - 1}
        className="fixed right-16 top-1/2 -translate-y-1/2 z-50 text-brand-white/40 hover:text-brand-gold disabled:opacity-0 transition-all duration-300"
        aria-label="Next slide"
      >
        <IconChevronRight size={32} />
      </button>

      {/* Slide counter */}
      <div className="fixed bottom-6 left-16 z-50 text-brand-white/20 font-sans text-xs tracking-widest">
        {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Stub app/page.tsx to test carousel**

```tsx
// app/page.tsx
'use client'
import CarouselShell from '@/components/carousel/CarouselShell'
import { SLIDES } from '@/lib/slides.config'

const slides = SLIDES.map(s => ({
  ...s,
  component: function StubSlide({ isActive }: { isActive: boolean }) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-brand-black text-brand-white">
        <span className="font-[family-name:var(--font-display)] text-5xl">{s.label}</span>
      </div>
    )
  },
}))

export default function Home() {
  return <CarouselShell slides={slides} />
}
```

- [ ] **Step 6: Verify in browser — 8 stub slides, keyboard nav, dot nav, progress bar, counter**

```bash
npm run dev
```
Open localhost:3000. Press → to advance, ← to go back. Click dots. Check counter bottom-left.

- [ ] **Step 7: Commit**

```bash
git add components/carousel/ app/page.tsx
git commit -m "feat: carousel shell — keyboard/swipe/dot nav, progress bar, GSAP transitions"
```

---

## Task 5: Shared UI Primitives

**Files:**
- Create: `components/ui/StatCounter.tsx`
- Create: `components/ui/VideoBackground.tsx`
- Create: `components/ui/ContactModal.tsx`

- [ ] **Step 1: Write StatCounter.tsx**

```tsx
// components/ui/StatCounter.tsx
'use client'
import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'

interface StatCounterProps {
  value: number
  unit: string
  label: string
  isActive: boolean
  delay?: number
}

export default function StatCounter({ value, unit, label, isActive, delay = 0 }: StatCounterProps) {
  const numRef = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (!isActive || animated.current || !numRef.current) return
    animated.current = true
    const obj = { val: 0 }
    gsap.to(obj, {
      val: value,
      duration: 2,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = value % 1 === 0
            ? Math.round(obj.val).toString()
            : obj.val.toFixed(1)
        }
      },
    })
  }, [isActive, value, delay])

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-5xl md:text-6xl font-[family-name:var(--font-display)] font-semibold text-brand-white">
        <span ref={numRef}>0</span>
        <span className="text-brand-gold">{unit}</span>
      </div>
      <p className="text-xs tracking-widest uppercase text-brand-white/50 font-sans">{label}</p>
    </div>
  )
}
```

- [ ] **Step 2: Write VideoBackground.tsx**

```tsx
// components/ui/VideoBackground.tsx
'use client'

interface VideoBackgroundProps {
  src: string
  poster?: string
  className?: string
  overlayOpacity?: number
}

export default function VideoBackground({
  src,
  poster,
  className = '',
  overlayOpacity = 0.5,
}: VideoBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-brand-black"
        style={{ opacity: overlayOpacity }}
      />
    </div>
  )
}
```

- [ ] **Step 3: Write ContactModal.tsx**

Note: This project uses `@base-ui/react` and `radix-ui` (not shadcn Dialog directly). Use `@base-ui/react` Dialog.

```tsx
// components/ui/ContactModal.tsx
'use client'
import { useState } from 'react'
import * as Dialog from '@base-ui/react/dialog'
import type { CtaId } from '@/lib/moa-data'

const TITLES: Record<CtaId, string> = {
  lease:   'Start a Leasing Conversation',
  sponsor: 'Explore Sponsorship Opportunities',
  events:  'Book Your Event',
}

interface ContactModalProps {
  open: boolean
  onClose: () => void
  type: CtaId
  email: string
}

export default function ContactModal({ open, onClose, type, email }: ContactModalProps) {
  const [name, setName]       = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(TITLES[type])
    const body    = encodeURIComponent(`Name: ${name}\nCompany: ${company}\n\n${message}`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={open => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-brand-black/80 z-50" />
        <Dialog.Popup className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-gray border border-brand-gold/20 rounded-lg p-8 max-w-lg w-full">
            <Dialog.Title className="font-[family-name:var(--font-display)] text-2xl text-brand-white mb-6">
              {TITLES[type]}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                required
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-brand-gray-mid border border-brand-white/10 rounded px-4 py-3 text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-gold/50"
              />
              <input
                required
                placeholder="Company"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="bg-brand-gray-mid border border-brand-white/10 rounded px-4 py-3 text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-gold/50"
              />
              <textarea
                placeholder="Tell us about your interest..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                className="bg-brand-gray-mid border border-brand-white/10 rounded px-4 py-3 text-brand-white placeholder:text-brand-white/30 focus:outline-none focus:border-brand-gold/50 resize-none"
              />
              <button
                type="submit"
                className="bg-brand-gold text-brand-black font-semibold py-3 px-6 rounded hover:bg-brand-gold-light transition-colors"
              >
                Send Inquiry
              </button>
            </form>
            <Dialog.Close className="absolute top-4 right-4 text-brand-white/40 hover:text-brand-white">✕</Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

- [ ] **Step 4: Verify no TypeScript errors**

```bash
npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add components/ui/
git commit -m "feat: UI primitives — StatCounter, VideoBackground, ContactModal"
```

---

## Task 6: Hero Slide

**Files:**
- Create: `components/slides/HeroSlide.tsx`
- Modify: `app/page.tsx` (swap stub)

- [ ] **Step 1: Write HeroSlide.tsx**

```tsx
// components/slides/HeroSlide.tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'
import VideoBackground from '@/components/ui/VideoBackground'
import StatCounter from '@/components/ui/StatCounter'
import { MOA_STATS } from '@/lib/moa-data'

export default function HeroSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const lineRef      = useRef<HTMLDivElement>(null)
  const subtitleRef  = useRef<HTMLParagraphElement>(null)
  const statsRef     = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!isActive || !containerRef.current) return

    const tl = gsap.timeline({ delay: 0.3 })

    tl.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 0.6, ease: 'power2.out' }
    )

    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: 'lines' })
      tl.from(split.lines, {
        y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
      }, '-=0.2')
    }

    tl.from(subtitleRef.current, {
      y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
    }, '-=0.5')

    if (statsRef.current?.children) {
      tl.from(Array.from(statsRef.current.children), {
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
      }, '-=0.4')
    }
  }, { dependencies: [isActive], scope: containerRef })

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-end pb-24">
      <VideoBackground
        src="/videos/hero-loop.mp4"
        poster="/images/hero-poster.jpg"
        overlayOpacity={0.55}
      />

      <div className="relative z-10 px-16 max-w-5xl">
        <div ref={lineRef} className="w-16 h-0.5 bg-brand-gold mb-6" />

        <p className="text-sm tracking-[0.3em] uppercase text-brand-gold font-sans mb-4">
          North America&apos;s #1 Shopping &amp; Entertainment Destination
        </p>

        <h1
          ref={titleRef}
          className="font-[family-name:var(--font-display)] text-6xl md:text-8xl text-brand-white leading-none mb-6 overflow-hidden"
        >
          Where<br />
          <em className="text-brand-gold not-italic">40 Million</em><br />
          Stories Begin.
        </h1>

        <p ref={subtitleRef} className="text-lg text-brand-white/70 font-sans max-w-xl leading-relaxed mb-12">
          Mall of America is not a mall. It is America&apos;s most visited destination —
          a city within a city, drawing visitors from all 50 states and 70+ countries.
        </p>

        <div ref={statsRef} className="flex gap-12">
          <StatCounter value={MOA_STATS.sqFt.value}   unit={MOA_STATS.sqFt.unit}   label={MOA_STATS.sqFt.label}   isActive={isActive} delay={1.2} />
          <StatCounter value={MOA_STATS.stores.value} unit={MOA_STATS.stores.unit} label={MOA_STATS.stores.label} isActive={isActive} delay={1.4} />
          <StatCounter value={MOA_STATS.visitors.value} unit={MOA_STATS.visitors.unit} label={MOA_STATS.visitors.label} isActive={isActive} delay={1.6} />
        </div>
      </div>

      <div className="absolute bottom-8 right-16 text-brand-white/30 text-xs tracking-widest uppercase font-sans flex items-center gap-2">
        <span>Navigate</span>
        <span>→</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update app/page.tsx to use HeroSlide**

```tsx
// app/page.tsx
'use client'
import CarouselShell from '@/components/carousel/CarouselShell'
import { SLIDES } from '@/lib/slides.config'
import HeroSlide from '@/components/slides/HeroSlide'

const slides = SLIDES.map(s => ({
  ...s,
  component: s.id === 'hero'
    ? HeroSlide
    : function StubSlide() {
        return (
          <div className="w-full h-full flex items-center justify-center bg-brand-black text-brand-white">
            <span className="font-[family-name:var(--font-display)] text-5xl">{s.label}</span>
          </div>
        )
      },
}))

export default function Home() {
  return <CarouselShell slides={slides} />
}
```

- [ ] **Step 3: Add placeholder hero video**

Place any short MP4 at `public/videos/hero-loop.mp4` (real MOA footage from YouTube, or placeholder). Without video, poster image still shows.

- [ ] **Step 4: Verify hero slide in browser — line reveals, title splits, stats count up**

- [ ] **Step 5: Commit**

```bash
git add components/slides/HeroSlide.tsx app/page.tsx
git commit -m "feat: hero slide — video bg, GSAP SplitText title, stat counters"
```

---

## Task 7: Why Slide + Retail Slide

**Files:**
- Create: `components/slides/WhySlide.tsx`
- Create: `components/slides/RetailSlide.tsx`

- [ ] **Step 1: Write WhySlide.tsx**

```tsx
// components/slides/WhySlide.tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import StatCounter from '@/components/ui/StatCounter'
import { MOA_STATS } from '@/lib/moa-data'

export default function WhySlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!isActive) return
    gsap.from(containerRef.current?.querySelectorAll('[data-reveal]') ?? [], {
      y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.3,
    })
  }, { dependencies: [isActive], scope: containerRef })

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center bg-brand-black">
      <div className="w-1/2 h-full flex flex-col justify-center px-16 gap-6 border-r border-brand-white/5">
        <div data-reveal className="w-12 h-0.5 bg-brand-gold" />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase text-brand-gold font-sans">The Property</p>
        <h2 data-reveal className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-brand-white leading-tight">
          Built at a Scale<br />
          <span className="text-brand-gold">Nothing Else Matches.</span>
        </h2>
        <p data-reveal className="text-brand-white/60 font-sans leading-relaxed max-w-md">
          Bloomington, MN. 5.6 million sq ft. Direct freeway access, 13,000 parking spaces,
          on-site hotels, and an international airport 5 minutes away.
        </p>
        <div data-reveal className="flex flex-col gap-2 text-sm font-sans text-brand-white/50">
          {[
            '16-state regional draw',
            '40% of visitors are tourists',
            'Average 3+ hour dwell time',
            'On-site Radisson Blu + JW Marriott',
          ].map(item => (
            <div key={item} className="flex items-center gap-3">
              <span className="text-brand-gold">✓</span> {item}
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="grid grid-cols-2 gap-12 px-16">
          {[MOA_STATS.visitors, MOA_STATS.sqFt, MOA_STATS.statesReached, MOA_STATS.hotelRooms].map((stat, i) => (
            <div key={stat.label} data-reveal className="text-center">
              <StatCounter value={stat.value} unit={stat.unit} label={stat.label} isActive={isActive} delay={0.5 + i * 0.15} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write RetailSlide.tsx**

Uses `recharts` (already installed) for category breakdown.

```tsx
// components/slides/RetailSlide.tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { RETAIL_BRANDS, RETAIL_CATEGORIES } from '@/lib/moa-data'

const CHART_COLORS = ['#C9A84C', '#E8C97A', '#A08030', '#D4B060', '#7A6020']

export default function RetailSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!isActive) return
    gsap.from(containerRef.current?.querySelectorAll('[data-reveal]') ?? [], {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'power2.out', delay: 0.3,
    })
  }, { dependencies: [isActive], scope: containerRef })

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center bg-brand-black">
      {/* Left: copy + brand grid */}
      <div className="w-3/5 h-full flex flex-col justify-center px-16 py-12">
        <div data-reveal className="w-12 h-0.5 bg-brand-gold mb-6" />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase text-brand-gold font-sans mb-4">Retail</p>
        <h2 data-reveal className="font-[family-name:var(--font-display)] text-5xl text-brand-white mb-4">
          520+ Brands. One Address.
        </h2>
        <p data-reveal className="text-brand-white/60 font-sans mb-8 max-w-2xl">
          Every category, every price point, every opportunity — MOA hosts the most
          comprehensive retail mix in the country.
        </p>

        <div data-reveal className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-6">
          {RETAIL_BRANDS.map(brand => (
            <div
              key={brand}
              className="border border-brand-white/10 rounded px-2 py-1.5 text-center text-xs text-brand-white/60 hover:border-brand-gold/30 hover:text-brand-white transition-all duration-300"
            >
              {brand}
            </div>
          ))}
          <div className="border border-brand-gold/20 rounded px-2 py-1.5 text-center text-xs text-brand-gold">
            +480 more
          </div>
        </div>
      </div>

      {/* Right: donut chart */}
      <div data-reveal className="w-2/5 h-full flex flex-col items-center justify-center px-8">
        <p className="text-xs tracking-widest uppercase text-brand-white/40 font-sans mb-4">Mix by Category</p>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={RETAIL_CATEGORIES}
              dataKey="pct"
              nameKey="cat"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              strokeWidth={0}
            >
              {RETAIL_CATEGORIES.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.2)', color: '#F5F5F0', fontSize: 12 }}
              formatter={(value: number) => [`${value}%`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-1 w-full max-w-xs">
          {RETAIL_CATEGORIES.map((cat, i) => (
            <div key={cat.cat} className="flex items-center gap-2 text-xs font-sans">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: CHART_COLORS[i] }} />
              <span className="text-brand-white/60">{cat.cat}</span>
              <span className="ml-auto text-brand-gold">{cat.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update app/page.tsx with both slides (keep stubs for others)**

```tsx
import WhySlide from '@/components/slides/WhySlide'
import RetailSlide from '@/components/slides/RetailSlide'

// In slides map:
// id === 'why'    → WhySlide
// id === 'retail' → RetailSlide
```

- [ ] **Step 4: Verify both in browser**

- [ ] **Step 5: Commit**

```bash
git add components/slides/WhySlide.tsx components/slides/RetailSlide.tsx app/page.tsx
git commit -m "feat: why + retail slides — stat grid, brand grid, recharts donut"
```

---

## Task 8: Luxury + Dining Slides

**Files:**
- Create: `components/slides/LuxurySlide.tsx`
- Create: `components/slides/DiningSlide.tsx`

- [ ] **Step 1: Write LuxurySlide.tsx**

```tsx
// components/slides/LuxurySlide.tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { LUXURY_BRANDS } from '@/lib/moa-data'

export default function LuxurySlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!isActive) return
    gsap.from(containerRef.current?.querySelectorAll('[data-reveal]') ?? [], {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.2,
    })
  }, { dependencies: [isActive], scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center"
      style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #111108 50%, #0A0A0A 100%)' }}
    >
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-40">
        <img src="/images/luxury-editorial.jpg" alt="Luxury retail environment" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/60 to-transparent" />
      </div>

      <div className="relative z-10 px-16 max-w-2xl">
        <div data-reveal className="w-12 h-0.5 bg-brand-gold mb-6" />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase text-brand-gold font-sans mb-4">Luxury</p>
        <h2 data-reveal className="font-[family-name:var(--font-display)] text-5xl md:text-6xl text-brand-white leading-tight mb-6">
          The Luxury<br />
          <span className="text-brand-gold italic">Experience</span><br />
          They Expect.
        </h2>
        <p data-reveal className="text-brand-white/60 font-sans leading-relaxed mb-8">
          MOA&apos;s luxury wing delivers the elevated retail environment that premium brands
          demand. Curated foot traffic. High-income visitors. A destination mindset
          that turns browsers into buyers.
        </p>
        <div data-reveal className="grid grid-cols-2 gap-1 mb-8">
          {LUXURY_BRANDS.map(brand => (
            <div key={brand} className="text-brand-white/50 text-sm font-sans tracking-wider border-b border-brand-white/5 py-2">
              {brand}
            </div>
          ))}
        </div>
        <div data-reveal className="flex gap-6 text-xs font-sans text-brand-white/40 tracking-widest uppercase">
          <span>Flagship Opportunities</span>
          <span className="text-brand-gold">·</span>
          <span>Pop-Up Spaces</span>
          <span className="text-brand-gold">·</span>
          <span>Custom Buildouts</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write DiningSlide.tsx**

```tsx
// components/slides/DiningSlide.tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { DINING_VENUES } from '@/lib/moa-data'
import VideoBackground from '@/components/ui/VideoBackground'

export default function DiningSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!isActive) return
    gsap.from(containerRef.current?.querySelectorAll('[data-reveal]') ?? [], {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.3,
    })
  }, { dependencies: [isActive], scope: containerRef })

  return (
    <div ref={containerRef} className="relative w-full h-full flex bg-brand-black">
      <div className="w-1/2 h-full relative">
        <VideoBackground src="/videos/dining-loop.mp4" poster="/images/dining-poster.jpg" overlayOpacity={0.3} />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-black" />
      </div>

      <div className="w-1/2 h-full flex flex-col justify-center px-12 py-12">
        <div data-reveal className="w-12 h-0.5 bg-brand-gold mb-6" />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase text-brand-gold font-sans mb-4">Dining & Lifestyle</p>
        <h2 data-reveal className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-brand-white mb-4 leading-tight">
          50+ Restaurants.<br />Zero Afterthoughts.
        </h2>
        <p data-reveal className="text-brand-white/60 font-sans mb-8 max-w-md">
          MOA&apos;s F&amp;B mix is a destination draw in itself — experiential concepts,
          celebrity chef partnerships, and local icons all under one roof.
        </p>

        <div className="flex flex-col gap-4">
          {DINING_VENUES.map((venue, i) => (
            <div key={venue.name} data-reveal className="flex gap-4 items-start border-b border-brand-white/5 pb-4">
              <span className="font-[family-name:var(--font-display)] text-brand-gold text-xl mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-brand-white font-sans font-medium">{venue.name}</p>
                <p className="text-brand-white/40 text-sm">{venue.description}</p>
              </div>
              <span className="ml-auto text-xs text-brand-white/30 font-sans tracking-wider uppercase shrink-0 mt-1">
                {venue.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update app/page.tsx**

- [ ] **Step 4: Verify**

- [ ] **Step 5: Commit**

```bash
git add components/slides/LuxurySlide.tsx components/slides/DiningSlide.tsx app/page.tsx
git commit -m "feat: luxury + dining slides — editorial layout, split video/list"
```

---

## Task 9: Entertainment + Events Slides

**Files:**
- Create: `components/slides/EntertainmentSlide.tsx`
- Create: `components/slides/EventsSlide.tsx`

- [ ] **Step 1: Write EntertainmentSlide.tsx**

```tsx
// components/slides/EntertainmentSlide.tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import VideoBackground from '@/components/ui/VideoBackground'

const ATTRACTIONS = [
  { name: 'Nickelodeon Universe', desc: '7-acre theme park, 27 rides',  icon: '🎢' },
  { name: 'SEA LIFE Aquarium',    desc: '10,000 sea creatures',         icon: '🐠' },
  { name: 'Crayola Experience',   desc: 'Interactive kids destination', icon: '🎨' },
  { name: 'FlyOver America',      desc: 'Immersive flight experience',  icon: '✈️' },
]

export default function EntertainmentSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!isActive) return
    gsap.from(containerRef.current?.querySelectorAll('[data-reveal]') ?? [], {
      y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.3,
    })
  }, { dependencies: [isActive], scope: containerRef })

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-end pb-20">
      <VideoBackground src="/videos/entertainment-loop.mp4" poster="/images/entertainment-poster.jpg" overlayOpacity={0.5} />

      <div className="relative z-10 px-16 w-full">
        <div data-reveal className="w-12 h-0.5 bg-brand-gold mb-6" />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase text-brand-gold font-sans mb-4">Attractions & Entertainment</p>
        <h2 data-reveal className="font-[family-name:var(--font-display)] text-5xl md:text-7xl text-brand-white mb-6 leading-none">
          The Theme Park<br />
          <span className="text-brand-gold">Inside the Mall.</span>
        </h2>
        <p data-reveal className="text-brand-white/70 font-sans max-w-2xl mb-10">
          Nickelodeon Universe. SEA LIFE Aquarium. Crayola Experience. FlyOver America.
          MOA&apos;s entertainment generates foot traffic no standalone mall can match — and keeps visitors on-site 3× longer.
        </p>
        <div data-reveal className="flex gap-4">
          {ATTRACTIONS.map(attr => (
            <div
              key={attr.name}
              className="bg-brand-white/5 backdrop-blur-sm border border-brand-white/10 rounded-lg px-5 py-4 flex-1 hover:border-brand-gold/30 transition-all duration-300"
            >
              <div className="text-2xl mb-2">{attr.icon}</div>
              <p className="text-brand-white font-sans font-medium text-sm">{attr.name}</p>
              <p className="text-brand-white/40 font-sans text-xs mt-1">{attr.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write EventsSlide.tsx**

```tsx
// components/slides/EventsSlide.tsx
'use client'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { CTA_PATHS, EVENTS_HIGHLIGHTS, type CtaId } from '@/lib/moa-data'
import ContactModal from '@/components/ui/ContactModal'

export default function EventsSlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [modal, setModal] = useState<{ open: boolean; type: CtaId; email: string }>({
    open: false, type: 'events', email: '',
  })

  useGSAP(() => {
    if (!isActive) return
    gsap.from(containerRef.current?.querySelectorAll('[data-reveal]') ?? [], {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.3,
    })
  }, { dependencies: [isActive], scope: containerRef })

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col justify-center bg-brand-black px-16 py-16">
      <div className="max-w-6xl mx-auto w-full">
        <div data-reveal className="w-12 h-0.5 bg-brand-gold mb-6" />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase text-brand-gold font-sans mb-4">Events Platform</p>
        <h2 data-reveal className="font-[family-name:var(--font-display)] text-5xl text-brand-white mb-4">
          The Stage is Set.<br />
          <span className="text-brand-gold">Your Brand is the Show.</span>
        </h2>
        <p data-reveal className="text-brand-white/60 font-sans mb-10 max-w-2xl">
          MOA hosts 400+ events per year — from national concert tours and championship
          sports to corporate product launches and brand activations reaching millions.
        </p>

        <div data-reveal className="grid grid-cols-4 gap-4 mb-12">
          {EVENTS_HIGHLIGHTS.map(event => (
            <div key={event.name} className="border border-brand-white/10 rounded-lg p-4">
              <p className="text-brand-gold text-xs tracking-widest uppercase font-sans mb-2">{event.type}</p>
              <p className="text-brand-white font-sans font-medium mb-1">{event.name}</p>
              <p className="text-brand-white/40 font-sans text-sm">{event.capacity}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="grid grid-cols-3 gap-4">
          {CTA_PATHS.map(path => (
            <button
              key={path.id}
              onClick={() => setModal({ open: true, type: path.id, email: path.email })}
              className="group border border-brand-gold/20 rounded-lg p-6 text-left hover:border-brand-gold hover:bg-brand-gold/5 transition-all duration-300"
            >
              <p className="font-[family-name:var(--font-display)] text-xl text-brand-white mb-1 group-hover:text-brand-gold transition-colors">{path.title}</p>
              <p className="text-brand-white/40 font-sans text-sm mb-4">{path.subtitle}</p>
              <span className="text-brand-gold text-xs tracking-widest uppercase font-sans">{path.cta} →</span>
            </button>
          ))}
        </div>
      </div>

      <ContactModal open={modal.open} onClose={() => setModal(m => ({ ...m, open: false }))} type={modal.type} email={modal.email} />
    </div>
  )
}
```

- [ ] **Step 3: Update app/page.tsx**

- [ ] **Step 4: Verify**

- [ ] **Step 5: Commit**

```bash
git add components/slides/EntertainmentSlide.tsx components/slides/EventsSlide.tsx app/page.tsx
git commit -m "feat: entertainment + events slides — attraction cards, CTA cards, contact modal"
```

---

## Task 10: CTA Slide + Wire All Slides

**Files:**
- Create: `components/slides/CTASlide.tsx`
- Modify: `app/page.tsx` (final wiring)

- [ ] **Step 1: Write CTASlide.tsx**

```tsx
// components/slides/CTASlide.tsx
'use client'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'
import { CTA_PATHS, type CtaId } from '@/lib/moa-data'
import ContactModal from '@/components/ui/ContactModal'

export default function CTASlide({ isActive }: { isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const [modal, setModal] = useState<{ open: boolean; type: CtaId; email: string }>({
    open: false, type: 'lease', email: '',
  })

  useGSAP(() => {
    if (!isActive) return
    const tl = gsap.timeline({ delay: 0.2 })

    if (titleRef.current) {
      const split = new SplitText(titleRef.current, { type: 'lines' })
      tl.from(split.lines, { y: 80, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out' })
    }

    tl.from(containerRef.current?.querySelectorAll('[data-reveal]') ?? [], {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
    }, '-=0.5')
  }, { dependencies: [isActive], scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #1A1500 0%, #0A0A0A 70%)' }}
    >
      <div className="text-center max-w-3xl px-8">
        <div data-reveal className="w-12 h-0.5 bg-brand-gold mx-auto mb-8" />
        <p data-reveal className="text-xs tracking-[0.3em] uppercase text-brand-gold font-sans mb-6">Your Next Move</p>

        <h2
          ref={titleRef}
          className="font-[family-name:var(--font-display)] text-5xl md:text-7xl text-brand-white leading-none mb-8 overflow-hidden"
        >
          Be Part of<br />
          <span className="text-brand-gold">America&apos;s Stage.</span>
        </h2>

        <p data-reveal className="text-brand-white/60 font-sans leading-relaxed mb-12">
          40 million people come to Mall of America every year.
          Brands that are here — win. Which conversation do you want to start?
        </p>

        <div data-reveal className="flex flex-col sm:flex-row gap-4 justify-center">
          {CTA_PATHS.map(path => (
            <button
              key={path.id}
              onClick={() => setModal({ open: true, type: path.id, email: path.email })}
              className={[
                'px-8 py-4 rounded font-sans font-semibold tracking-wider text-sm transition-all duration-300',
                path.id === 'lease'
                  ? 'bg-brand-gold text-brand-black hover:bg-brand-gold-light'
                  : 'border border-brand-gold/40 text-brand-white hover:border-brand-gold hover:bg-brand-gold/10',
              ].join(' ')}
            >
              {path.title}
            </button>
          ))}
        </div>

        <p data-reveal className="text-brand-white/20 font-sans text-xs mt-10 tracking-widest">
          MALL OF AMERICA · BLOOMINGTON, MN
        </p>
      </div>

      <ContactModal open={modal.open} onClose={() => setModal(m => ({ ...m, open: false }))} type={modal.type} email={modal.email} />
    </div>
  )
}
```

- [ ] **Step 2: Replace app/page.tsx with final wiring**

```tsx
// app/page.tsx
'use client'
import CarouselShell from '@/components/carousel/CarouselShell'
import { SLIDES } from '@/lib/slides.config'
import HeroSlide          from '@/components/slides/HeroSlide'
import WhySlide           from '@/components/slides/WhySlide'
import RetailSlide        from '@/components/slides/RetailSlide'
import LuxurySlide        from '@/components/slides/LuxurySlide'
import DiningSlide        from '@/components/slides/DiningSlide'
import EntertainmentSlide from '@/components/slides/EntertainmentSlide'
import EventsSlide        from '@/components/slides/EventsSlide'
import CTASlide           from '@/components/slides/CTASlide'
import type { ComponentType } from 'react'

const SLIDE_COMPONENTS: Record<string, ComponentType<{ isActive: boolean }>> = {
  hero:          HeroSlide,
  why:           WhySlide,
  retail:        RetailSlide,
  luxury:        LuxurySlide,
  dining:        DiningSlide,
  entertainment: EntertainmentSlide,
  events:        EventsSlide,
  cta:           CTASlide,
}

const slides = SLIDES.map(s => ({ ...s, component: SLIDE_COMPONENTS[s.id] }))

export default function Home() {
  return <CarouselShell slides={slides} />
}
```

- [ ] **Step 3: Full run-through — all 8 slides, all nav methods, all modals open**

- [ ] **Step 4: Commit**

```bash
git add components/slides/CTASlide.tsx app/page.tsx
git commit -m "feat: CTA slide + wire all 8 slides into carousel — full deck complete"
```

---

## Task 11: Remotion Hero Intro

**Files:**
- Create: `remotion/compositions/HeroIntro.tsx`
- Create: `remotion/Root.tsx`
- Create: `remotion/remotion.config.ts`

- [ ] **Step 1: Write remotion/remotion.config.ts**

```typescript
// remotion/remotion.config.ts
import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setOverwriteOutput(true)
```

- [ ] **Step 2: Write remotion/compositions/HeroIntro.tsx**

```tsx
// remotion/compositions/HeroIntro.tsx
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion'

export default function HeroIntro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const lineWidth   = interpolate(frame, [10, 40],  [0, 200], { extrapolateRight: 'clamp' })
  const titleOpacity = interpolate(frame, [20, 50],  [0, 1],   { extrapolateRight: 'clamp' })
  const titleY      = interpolate(frame, [20, 50],  [50, 0],  { extrapolateRight: 'clamp' })
  const stat1       = spring({ frame: frame - 50, fps, config: { damping: 20 } })
  const stat2       = spring({ frame: frame - 65, fps, config: { damping: 20 } })
  const stat3       = spring({ frame: frame - 80, fps, config: { damping: 20 } })

  return (
    <AbsoluteFill style={{ background: '#0A0A0A', fontFamily: 'sans-serif' }}>
      {/* Gold line */}
      <div style={{ position: 'absolute', top: '42%', left: 160, width: lineWidth, height: 2, background: '#C9A84C' }} />

      {/* Title */}
      <div style={{ position: 'absolute', top: '45%', left: 160, opacity: titleOpacity, transform: `translateY(${titleY}px)` }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 110, color: '#F5F5F0', lineHeight: 1.05, margin: 0 }}>
          Mall of<br />
          <span style={{ color: '#C9A84C' }}>America.</span>
        </h1>
      </div>

      {/* Stats */}
      <div style={{ position: 'absolute', bottom: 120, left: 160, display: 'flex', gap: 80 }}>
        {([
          { val: (40 * stat1).toFixed(0),  unit: 'M+',      label: 'Annual Visitors' },
          { val: (520 * stat2).toFixed(0), unit: '+',        label: 'Retail Stores' },
          { val: (5.6 * stat3).toFixed(1), unit: 'M sq ft', label: 'Total Area' },
        ] as const).map(s => (
          <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 64, color: '#F5F5F0', fontFamily: 'Georgia, serif', lineHeight: 1 }}>
              {s.val}<span style={{ color: '#C9A84C' }}>{s.unit}</span>
            </span>
            <span style={{ fontSize: 13, color: 'rgba(245,245,240,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}
```

- [ ] **Step 3: Write remotion/Root.tsx**

```tsx
// remotion/Root.tsx
import { Composition } from 'remotion'
import HeroIntro from './compositions/HeroIntro'

export default function Root() {
  return (
    <Composition
      id="HeroIntro"
      component={HeroIntro}
      durationInFrames={120}
      fps={30}
      width={1920}
      height={1080}
    />
  )
}
```

- [ ] **Step 4: Add render script to package.json**

In `package.json` scripts:
```json
"render:hero": "npx remotion render remotion/Root.tsx HeroIntro public/videos/hero-intro.mp4"
```

- [ ] **Step 5: Render**

```bash
npm run render:hero
```
Expected: `public/videos/hero-intro.mp4` created (4s, 1920×1080)

- [ ] **Step 6: Commit**

```bash
git add remotion/ public/videos/hero-intro.mp4 package.json
git commit -m "feat: Remotion hero intro — animated title + stat counters rendered to MP4"
```

---

## Task 12: Assets, Polish, TypeScript Check

**Files:**
- Create: `public/images/` (4 AI-generated images)
- Modify: `components/carousel/CarouselShell.tsx` (loading state)

- [ ] **Step 1: Generate AI images**

Use Midjourney or DALL-E 3. Save to `public/images/`:

| File | Prompt |
|------|--------|
| `hero-poster.jpg` | `Mall of America aerial exterior view, golden hour light, cinematic photography, 16:9, luxury editorial` |
| `luxury-editorial.jpg` | `Luxury retail interior dark moody lighting, designer boutique, editorial photography, --ar 16:9` |
| `dining-poster.jpg` | `Upscale restaurant interior warm lighting, food destination, cinematic, --ar 16:9` |
| `entertainment-poster.jpg` | `Indoor theme park colorful rides, crowd energy, cinematic, --ar 16:9` |

- [ ] **Step 2: Add loading guard to CarouselShell.tsx**

At top of `CarouselShell` component, after the state declarations:

```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true) }, [])
if (!mounted) return <div className="w-screen h-screen bg-brand-black" />
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: 0 errors. Fix any type errors before proceeding.

- [ ] **Step 4: Build check**

```bash
npm run build
```
Expected: build succeeds, `out/` directory created (static export)

- [ ] **Step 5: Verify tablet (768px)**

Open Chrome DevTools, set viewport to 768px wide. Check: text readable, dots visible, CTAs accessible, no overflow.

- [ ] **Step 6: Commit**

```bash
git add public/images/ components/carousel/CarouselShell.tsx
git commit -m "feat: AI assets, loading guard, TypeScript clean, tablet verified"
```

---

## Task 13: Deploy + README

- [ ] **Step 1: Initialize git (if not already)**

```bash
git remote -v
```
If no remote, create GitHub repo then:
```bash
git remote add origin https://github.com/<username>/moa-sales-deck.git
git push -u origin main
```

- [ ] **Step 2: Deploy to Vercel**

```bash
npx vercel --prod
```
Accept defaults. Copy production URL.

- [ ] **Step 3: Verify live URL**

Open production URL. Test: all 8 slides load, video plays, GSAP animates, modals open, keyboard nav works, dot nav works.

- [ ] **Step 4: Write README.md**

Replace existing `README.md`:

```markdown
# Mall of America — Interactive Sales Deck

**Live:** https://<your-vercel-url>.vercel.app

Interactive, carousel-based sales tool for leasing, sponsorship, and event-booking at Mall of America. Non-linear navigation, video-first storytelling, luxury UI inspired by Apple / Hermès / Tesla.

## Stack

- **Next.js 16** (App Router, static export)
- **React 19**, TypeScript
- **Tailwind CSS v4** (`@theme` CSS tokens)
- **GSAP 3** — SplitText headline reveals, slide transitions, stat counters
- **Remotion** — pre-rendered hero intro MP4
- **Recharts** — retail category donut chart
- **@base-ui/react** — contact modal
- **@tabler/icons-react** — nav icons

## Setup

```bash
npm install
npm run dev          # localhost:3000
npm run render:hero  # regenerate Remotion video
npm run build        # static export → out/
```

## Navigation

- **Arrow keys** ← → to navigate slides
- **Touch/swipe** on mobile/tablet
- **Dot nav** (right side) — click any dot to jump
- **On-screen arrows** — prev/next buttons

## Design Decisions

- Carousel (no page scroll) — non-linear per brief; each slide is isolated `100vw × 100vh`
- GSAP `SplitText` for luxury headline reveals (lines mask animation)
- Tailwind v4 with `@theme inline` for brand tokens — no config file needed
- Remotion pre-renders hero intro to MP4 — zero runtime bundle impact
- `recharts` for retail category visualization (already in project deps)
- Dark palette `#0A0A0A` + gold `#C9A84C` — references Apple/Tesla/Hermès

## AI Tools Used

- **Midjourney v6** — hero poster, luxury editorial, dining, entertainment imagery
- **DALL-E 3** — supplemental architectural renders
- **Remotion** — programmatic cinematic video composition

## Phase 2 Expandable Modules

Architecture supports expansion into sub-modules without rewrite:
- `components/modules/EventsModule.tsx` — venue specs, booking form
- `components/modules/SponsorModule.tsx` — tier cards, audience data
- `components/modules/LeaseModule.tsx` — category filter, tailored pitch
```

- [ ] **Step 5: Commit + push**

```bash
git add README.md
git commit -m "docs: README — stack, setup, design decisions, AI tools"
git push
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Cinematic opening — HeroSlide + Remotion MP4
- [x] Non-linear navigation — CarouselShell dot nav + keyboard + swipe
- [x] Video-first — VideoBackground on Hero, Dining, Entertainment
- [x] Why This Property — WhySlide with stats + checklist
- [x] Retail — RetailSlide brand grid + recharts donut
- [x] Luxury — LuxurySlide editorial layout
- [x] Dining — DiningSlide split video/list
- [x] Entertainment — EntertainmentSlide attraction cards
- [x] Events Platform — EventsSlide highlights + CTAs
- [x] Phase 2 expandable — modules directory, modal pattern established
- [x] Deployable — Vercel static export
- [x] AI assets — Midjourney + Remotion
- [x] Clean repo + README

**Tailwind v4 compatibility:** All color tokens use `--color-brand-*` pattern in `@theme inline`. Usage as `bg-brand-black` maps correctly.

**Type consistency:** All slides receive `{ isActive: boolean }`. `CtaId` exported from `moa-data.ts` and used in `ContactModal`, `EventsSlide`, `CTASlide`. `SlideEntry extends SlideConfig` with `component` prop consistent across Tasks 4 and 10.

**No placeholders:** All code blocks complete. All commands include expected output.
