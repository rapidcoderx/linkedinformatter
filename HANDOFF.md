# HANDOFF.md — LinkedIn Text Formatter

> Project handoff document for developers picking up this codebase.

---

## Quick Start

```bash
npm install           # Install dependencies
npm run build:css     # Build Tailwind CSS (required before first run)
npm start             # Start server at http://localhost:3000
npm run dev           # Dev mode with auto-reload (nodemon)
npm run watch:css     # Watch & rebuild CSS on changes
```

---

## Project Summary

A web-based LinkedIn post formatter that converts plain text and markdown into Unicode-styled text (bold, italic, monospace, script, fraktur, etc.) that renders natively on LinkedIn without any special formatting support.

**Stack:** Node.js + Express v5 + Tailwind CSS v4 + Vanilla JavaScript  
**No frontend frameworks.** No build step for JS. Only CSS needs building.

---

## File Map

| File | Purpose | Key Details |
|------|---------|-------------|
| `server.js` | Express server | API routes, static files, markdown conversion, Helmet CSP |
| `public/index.html` | Single-page app | Header, editor, toolbar, preview panel, modals |
| `public/js/app.js` | Main app logic | Editor events, slash menu, preview, copy, export, emoji, undo/redo |
| `public/js/unicode-maps.js` | Unicode engine | 20+ character maps, `toBold()`, `toItalic()`, `transform()` |
| `public/js/slash-commands.js` | Slash commands | 25+ commands with categories, search, execute |
| `public/js/emoji-data.js` | Emoji picker data | Curated LinkedIn-appropriate emojis by category |
| `src/css/input.css` | Tailwind source | `@theme` config, custom CSS classes (no `tailwind.config.js`) |
| `public/css/styles.css` | Built CSS | **Generated file** — do not edit directly |

---

## Architecture Decisions

### Why Vanilla JS?
Performance and simplicity. No framework overhead, no virtual DOM, no build step for JavaScript. The app is a single-page text tool — frameworks add complexity without value here.

### Why `<textarea>` over `contenteditable`?
Reliability. `contenteditable` has inconsistent behavior across browsers for cursor positioning, text selection, and undo/redo. `<textarea>` is predictable and accessible.

### Why Tailwind CSS v4?
CSS-first configuration with `@theme` directive. No JavaScript config file. Faster builds (~105ms). Theme variables defined directly in CSS.

### Why Express v5?
Modern routing, better error handling. Note: v5 removed wildcard `*` route patterns — SPA catch-all uses `app.use()` middleware instead.

---

## Key Patterns

### Unicode Transformation Flow
1. User selects text in editor → clicks toolbar button
2. `app.js` calls `UnicodeMaps.toBold(selectedText)` (or other style)
3. Unicode map replaces ASCII chars with Mathematical Alphanumeric Symbols
4. Transformed text replaces selection in `<textarea>`

### Markdown Live Preview
- `containsMarkdown(text)` detects markdown patterns (headings, bold, lists, etc.)
- `clientSideMarkdownConvert(text)` converts markdown syntax to Unicode equivalents
- `updatePreview()` auto-detects and converts on every keystroke
- Server-side conversion available at `POST /api/markdown-to-linkedin` (uses `marked` library)

### Slash Commands
- User types `/` → `slashState.active = true`
- Keystrokes build `slashState.query` → filtered against `SlashCommands.search()`
- Arrow keys navigate, Enter selects → `command.action()` returns formatted text
- Text inserted at cursor position

### Post Optimization Score
- `calculatePostScore(text)` runs on every keystroke (via `updatePreview()` → `updateScorePanel()`)
- Scores 5 dimensions (0-20 each, 100 total): Hook, Readability, Formatting, Structure, Length
- Returns `{ total, hookScore, readScore, fmtScore, strScore, lenScore, grade, tips[] }`
- Visual ring uses SVG `stroke-dashoffset` animation; bars use CSS width transitions
- Tips are contextual — they change based on what's missing (max 4 shown)

### Device Preview (Phone & Tablet)
- `openDevicePreview(mode)` opens a modal with phone or tablet frame
- Phone: 375px width; Tablet: 768px width
- Shows full LinkedIn app chrome (header, avatar, engagement bar)
- Reuses `clientSideMarkdownConvert()` for markdown → Unicode in device view

---

## Common Tasks

### Adding a New Unicode Style
1. Add the character map to `public/js/unicode-maps.js` inside the IIFE
2. Add a convenience method (`toNewStyle()`) in the public API
3. Add a toolbar button in `public/index.html`
4. Wire up the click handler in `app.js` toolbar section

### Adding a New Slash Command
1. Add command object to `commands` array in `public/js/slash-commands.js`
2. Provide `name`, `label`, `description`, `icon`, `category`, `action` function
3. The command auto-appears in the slash menu (no other changes needed)

### Modifying the Theme
1. Edit `src/css/input.css` — update `@theme { }` variables
2. Run `npm run build:css` to regenerate `public/css/styles.css`
3. Never edit `public/css/styles.css` directly

---

## Known Constraints

- **LinkedIn character limit:** 3,000 characters. Unicode characters count as 1 char each despite being multi-byte.
- **Some Unicode styles have gaps:** Not all ASCII chars have Unicode equivalents in every style (e.g., digits missing in some script variants). The maps handle this gracefully by returning the original character.
- **Accessibility:** Screen readers may struggle with some Unicode variants. This is an inherent limitation of the Unicode approach.
- **Express v5 breaking changes:** No `app.get('*', ...)` wildcard patterns. Use `app.use()` middleware for catch-all routes.

---

## Environment

- **Node.js:** v18+ required (v25+ tested)
- **Tailwind CSS:** v4.1 (CSS-first config, no JS config file)
- **Express:** v5 (not v4 — routing differences)
- **No database** — all state is client-side (localStorage)
- **No authentication** — public tool, no user accounts

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/markdown-to-linkedin` | Convert markdown text to Unicode-formatted LinkedIn text |
| `GET` | `/api/health` | Health check — returns `{ status: "ok" }` |
| `GET` | `/*` | Serves static files from `public/`, falls back to `index.html` |
