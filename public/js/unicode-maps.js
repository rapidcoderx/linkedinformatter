/**
 * Unicode Character Maps for LinkedIn Text Formatting
 * Comprehensive maps for transforming ASCII text to various Unicode math symbol variants.
 */

const UnicodeMaps = (() => {
  // Helper: build a letter map from a base codepoint
  function buildLetterMap(upperBase, lowerBase, digitBase) {
    const map = {};
    for (let i = 0; i < 26; i++) {
      map[String.fromCharCode(65 + i)] = String.fromCodePoint(upperBase + i);
      map[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerBase + i);
    }
    if (digitBase !== undefined) {
      for (let i = 0; i < 10; i++) {
        map[String.fromCharCode(48 + i)] = String.fromCodePoint(digitBase + i);
      }
    }
    return map;
  }

  // Bold: Mathematical Bold
  const bold = buildLetterMap(0x1D400, 0x1D41A, 0x1D7CE);

  // Italic: Mathematical Italic
  const italic = buildLetterMap(0x1D434, 0x1D44E);
  italic['h'] = String.fromCodePoint(0x210E); // Special case for 'h'

  // Bold Italic: Mathematical Bold Italic
  const boldItalic = buildLetterMap(0x1D468, 0x1D482);

  // Monospace: Mathematical Monospace
  const monospace = buildLetterMap(0x1D670, 0x1D68A, 0x1D7F6);

  // Script (Calligraphic): Mathematical Script
  const script = buildLetterMap(0x1D49C, 0x1D4B6);
  // Special cases for script
  script['B'] = String.fromCodePoint(0x212C);
  script['E'] = String.fromCodePoint(0x2130);
  script['F'] = String.fromCodePoint(0x2131);
  script['H'] = String.fromCodePoint(0x210B);
  script['I'] = String.fromCodePoint(0x2110);
  script['L'] = String.fromCodePoint(0x2112);
  script['M'] = String.fromCodePoint(0x2133);
  script['R'] = String.fromCodePoint(0x211B);
  script['e'] = String.fromCodePoint(0x212F);
  script['g'] = String.fromCodePoint(0x210A);
  script['o'] = String.fromCodePoint(0x2134);

  // Script Bold: Mathematical Bold Script
  const scriptBold = buildLetterMap(0x1D4D0, 0x1D4EA);

  // Fraktur: Mathematical Fraktur
  const fraktur = buildLetterMap(0x1D504, 0x1D51E);
  fraktur['C'] = String.fromCodePoint(0x212D);
  fraktur['H'] = String.fromCodePoint(0x210C);
  fraktur['I'] = String.fromCodePoint(0x2111);
  fraktur['R'] = String.fromCodePoint(0x211C);
  fraktur['Z'] = String.fromCodePoint(0x2128);

  // Bold Fraktur: Mathematical Bold Fraktur
  const boldFraktur = buildLetterMap(0x1D56C, 0x1D586);

  // Double-Struck: Mathematical Double-Struck
  const doubleStruck = buildLetterMap(0x1D538, 0x1D552, 0x1D7D8);
  doubleStruck['C'] = String.fromCodePoint(0x2102);
  doubleStruck['H'] = String.fromCodePoint(0x210D);
  doubleStruck['N'] = String.fromCodePoint(0x2115);
  doubleStruck['P'] = String.fromCodePoint(0x2119);
  doubleStruck['Q'] = String.fromCodePoint(0x211A);
  doubleStruck['R'] = String.fromCodePoint(0x211D);
  doubleStruck['Z'] = String.fromCodePoint(0x2124);

  // Sans-Serif: Mathematical Sans-Serif
  const sansSerif = buildLetterMap(0x1D5A0, 0x1D5BA, 0x1D7E2);

  // Sans-Serif Bold
  const sansSerifBold = buildLetterMap(0x1D5D4, 0x1D5EE, 0x1D7EC);

  // Sans-Serif Italic
  const sansSerifItalic = buildLetterMap(0x1D608, 0x1D622);

  // Sans-Serif Bold Italic
  const sansSerifBoldItalic = buildLetterMap(0x1D63C, 0x1D656);

  // Circled letters
  const circled = {};
  for (let i = 0; i < 26; i++) {
    circled[String.fromCharCode(65 + i)] = String.fromCodePoint(0x24B6 + i);
    circled[String.fromCharCode(97 + i)] = String.fromCodePoint(0x24D2 + i);
  }
  // Circled digits (special: 0 is separate)
  circled['0'] = String.fromCodePoint(0x24EA);
  for (let i = 1; i <= 9; i++) {
    circled[String.fromCharCode(48 + i)] = String.fromCodePoint(0x2460 + i - 1);
  }

  // Negative Circled (Squared dark)
  const negativeCircled = {};
  for (let i = 0; i < 26; i++) {
    negativeCircled[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F150 + i);
    negativeCircled[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1F150 + i);
  }

  // Squared
  const squared = {};
  for (let i = 0; i < 26; i++) {
    squared[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F130 + i);
    squared[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1F130 + i);
  }

  // Negative Squared (filled)
  const negativeSquared = {};
  for (let i = 0; i < 26; i++) {
    negativeSquared[String.fromCharCode(65 + i)] = String.fromCodePoint(0x1F170 + i);
    negativeSquared[String.fromCharCode(97 + i)] = String.fromCodePoint(0x1F170 + i);
  }

  // Fullwidth
  const fullwidth = {};
  for (let i = 0; i < 26; i++) {
    fullwidth[String.fromCharCode(65 + i)] = String.fromCodePoint(0xFF21 + i);
    fullwidth[String.fromCharCode(97 + i)] = String.fromCodePoint(0xFF41 + i);
  }
  for (let i = 0; i < 10; i++) {
    fullwidth[String.fromCharCode(48 + i)] = String.fromCodePoint(0xFF10 + i);
  }

  // Subscript map (limited characters available)
  const subscript = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
    'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
    'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
    'v': 'ᵥ', 'x': 'ₓ',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  };

  // Superscript map
  const superscript = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
    'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
    'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
    'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ',
    'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  };

  /**
   * Transform text using the specified map
   */
  function transform(text, mapName) {
    const map = allMaps[mapName];
    if (!map) return text;
    return [...text].map(ch => map[ch] || ch).join('');
  }

  const allMaps = {
    bold,
    italic,
    boldItalic,
    monospace,
    script,
    scriptBold,
    fraktur,
    boldFraktur,
    doubleStruck,
    sansSerif,
    sansSerifBold,
    sansSerifItalic,
    sansSerifBoldItalic,
    circled,
    negativeCircled,
    squared,
    negativeSquared,
    fullwidth,
    subscript,
    superscript,
  };

  return {
    maps: allMaps,
    transform,

    // Convenience methods
    toBold: text => transform(text, 'bold'),
    toItalic: text => transform(text, 'italic'),
    toBoldItalic: text => transform(text, 'boldItalic'),
    toMonospace: text => transform(text, 'monospace'),
    toScript: text => transform(text, 'script'),
    toScriptBold: text => transform(text, 'scriptBold'),
    toFraktur: text => transform(text, 'fraktur'),
    toDoubleStruck: text => transform(text, 'doubleStruck'),
    toCircled: text => transform(text, 'circled'),
    toSquared: text => transform(text, 'squared'),
    toFullwidth: text => transform(text, 'fullwidth'),
    toSansSerif: text => transform(text, 'sansSerif'),
    toSansSerifBold: text => transform(text, 'sansSerifBold'),

    // Get a list of all available styles for display
    getStyleNames() {
      return Object.keys(allMaps);
    },

    // Preview all styles for a sample text
    previewAll(sampleText) {
      const results = {};
      for (const [name, map] of Object.entries(allMaps)) {
        results[name] = [...sampleText].map(ch => map[ch] || ch).join('');
      }
      return results;
    }
  };
})();

// Export for use in other files
if (typeof window !== 'undefined') {
  window.UnicodeMaps = UnicodeMaps;
}
