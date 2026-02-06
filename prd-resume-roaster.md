# Product Requirements Document
## AI Resume Roaster & Optimizer

**Version:** 1.0
**Date:** February 5, 2026
**Author:** January — The Growth Angle
**Status:** Draft

---

## 1. Product Overview

### 1.1 Vision
A sleek, AI-powered resume analysis tool that roasts weak resumes and rewrites them for maximum impact. Users upload a PDF resume, select a target role, and receive a brutal-but-helpful score breakdown, flagged weaknesses, and AI-rewritten bullet points — all in a polished before/after diff view.

### 1.2 Problem Statement
Most resume tools are either overly generic ("looks good!") or require expensive subscriptions with bloated features. Job seekers — especially those applying to competitive AI/tech roles — need specific, actionable, section-by-section feedback that tells them *exactly* what's weak and *shows* them the fix.

### 1.3 Target Users
- Software engineers & tech professionals applying to AI companies
- Career switchers targeting tech roles
- Anyone who wants honest, specific resume feedback without paying for a human review

### 1.4 Success Metrics
- Portfolio showcase quality (clean code, modern design, fast UX)
- Demonstrates: PDF processing, AI streaming, structured output, diff rendering
- < 3 seconds to first AI token (streaming response)

---

## 2. Technical Architecture

### 2.1 Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| AI | GLM-4.7 via Z AI (`https://api.z.ai/api/anthropic`) |
| PDF Parsing | `pdf-parse` (server-side) |
| Styling | Tailwind CSS + Framer Motion |
| Diff View | Custom before/after component |
| Deployment | Vercel (free tier) |
| State | React state + URL params (no database) |

### 2.2 API Configuration
```
Base URL: https://api.z.ai/api/anthropic
Model: glm-4.7
Auth: Bearer token via Z AI subscription key
```

### 2.3 Architecture Diagram
```
[User Browser]
    │
    ├── Upload PDF ──→ [Next.js API Route: /api/parse]
    │                       │
    │                       ├── pdf-parse extracts text
    │                       └── Returns structured text
    │
    ├── Analyze ──────→ [Next.js API Route: /api/analyze]
    │                       │
    │                       ├── Sends resume text + target role to Z AI
    │                       ├── Streams structured JSON response
    │                       └── Returns: scores, flags, rewrites
    │
    └── UI renders scores, diff view, download
```

### 2.4 No External Dependencies
- **No database** — all state lives in React (session-only)
- **No auth** — anonymous usage
- **No storage** — PDFs processed in memory, never saved
- **Only API** — Z AI subscription covers all AI calls

---

## 3. Feature Specification

### 3.1 Feature: PDF Upload & Parsing

**Description:** User uploads a PDF resume. System extracts text and identifies sections.

**Acceptance Criteria:**
- Drag-and-drop + click-to-upload zone
- Accepts .pdf only, max 5MB
- Extracts text preserving section structure
- Shows upload progress with animation
- Error handling: corrupt PDF, scanned image PDF (no text), oversized file
- Preview of extracted text before analysis

### 3.2 Feature: Target Role Selection

**Description:** User selects or types a target role to calibrate the AI analysis.

**Acceptance Criteria:**
- Preset role chips: "Software Engineer", "Product Manager", "Data Scientist", "ML Engineer", "Designer", "Marketing"
- Custom role free-text input
- Optional: company name field (for tailored advice)
- Selection persists through the analysis flow

### 3.3 Feature: AI Resume Analysis (Core)

**Description:** AI analyzes the full resume and returns structured, section-by-section feedback.

**AI Output Structure:**
```json
{
  "overall_score": 72,
  "roast_summary": "Your resume reads like a job description, not an impact statement...",
  "sections": [
    {
      "name": "Professional Summary",
      "score": 45,
      "severity": "critical",
      "issues": [
        "Too generic — could apply to anyone in tech",
        "No quantified achievements",
        "Missing keywords for target role"
      ],
      "original_text": "Experienced software engineer...",
      "rewritten_text": "ML engineer with 4+ years shipping production models...",
      "improvement_notes": "Added specificity, metrics, and role-aligned keywords"
    }
  ],
  "quick_wins": ["Add metrics to 3 bullet points", "Remove objective statement", "..."],
  "ats_keywords_missing": ["machine learning", "production systems", "..."],
  "overall_verdict": "brutal_honesty | needs_work | solid | exceptional"
}
```

**Acceptance Criteria:**
- Streaming response — scores appear progressively
- Each section scored 0–100 with color coding
- Severity levels: critical (red), warning (yellow), good (green)
- "Roast" summary is engaging, blunt, but constructive
- ATS keyword gap analysis for target role

