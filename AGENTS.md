# AGENTS.md — LinkedIn Text Formatter

## Project Overview

**LinkedIn Text Formatter** is a web-based tool that allows users to format their LinkedIn posts using Unicode text styling. Since LinkedIn's post editor doesn't support native rich text formatting (bold, italic, etc.), this tool leverages Unicode's Mathematical Alphanumeric Symbols to produce visually styled text that displays correctly across all platforms and devices.

---

## Concept

### The Problem
LinkedIn does not provide text formatting options (bold, italic, headings) in its post composer. Posts that use plain text often fail to stand out in the feed.

### The Solution
Unicode includes thousands of characters that look like styled versions of regular Latin letters — bold, italic, monospace, script, fraktur, and more. By mapping regular ASCII characters to their Unicode equivalents, we can produce "formatted" text that copies and pastes into LinkedIn's composer and renders correctly everywhere.

### Target Users
- LinkedIn content creators
- Social media managers
- Marketing professionals
- Personal branding enthusiasts
- Anyone who wants their LinkedIn posts to stand out

---

## Architecture

### Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node.js (v18+) | Fast, modern, great ecosystem |
| Server | Express.js v5 | Lightweight, well-documented |
| CSS | Tailwind CSS v4.1 | Next-gen CSS-first configuration, improved performance |
| Frontend | Vanilla JavaScript | No framework overhead, fast load |
| Editor | Native `<textarea>` | Simple, reliable, accessible |
| Icons | Lucide | Modern, tree-shakeable, clean |
| Markdown | marked (server) + custom (client) | Dual processing for reliability |

### Design Principles
1. **Zero Dependencies on Client Frameworks** — No React, Vue, or Angular. Pure vanilla JS for performance and simplicity.
2. **Progressive Enhancement** — Works without JavaScript and enhances with it.
3. **Offline-Capable** — Core Unicode transformation is client-side; server is only needed for advanced markdown conversion.
4. **Accessibility First** — Keyboard shortcuts, semantic HTML, ARIA attributes.
5. **Mobile Responsive** — Full functionality on mobile devices.

---

## Feature Implementation Status

### Completed ✅

| Feature | Status | Description |
|---------|--------|-------------|
| Unicode Text Styling | ✅ Complete | 20+ Unicode variants (bold, italic, monospace, script, fraktur, double-struck, circled, squared, fullwidth, etc.) |
| Toolbar Formatting | ✅ Complete | Click-to-format toolbar with all major styles |
| Slash Commands | ✅ Complete | 25+ commands for formatting, blocks, and templates |
| Slash Command Menu | ✅ Complete | Auto-complete dropdown with keyboard navigation |
| Markdown Import | ✅ Complete | Modal dialog for pasting markdown content |
| Markdown Conversion | ✅ Complete | Server-side + client-side fallback conversion |
| One-Click Copy | ✅ Complete | Clipboard API with fallback |
| Export as .txt | ✅ Complete | Download formatted text as .txt file |
| Export as .md | ✅ Complete | Download formatted text as .md file  |
| Real-time Preview | ✅ Complete | LinkedIn-style card preview + plain text view with auto markdown detection |
| Live Markdown Preview | ✅ Complete | Auto-detects markdown in editor and renders formatted Unicode in preview |
| Feature Info Popup | ✅ Complete | Help icon (?) in header opens feature list popup |
| Post Optimization Score | ✅ Complete | Real-time 0-100 scoring against LinkedIn best practices (hook, readability, formatting, structure, length) |
| Device Preview | ✅ Complete | Phone (375px) and tablet (768px) preview popups with realistic LinkedIn app frame |
| Character Counter | ✅ Complete | Live count with LinkedIn 3,000 char limit warning |
| Word/Line/Read Stats | ✅ Complete | Live statistics in preview footer |
| Emoji Picker | ✅ Complete | Curated LinkedIn emojis by category |
| Keyboard Shortcuts | ✅ Complete | Ctrl+B, Ctrl+I, Ctrl+M, Ctrl+Shift+C, Ctrl+Z |
| Undo/Redo | ✅ Complete | Full history stack (50 levels) |
| Auto-Save | ✅ Complete | localStorage draft persistence |
| Responsive Design | ✅ Complete | Mobile-friendly layout |
| Security Headers | ✅ Complete | Helmet.js with CSP |
| Compression | ✅ Complete | gzip response compression |
| Request Logging | ✅ Complete | Morgan HTTP logging |

### Potential Future Enhancements 🔮

