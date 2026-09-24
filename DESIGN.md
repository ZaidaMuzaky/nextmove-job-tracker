---
name: Nextmove
description: A campus editorial planner for keeping the next job-search move in view.
colors:
  paper: "#f4f1e8"
  paper-bright: "#fffdf7"
  ink: "#171713"
  muted: "#6f7068"
  line: "#d8d4c8"
  violet: "#6548e8"
  violet-dark: "#4c34c4"
  lime: "#d9ff63"
  coral: "#ff765f"
  aqua: "#90e6d0"
  blue: "#81a8ff"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, sans-serif"
    fontSize: "clamp(40px, 5vw, 72px)"
    fontWeight: 720
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Bricolage Grotesque Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Bricolage Grotesque Variable, sans-serif"
    fontSize: "10px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.06em"
rounded:
  control: "12px"
  surface: "14px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "20px"
  xl: "38px"
components:
  button-primary:
    backgroundColor: "{colors.violet}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.violet-dark}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
  button-secondary:
    backgroundColor: "{colors.paper-bright}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  input-field:
    backgroundColor: "#f7f4ec"
    textColor: "{colors.ink}"
    rounded: "11px"
    padding: "11px 12px"
    height: "43px"
  card:
    backgroundColor: "{colors.paper-bright}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "13px"
  nav-active:
    backgroundColor: "#30302a"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "12px 13px"
---

# Design System: Nextmove

## Overview

**Creative North Star: "The Campus Editorial Planner"**

The Campus Editorial Planner treats a job search as a personal plan in motion. Warm paper and carbon ink make the workspace feel like a well-kept working notebook; oversized, tightly set headings give each visit an editorial point of entry. Compact metadata keeps 5–40 opportunities scannable without making the interface feel like a recruiting database.

Violet marks the primary action and moments of focus. Lime brings a quick signal to what is due today and to the momentum panel, while coral and cool secondary hues distinguish outcomes and stages. Cards, clipped corner marks, small uppercase labels, and restrained shadows add tactile character while keeping next actions in front. The interface explicitly frames progress as information rather than a score.

**Key Characteristics:**
- Warm paper, carbon ink, and bright but bounded signals
- Editorial display type paired with compact, practical labels
- Action-first hierarchy with a tactile application pipeline
- Responsive, locally grounded personal workspace

## Colors

The palette pairs warm stationery neutrals with violet action cues, lime immediacy, and distinct stage colors.

### Primary
- **Notebook Violet** (`{colors.violet}`): Primary add and save actions, display emphasis, selected navigation, and keyboard focus.
- **Deep Violet** (`{colors.violet-dark}`): Hover state for the primary action.

### Secondary
- **Margin Lime** (`{colors.lime}`): Today deadlines, the momentum surface, active brand mark, and undo action; use as a signal rather than a general page fill.
- **Interview Blue** (`{colors.blue}`): Applied-stage marker.
- **Quiet Aqua** (`{colors.aqua}`): Local-storage reassurance indicator.

### Tertiary
- **Deadline Coral** (`{colors.coral}`): Rejected-stage marker and overdue accents.

### Neutral
- **Warm Paper** (`{colors.paper}`): Main canvas, keeping the workspace softer than a white dashboard.
- **Bright Stock** (`{colors.paper-bright}`): Cards, lists, and editor sheet surfaces.
- **Carbon Ink** (`{colors.ink}`): Main text and dark navigation rail.
- **Soft Graphite** (`{colors.muted}`): Supporting descriptions and secondary metadata.
- **Pencil Rule** (`{colors.line}`): Section separators and subtle structure.

### Named Rules
**The Signal Rule.** Violet directs action; lime identifies immediate attention. Keep both legible and purposeful rather than using them as decorative fills everywhere.

## Typography

**Display Font:** Bricolage Grotesque Variable (with sans-serif fallback)  
**Body Font:** Bricolage Grotesque Variable (with sans-serif fallback)  
**Label/Mono Font:** Bricolage Grotesque Variable; keyboard shortcut uses the browser's system monospace treatment.

**Character:** A single expressive family gives the large headline warmth and personality, while weight, scale, and tracking keep controls direct. Small uppercase labels add planner-like precision without introducing a competing typeface.

### Hierarchy
- **Display** (720, `clamp(40px, 5vw, 72px)`, 0.96 line-height, -0.04em): The Today hero; its emphasized line switches to violet and a lighter weight.
- **Headline** (700, 26px, 1.1 line-height, -0.025em): Pipeline section title.
- **Title** (700, 15px, 1.3 line-height): Action-stack and compact surface headings.
- **Body** (400, 13px, 1.5 line-height): Supporting explanation and standard reading text; dense card metadata may step down to 9–11px.
- **Label** (800, 10px, 1.3 line-height, 0.06em tracking, uppercase where used): Field names, pipeline headings, and compact status context.

### Named Rules
**The One Family Rule.** Use Bricolage Grotesque Variable throughout the interface; create hierarchy through size, weight, and tracking rather than introducing a new display face.

## Layout

The desktop workspace pairs a fixed dark rail (220px) with a fluid canvas and 38px side padding. A sticky 84px top bar holds search and the always-visible add action. The Today section leads with a large headline, then pairs an action queue with a narrower momentum panel; the pipeline follows beneath a fine divider. The board presents five compact columns with horizontal overflow when needed.