### 3.4 Feature: Before/After Diff View

**Description:** Side-by-side (desktop) or toggle (mobile) view showing original vs. rewritten text with inline highlights.

**Acceptance Criteria:**
- Red highlights on removed/weak text
- Green highlights on added/improved text
- Section-by-section navigation
- Copy rewritten text per section or full resume
- Smooth animation when switching between views
- Mobile: swipe or tab toggle between original/improved

### 3.5 Feature: Score Dashboard

**Description:** Visual score breakdown with overall grade and per-section scores.

**Acceptance Criteria:**
- Large animated overall score (circular progress ring)
- Per-section score bars with labels
- Color-coded: 0–40 red, 41–70 yellow, 71–100 green
- Animated counting up effect on load
- Quick wins checklist at the bottom

### 3.6 Feature: Export & Share

**Description:** Download the improved resume analysis as a formatted summary.

**Acceptance Criteria:**
- "Copy all improvements" button
- Download analysis as Markdown
- Share via URL (encode analysis in URL hash — no backend needed)

---

## 4. UI/UX Design Specification

### 4.1 Design System

**Color Palette:**
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0A0A0B` | Main background (dark) |
| `--bg-card` | `#141416` | Card surfaces |
| `--bg-elevated` | `#1C1C1F` | Elevated elements |
| `--accent` | `#6366F1` | Primary actions (indigo) |
| `--accent-hover` | `#818CF8` | Hover state |
| `--success` | `#22C55E` | Good scores, improvements |
| `--warning` | `#F59E0B` | Warning scores |
| `--danger` | `#EF4444` | Critical scores, removed text |
| `--text-primary` | `#F5F5F7` | Headings |
| `--text-secondary` | `#A1A1AA` | Body text |
| `--border` | `#27272A` | Subtle borders |

**Typography:**
- Headings: Inter (700, 600)
- Body: Inter (400)
- Code/scores: JetBrains Mono

**Spacing:** 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)

**Border Radius:** 8px cards, 12px modals, 24px pills/buttons

**Animations:**
- Page transitions: Framer Motion fade + slide (200ms)
- Score counters: spring animation counting up
- Diff highlights: sequential fade-in (staggered 50ms)
- Upload zone: pulse on drag-over

### 4.2 Page Layout

#### Page 1: Landing / Upload
```
┌─────────────────────────────────────────────┐
│  [Logo] Resume Roaster          [GitHub ↗]  │
├─────────────────────────────────────────────┤
│                                             │
│         🔥 Get Your Resume Roasted          │
│     Brutal AI feedback. Beautiful results.  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │     📄 Drop your resume here          │  │
│  │        or click to browse             │  │
│  │                                       │  │
│  │        PDF only · Max 5MB             │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Target Role:                               │
│  [SWE] [PM] [Data Sci] [ML Eng] [Custom…]  │
│                                             │
│  Optional: Company ___________              │
│                                             │
│         [ 🔥 Roast My Resume ]              │
│                                             │
└─────────────────────────────────────────────┘
```

#### Page 2: Analysis Results
```
┌─────────────────────────────────────────────┐
│  [← Back]  Resume Analysis    [↓ Export]    │
├─────────────────────────────────────────────┤
│                                             │
│  Overall Score    Roast Summary             │
│  ┌────────┐      "Your resume reads like    │
│  │  72/100 │      a Wikipedia article about  │
│  │  ◕____  │      a generic engineer..."     │
│  └────────┘                                 │
│                                             │
│  ── Section Scores ──────────────────────── │
│  Summary      ██████░░░░  45/100  CRITICAL  │
│  Experience   ████████░░  78/100  GOOD      │
│  Skills       ██████░░░░  61/100  WARNING   │
│  Education    █████████░  88/100  GOOD      │
│                                             │
│  ── Before / After ──────────────────────── │
│  [Original] [Improved] [Diff]               │
│  ┌──────────────┬──────────────────────┐    │
│  │ Experienced  │ ML engineer with 4+  │    │
│  │ software     │ years shipping       │    │
│  │ engineer     │ production models    │    │
│  │ with 5 yrs  │ serving 2M+ daily    │    │
│  │ experience   │ requests at scale    │    │
│  └──────────────┴──────────────────────┘    │
│                                             │
│  ── Quick Wins ──────────────────────────── │
│  ☐ Add metrics to Experience bullet #2      │
│  ☐ Remove generic objective statement       │
│  ☐ Add "Python, TensorFlow" to skills       │
│                                             │
│  ── Missing ATS Keywords ────────────────── │
│  [machine learning] [CI/CD] [production]    │
│                                             │
└─────────────────────────────────────────────┘
```