| Feature | Priority | Description |
|---------|----------|-------------|
| Dark Mode | Medium | Toggle between light/dark themes |
| Post Templates Library | Medium | Saved template collection with categories |
| Hashtag Suggestions | Medium | Auto-suggest trending hashtags based on post content keywords |
| Post History & Comparison | Medium | Save multiple drafts with timestamps, side-by-side diff view |
| A/B Hook Tester | Medium | Write 2-3 hook variants, score & compare them side by side |
| Tone Analyzer | Medium | Detect post tone (professional, casual, inspirational) with suggestions |
| AI-Powered Hook Generator | Low | Generate attention hooks with AI |
| Chrome Extension | Low | Format directly in LinkedIn's composer |
| User Accounts | Low | Save posts and templates online |
| Scheduled Post Drafts | Low | Set date/time reminders for when to publish each draft |
| Bulk Formatting | Low | Format multiple posts at once |
| Custom Unicode Styles | Low | Let users create their own mappings |
| i18n Support | Low | Multi-language interface |
| Accessibility Audit Mode | Low | Warn when Unicode styles may be unreadable by screen readers |

---

## Code Architecture

### File Structure

```
server.js                      → Express server, API routes, markdown conversion
public/index.html              → Single-page application UI
public/js/unicode-maps.js      → Unicode character transformation maps (20+ styles)
public/js/slash-commands.js    → Slash command definitions and engine
public/js/emoji-data.js        → Curated emoji data by category
public/js/app.js               → Main application logic (editor, preview, events)
src/css/input.css              → Tailwind v4 source with @theme configuration & custom CSS
```

### Key Modules

#### `unicode-maps.js`
Self-contained IIFE that builds character maps for all Unicode styles. Each map is a plain object mapping ASCII characters to their Unicode codepoints. The module exposes:
- `transform(text, mapName)` — General transformation function
- `toBold(text)`, `toItalic(text)`, etc. — Convenience methods
- `previewAll(text)` — Preview text in all styles
- `getStyleNames()` — List available styles

#### `slash-commands.js`
Defines all available slash commands with their metadata and action functions. Each command has:
- `name` — Command identifier (used after `/`)
- `label` — Display name
- `description` — Help text
- `icon` — Visual identifier
- `category` — Grouping (formatting, blocks, templates, tools)
- `action` — Function that returns the formatted text

#### `app.js`
Main application orchestrator that:
- Initializes all DOM references
- Handles editor input and keyboard events
- Manages slash command detection and menu rendering
- Controls the preview (LinkedIn card + plain text)
- Handles copy, export, clear, undo/redo
- Manages the markdown import modal
- Manages the emoji picker
- Auto-saves drafts to localStorage

#### `server.js`
Express server that:
- Serves static files from `/public`
- Provides `/api/markdown-to-linkedin` for server-side markdown conversion
- Applies security headers (Helmet)
- Compresses responses (compression)
- Logs requests (Morgan)

---

## Development Progress Log

### v1.0.0 (2026-02-09) — Initial Release

#### Phase 1: Project Setup
- Initialized Node.js project with Express.js v5
- Configured Tailwind CSS v4.1 with CSS-based @theme configuration (LinkedIn colors, Inter font, animations)
- Set up project structure and build scripts
- Migrated from JavaScript config (v3) to CSS-first configuration (v4)

#### Phase 2: Core Unicode Engine
- Built comprehensive Unicode character maps for 20+ styles
- Implemented transformation functions with proper codepoint handling
- Handled special cases (italic 'h', script letters, fraktur letters, double-struck letters)

#### Phase 3: Editor & UI
- Built the main editor with textarea and toolbar
- Implemented click-to-format and selection-based formatting
- Created LinkedIn-style preview card with mock engagement
- Added plain text preview toggle
- Built responsive two-column layout

#### Phase 4: Slash Commands
- Defined 25+ slash commands across 4 categories
- Implemented slash detection in textarea
- Built auto-complete dropdown with keyboard navigation
- Added command execution with text insertion

#### Phase 5: Markdown Support
- Implemented server-side markdown→LinkedIn conversion using regex transformations
- Built modal dialog for markdown input
- Added client-side fallback conversion
- Handles headers, bold, italic, code, lists, blockquotes, links

#### Phase 6: Copy & Export
- Implemented clipboard copy with Clipboard API + fallback
- Built .txt and .md file download functionality
- Added toast notifications for user feedback

#### Phase 7: Polish
- Added keyboard shortcuts (Ctrl+B/I/M, Ctrl+Shift+C, Ctrl+Z)
- Built undo/redo stack (50 levels)
- Added auto-save to localStorage
- Built emoji picker with categories
- Added character counter with LinkedIn limit warnings
- Added word count, line count, read time estimates
- Added quick reference section