At 960px, the rail becomes icon-only (76px), the content padding tightens, and board columns become fixed-width horizontal panels. At 720px, the rail disappears; the top bar wraps brand, add action, and full-width search; the Today panels stack; and the pipeline supports a compact list view alongside horizontally scrollable board columns. Form grids collapse to one column. The observed rhythm uses compact 6–14px control and metadata gaps, 18–20px surface spacing, and broad 38–56px section breathing room.

## Elevation & Depth

Depth is a restrained hybrid: warm tonal shifts and fine rules do most of the organizing, while low, diffuse shadows lift key cards and the primary action. Hover adds a small physical response. The editor sheet receives the strongest shadow and a subdued backdrop so the form reads as a focused layer over the planner.

### Shadow Vocabulary
- **Action lift** (`0 7px 18px rgba(80, 53, 200, .2)`): Soft violet lift beneath the primary action.
- **Surface lift** (`0 7px 20px rgba(57, 50, 35, .055)`): Quiet separation for application cards.
- **Surface hover** (`0 12px 25px rgba(57, 50, 35, .1)`): Slightly stronger card lift on hover.
- **Editor focus** (`-22px 0 60px rgba(20,20,17,.18)`): Deep edge shadow on the full-height editor sheet.

### Named Rules
**The Quiet Lift Rule.** Shadows should clarify an interactive layer or raised surface; use paper tone and borders for ordinary grouping.

## Shapes

Controls and navigation use gently rounded corners (10–12px); larger cards and panels use a consistent 14px radius. Deadline tags are fully pill-shaped. The brand mark and company avatars repeat a clipped lower corner, the system's small editorial signature. Fine warm-gray borders define inputs and section breaks; empty board columns use a dashed outline.

## Components

Components feel tactile and confident, with compact proportions and clear state changes.

### Buttons
- **Shape:** Softly rounded corners (12px), 44px minimum height, and a compact icon-plus-label gap.
- **Primary:** Notebook Violet with white text and a restrained violet shadow; the label is bold and sentence case.
- **Hover / Focus:** Hover deepens violet and lifts by 1px. Keyboard focus uses a visible 3px violet outline with a 3px offset.
- **Secondary:** Bright Stock fill, thin neutral border, and a warm-gray hover fill.
- **Destructive:** Delete is a text-first action in muted red, separated from save/cancel; confirmation offers explicit delete and cancel choices.

### Chips
- **Style:** Deadline tags are compact, bold pills on a soft neutral background.
- **State:** Overdue uses pale coral with dark red text; due today uses lime; future dates remain neutral. Stage identity uses distinct blue, violet, green, and coral markers.

### Cards / Containers
- **Corner Style:** Soft 14px corners on application cards and the action queue.
- **Background:** Bright Stock against the warm paper canvas.
- **Shadow Strategy:** Low ambient lift at rest, slightly stronger on hover; see Elevation & Depth.
- **Border:** Usually borderless; thin internal rules divide action rows and card details.
- **Internal Padding:** Application cards use 13px; the action queue uses about 20px horizontally.

### Inputs / Fields
- **Style:** Warm tinted input fill, 1px pencil border, 11px corners, and 11–12px inner padding.
- **Focus:** Violet border with a soft violet halo; global keyboard focus remains visibly outlined.
- **Error / Disabled:** Invalid fields turn their border and concise helper message red. Disabled styling is not established in the current interface.

### Navigation
- **Style:** Fixed carbon rail with a compact wordmark, icon-led links, and personal-space control.
- **Default / Active:** Muted text at rest; active or hovered link gets a slightly lighter dark surface and white text, with a lime active dot.
- **Mobile:** The rail hides below 720px and a compact wordmark moves into the top bar.

### Action Queue
The “On your radar” queue uses numbered rows, a clear action sentence, company and role context, and a deadline pill. Overdue and due-today accents are explicit; an affirmative quiet state replaces the list when there is nothing due. Rows open the relevant application for editing.

### Application Card
Two-letter company monogram and role/company title anchor the card. Location, deadline, next action, and source or work mode follow as compact metadata. The stage picker makes movement available without relying on drag-and-drop alone.

### Editor Sheet
A right-side, full-height sheet uses a blurred dark scrim, sticky title bar, and bright surface. It traps keyboard focus, closes with Escape or backdrop click, and returns focus to the invoking control. Reduced-motion preferences collapse its entrance animation.

## Do's and Don'ts

### Do:
- **Do** keep the warm paper canvas and carbon text as the default working surface.
- **Do** use violet for primary actions and focus, and lime for immediate attention or active momentum cues.
- **Do** keep company and role prominent while secondary metadata stays compact and may truncate cleanly.
- **Do** preserve visible keyboard focus and honor reduced-motion preferences.
- **Do** keep overdue, today, and future deadlines distinguishable by both text and color.

### Don't:
- **Don't** turn the momentum percentage into a score or use rejection as a celebratory event.
- **Don't** make shadows the primary way ordinary content is grouped.
- **Don't** rely on drag-and-drop as the only way to change a stage.
- **Don't** introduce additional type families without a demonstrated hierarchy need.