### 4.3 Responsive Behavior
- **Desktop (>1024px):** Side-by-side diff view, full score dashboard
- **Tablet (768–1024px):** Stacked layout, collapsible sections
- **Mobile (<768px):** Tab-toggle diff view, swipeable sections, compact scores

### 4.4 Micro-interactions
| Element | Animation | Duration |
|---------|-----------|----------|
| Upload zone drag-over | Border pulse + scale(1.02) | 300ms |
| Score reveal | Number count-up + ring fill | 1.2s ease-out |
| Section scores | Staggered bar fill left-to-right | 800ms, 100ms stagger |
| Diff highlights | Sequential word highlight | 50ms per word |
| Roast text | Typewriter effect | 30ms per char |
| Tab switch | Crossfade with slight Y translate | 200ms |
| Copy button | Checkmark morph + "Copied!" toast | 1.5s |

---

## 5. Task Breakdown

### Epic 1: Project Setup & Infrastructure
**Estimated time: 2–3 hours**

| # | Task | Subtasks | Priority |
|---|------|----------|----------|
| 1.1 | Initialize Next.js project | • `npx create-next-app@latest` with App Router, TypeScript, Tailwind | P0 |
| 1.2 | Configure project structure | • Create folder structure: `/app`, `/components`, `/lib`, `/types` | P0 |
| | | • Set up path aliases in `tsconfig.json` | |
| | | • Add `.env.local` with `ZAI_API_KEY` and `ZAI_BASE_URL=https://api.z.ai/api/anthropic` | |
| 1.3 | Install dependencies | • `pdf-parse` for PDF extraction | P0 |
| | | • `framer-motion` for animations | |
| | | • `lucide-react` for icons | |
| | | • `clsx` + `tailwind-merge` for class utilities | |
| 1.4 | Set up design system | • Create `tailwind.config.ts` with custom colors, fonts, spacing | P0 |
| | | • Add Inter + JetBrains Mono via `next/font` | |
| | | • Create `/lib/cn.ts` utility | |
| 1.5 | Create shared components | • Button (primary, secondary, ghost variants) | P1 |
| | | • Card component with glass-morphism effect | |
| | | • Badge component (critical, warning, good) | |
| | | • Toast notification component | |

### Epic 2: PDF Upload & Parsing
**Estimated time: 3–4 hours**

| # | Task | Subtasks | Priority |
|---|------|----------|----------|
| 2.1 | Build upload zone UI | • Drag-and-drop area with `onDrop`/`onDragOver` | P0 |
| | | • Click-to-browse with hidden `<input type="file">` | |
| | | • Drag-over visual state (pulse border, scale) | |
| | | • File validation (PDF only, max 5MB) | |
| | | • Error states with friendly messages | |
| 2.2 | Create PDF parse API route | • `POST /api/parse` — accepts FormData with PDF | P0 |
| | | • Use `pdf-parse` to extract text | |
| | | • Return structured text (preserve line breaks) | |
| | | • Error handling: corrupt file, no text (scanned), too large | |
| 2.3 | Build text preview panel | • Show extracted text in scrollable panel | P1 |
| | | • "Looks good" / "Try another" actions | |
| | | • Highlight detected sections (Summary, Experience, etc.) | |
| 2.4 | Add upload progress UX | • Loading spinner during upload | P1 |
| | | • File name + size display after upload | |
| | | • "Remove" button to clear and re-upload | |

### Epic 3: Role Selection & Configuration
**Estimated time: 1–2 hours**

| # | Task | Subtasks | Priority |
|---|------|----------|----------|
| 3.1 | Build role selector | • Preset role chips with active state | P0 |
| | | • Custom role text input (appears on "Custom" chip click) | |
| | | • Optional company name field | |
| 3.2 | Wire up state management | • Combine PDF text + role + company into analysis request | P0 |
| | | • Validate all required fields before enabling "Roast" button | |
| | | • Disabled state with tooltip for incomplete fields | |

### Epic 4: AI Analysis Engine
**Estimated time: 4–5 hours**

