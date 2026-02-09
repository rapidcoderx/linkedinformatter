/**
 * Slash Commands Engine for LinkedIn Text Formatter
 * Provides /command functionality for quick formatting and content insertion.
 */

const SlashCommands = (() => {
  const commands = [
    {
      name: 'bold',
      label: 'Bold Text',
      description: 'Transform selected text to bold Unicode',
      icon: '𝗕',
      category: 'formatting',
      action: (text) => UnicodeMaps.toBold(text || 'Bold text here'),
    },
    {
      name: 'italic',
      label: 'Italic Text',
      description: 'Transform selected text to italic Unicode',
      icon: '𝘐',
      category: 'formatting',
      action: (text) => UnicodeMaps.toItalic(text || 'Italic text here'),
    },
    {
      name: 'bolditalic',
      label: 'Bold Italic',
      description: 'Transform text to bold italic Unicode',
      icon: '𝑩',
      category: 'formatting',
      action: (text) => UnicodeMaps.toBoldItalic(text || 'Bold italic text'),
    },
    {
      name: 'mono',
      label: 'Monospace',
      description: 'Transform text to monospace Unicode',
      icon: '𝙼',
      category: 'formatting',
      action: (text) => UnicodeMaps.toMonospace(text || 'monospace text'),
    },
    {
      name: 'script',
      label: 'Script / Calligraphy',
      description: 'Transform text to script style',
      icon: '𝓐',
      category: 'formatting',
      action: (text) => UnicodeMaps.toScriptBold(text || 'Script text'),
    },
    {
      name: 'fraktur',
      label: 'Fraktur / Gothic',
      description: 'Transform text to Fraktur style',
      icon: '𝔄',
      category: 'formatting',
      action: (text) => UnicodeMaps.toFraktur(text || 'Gothic text'),
    },
    {
      name: 'doublestruck',
      label: 'Double-Struck',
      description: 'Transform text to double-struck style',
      icon: '𝔸',
      category: 'formatting',
      action: (text) => UnicodeMaps.toDoubleStruck(text || 'Double struck'),
    },
    {
      name: 'circled',
      label: 'Circled Letters',
      description: 'Transform text to circled characters',
      icon: 'Ⓐ',
      category: 'formatting',
      action: (text) => UnicodeMaps.toCircled(text || 'Circled'),
    },
    {
      name: 'squared',
      label: 'Squared Letters',
      description: 'Transform text to squared characters',
      icon: '🅰',
      category: 'formatting',
      action: (text) => UnicodeMaps.toSquared(text || 'Squared'),
    },
    {
      name: 'heading',
      label: 'Section Heading',
      description: 'Insert a bold heading with separator',
      icon: 'H',
      category: 'blocks',
      action: (text) => {
        const title = text || 'Section Title';
        return `\n${UnicodeMaps.toBold(title)}\n${'─'.repeat(25)}\n`;
      },
    },
    {
      name: 'divider',
      label: 'Divider Line',
      description: 'Insert a decorative separator',
      icon: '─',
      category: 'blocks',
      action: () => '\n─────────────────────────\n',
    },
    {
      name: 'dotdivider',
      label: 'Dot Divider',
      description: 'Insert a dotted separator',
      icon: '·',
      category: 'blocks',
      action: () => '\n· · · · · · · · · · · · ·\n',
    },
    {
      name: 'stardivider',
      label: 'Star Divider',
      description: 'Insert a star separator',
      icon: '✦',
      category: 'blocks',
      action: () => '\n✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦\n',
    },
    {
      name: 'bullet',
      label: 'Bullet List',
      description: 'Insert a bullet point list template',
      icon: '•',
      category: 'blocks',
      action: () => '\n• Point one\n• Point two\n• Point three\n',
    },
    {
      name: 'numbered',
      label: 'Numbered List',
      description: 'Insert a numbered list template',
      icon: '1.',
      category: 'blocks',
      action: () => '\n1️⃣ First item\n2️⃣ Second item\n3️⃣ Third item\n',
    },
    {
      name: 'arrow',
      label: 'Arrow List',
      description: 'Insert an arrow list template',
      icon: '→',
      category: 'blocks',
      action: () => '\n→ Item one\n→ Item two\n→ Item three\n',
    },
    {
      name: 'checklist',
      label: 'Checklist',
      description: 'Insert a checklist template',
      icon: '✅',
      category: 'blocks',
      action: () => '\n✅ Done item\n✅ Done item\n⬜ Todo item\n⬜ Todo item\n',
    },
    {
      name: 'cta',
      label: 'Call to Action',
      description: 'Insert a call-to-action block',
      icon: '📢',
      category: 'templates',
      action: () => {
        return `\n${'─'.repeat(25)}\n\n👇 ${UnicodeMaps.toBold('Your call to action here')}\n\n💬 Drop a comment below\n♻️ Repost if you found this valuable\n🔔 Follow for more content\n`;
      },
    },
    {
      name: 'hook',
      label: 'Hook Template',
      description: 'Insert an attention-grabbing hook',
      icon: '🪝',
      category: 'templates',
      action: () => {
        return `${UnicodeMaps.toBold('Stop scrolling. This changed everything.')}\n\nHere's what I learned 👇\n\n`;
      },
    },
    {
      name: 'tips',
      label: 'Tips Template',
      description: 'Insert a tips/lessons template',
      icon: '💡',
      category: 'templates',
      action: () => {
        return `${UnicodeMaps.toBold('5 things I wish I knew earlier:')}\n\n1️⃣ First lesson\n\n2️⃣ Second lesson\n\n3️⃣ Third lesson\n\n4️⃣ Fourth lesson\n\n5️⃣ Fifth lesson\n\nWhich one resonates with you?\n`;
      },
    },
    {
      name: 'story',
      label: 'Story Template',
      description: 'Insert a storytelling framework',
      icon: '📖',
      category: 'templates',
      action: () => {
        return `${UnicodeMaps.toBold('A story that changed my perspective:')}\n\n${UnicodeMaps.toItalic('The situation:')}\n[Describe what happened]\n\n${UnicodeMaps.toItalic('The turning point:')}\n[What changed]\n\n${UnicodeMaps.toItalic('The lesson:')}\n[What you learned]\n\n${'─'.repeat(25)}\n\n💬 Has something similar happened to you?\n`;
      },
    },
    {
      name: 'poll',
      label: 'Poll Style',
      description: 'Insert a poll-style engagement post',
      icon: '📊',
      category: 'templates',
      action: () => {
        return `${UnicodeMaps.toBold('Quick poll:')}\n\nWhich do you prefer?\n\n🅰 Option A\n🅱 Option B\n🅲 Option C\n🅳 Option D\n\nVote in the comments! 👇\n`;
      },
    },
    {
      name: 'quote',
      label: 'Quote Block',
      description: 'Insert a formatted quote',
      icon: '❝',
      category: 'blocks',
      action: (text) => {
        const quote = text || 'Your inspiring quote here';
        return `\n❝ ${UnicodeMaps.toItalic(quote)} ❞\n\n— Author Name\n`;
      },
    },
    {
      name: 'hashtags',
      label: 'Hashtag Block',
      description: 'Insert a hashtag section',
      icon: '#',
      category: 'blocks',
      action: () => '\n\n·\n·\n·\n\n#LinkedIn #ContentCreation #PersonalBranding #Networking #GrowthMindset\n',
    },
    {
      name: 'spacer',
      label: 'Line Spacer',
      description: 'Insert blank lines for spacing',
      icon: '↕',
      category: 'blocks',
      action: () => '\n\n\n',
    },
    {
      name: 'markdown',
      label: 'Paste Markdown',
      description: 'Convert markdown to LinkedIn format',
      icon: 'MD',
      category: 'tools',
      action: 'OPEN_MARKDOWN_MODAL',
    },
  ];

  /**
   * Search/filter commands by query
   */
  function search(query) {
    if (!query) return commands;
    const q = query.toLowerCase().trim();
    return commands.filter(cmd =>
      cmd.name.includes(q) ||
      cmd.label.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.category.includes(q)
    );
  }

  /**
   * Get a command by name
   */
  function get(name) {
    return commands.find(cmd => cmd.name === name);
  }

  /**
   * Execute a command
   */
  function execute(name, selectedText) {
    const cmd = get(name);
    if (!cmd) return null;
    if (cmd.action === 'OPEN_MARKDOWN_MODAL') return 'OPEN_MARKDOWN_MODAL';
    return cmd.action(selectedText);
  }

  /**
   * Get commands grouped by category
   */
  function getGrouped() {
    const groups = {};
    for (const cmd of commands) {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    }
    return groups;
  }

  return { commands, search, get, execute, getGrouped };
})();

if (typeof window !== 'undefined') {
  window.SlashCommands = SlashCommands;
}
