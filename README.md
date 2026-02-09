# LinkedIn Text Formatter

A powerful, free LinkedIn text formatter built with **Node.js**, **Tailwind CSS**, and vanilla **JavaScript**. Transform your LinkedIn posts with bold, italic, monospace, and decorative Unicode styling — all from a clean, modern web interface.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Features

### ✨ Unicode Text Styling
Transform text with **20+ Unicode variants** including:
- **𝗕𝗼𝗹𝗱** — Mathematical Bold
- *𝘐𝘵𝘢𝘭𝘪𝘤* — Mathematical Italic
- `𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎` — Mathematical Monospace
- 𝓢𝓬𝓻𝓲𝓹𝓽 — Script/Calligraphy
- 𝔉𝔯𝔞𝔨𝔱𝔲𝔯 — Fraktur/Gothic
- 𝔻𝕠𝕦𝕓𝕝𝕖-𝕊𝕥𝕣𝕦𝕔𝕜 — Double-Struck
- Ⓒⓘⓡⓒⓛⓔⓓ — Circled Letters
- 🅂🅀🅄🄰🅁🄴🄳 — Squared Letters
- And more: Sans-Serif, Fullwidth, Subscript, Superscript

### ⌨️ Smart Slash Commands
Type `/` in the editor to access 25+ commands:
- `/bold`, `/italic`, `/mono` — Quick text styling
- `/heading`, `/divider`, `/bullet`, `/numbered` — Structure blocks
- `/cta`, `/hook`, `/tips`, `/story`, `/poll` — Post templates
- `/quote`, `/hashtags`, `/spacer` — Content helpers
- `/markdown` — Open the markdown import dialog

### 📝 Markdown Support
Paste markdown content and convert it to LinkedIn-friendly formatting:
- Headers → Bold Unicode
- `**bold**` → 𝗯𝗼𝗹𝗱
- `*italic*` → 𝘪𝘵𝘢𝘭𝘪𝘤
- \`code\` → 𝚌𝚘𝚍𝚎
- Lists → Bullet/numbered symbols
- Blockquotes → ❝ styled quotes
- Links → text (url) format

### 📋 One-Click Copy
Copy your formatted content directly to the clipboard with a single click. Works on all browsers with a graceful fallback.

### 💾 Export Options
Export your formatted posts as:
- `.txt` — Plain text file
- `.md` — Markdown file

### 👁️ Real-time Preview
See exactly how your post will look on LinkedIn as you type:
- **LinkedIn Preview** — Mocked LinkedIn post card with avatar, engagement bar
- **Plain Preview** — Raw text view
- **Live Markdown Detection** — Auto-converts markdown syntax to formatted Unicode in preview
- Live character counter (with LinkedIn's 3,000 limit warning)
- Word count, line count, and estimated read time

### 📊 Post Optimization Score
Real-time scoring (0-100) that grades your post against LinkedIn best practices:
- **Hook Strength** (0-20) — First line impact: length, formatting, power words, emojis, punctuation
- **Readability** (0-20) — Paragraph breaks, line spacing, average line length, wall-of-text detection
- **Formatting** (0-20) — Unicode styling usage, emoji density (2-8 optimal), bullet points, dividers
- **Structure** (0-20) — CTA presence, hashtag count (3-5 optimal), numbered points, conclusion quality
- **Length** (0-20) — Sweet spot at 1,200-1,500 chars, graduated scoring to 3,000 limit
- **Visual score ring** with color-coded animation and grade label
- **Actionable tips** that dynamically change based on your post content

### 🔍 "See More" Fold Preview
LinkedIn truncates posts in the feed — know exactly where your post gets cut:
- Line-count-aware fold: **~5 visible lines** (desktop) / **~3 lines** (mobile)
- Accounts for long-line wrapping when calculating visible lines
- Smart word-boundary detection for a clean fold position
- Toggle on/off via checkbox in the preview header
- Content below the fold rendered in lighter color
- Fold position badges showing mobile vs. desktop line/char counts

### 📱 Device Preview
See exactly how your post looks on real devices:
- **Phone preview** (375px) — iPhone-sized frame with LinkedIn app chrome
- **Tablet preview** (768px) — iPad-sized frame with LinkedIn app chrome
- Realistic notch, search bar, action bar, and engagement buttons
- Opens in a modal popup; close with ESC or click outside

### 🎹 Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold selected text |
| `Ctrl+I` | Italic selected text |
| `Ctrl+M` | Monospace selected text |
| `Ctrl+Shift+C` | Copy to clipboard |
| `Ctrl+Z` | Undo |

### 🎨 Additional Features
- **Feature Info Popup** — Click the `?` icon in the header for a quick features overview
- **Device Preview** — Phone & tablet preview popups with realistic LinkedIn app frame
- **Emoji Picker** — Curated LinkedIn emojis organized by category
- **Auto-Save** — Drafts saved to localStorage automatically
- **Undo/Redo** — Full history support
- **Responsive Design** — Works on desktop and mobile
- **Clean UI** — Modern, LinkedIn-inspired design

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js** (v18+) | Backend server |
| **Express.js** (v5) | HTTP server & API routes |
| **Tailwind CSS** (v4.1) | Next-gen utility-first CSS with CSS-based configuration |
| **Lucide Icons** | Modern icon library |
| **marked** | Markdown parsing (server-side) |
| **helmet** | Security headers |
| **compression** | Response compression |
| **morgan** | HTTP request logging |

---

## Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd linkedinformatter

# Install dependencies
npm install

# Build Tailwind CSS
npm run build:css

# Start the server
npm start
```