| # | Task | Subtasks | Priority |
|---|------|----------|----------|
| 4.1 | Create analysis API route | • `POST /api/analyze` — accepts resume text + role + company | P0 |
| | | • Configure Z AI API client: | |
| | | &nbsp;&nbsp;— Base URL: `https://api.z.ai/api/anthropic` | |
| | | &nbsp;&nbsp;— Model: `glm-4.7` | |
| | | &nbsp;&nbsp;— Bearer auth with env key | |
| | | • Enable streaming response | |
| 4.2 | Craft analysis prompt | • System prompt: "You are a brutal but constructive resume reviewer..." | P0 |
| | | • Define JSON output schema in prompt | |
| | | • Include role-specific evaluation criteria | |
| | | • Include ATS keyword awareness | |
| | | • Test prompt with 3+ real resumes | |
| 4.3 | Parse streaming JSON | • Incrementally parse AI response chunks | P0 |
| | | • Extract overall score first (show immediately) | |
| | | • Extract sections progressively | |
| | | • Handle malformed/partial JSON gracefully | |
| 4.4 | Build retry & error handling | • Timeout after 30s with retry option | P1 |
| | | • Rate limit awareness (show "try again in X seconds") | |
| | | • Fallback: if streaming fails, retry with non-streaming | |

### Epic 5: Score Dashboard
**Estimated time: 3–4 hours**

| # | Task | Subtasks | Priority |
|---|------|----------|----------|
| 5.1 | Build overall score ring | • SVG circular progress with animated stroke-dashoffset | P0 |
| | | • Number count-up animation (0 → score) | |
| | | • Color transitions: red → yellow → green based on score | |
| | | • Verdict label below (e.g., "Needs Work") | |
| 5.2 | Build section score bars | • Horizontal bar chart per section | P0 |
| | | • Staggered fill animation on mount | |
| | | • Score number + severity badge per row | |
| | | • Click to scroll to that section's diff | |
| 5.3 | Build roast summary card | • Typewriter animation for roast text | P0 |
| | | • 🔥 emoji accent | |
| | | • Expandable if text is long | |
| 5.4 | Build quick wins checklist | • Interactive checklist (checkboxes, local state) | P1 |
| | | • Strike-through animation on check | |
| | | • Progress indicator: "2 of 5 done" | |
| 5.5 | Build ATS keyword pills | • Missing keywords as pill/chip badges | P1 |
| | | • Click to copy individual keyword | |

### Epic 6: Before/After Diff View
**Estimated time: 4–5 hours**

| # | Task | Subtasks | Priority |
|---|------|----------|----------|
| 6.1 | Build diff container layout | • Tab navigation: "Original" / "Improved" / "Diff" | P0 |
| | | • Desktop: side-by-side panels | |
| | | • Mobile: tab toggle with crossfade | |
| 6.2 | Build word-level diff engine | • Compare original vs. rewritten per section | P0 |
| | | • Compute word-level insertions/deletions | |
| | | • Generate highlighted spans (red=removed, green=added) | |
| 6.3 | Build section navigation | • Scrollable section tabs/pills | P0 |
| | | • Active section highlighting | |
| | | • Section jump from score dashboard (click score → scroll to section) | |
| 6.4 | Add copy functionality | • "Copy improved text" per section | P1 |
| | | • "Copy all improvements" button | |
| | | • Animated checkmark + toast on copy | |
| 6.5 | Add improvement notes | • Expandable note per section explaining *why* changes were made | P1 |
| | | • Collapsible by default, expand on click | |

### Epic 7: Export & Polish
**Estimated time: 2–3 hours**

| # | Task | Subtasks | Priority |
|---|------|----------|----------|
| 7.1 | Markdown export | • Generate formatted Markdown of full analysis | P1 |
| | | • Include scores, sections, rewrites, quick wins | |
| | | • Download as `.md` file | |
| 7.2 | URL sharing | • Encode analysis results in URL hash (compressed) | P2 |
| | | • Decode on load — shareable analysis without backend | |
| 7.3 | Landing page polish | • Hero section with engaging copy | P1 |
| | | • Sample analysis preview (static example) | |
| | | • Footer with GitHub link | |
| 7.4 | Loading states | • Skeleton screens during PDF parsing | P0 |
| | | • Animated "Analyzing..." state with progress steps | |
| | | • Streaming text reveal as AI responds | |

### Epic 8: Responsive & Accessibility
**Estimated time: 2–3 hours**

| # | Task | Subtasks | Priority |
|---|------|----------|----------|
| 8.1 | Mobile optimization | • Test all views at 375px, 390px, 414px widths | P0 |
| | | • Tab-toggle diff view for mobile | |
| | | • Collapsible score sections | |
| | | • Touch-friendly upload zone | |
| 8.2 | Accessibility | • Keyboard navigation for all interactive elements | P1 |
| | | • ARIA labels on score visualizations | |
| | | • Screen reader text for color-coded scores | |
| | | • Focus ring styles | |
| 8.3 | Performance | • Lazy load diff view (only compute when tab is active) | P1 |
| | | • Memoize score animations | |
| | | • Dynamic import for `pdf-parse` (server only) | |

---

