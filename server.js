const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API: Convert Markdown to LinkedIn-friendly text
app.post('/api/markdown-to-linkedin', (req, res) => {
  try {
    const { markdown } = req.body;

    if (!markdown || typeof markdown !== 'string') {
      return res.status(400).json({ error: 'Markdown content is required' });
    }

    const linkedinText = convertMarkdownToLinkedIn(markdown);
    res.json({ result: linkedinText });
  } catch (err) {
    console.error('Markdown conversion error:', err);
    res.status(500).json({ error: 'Failed to convert markdown' });
  }
});

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback to index.html for SPA routing (Express v5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Convert Markdown to LinkedIn-friendly plain text with Unicode formatting.
 */
function convertMarkdownToLinkedIn(md) {
  const unicodeMaps = getUnicodeMaps();
  let text = md;

  // Code blocks FIRST (before inline code can match triple backticks)
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    const code = match.replace(/```\w*\n?/g, '').trim();
    return '\n' + toMonospaceUnicode(code, unicodeMaps.monospace) + '\n';
  });

  // Convert headers to bold Unicode
  text = text.replace(/^#{1,6}\s+(.+)$/gm, (_, content) => {
    return '\n' + toBoldUnicode(content.trim(), unicodeMaps.bold) + '\n';
  });

  // Convert bold+italic (***text*** or ___text___)
  text = text.replace(/\*{3}(.+?)\*{3}|_{3}(.+?)_{3}/g, (_, g1, g2) => {
    return toBoldItalicUnicode(g1 || g2, unicodeMaps.boldItalic);
  });

  // Convert bold (**text** or __text__)
  text = text.replace(/\*{2}(.+?)\*{2}|_{2}(.+?)_{2}/g, (_, g1, g2) => {
    return toBoldUnicode(g1 || g2, unicodeMaps.bold);
  });

  // Convert italic (*text* or _text_)
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, (_, g1, g2) => {
    return toItalicUnicode(g1 || g2, unicodeMaps.italic);
  });

  // Convert inline code to monospace (after code blocks are already handled)
  text = text.replace(/`([^`]+)`/g, (_, code) => {
    return toMonospaceUnicode(code, unicodeMaps.monospace);
  });

  // Convert unordered lists
  text = text.replace(/^[\s]*[-*+]\s+(.+)$/gm, '  • $1');

  // Convert ordered lists
  text = text.replace(/^[\s]*\d+\.\s+(.+)$/gm, (_, content) => `  ▸ ${content}`);

  // Convert blockquotes
  text = text.replace(/^>\s+(.+)$/gm, '  ❝ $1');

  // Convert links [text](url) → text (url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

  // Convert images ![alt](url) → [Image: alt]
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '[Image: $1]');

  // Convert horizontal rules
  text = text.replace(/^[-*_]{3,}$/gm, '\n─────────────────────\n');

  // Convert strikethrough
  text = text.replace(/~~(.+?)~~/g, '̶$̶1̶');

  // Clean up extra newlines
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  return text;
}

function getUnicodeMaps() {
  const boldMap = {};
  const italicMap = {};
  const boldItalicMap = {};
  const monospaceMap = {};

  // Bold: Mathematical Bold (U+1D400 - U+1D433)
  for (let i = 0; i < 26; i++) {
    boldMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1D400 + i);
    boldMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1D41A + i);
  }
  // Bold digits
  for (let i = 0; i < 10; i++) {
    boldMap[String.fromCharCode(48 + i)] = String.fromCodePoint(0x1D7CE + i);
  }

  // Italic: Mathematical Italic (U+1D434 - U+1D467)
  for (let i = 0; i < 26; i++) {
    italicMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1D434 + i);
    italicMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1D44E + i);
  }
  // Fix 'h' which has a different codepoint
  italicMap['h'] = String.fromCodePoint(0x210E);

  // Bold Italic: Mathematical Bold Italic (U+1D468 - U+1D49B)
  for (let i = 0; i < 26; i++) {
    boldItalicMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1D468 + i);
    boldItalicMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1D482 + i);
  }

  // Monospace: Mathematical Monospace (U+1D670 - U+1D6A3)
  for (let i = 0; i < 26; i++) {
    monospaceMap[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1D670 + i);
    monospaceMap[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1D68A + i);
  }
  // Monospace digits
  for (let i = 0; i < 10; i++) {
    monospaceMap[String.fromCharCode(48 + i)] = String.fromCodePoint(0x1D7F6 + i);
  }

  return { bold: boldMap, italic: italicMap, boldItalic: boldItalicMap, monospace: monospaceMap };
}

function toBoldUnicode(text, map) {
  return [...text].map(ch => map[ch] || ch).join('');
}

function toItalicUnicode(text, map) {
  return [...text].map(ch => map[ch] || ch).join('');
}

function toBoldItalicUnicode(text, map) {
  return [...text].map(ch => map[ch] || ch).join('');
}

function toMonospaceUnicode(text, map) {
  return [...text].map(ch => map[ch] || ch).join('');
}

// Start server (only for local development, not Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 LinkedIn Text Formatter running at http://localhost:${PORT}\n`);
  });
}

module.exports = app;
