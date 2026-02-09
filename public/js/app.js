/**
 * LinkedIn Text Formatter — Main Application
 * Handles editor interactions, formatting, preview, slash commands,
 * markdown import, copy, export, and real-time preview.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // ─── DOM References ────────────────────────────────────────────
  const editor = document.getElementById('editor');
  const previewContent = document.getElementById('previewContent');
  const plainPreviewContent = document.getElementById('plainPreviewContent');
  const charCounter = document.getElementById('charCounter');
  const wordCount = document.getElementById('wordCount');
  const lineCount = document.getElementById('lineCount');
  const readTime = document.getElementById('readTime');
  const slashMenu = document.getElementById('slashMenu');
  const copyBtn = document.getElementById('copyBtn');
  const copyPreviewBtn = document.getElementById('copyPreviewBtn');
  const clearBtn = document.getElementById('clearBtn');
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  const exportTextBtn = document.getElementById('exportTextBtn');
  const exportMdBtn = document.getElementById('exportMdBtn');
  const markdownImportBtn = document.getElementById('markdownImportBtn');
  const markdownModal = document.getElementById('markdownModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModal = document.getElementById('closeModal');
  const cancelModal = document.getElementById('cancelModal');
  const convertMarkdown = document.getElementById('convertMarkdown');
  const markdownInput = document.getElementById('markdownInput');
  const emojiBtn = document.getElementById('emojiBtn');
  const emojiPicker = document.getElementById('emojiPicker');
  const emojiGrid = document.getElementById('emojiGrid');
  const previewLinkedin = document.getElementById('previewLinkedin');
  const previewPlain = document.getElementById('previewPlain');
  const linkedinPreview = document.getElementById('linkedinPreview');
  const plainPreview = document.getElementById('plainPreview');
  const featureInfoBtn = document.getElementById('featureInfoBtn');
  const featurePopup = document.getElementById('featurePopup');
  const foldToggle = document.getElementById('foldToggle');

  // Score panel DOM
  const scoreRingFg = document.getElementById('scoreRingFg');
  const scoreValue = document.getElementById('scoreValue');
  const scoreGrade = document.getElementById('scoreGrade');
  const scoreHookBar = document.getElementById('scoreHookBar');
  const scoreHookVal = document.getElementById('scoreHookVal');
  const scoreReadBar = document.getElementById('scoreReadBar');
  const scoreReadVal = document.getElementById('scoreReadVal');
  const scoreFmtBar = document.getElementById('scoreFmtBar');
  const scoreFmtVal = document.getElementById('scoreFmtVal');
  const scoreStrBar = document.getElementById('scoreStrBar');
  const scoreStrVal = document.getElementById('scoreStrVal');
  const scoreLenBar = document.getElementById('scoreLenBar');
  const scoreLenVal = document.getElementById('scoreLenVal');
  const scoreTips = document.getElementById('scoreTips');

  // Device preview DOM
  const devicePreviewModal = document.getElementById('devicePreviewModal');
  const deviceOverlay = document.getElementById('deviceOverlay');
  const closeDevicePreview = document.getElementById('closeDevicePreview');
  const deviceFrame = document.getElementById('deviceFrame');
  const devicePreviewContent = document.getElementById('devicePreviewContent');
  const deviceLabel = document.getElementById('deviceLabel');
  const previewPhone = document.getElementById('previewPhone');
  const previewTablet = document.getElementById('previewTablet');

  // ─── State ─────────────────────────────────────────────────────
  let slashState = {
    active: false,
    query: '',
    startPos: -1,
    selectedIndex: 0,
  };

  let undoStack = [];
  let redoStack = [];
  let lastSavedContent = '';

  // ─── Undo/Redo ─────────────────────────────────────────────────
  function saveUndoState() {
    const content = editor.value;
    if (content !== lastSavedContent) {
      undoStack.push(lastSavedContent);
      if (undoStack.length > 50) undoStack.shift();
      redoStack = [];
      lastSavedContent = content;
    }
  }

  undoBtn.addEventListener('click', () => {
    if (undoStack.length === 0) return;
    redoStack.push(editor.value);
    const prev = undoStack.pop();
    editor.value = prev;
    lastSavedContent = prev;
    updatePreview();
    updateStats();
  });

  redoBtn.addEventListener('click', () => {
    if (redoStack.length === 0) return;
    undoStack.push(editor.value);
    const next = redoStack.pop();
    editor.value = next;
    lastSavedContent = next;
    updatePreview();
    updateStats();
  });

  // ─── Editor Events ─────────────────────────────────────────────
  editor.addEventListener('input', () => {
    handleSlashDetection();
    updatePreview();
    updateStats();
    debouncedSaveUndo();
  });

  editor.addEventListener('keydown', (e) => {
    // Slash menu navigation
    if (slashState.active) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateSlashMenu(1);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateSlashMenu(-1);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        executeSlashCommand();
        return;
      }
      if (e.key === 'Escape') {
        closeSlashMenu();
        return;
      }
    }

    // Keyboard shortcuts
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      if (e.key === 'b') {
        e.preventDefault();
        applyStyleToSelection('bold');
      } else if (e.key === 'i') {
        e.preventDefault();
        applyStyleToSelection('italic');
      } else if (e.key === 'm') {
        e.preventDefault();
        applyStyleToSelection('monospace');
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      copyToClipboard();
    }
  });

  // ─── Slash Commands ────────────────────────────────────────────
  function handleSlashDetection() {
    const text = editor.value;
    const cursorPos = editor.selectionStart;

    // Find if there's a / before the cursor on the current line
    const textBeforeCursor = text.substring(0, cursorPos);
    const lastNewline = textBeforeCursor.lastIndexOf('\n');
    const currentLine = textBeforeCursor.substring(lastNewline + 1);

    const slashMatch = currentLine.match(/\/(\w*)$/);

    if (slashMatch) {
      const query = slashMatch[1];
      slashState.active = true;
      slashState.query = query;
      slashState.startPos = cursorPos - query.length - 1;
      slashState.selectedIndex = 0;
      renderSlashMenu(query);
    } else {
      closeSlashMenu();
    }
  }

  function renderSlashMenu(query) {
    const results = SlashCommands.search(query);
    if (results.length === 0) {
      closeSlashMenu();
      return;
    }

    let html = '';
    let lastCategory = '';

    results.forEach((cmd, idx) => {
      if (cmd.category !== lastCategory) {
        lastCategory = cmd.category;
        html += `<div class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50">${cmd.category}</div>`;
      }
      html += `
        <div class="slash-menu-item ${idx === slashState.selectedIndex ? 'active' : ''}" 
             data-command="${cmd.name}" data-index="${idx}">
          <div class="icon">${cmd.icon}</div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-800">${cmd.label}</div>
            <div class="text-xs text-gray-500 truncate">${cmd.description}</div>
          </div>
        </div>`;
    });

    slashMenu.innerHTML = html;
    slashMenu.classList.remove('hidden');

    // Position the menu
    positionSlashMenu();

    // Click handlers
    slashMenu.querySelectorAll('.slash-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        slashState.selectedIndex = parseInt(item.dataset.index);
        executeSlashCommand();
      });
      item.addEventListener('mouseenter', () => {
        slashMenu.querySelectorAll('.slash-menu-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        slashState.selectedIndex = parseInt(item.dataset.index);
      });
    });
  }

  function positionSlashMenu() {
    // Position below the cursor
    const rect = editor.getBoundingClientRect();
    const lineHeight = 24;

    // Estimate cursor position
    const text = editor.value.substring(0, editor.selectionStart);
    const lines = text.split('\n');
    const currentLineNum = lines.length;
    const scrollTop = editor.scrollTop;

    const top = rect.top + (currentLineNum * lineHeight) - scrollTop + lineHeight;
    const left = rect.left + 20;

    slashMenu.style.position = 'fixed';
    slashMenu.style.top = `${Math.min(top, window.innerHeight - 300)}px`;
    slashMenu.style.left = `${Math.min(left, window.innerWidth - 320)}px`;
  }

  function navigateSlashMenu(direction) {
    const items = slashMenu.querySelectorAll('.slash-menu-item');
    if (items.length === 0) return;

    slashState.selectedIndex = Math.max(0, Math.min(items.length - 1, slashState.selectedIndex + direction));

    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === slashState.selectedIndex);
    });

    // Scroll into view
    items[slashState.selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }

  function executeSlashCommand() {
    const results = SlashCommands.search(slashState.query);
    const cmd = results[slashState.selectedIndex];
    if (!cmd) return;

    const result = SlashCommands.execute(cmd.name, '');

    if (result === 'OPEN_MARKDOWN_MODAL') {
      // Remove the slash command text first
      removeSlashText();
      closeSlashMenu();
      openMarkdownModal();
      return;
    }

    if (result) {
      removeSlashText();
      insertTextAtCursor(result);
    }

    closeSlashMenu();
    updatePreview();
    updateStats();
    saveUndoState();
  }

  function removeSlashText() {
    const text = editor.value;
    const before = text.substring(0, slashState.startPos);
    const after = text.substring(editor.selectionStart);
    editor.value = before + after;
    editor.selectionStart = editor.selectionEnd = slashState.startPos;
  }

  function closeSlashMenu() {
    slashState.active = false;
    slashState.query = '';
    slashMenu.classList.add('hidden');
    slashMenu.innerHTML = '';
  }

  // ─── Text Formatting ──────────────────────────────────────────
  function applyStyleToSelection(styleName) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const text = editor.value;

    if (start === end) {
      // No selection — show toast
      showToast('Select some text first, then apply formatting', 'info');
      return;
    }

    const selected = text.substring(start, end);
    const transformed = UnicodeMaps.transform(selected, styleName);

    saveUndoState();
    editor.value = text.substring(0, start) + transformed + text.substring(end);
    editor.selectionStart = start;
    editor.selectionEnd = start + transformed.length;
    editor.focus();

    updatePreview();
    updateStats();
  }

  // Toolbar style buttons
  document.querySelectorAll('[data-style]').forEach(btn => {
    btn.addEventListener('click', () => {
      const style = btn.dataset.style;
      applyStyleToSelection(style);
    });
  });

  // Toolbar action buttons
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      saveUndoState();

      switch (action) {
        case 'bullet':
          insertTextAtCursor('\n• ');
          break;
        case 'numbered':
          insertTextAtCursor('\n1. ');
          break;
        case 'divider':
          insertTextAtCursor('\n─────────────────────────\n');
          break;
      }

      updatePreview();
      updateStats();
    });
  });

  // ─── Preview Toggle ────────────────────────────────────────────
  previewLinkedin.addEventListener('click', () => {
    previewLinkedin.classList.add('active');
    previewPlain.classList.remove('active');
    linkedinPreview.classList.remove('hidden');
    plainPreview.classList.add('hidden');
  });

  previewPlain.addEventListener('click', () => {
    previewPlain.classList.add('active');
    previewLinkedin.classList.remove('active');
    plainPreview.classList.remove('hidden');
    linkedinPreview.classList.add('hidden');
  });

  // Fold toggle re-renders preview
  if (foldToggle) {
    foldToggle.addEventListener('change', () => {
      updatePreview();
    });
  }

  // ─── Preview Update ────────────────────────────────────────────

  /**
   * Detect if text contains markdown syntax
   */
  function containsMarkdown(text) {
    const mdPatterns = [
      /^#{1,6}\s+/m,            // Headings
      /\*{2}.+?\*{2}/,          // Bold
      /(?<!\*)\*(?!\*).+?(?<!\*)\*(?!\*)/,  // Italic
      /`.+?`/,                  // Inline code
      /```[\s\S]*?```/,         // Code blocks
      /^\s*[-*+]\s+/m,          // Unordered lists
      /^\s*\d+\.\s+/m,          // Ordered lists
      /^>\s+/m,                 // Blockquotes
      /\[.+?\]\(.+?\)/,         // Links
      /^[-*_]{3,}$/m,           // Horizontal rules
    ];
    return mdPatterns.some(pattern => pattern.test(text));
  }

  function updatePreview() {
    const text = editor.value;

    if (!text.trim()) {
      previewContent.innerHTML = '<span class="text-gray-400 italic">Your formatted post will appear here as you type...</span>';
      plainPreviewContent.innerHTML = '<span class="text-gray-400 italic">Your formatted post text will appear here...</span>';
      updateScorePanel();
      return;
    }

    // Auto-detect markdown and convert to formatted Unicode
    let displayText = text;
    if (containsMarkdown(text)) {
      displayText = clientSideMarkdownConvert(text);
    }

    // LinkedIn preview: render with fold indicator
    renderPreviewWithFold(displayText);
    plainPreviewContent.textContent = displayText;

    // Update optimization score
    updateScorePanel();
  }

  // ─── Stats Update ──────────────────────────────────────────────
  function updateStats() {
    const text = editor.value;
    const chars = [...text].length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));

    // Character counter with LinkedIn limits
    const LINKEDIN_LIMIT = 3000;
    charCounter.textContent = `${chars.toLocaleString()} / ${LINKEDIN_LIMIT.toLocaleString()}`;
    charCounter.className = 'char-counter';
    if (chars > LINKEDIN_LIMIT) {
      charCounter.classList.add('danger');
    } else if (chars > LINKEDIN_LIMIT * 0.9) {
      charCounter.classList.add('warning');
    } else {
      charCounter.classList.add('text-gray-400');
    }

    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    lineCount.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
    readTime.textContent = `${minutes} min read`;
  }

  // ─── Post Optimization Score ───────────────────────────────────
  const RING_CIRCUMFERENCE = 97.4; // 2 * π * 15.5

  function calculatePostScore(text) {
    if (!text.trim()) return null;

    const chars = [...text].length;
    const words = text.trim().split(/\s+/).length;
    const lines = text.split('\n');
    const firstLine = lines[0] || '';
    const paragraphs = text.split(/\n{2,}/);
    const tips = [];

    // ── 1. Hook Score (0-20) ───────────────────────────────
    let hookScore = 0;
    const hookText = firstLine.trim();
    const hookLen = [...hookText].length;

    // Has content at all
    if (hookLen > 0) hookScore += 3;
    // Good hook length (30-150 chars keeps above the fold)
    if (hookLen >= 30 && hookLen <= 150) hookScore += 5;
    else if (hookLen > 0) hookScore += 2;
    // Starts with something attention-grabbing
    if (/^[🔥💡🚀✨⚡🎯❌✅🏆💰📈❗❓]/.test(hookText)) hookScore += 3;
    else if (/^[^\w\s]/.test(hookText)) hookScore += 1;
    // Uses Unicode bold/formatting in hook (stands out in feed)
    if (/[\u{1D400}-\u{1D7FF}]/u.test(hookText)) hookScore += 4;
    else tips.push({ icon: '✏️', text: 'Bold your first line to make it stand out in the feed' });
    // Ends with a question or hook pattern
    if (/[?!…]$/.test(hookText)) hookScore += 3;
    else if (/[:.]$/.test(hookText)) hookScore += 1;
    // Contains power words
    const powerWords = /\b(secret|mistake|truth|myth|lesson|hack|why|how|stop|never|always|free|proven|simple)\b/i;
    if (powerWords.test(hookText)) hookScore += 2;

    if (hookLen < 20 && hookLen > 0) tips.push({ icon: '🎯', text: 'Make your hook longer (30-150 chars) to fill the "above the fold" space' });
    if (hookLen > 150) tips.push({ icon: '✂️', text: 'Shorten your hook — it gets cut off by "...see more" on mobile' });

    hookScore = Math.min(20, hookScore);

    // ── 2. Readability Score (0-20) ────────────────────────
    let readScore = 0;
    const avgLineLen = chars / Math.max(lines.length, 1);

    // Short paragraphs (1-3 sentences each)
    if (paragraphs.length >= 3) readScore += 5;
    else if (paragraphs.length >= 2) readScore += 3;
    else tips.push({ icon: '📝', text: 'Break your post into 3+ short paragraphs for better readability' });

    // Line breaks (LinkedIn rewards visual spacing)
    const blankLines = lines.filter(l => l.trim() === '').length;
    if (blankLines >= 3) readScore += 5;
    else if (blankLines >= 1) readScore += 3;
    else tips.push({ icon: '↕️', text: 'Add blank lines between paragraphs — LinkedIn readers scan, not read' });

    // Average line length (shorter is more readable on mobile)
    if (avgLineLen <= 80) readScore += 5;
    else if (avgLineLen <= 120) readScore += 3;
    else tips.push({ icon: '📱', text: 'Keep lines under 80 chars for mobile readability' });

    // No wall of text
    const maxParagraphLen = Math.max(...paragraphs.map(p => [...p].length));
    if (maxParagraphLen <= 300) readScore += 5;
    else if (maxParagraphLen <= 500) readScore += 3;
    else tips.push({ icon: '🧱', text: 'Your longest paragraph is too dense — break it up' });

    readScore = Math.min(20, readScore);

    // ── 3. Formatting Score (0-20) ─────────────────────────
    let fmtScore = 0;

    // Uses Unicode styling
    if (/[\u{1D400}-\u{1D7FF}]/u.test(text)) fmtScore += 5;
    // Uses emojis (but not too many)
    const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
    if (emojiCount >= 2 && emojiCount <= 8) fmtScore += 5;
    else if (emojiCount === 1) fmtScore += 3;
    else if (emojiCount > 8) { fmtScore += 2; tips.push({ icon: '🎭', text: 'Too many emojis can look spammy — aim for 2-8' }); }
    else tips.push({ icon: '😀', text: 'Add 2-8 emojis to make your post visually engaging' });

    // Uses bullet points or lists
    if (/[•▸►◆✦→⊕▹▻]/.test(text) || /^\s*[-*+]\s/m.test(text)) fmtScore += 5;
    else tips.push({ icon: '📌', text: 'Use bullet points to make key takeaways scannable' });

    // Uses dividers or visual separators
    if (/[─━═—⸻]/.test(text) || /^[-=_]{3,}$/m.test(text)) fmtScore += 3;
    // Mix of styles (bold + another)
    const boldRange = /[\u{1D400}-\u{1D433}]/u;
    const italicRange = /[\u{1D434}-\u{1D467}]/u;
    if (boldRange.test(text) && (italicRange.test(text) || /[\u{1D670}-\u{1D6A3}]/u.test(text))) fmtScore += 2;

    fmtScore = Math.min(20, fmtScore);

    // ── 4. Structure Score (0-20) ──────────────────────────
    let strScore = 0;

    // Has a CTA (call to action)
    const ctaPatterns = /\b(comment|share|follow|like|agree|thoughts|opinion|repost|tag|DM|link in|check out|let me know|what do you think)\b/i;
    if (ctaPatterns.test(text)) strScore += 5;
    else tips.push({ icon: '📣', text: 'End with a CTA — ask a question or invite comments to boost engagement' });

    // Has hashtags
    const hashtagCount = (text.match(/#\w+/g) || []).length;
    if (hashtagCount >= 3 && hashtagCount <= 5) strScore += 5;
    else if (hashtagCount >= 1 && hashtagCount <= 7) strScore += 3;
    else if (hashtagCount > 7) { strScore += 1; tips.push({ icon: '#️⃣', text: 'Use 3-5 hashtags — too many reduces reach' }); }
    else tips.push({ icon: '#️⃣', text: 'Add 3-5 relevant hashtags for discoverability' });

    // Has a clear ending/conclusion
    const lastParagraph = paragraphs[paragraphs.length - 1] || '';
    if (ctaPatterns.test(lastParagraph) || /[?!]/.test(lastParagraph)) strScore += 5;
    else if (paragraphs.length >= 3) strScore += 2;

    // Has numbered points or clear structure
    if (/^\s*\d+[.)]\s/m.test(text) || paragraphs.length >= 4) strScore += 5;
    else if (paragraphs.length >= 2) strScore += 2;

    strScore = Math.min(20, strScore);

    // ── 5. Length Score (0-20) ─────────────────────────────
    let lenScore = 0;

    if (chars >= 1200 && chars <= 1500) { lenScore = 20; }
    else if (chars >= 800 && chars <= 2000) { lenScore = 15; }
    else if (chars >= 500 && chars <= 2500) { lenScore = 10; }
    else if (chars >= 200 && chars <= 3000) { lenScore = 5; }
    else if (chars > 3000) { lenScore = 2; tips.push({ icon: '✂️', text: 'Over 3,000 chars — LinkedIn will truncate your post' }); }
    else { lenScore = 2; }

    if (chars < 200) tips.push({ icon: '📏', text: 'Posts with 1,200-1,500 characters get the most engagement' });
    else if (chars < 800) tips.push({ icon: '📏', text: 'Good start! Top-performing posts are 1,200-1,500 characters' });
    else if (chars > 2500) tips.push({ icon: '📏', text: 'Consider trimming — the sweet spot is 1,200-1,500 characters' });

    lenScore = Math.min(20, lenScore);

    // ── Total ──────────────────────────────────────────────
    const total = hookScore + readScore + fmtScore + strScore + lenScore;

    let grade;
    if (total >= 85) grade = '🏆 Excellent — ready to post!';
    else if (total >= 70) grade = '🔥 Great — minor tweaks possible';
    else if (total >= 50) grade = '👍 Good — review suggestions below';
    else if (total >= 30) grade = '📝 Fair — see tips to improve';
    else grade = '🚧 Needs work — keep going!';

    // Limit tips to top 4
    return { total, hookScore, readScore, fmtScore, strScore, lenScore, grade, tips: tips.slice(0, 4) };
  }

  function updateScorePanel() {
    const text = editor.value;
    const result = calculatePostScore(text);

    if (!result) {
      // Reset
      scoreRingFg.style.strokeDashoffset = RING_CIRCUMFERENCE;
      scoreRingFg.style.color = '#d1d5db';
      scoreValue.textContent = '—';
      scoreValue.className = 'text-2xl font-bold text-gray-300';
      scoreGrade.textContent = 'Start typing...';
      scoreGrade.className = 'text-xs font-semibold text-gray-400 mt-2';
      ['scoreHookBar', 'scoreReadBar', 'scoreFmtBar', 'scoreStrBar', 'scoreLenBar'].forEach(id => {
        document.getElementById(id).style.width = '0%';
        document.getElementById(id).className = 'h-full rounded-full bg-gray-300 transition-all duration-500';
      });
      ['scoreHookVal', 'scoreReadVal', 'scoreFmtVal', 'scoreStrVal', 'scoreLenVal'].forEach(id => {
        document.getElementById(id).textContent = '0';
        document.getElementById(id).className = 'text-xs font-medium text-gray-400 w-8 text-right';
      });
      scoreTips.innerHTML = '<li class="flex items-start gap-2"><span class="text-gray-300">💡</span><span>Start typing to get optimization tips...</span></li>';
      return;
    }

    const { total, hookScore, readScore, fmtScore, strScore, lenScore, grade, tips } = result;

    // Ring animation
    const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * total / 100);
    scoreRingFg.style.strokeDashoffset = offset;

    // Color based on score
    let color;
    if (total >= 80) color = '#10b981'; // green
    else if (total >= 60) color = '#0a66c2'; // blue
    else if (total >= 40) color = '#f59e0b'; // amber
    else color = '#ef4444'; // red

    scoreRingFg.style.color = color;
    scoreValue.textContent = total;
    scoreValue.style.color = color;
    scoreValue.className = 'text-2xl font-bold';
    scoreGrade.textContent = grade;
    scoreGrade.className = 'text-xs font-semibold text-gray-600 mt-2 text-center';

    // Update bars
    const updateBar = (barEl, valEl, score, max) => {
      const pct = (score / max) * 100;
      barEl.style.width = pct + '%';
      let barColor;
      if (pct >= 80) barColor = 'bg-emerald-400';
      else if (pct >= 50) barColor = 'bg-linkedin-400';
      else if (pct >= 25) barColor = 'bg-amber-400';
      else barColor = 'bg-red-400';
      barEl.className = `h-full rounded-full ${barColor} transition-all duration-500`;
      valEl.textContent = score;
      valEl.className = 'text-xs font-medium text-gray-600 w-8 text-right';
    };

    updateBar(scoreHookBar, scoreHookVal, hookScore, 20);
    updateBar(scoreReadBar, scoreReadVal, readScore, 20);
    updateBar(scoreFmtBar, scoreFmtVal, fmtScore, 20);
    updateBar(scoreStrBar, scoreStrVal, strScore, 20);
    updateBar(scoreLenBar, scoreLenVal, lenScore, 20);

    // Tips
    if (tips.length > 0) {
      scoreTips.innerHTML = tips.map(t =>
        `<li class="flex items-start gap-2"><span>${t.icon}</span><span class="text-gray-600">${t.text}</span></li>`
      ).join('');
    } else {
      scoreTips.innerHTML = '<li class="flex items-start gap-2"><span>✅</span><span class="text-gray-600">Your post looks great! No suggestions.</span></li>';
    }
  }

  // ─── "See More" Fold Preview ───────────────────────────────────
  // LinkedIn fold behavior:
  // - Desktop: ~5 visible lines OR ~210 chars (whichever comes first)
  // - Mobile: ~3 visible lines OR ~140 chars (whichever comes first)
  // Blank lines count as visible lines. Long lines wrap based on container width.
  const FOLD_DESKTOP_LINES = 5;
  const FOLD_MOBILE_LINES = 3;
  const FOLD_DESKTOP_CHARS = 480;
  const FOLD_MOBILE_CHARS = 300;

  function findFoldPosition(text, maxLines, maxChars) {
    const lines = text.split('\n');
    let visibleLines = 0;
    let charPos = 0;
    // Approximate chars per visual line in the preview container (~55 chars on desktop)
    const charsPerVisualLine = maxChars > 400 ? 55 : 38;

    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      // Each newline-separated line takes at least 1 visual line
      // Long lines wrap — estimate wrapped lines
      const wrappedLines = lineText.length === 0 ? 1 : Math.ceil(lineText.length / charsPerVisualLine);
      visibleLines += wrappedLines;

      if (visibleLines > maxLines || (charPos + lineText.length) > maxChars) {
        // Fold at the start of this line (include lines before this one)
        return charPos > 0 ? charPos - 1 : 0; // -1 to exclude the \n before this line
      }

      charPos += lineText.length + 1; // +1 for the \n
    }

    return -1; // No fold needed
  }

  function renderPreviewWithFold(text) {
    const showFold = foldToggle && foldToggle.checked;

    if (!showFold) {
      previewContent.textContent = text;
      return;
    }

    const desktopFoldPos = findFoldPosition(text, FOLD_DESKTOP_LINES, FOLD_DESKTOP_CHARS);

    if (desktopFoldPos < 0 || desktopFoldPos >= text.length) {
      // No fold needed
      previewContent.textContent = text;
      return;
    }

    // Snap to word/line boundary for clean break
    let foldPos = desktopFoldPos;
    const chars = [...text];
    // Walk back to find a space or newline for clean break
    let tmpPos = foldPos;
    while (tmpPos > 0 && text[tmpPos] !== ' ' && text[tmpPos] !== '\n') {
      tmpPos--;
    }
    if (tmpPos > foldPos * 0.5) foldPos = tmpPos;

    const aboveFold = text.slice(0, foldPos).trimEnd();
    const belowFold = text.slice(foldPos).trimStart();

    // Build DOM
    previewContent.innerHTML = '';

    const aboveEl = document.createElement('span');
    aboveEl.textContent = aboveFold;
    previewContent.appendChild(aboveEl);

    // Fold indicator
    const foldEl = document.createElement('div');
    foldEl.className = 'fold-line';
    foldEl.innerHTML = '<span class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">…see more</span>';
    previewContent.appendChild(foldEl);

    const belowEl = document.createElement('span');
    belowEl.className = 'text-gray-400';
    belowEl.textContent = belowFold;
    previewContent.appendChild(belowEl);

    // Mobile fold calculation
    const mobileFoldPos = findFoldPosition(text, FOLD_MOBILE_LINES, FOLD_MOBILE_CHARS);
    const mobileFoldDisplay = mobileFoldPos > 0 ? mobileFoldPos : foldPos;

    // Add fold info badge
    const infoEl = document.createElement('div');
    infoEl.className = 'mt-3 flex items-center gap-3 text-[10px] flex-wrap';
    infoEl.innerHTML = `<span class="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> ~${FOLD_MOBILE_LINES} lines / ~${mobileFoldDisplay} chars (mobile)</span>`
      + `<span class="flex items-center gap-1 text-linkedin-600 bg-linkedin-50 px-2 py-1 rounded-full"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> ~${FOLD_DESKTOP_LINES} lines / ~${foldPos} chars (desktop)</span>`
      + `<span class="text-gray-400">${text.length} total</span>`;
    previewContent.appendChild(infoEl);
  }

  // ─── Copy ──────────────────────────────────────────────────────
  async function copyToClipboard() {
    const text = editor.value;
    if (!text.trim()) {
      showToast('Nothing to copy — start typing first!', 'info');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard!', 'success');
      copyBtn.classList.add('copy-pulse');
      setTimeout(() => copyBtn.classList.remove('copy-pulse'), 300);
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Copied to clipboard!', 'success');
    }
  }

  copyBtn.addEventListener('click', copyToClipboard);
  copyPreviewBtn.addEventListener('click', copyToClipboard);

  // ─── Clear ─────────────────────────────────────────────────────
  clearBtn.addEventListener('click', () => {
    if (editor.value.trim() && !confirm('Clear all content?')) return;
    saveUndoState();
    editor.value = '';
    updatePreview();
    updateStats();
    editor.focus();
    showToast('Editor cleared', 'info');
  });

  // ─── Export ────────────────────────────────────────────────────
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  exportTextBtn.addEventListener('click', () => {
    const text = editor.value;
    if (!text.trim()) {
      showToast('Nothing to export', 'info');
      return;
    }
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(text, `linkedin-post-${timestamp}.txt`, 'text/plain');
    showToast('Exported as .txt file', 'success');
  });

  exportMdBtn.addEventListener('click', () => {
    const text = editor.value;
    if (!text.trim()) {
      showToast('Nothing to export', 'info');
      return;
    }
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadFile(text, `linkedin-post-${timestamp}.md`, 'text/markdown');
    showToast('Exported as .md file', 'success');
  });

  // ─── Markdown Import ──────────────────────────────────────────
  function openMarkdownModal() {
    markdownModal.classList.remove('hidden');
    markdownInput.value = '';
    markdownInput.focus();
  }

  function closeMarkdownModal() {
    markdownModal.classList.add('hidden');
  }

  markdownImportBtn.addEventListener('click', openMarkdownModal);
  modalOverlay.addEventListener('click', closeMarkdownModal);
  closeModal.addEventListener('click', closeMarkdownModal);
  cancelModal.addEventListener('click', closeMarkdownModal);

  convertMarkdown.addEventListener('click', async () => {
    const md = markdownInput.value;
    if (!md.trim()) {
      showToast('Paste some markdown first', 'info');
      return;
    }

    try {
      const res = await fetch('/api/markdown-to-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: md }),
      });

      const data = await res.json();

      if (data.result) {
        saveUndoState();
        insertTextAtCursor(data.result);
        closeMarkdownModal();
        updatePreview();
        updateStats();
        showToast('Markdown converted and inserted!', 'success');
      } else {
        showToast('Conversion failed', 'error');
      }
    } catch (err) {
      console.error('Markdown conversion error:', err);
      // Fallback: do client-side conversion
      const converted = clientSideMarkdownConvert(md);
      saveUndoState();
      insertTextAtCursor(converted);
      closeMarkdownModal();
      updatePreview();
      updateStats();
      showToast('Markdown converted (client-side fallback)', 'success');
    }
  });

  // ESC to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !markdownModal.classList.contains('hidden')) {
      closeMarkdownModal();
    }
  });

  /**
   * Client-side markdown to LinkedIn conversion (fallback)
   */
  function clientSideMarkdownConvert(md) {
    let text = md;

    // Code blocks FIRST (before inline code can match backticks)
    text = text.replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```\w*\n?/g, '').trim();
      return '\n' + UnicodeMaps.toMonospace(code) + '\n';
    });

    // Headers → Bold Unicode
    text = text.replace(/^#{1,6}\s+(.+)$/gm, (_, content) => {
      return '\n' + UnicodeMaps.toBold(content.trim()) + '\n';
    });

    // Bold+Italic
    text = text.replace(/\*{3}(.+?)\*{3}|_{3}(.+?)_{3}/g, (_, g1, g2) => {
      return UnicodeMaps.toBoldItalic(g1 || g2);
    });

    // Bold
    text = text.replace(/\*{2}(.+?)\*{2}|_{2}(.+?)_{2}/g, (_, g1, g2) => {
      return UnicodeMaps.toBold(g1 || g2);
    });

    // Italic
    text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, (_, g1, g2) => {
      return UnicodeMaps.toItalic(g1 || g2);
    });

    // Inline code (after code blocks are already handled)
    text = text.replace(/`([^`]+)`/g, (_, code) => {
      return UnicodeMaps.toMonospace(code);
    });

    // Lists
    text = text.replace(/^[\s]*[-*+]\s+(.+)$/gm, '  • $1');
    text = text.replace(/^[\s]*\d+\.\s+(.+)$/gm, (_, content) => `  ▸ ${content}`);

    // Blockquotes
    text = text.replace(/^>\s+(.+)$/gm, '  ❝ $1');

    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

    // Images  
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '[Image: $1]');

    // Horizontal rules
    text = text.replace(/^[-*_]{3,}$/gm, '\n─────────────────────\n');

    // Cleanup
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    return text;
  }

  // ─── Emoji Picker ──────────────────────────────────────────────
  function buildEmojiPicker() {
    const categories = EmojiData.getAll();
    let html = '';

    for (const [catName, emojis] of Object.entries(categories)) {
      html += `<div class="col-span-8 text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-2 mb-1 first:mt-0">${catName}</div>`;
      for (const emoji of emojis) {
        html += `<button class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-lg transition-colors cursor-pointer" data-emoji="${emoji}" title="${emoji}">${emoji}</button>`;
      }
    }

    emojiGrid.innerHTML = html;

    emojiGrid.querySelectorAll('[data-emoji]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const emoji = btn.dataset.emoji;
        insertTextAtCursor(emoji);
        updatePreview();
        updateStats();
        closeEmojiPicker();
        editor.focus();
      });
    });
  }

  let emojiPickerOpen = false;

  emojiBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (emojiPickerOpen) {
      closeEmojiPicker();
    } else {
      openEmojiPicker();
    }
  });

  function openEmojiPicker() {
    const rect = emojiBtn.getBoundingClientRect();
    emojiPicker.style.top = `${rect.bottom + 8}px`;
    emojiPicker.style.left = `${Math.min(rect.left, window.innerWidth - 340)}px`;
    emojiPicker.classList.remove('hidden');
    emojiPickerOpen = true;
  }

  function closeEmojiPicker() {
    emojiPicker.classList.add('hidden');
    emojiPickerOpen = false;
  }

  document.addEventListener('click', (e) => {
    if (emojiPickerOpen && !emojiPicker.contains(e.target) && e.target !== emojiBtn) {
      closeEmojiPicker();
    }
  });

  buildEmojiPicker();

  // ─── Feature Info Popup ────────────────────────────────────────
  if (featureInfoBtn && featurePopup) {
    featureInfoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      featurePopup.classList.toggle('hidden');
      // Re-render lucide icons inside popup
      if (window.lucide) lucide.createIcons();
    });

    document.addEventListener('click', (e) => {
      if (!featurePopup.classList.contains('hidden') && !featurePopup.contains(e.target) && e.target !== featureInfoBtn) {
        featurePopup.classList.add('hidden');
      }
    });
  }

  // ─── Device Preview (Phone/Tablet) ─────────────────────────────
  function openDevicePreview(mode) {
    if (!devicePreviewModal) return;

    const text = editor.value;
    let displayText = text;
    if (containsMarkdown(text)) {
      displayText = clientSideMarkdownConvert(text);
    }

    // Set frame size class
    deviceFrame.className = `device-frame ${mode}`;

    if (mode === 'phone') {
      deviceFrame.style.width = '375px';
      deviceLabel.textContent = 'iPhone 14 — 375×812';
    } else {
      deviceFrame.style.width = '768px';
      deviceLabel.textContent = 'iPad — 768×1024';
    }

    // Set content
    if (!displayText.trim()) {
      devicePreviewContent.innerHTML = '<span class="text-gray-400 italic text-xs">Your post will appear here...</span>';
    } else {
      devicePreviewContent.textContent = displayText;
    }

    devicePreviewModal.classList.remove('hidden');
    // Re-render lucide icons inside modal
    if (window.lucide) lucide.createIcons();
  }

  function closeDevicePreviewModal() {
    if (devicePreviewModal) devicePreviewModal.classList.add('hidden');
  }

  if (previewPhone) {
    previewPhone.addEventListener('click', () => openDevicePreview('phone'));
  }
  if (previewTablet) {
    previewTablet.addEventListener('click', () => openDevicePreview('tablet'));
  }
  if (closeDevicePreview) {
    closeDevicePreview.addEventListener('click', closeDevicePreviewModal);
  }
  if (deviceOverlay) {
    deviceOverlay.addEventListener('click', closeDevicePreviewModal);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && devicePreviewModal && !devicePreviewModal.classList.contains('hidden')) {
      closeDevicePreviewModal();
    }
  });

  // ─── Utilities ─────────────────────────────────────────────────
  function insertTextAtCursor(text) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const value = editor.value;

    editor.value = value.substring(0, start) + text + value.substring(end);
    const newPos = start + text.length;
    editor.selectionStart = editor.selectionEnd = newPos;
    editor.focus();
  }

  function showToast(message, type = 'info') {
    // Remove existing toast
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const icons = {
      success: '✓',
      error: '✗',
      info: 'ℹ',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Debounce utility
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedSaveUndo = debounce(saveUndoState, 500);

  // ─── Initialize ────────────────────────────────────────────────
  updatePreview();
  updateStats();
  editor.focus();

  // Auto-save to localStorage
  const STORAGE_KEY = 'linkedin-formatter-draft';

  function loadDraft() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        editor.value = saved;
        updatePreview();
        updateStats();
      }
    } catch (e) { /* ignore */ }
  }

  function saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, editor.value);
    } catch (e) { /* ignore */ }
  }

  loadDraft();
  editor.addEventListener('input', debounce(saveDraft, 1000));

  // Welcome message in console
  console.log(
    '%c✨ LinkedIn Text Formatter%c\n' +
    'Format your LinkedIn posts with Unicode styling, slash commands, and more.\n' +
    'Type / in the editor to see available commands.',
    'font-size: 18px; font-weight: bold; color: #0a66c2;',
    'font-size: 12px; color: #64748b;'
  );
});