## 6. API Route Specifications

### `POST /api/parse`
**Purpose:** Extract text from uploaded PDF
```
Request:  FormData { file: File (PDF) }
Response: { success: true, text: string, sections: string[] }
Error:    { success: false, error: "No text found - is this a scanned PDF?" }
```

### `POST /api/analyze`
**Purpose:** Send resume to AI for analysis (streaming)
```
Request:  { resumeText: string, targetRole: string, company?: string }
Response: ReadableStream (SSE) with JSON chunks
Headers:  Content-Type: text/event-stream
```

**Z AI API call inside route:**
```typescript
const response = await fetch("https://api.z.ai/api/anthropic/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ZAI_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "glm-4.7",
    max_tokens: 4096,
    stream: true,
    system: RESUME_ANALYSIS_SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildAnalysisPrompt(resumeText, targetRole, company) }]
  })
});
```

---

## 7. File Structure
```
resume-roaster/
├── app/
│   ├── layout.tsx              # Root layout + fonts + metadata
│   ├── page.tsx                # Landing / upload page
│   ├── results/
│   │   └── page.tsx            # Analysis results page
│   ├── api/
│   │   ├── parse/route.ts      # PDF extraction endpoint
│   │   └── analyze/route.ts    # AI analysis endpoint (streaming)
│   └── globals.css             # Tailwind base + custom properties
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Toast.tsx
│   │   └── Tabs.tsx
│   ├── upload/
│   │   ├── DropZone.tsx        # Drag & drop upload area
│   │   ├── FilePreview.tsx     # Uploaded file info
│   │   └── RoleSelector.tsx    # Role chip selector
│   ├── analysis/
│   │   ├── ScoreRing.tsx       # Circular overall score
│   │   ├── SectionScores.tsx   # Horizontal bar scores
│   │   ├── RoastSummary.tsx    # Typewriter roast text
│   │   ├── QuickWins.tsx       # Checklist component
│   │   └── AtsKeywords.tsx     # Missing keyword pills
│   └── diff/
│       ├── DiffContainer.tsx   # Tab layout + responsive logic
│       ├── DiffPanel.tsx       # Single panel (original or improved)
│       ├── InlineDiff.tsx      # Word-level diff highlights
│       └── SectionNav.tsx      # Section tab navigation
├── lib/
│   ├── cn.ts                   # clsx + tailwind-merge utility
│   ├── pdf.ts                  # PDF parsing helpers
│   ├── ai.ts                   # Z AI API client + prompt builder
│   ├── diff.ts                 # Word-level diff algorithm
│   └── types.ts                # TypeScript interfaces
├── .env.local                  # ZAI_API_KEY, ZAI_BASE_URL
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 8. Milestones & Timeline

| Milestone | Epics | Est. Hours | Target |
|-----------|-------|------------|--------|
| **M1: Skeleton** | Epic 1 (Setup) | 3h | Day 1 |
| **M2: Upload Flow** | Epic 2 + 3 (Upload + Role) | 5h | Day 2 |
| **M3: AI Core** | Epic 4 (Analysis Engine) | 5h | Day 3 |
| **M4: Results UI** | Epic 5 + 6 (Scores + Diff) | 8h | Day 4–5 |
| **M5: Polish** | Epic 7 + 8 (Export + Responsive) | 5h | Day 6 |
| **Total** | | **~26 hours** | **~6 days** |

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| PDF parsing fails on complex layouts | User gets garbled text | Show text preview, let user edit before analysis |
| AI returns malformed JSON | App crashes | Wrap in try/catch, retry with explicit JSON instruction |
| Z AI rate limits hit | Analysis fails mid-stream | Show partial results + "retry" button |
| Large resumes exceed token limit | Truncated analysis | Cap at ~3000 words, warn user to trim |
| Scanned PDFs (image-only) | No text extracted | Detect empty text, show "scanned PDF not supported" message |

---

## 10. Out of Scope (v1)

- User accounts / authentication
- Database storage of analyses
- Actual resume PDF generation (we analyze, not generate)
- Multi-language resume support
- LinkedIn profile import
- Payment / premium tiers
- Resume templates

---

## 11. Definition of Done

- [ ] PDF upload works with drag-and-drop and click
- [ ] AI analysis returns structured scores for 4+ resume sections
- [ ] Before/after diff view renders with word-level highlighting
- [ ] Score dashboard animates on load
- [ ] Quick wins checklist is interactive
- [ ] ATS keywords display as pills
- [ ] Works on mobile (375px+)
- [ ] Deployed to Vercel with working demo
- [ ] README with setup instructions + demo GIF
- [ ] Clean git history with conventional commits
