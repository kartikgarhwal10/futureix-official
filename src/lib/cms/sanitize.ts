/**
 * FUTUREIX CMS — Security & HTML Sanitization Utility
 * 
 * Provides robust sanitization for rich text content, stripping executable
 * scripts, malicious attributes, protocol handlers, and unsafe event listeners.
 */

// Disallowed tags that could introduce script execution or DOM clobbering
const DANGEROUS_TAGS = [
  "script",
  "iframe",
  "object",
  "embed",
  "applet",
  "base",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "meta",
  "link",
  "style",
  "frame",
  "frameset",
];

/**
 * Sanitizes rich text HTML content to prevent Stored XSS.
 * Removes forbidden tags, inline javascript event handlers (onload, onerror, etc.),
 * and malicious protocol schemes (javascript:, data:text/html, vbscript:).
 */
export function sanitizeHtml(rawHtml: string | null | undefined): string {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  let cleaned = rawHtml;

  // 1. Remove dangerous tags and their content
  for (const tag of DANGEROUS_TAGS) {
    const tagRegex = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    cleaned = cleaned.replace(tagRegex, "");
    // Also remove self-closing or lone tags
    const loneTagRegex = new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi");
    cleaned = cleaned.replace(loneTagRegex, "");
  }

  // 2. Strip inline event handlers (e.g. onload, onerror, onclick, onmouseover)
  cleaned = cleaned.replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // 3. Strip dangerous protocol handlers from href and src attributes (javascript:, data:text/html, vbscript:)
  cleaned = cleaned.replace(
    /\b(href|src)\s*=\s*(?:'(?:javascript|data:text\/html|vbscript):[^']*'|"(?:javascript|data:text\/html|vbscript):[^"]*"|(?:javascript|data:text\/html|vbscript):[^\s>]+)/gi,
    '$1="#"'
  );

  return cleaned;
}

/**
 * Validates and sanitizes internal redirection paths to prevent Open Redirect vulnerabilities.
 * Ensures the redirect target starts strictly with `/admin` and cannot be hijacked.
 */
export function sanitizeRedirectPath(target: string | null | undefined, defaultFallback: string = "/admin/dashboard"): string {
  if (!target || typeof target !== "string") return defaultFallback;

  const trimmed = target.trim();

  // Reject protocol-relative URLs (e.g. //attacker.com)
  if (trimmed.startsWith("//")) return defaultFallback;

  // Reject URLs containing protocol schemes (e.g. http:, https:, javascript:)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return defaultFallback;

  // Reject backslashes which browsers might convert to forward slashes
  if (trimmed.includes("\\")) return defaultFallback;

  // Must strictly be an internal admin path
  if (!trimmed.startsWith("/admin")) return defaultFallback;

  return trimmed;
}

/**
 * Validates whether an input URL is safe (http, https, or relative).
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();

  // Relative paths
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;

  // Safe protocols
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
