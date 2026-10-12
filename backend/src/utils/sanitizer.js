/**
 * LazyForge Sanitizer Utility
 * Sanitizes user-provided HTML, CSS, and layout blocks to prevent XSS
 * (Fulfills REQ-10: Custom HTML/CSS Safe Sanitizer)
 */

/**
 * Remove harmful script tags, iframe, object, embed, javascript: protocols,
 * and inline event attributes (onload, onerror, onclick, etc.)
 */
export function sanitizeHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  return rawHtml
    // Strip <script>...</script>
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Strip <style>...</style> (styles belong in custom_css)
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Strip <iframe...>, <object...>, <embed...>, <base...>
    .replace(/<\/?(iframe|object|embed|base|link|meta)\b[^>]*>/gi, '')
    // Strip javascript: pseudo-protocols
    .replace(/href\s*=\s*(['"])\s*javascript:[^'"]*(\1)/gi, 'href="#"')
    .replace(/src\s*=\s*(['"])\s*javascript:[^'"]*(\1)/gi, 'src=""')
    // Strip on* event handlers (e.g. onerror=, onclick=, onload=)
    .replace(/\son\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '');
}

/**
 * Sanitize custom CSS to prevent CSS injection, external imports, and expression execution
 */
export function sanitizeCss(rawCss) {
  if (!rawCss || typeof rawCss !== 'string') return '';

  return rawCss
    // Remove @import directives
    .replace(/@import\b[^;]*;/gi, '')
    // Remove javascript: inside url()
    .replace(/url\s*\(\s*(['"]?)\s*javascript:[^)]*(\1)\s*\)/gi, 'none')
    // Remove IE expression(...)
    .replace(/expression\s*\([^)]*\)/gi, 'none')
    // Remove -moz-binding / behavior
    .replace(/(-moz-binding|behavior)\s*:[^;}]*/gi, '');
}

/**
 * Recursively sanitize all text and HTML fields inside landing page layout sections
 */
export function sanitizeSections(sections) {
  if (!Array.isArray(sections)) return [];

  return sections.map((section) => {
    if (!section || typeof section !== 'object') return section;

    const sanitized = { ...section };

    // String fields
    for (const key of Object.keys(sanitized)) {
      if (typeof sanitized[key] === 'string') {
        if (key === 'customHtml' || key === 'contentHtml' || key === 'html') {
          sanitized[key] = sanitizeHtml(sanitized[key]);
        } else {
          // Regular text: strip HTML tags to avoid tag injection in titles/copy
          sanitized[key] = sanitized[key].replace(/<[^>]*>/g, '').trim();
        }
      }
    }

    return sanitized;
  });
}
