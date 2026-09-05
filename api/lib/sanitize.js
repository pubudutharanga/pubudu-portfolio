/**
 * Zero-dependency HTML sanitizer specifically crafted for portfolio blog posts.
 * Runs natively in Node.js and Vercel Serverless Functions without external
 * CJS dependencies that cause cold-start invocation crashes.
 */

const ALLOWED_TAGS = new Set([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'a', 'b', 'i', 'strong', 'em', 'strike', 's', 'u', 'code', 'pre', 'hr', 'br',
    'ul', 'ol', 'li', 'blockquote',
    'div', 'span',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img', 'figure', 'figcaption',
    'svg', 'path', 'mark', 'kbd', 'sub', 'sup', 'del'
]);

const ALLOWED_ATTRS = new Set([
    'class', 'id', 'title',
    'href', 'target', 'rel',
    'src', 'alt', 'loading', 'width', 'height',
    'xmlns', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'd'
]);

/**
 * Sanitize dirty HTML string:
 * - Strips dangerous tags entirely (script, style, iframe, object, embed, form, meta, link, base)
 * - Removes HTML comments
 * - Removes event handlers (onclick, onerror, onload, etc.)
 * - Strips malicious schemes (javascript:, vbscript:, non-image data:)
 * - Enforces rel="noopener noreferrer" on external/blank-target links
 * - Preserves allowed formatting tags and Tailwind CSS classes
 */
export function sanitizePostHtml(dirtyHtml) {
    if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

    let clean = dirtyHtml;

    // 1. Remove dangerous blocks and their contents entirely
    clean = clean.replace(/<(?:script|style|iframe|object|embed|applet|form|textarea|select|button|meta|link|base)[^>]*>[\s\S]*?<\/(?:script|style|iframe|object|embed|applet|form|textarea|select|button)>/gi, '');
    clean = clean.replace(/<(?:script|style|iframe|object|embed|applet|form|textarea|select|button|meta|link|base)[^>]*\/?>/gi, '');

    // 2. Remove HTML comments
    clean = clean.replace(/<!--[\s\S]*?-->/g, '');

    // 3. Process every HTML tag
    clean = clean.replace(/<\/?([a-zA-Z0-9-]+)([^>]*)>/g, (match, rawTagName, rawAttrs) => {
        const tagName = rawTagName.toLowerCase();
        const isClosing = match.startsWith('</');

        // If tag is not in allowlist, strip the tag itself
        if (!ALLOWED_TAGS.has(tagName)) {
            return '';
        }

        if (isClosing) {
            return `</${tagName}>`;
        }

        // Parse attributes
        const cleanAttrs = [];
        let isBlankTarget = false;
        let isExternalHref = false;

        const attrRegex = /([a-zA-Z0-9_-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
        let attrMatch;

        while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
            const attrName = attrMatch[1].toLowerCase();
            const attrVal = attrMatch[2] !== undefined ? attrMatch[2] : (attrMatch[3] !== undefined ? attrMatch[3] : (attrMatch[4] || ''));

            // Block any event handlers (onclick, onload, onerror, etc.)
            if (attrName.startsWith('on')) {
                continue;
            }

            // Check if allowed attribute or data-*/aria-*
            const isAllowed = ALLOWED_ATTRS.has(attrName) || attrName.startsWith('data-') || attrName.startsWith('aria-');
            if (!isAllowed) {
                continue;
            }

            // URL sanitation for href and src
            if (attrName === 'href' || attrName === 'src') {
                const trimmedVal = attrVal.trim().toLowerCase();
                // Block javascript:, vbscript:, and unsafe data: URIs
                if (trimmedVal.startsWith('javascript:') || trimmedVal.startsWith('vbscript:') || (trimmedVal.startsWith('data:') && !trimmedVal.startsWith('data:image/'))) {
                    continue;
                }

                if (attrName === 'href') {
                    if (trimmedVal.startsWith('http://') || trimmedVal.startsWith('https://')) {
                        isExternalHref = true;
                    }
                }
            }

            if (attrName === 'target' && attrVal.toLowerCase() === '_blank') {
                isBlankTarget = true;
            }

            // Escape quotes inside attribute value
            const escapedVal = attrVal.replace(/"/g, '&quot;');
            cleanAttrs.push(`${attrName}="${escapedVal}"`);
        }

        // Enforce rel="noopener noreferrer" on external or blank-target links
        if (tagName === 'a') {
            if (isBlankTarget || isExternalHref) {
                const hasRel = cleanAttrs.some(a => a.startsWith('rel='));
                if (!hasRel) {
                    cleanAttrs.push('rel="noopener noreferrer"');
                }
            }
        }

        const attrString = cleanAttrs.length > 0 ? ' ' + cleanAttrs.join(' ') : '';
        const isSelfClosing = match.endsWith('/>') || ['img', 'br', 'hr'].includes(tagName);
        return isSelfClosing ? `<${tagName}${attrString} />` : `<${tagName}${attrString}>`;
    });

    return clean;
}

