# Mall of America — Interactive Commercial Deck

A cinematic, slide-based sales presentation for Mall of America's commercial leasing, sponsorship, and event opportunities. Built as a full-screen interactive experience with GPU-accelerated animations and a macOS-style dock navigation.

**Live:** https://liat-theta.vercel.app  
**Repo:** https://github.com/neilkumar93600/liat

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | GSAP 3 + SplitText plugin |
| 3D | Three.js (particle field) |
| Charts | Recharts |
| UI components | shadcn/ui (Radix primitives) |
| Fonts | Playfair Display (display) · Inter (sans) |
| Deployment | Vercel |

---

## Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
# → http://localhost:3000

# Production build
npm run build && npm start
```

Requires Node 20+. No environment variables needed.

---

## Slides

| # | Slide | Content |
|---|---|---|
| 01 | Hero | Video background, Three.js particles, animated stat counters |
| 02 | Why MOA | Visitor origin chart, key differentiators |
| 03 | Retail | Lease opportunity breakdown, category bar chart |
| 04 | Luxury | Premium tenant showcase |
| 05 | Dining & Lifestyle | F&B district highlights |
| 06 | Entertainment | Attractions and footfall drivers |
| 07 | Events Platform | Event capacity chart, booking proposition |
| 08 | Partner With Us | CTA with contact modal |

---

## Navigation

- **Keyboard:** Arrow keys (← → ↑ ↓)
- **Touch:** Swipe left / right
- **Dock:** macOS-style icon dock at bottom — magnifies on hover, shows active indicator
- **Arrows:** Left / right chevron buttons on slide edges
- **Progress bar:** Top of screen

---

## Design Decisions

**Full-screen cinematic mode.** No traditional page layout — every slide owns 100 vw × 100 vh. The goal was investor-grade polish, not a blog template.

**GSAP for all motion.** Framer Motion is available in the project but GSAP was chosen for slides because it handles `SplitText` character-level animations and complex timelines with less overhead. Each slide runs its entrance timeline once (guarded by `hasAnimated` ref), then idles.

**Dock navigation over a sidebar.** The macOS-style dock with cosine-curve magnification gives users a spatial sense of the full deck at a glance without a persistent sidebar eating screen space. Icons are bespoke SVG matched to each section theme.

**Gold / near-black palette.** `#C9A84C` gold on `#0A0A0A` near-black matches Mall of America's premium positioning and provides sufficient contrast without a pure white that would fight the video overlays.

**Three.js particle field on Hero.** Provides depth and motion without video playback on slower connections — the particles activate only when the slide is active and are cleaned up on unmount.

**Static data, no API.** All stats and copy are sourced from publicly available MOA figures and hardcoded in `/lib/moa-data.ts`. No external fetch dependencies means zero runtime latency.

---

## AI Tools Used

- **Claude (Anthropic)** — primary coding assistant via Claude Code CLI. Used for component architecture, GSAP timeline authoring, Three.js particle system, Recharts configuration, and the macOS dock magnification math.
- **Cursor** — in-editor AI completions during rapid iteration on slide layouts.
- AI was used to accelerate implementation; all design decisions, content structure, and final review were done by the developer.

---

## What I'd Improve With More Time

1. **Video fallback** — swap the CDN video for a self-hosted, optimised WebM with a static poster on slow connections.
2. **Real data layer** — pull live occupancy and visitor stats from a CMS (Contentful or Sanity) so the deck stays current without a redeploy.
3. **Transition variety** — currently all slides use the same vertical clip-path entrance. Alternate reveals (horizontal wipe for Retail, scale for Entertainment) would add editorial rhythm.
4. **Accessibility** — add `prefers-reduced-motion` guards around GSAP timelines and ensure full keyboard focus management between slides.
5. **PDF export** — a "Download PDF" button that Puppeteer-renders each slide server-side would make this usable in offline pitches.