### v1.1.0 — UI Refinements & Preview Enhancement

#### Markdown-Aware Live Preview
- Added `containsMarkdown()` function to detect markdown patterns in editor text
- Modified `updatePreview()` to auto-convert markdown to Unicode formatting via `clientSideMarkdownConvert()`
- Preview now shows formatted output (bold, italic, headings, lists, code) in real-time when markdown is detected

#### Layout & UX Improvements
- Increased editor height: `min-height: 460px`, `max-height: 600px`
- Fixed preview area: height locked to 340px with `overflow-y: auto` scrollbar
- Preview no longer expands the page — content scrolls within fixed container

#### UI Restructuring
- Removed FAQ accordion section from the main page
- Removed feature badges row from below header
- Added `?` (help-circle) icon button in header actions
- Created feature info popup card with all 6 feature descriptions, triggered by the `?` icon
- Popup auto-closes when clicking outside

#### CSS Fixes
- Fixed `@import` order in `src/css/input.css` — Google Fonts import now precedes `@import "tailwindcss"` to eliminate build warning

### v1.2.0 — Post Optimization Score

#### Post Optimization Score
- Added `calculatePostScore(text)` function that analyzes posts against LinkedIn best practices
- Scores 5 dimensions (0-20 each, 100 total): Hook Strength, Readability, Formatting, Structure, Length
- Hook scoring: checks first-line length, Unicode formatting, emojis, power words, punctuation
- Readability scoring: paragraph count, blank lines, avg line length, wall-of-text detection
- Formatting scoring: Unicode usage, emoji density (2-8 optimal), bullet points, dividers, style mixing
- Structure scoring: CTA presence, hashtag count (3-5 optimal), conclusion quality, numbered points
- Length scoring: sweet spot at 1,200-1,500 chars, graduated scoring to 3,000 limit
- Visual score ring with color-coded animation (green/blue/amber/red)
- Breakdown bars for each dimension with real-time updates
- Dynamic actionable tips (max 4) that change based on post content
- Grade labels from 🏆 Excellent to 🚧 Needs work

#### Future Enhancement Ideas Added
- Hashtag Suggestions, Post History & Comparison, A/B Hook Tester
- Tone Analyzer, Scheduled Post Drafts, Accessibility Audit Mode

### v1.2.1 — Device Preview & Code Block Fix

#### Device Preview (Phone & Tablet)
- Added phone (375px) and tablet (768px) preview buttons in preview header
- Renders in a realistic device frame popup with notch, LinkedIn app chrome, and action bar
- Shows post exactly as it would appear in the LinkedIn mobile/tablet app
- Modal closes on ESC or click outside

#### Code Block Formatting Fix
- Fixed code block processing order: triple-backtick blocks now processed BEFORE inline code
- Prevents inline code regex from partially matching inside triple-backtick blocks
- Fixed in both `clientSideMarkdownConvert()` (client) and `convertMarkdownToLinkedIn()` (server)
- Code blocks now render cleanly in monospace without leftover backtick artifacts

#### Profile Update
- LinkedIn preview card now shows "Alex Rivera" with a realistic headline instead of placeholder text

---

## AI Agent Instructions

When working on this project, AI agents should:

1. **Preserve Unicode correctness** — The character maps use specific Unicode codepoints. Do not modify these without verifying the correct codepoint ranges.

2. **Test in browser** — Unicode rendering can vary. Always test formatted output visually.

3. **Keep client-side fallbacks** — The markdown conversion has both server-side and client-side implementations. Both should be maintained.

4. **Respect the textarea approach** — We deliberately chose `<textarea>` over `contenteditable` for reliability. Do not change this without strong justification.

5. **Tailwind CSS v4 configuration** — This project uses Tailwind CSS v4 with CSS-based configuration. All theme customization is done in `src/css/input.css` using the `@theme` directive. There is NO `tailwind.config.js` file. Custom components are defined as regular CSS classes, not using `@layer` or `@apply`.

6. **No external frameworks** — The frontend is vanilla JS by design. Do not add React, Vue, or other frameworks.

7. **Maintain security** — Keep Helmet.js CSP rules updated when adding new external resources.

8. **Test slash commands** — After modifying slash commands, verify the menu renders correctly and commands execute properly.

---

## Useful Commands

```bash
# Install dependencies
npm install

# Build CSS
npm run build:css

# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Watch CSS changes during development
npm run watch:css
```