The app will be running at **http://localhost:3000**

### Development Mode

```bash
# Watch Tailwind CSS changes (in one terminal)
npm run watch:css

# Start with auto-reload (in another terminal)
npm run dev
```

---

## Project Structure

```
linkedinformatter/
├── server.js                  # Express.js server & API
├── package.json               # Dependencies & scripts
├── public/                    # Static files served by Express
│   ├── index.html             # Main single-page application
│   ├── css/
│   │   └── styles.css         # Compiled Tailwind CSS (generated)
│   └── js/
│       ├── app.js             # Main application logic
│       ├── unicode-maps.js    # Unicode character transformation maps
│       ├── slash-commands.js   # Slash command definitions & engine
│       └── emoji-data.js      # Curated emoji data
├── src/
│   └── css/
│       └── input.css          # Tailwind CSS v4 source with @theme configuration
├── README.md                  # This file
├── AGENTS.md                  # AI agent documentation
└── HANDOFF.md                 # Developer handoff guide
```

---

## API Endpoints

### `POST /api/markdown-to-linkedin`
Convert markdown content to LinkedIn-friendly Unicode text.

**Request:**
```json
{
  "markdown": "# Hello\n\n**Bold** and *italic* text"
}
```

**Response:**
```json
{
  "result": "\n𝗛𝗲𝗹𝗹𝗼\n\n𝗕𝗼𝗹𝗱 and 𝘪𝘵𝘢𝘭𝘪𝘤 text"
}
```

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-09T00:00:00.000Z"
}
```

---

## How It Works

LinkedIn doesn't support native text formatting (bold, italic, etc.) in regular posts. However, Unicode includes **Mathematical Alphanumeric Symbols** — separate character sets that look like styled versions of regular letters.

This tool maps regular ASCII letters to their Unicode equivalents:

| Style | A → | a → | Range |
|-------|------|------|-------|
| Bold | 𝐀 (U+1D400) | 𝐚 (U+1D41A) | Mathematical Bold |
| Italic | 𝐴 (U+1D434) | 𝑎 (U+1D44E) | Mathematical Italic |
| Monospace | 𝙰 (U+1D670) | 𝚊 (U+1D68A) | Mathematical Monospace |
| Script | 𝒜 (U+1D49C) | 𝒶 (U+1D4B6) | Mathematical Script |
| Fraktur | 𝔄 (U+1D504) | 𝔞 (U+1D51E) | Mathematical Fraktur |
| Double-Struck | 𝔸 (U+1D538) | 𝕒 (U+1D552) | Mathematical Double-Struck |

These characters are **standard Unicode** and display consistently across all devices, browsers, and the LinkedIn mobile app.

---

## Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome 90+ | ✅ |
| Firefox 90+ | ✅ |
| Safari 15+ | ✅ |
| Edge 90+ | ✅ |
| Mobile Chrome | ✅ |
| Mobile Safari | ✅ |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Commit: `git commit -m 'Add my feature'`
5. Push: `git push origin feature/my-feature`
6. Open a Pull Request

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Inspired by [ConnectSafely LinkedIn Text Formatter](https://connectsafely.ai/free/linkedin-text-formatter)
- Unicode character maps based on the [Unicode Mathematical Alphanumeric Symbols](https://unicode.org/charts/PDF/U1D400.pdf) block
- Icons by [Lucide](https://lucide.dev)
- CSS framework by [Tailwind CSS](https://tailwindcss.com)
