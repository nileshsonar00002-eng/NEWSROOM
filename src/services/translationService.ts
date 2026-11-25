/**
 * Translation Service for English <-> Hindi News Translation.
 * Uses high-speed Google Translate client API with MyMemory fallback,
 * local caching, and HTML structure preservation.
 */

const translationCache = new Map<string, string>();

// Read from sessionStorage cache if available
function getCachedTranslation(text: string, fromLang: string, toLang: string): string | null {
  const key = `trans_${fromLang}_${toLang}_${text.length}_${text.substring(0, 32)}`;
  if (translationCache.has(key)) {
    return translationCache.get(key)!;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        translationCache.set(key, stored);
        return stored;
      }
    } catch {}
  }
  return null;
}

function setCachedTranslation(text: string, fromLang: string, toLang: string, translated: string): void {
  const key = `trans_${fromLang}_${toLang}_${text.length}_${text.substring(0, 32)}`;
  translationCache.set(key, translated);
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(key, translated);
    } catch {}
  }
}

/**
 * Translates a single plain text chunk (up to ~1000 chars) using Google Translate client API
 */
async function translateChunkWithGoogle(text: string, fromLang: string, toLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });

  if (!res.ok) {
    throw new Error(`Google translate returned status ${res.status}`);
  }

  const data = await res.json();
  if (Array.isArray(data) && Array.isArray(data[0])) {
    const result = data[0].map((item: any) => (Array.isArray(item) ? item[0] : '')).join('');
    if (result && result.trim()) {
      return result;
    }
  }
  throw new Error('Invalid translation response format');
}

/**
 * Fallback translation using MyMemory API
 */
async function translateChunkWithMyMemory(text: string, fromLang: string, toLang: string): Promise<string> {
  const langPair = `${fromLang}|${toLang}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`MyMemory returned status ${res.status}`);
  }

  const data = await res.json();
  if (data?.responseData?.translatedText) {
    return data.responseData.translatedText;
  }
  throw new Error('MyMemory translation empty');
}

/**
 * Translates plain text with automatic chunking and fallback strategies
 */
export async function translatePlainText(
  text: string,
  fromLang: 'en' | 'hi' = 'en',
  toLang: 'en' | 'hi' = 'hi'
): Promise<string> {
  if (!text || !text.trim()) return text;
  if (fromLang === toLang) return text;

  const trimmed = text.trim();
  const cached = getCachedTranslation(trimmed, fromLang, toLang);
  if (cached) return cached;

  // Split large texts into chunks by sentences/lines (max 800 chars per chunk)
  const maxChunkLength = 800;
  if (trimmed.length > maxChunkLength) {
    const lines = trimmed.split(/\n+/);
    const translatedLines: string[] = [];
    for (const line of lines) {
      if (!line.trim()) {
        translatedLines.push('');
        continue;
      }
      const transLine = await translatePlainText(line, fromLang, toLang);
      translatedLines.push(transLine);
    }
    const combined = translatedLines.join('\n');
    setCachedTranslation(trimmed, fromLang, toLang, combined);
    return combined;
  }

  // Attempt Google Translate first
  try {
    const res = await translateChunkWithGoogle(trimmed, fromLang, toLang);
    setCachedTranslation(trimmed, fromLang, toLang, res);
    return res;
  } catch (err) {
    console.warn('[Translation] Google translate fallback triggered:', err);
  }

  // Attempt MyMemory second
  try {
    const res = await translateChunkWithMyMemory(trimmed, fromLang, toLang);
    setCachedTranslation(trimmed, fromLang, toLang, res);
    return res;
  } catch (err2) {
    console.warn('[Translation] MyMemory fallback failed:', err2);
  }

  // Return original text if network translation fails
  return trimmed;
}

/**
 * Translates rich HTML while preserving all HTML tags, attributes, formatting, and images.
 */
export async function translateHtml(
  html: string,
  fromLang: 'en' | 'hi' = 'en',
  toLang: 'en' | 'hi' = 'hi'
): Promise<string> {
  if (!html || !html.trim()) return '';
  if (fromLang === toLang) return html;

  // In non-browser environments, return text translation
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return translatePlainText(html, fromLang, toLang);
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const container = doc.body.firstElementChild || doc.body;

    // Collect all text nodes with actual textual content
    const textNodes: { node: Node; text: string }[] = [];
    const walk = (node: Node) => {
      // Don't translate script, style, or code elements
      const parentTag = node.parentElement?.tagName.toLowerCase();
      if (parentTag === 'script' || parentTag === 'style' || parentTag === 'code') {
        return;
      }

      if (node.nodeType === Node.TEXT_NODE) {
        const txt = node.textContent?.trim();
        if (txt && txt.length > 0) {
          textNodes.push({ node, text: txt });
        }
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          walk(node.childNodes[i]);
        }
      }
    };

    walk(container);

    // Translate each text node preserving whitespaces
    for (const item of textNodes) {
      const original = item.text;
      const translated = await translatePlainText(original, fromLang, toLang);
      if (item.node.textContent) {
        item.node.textContent = item.node.textContent.replace(original, translated);
      }
    }

    return container.innerHTML;
  } catch (e) {
    console.warn('[Translation] HTML parsing error, falling back to plain text:', e);
    return translatePlainText(html, fromLang, toLang);
  }
}

/**
 * Translates all article translation fields (title, description, content) at once
 */
export async function translateArticleFields(
  fields: { title: string; description: string; content: string },
  fromLang: 'en' | 'hi' = 'en',
  toLang: 'en' | 'hi' = 'hi'
): Promise<{ title: string; description: string; content: string }> {
  const [translatedTitle, translatedDesc, translatedContent] = await Promise.all([
    fields.title ? translatePlainText(fields.title, fromLang, toLang) : Promise.resolve(''),
    fields.description ? translatePlainText(fields.description, fromLang, toLang) : Promise.resolve(''),
    fields.content ? translateHtml(fields.content, fromLang, toLang) : Promise.resolve('')
  ]);

  return {
    title: translatedTitle,
    description: translatedDesc,
    content: translatedContent
  };
}
