import sanitizeHtml from 'sanitize-html';

/**
 * Shared sanitize-html configuration strictly tailored to the portfolio's Tailwind typography & UI components.
 * Prevents stored XSS while preserving rich article elements (headings, code blocks, feature grids, highlight boxes).
 */
export const SANITIZE_OPTIONS = {
    allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'a', 'b', 'i', 'strong', 'em', 'strike', 'code', 'pre', 'hr', 'br',
        'ul', 'ol', 'li', 'blockquote',
        'div', 'span',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'img', 'figure', 'figcaption',
        'svg', 'path'
    ],
    allowedAttributes: {
        '*': ['class', 'id', 'aria-*', 'data-*'],
        'a': ['href', 'name', 'target', 'rel', 'title'],
        'img': ['src', 'alt', 'title', 'loading', 'width', 'height'],
        'svg': ['xmlns', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'width', 'height'],
        'path': ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
        'code': ['class'],
        'pre': ['class']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
    allowedSchemesByTag: {
        img: ['http', 'https', 'data']
    },
    transformTags: {
        'a': (tagName, attribs) => {
            // Force rel="noopener noreferrer" on external links
            if (attribs.target === '_blank' || (attribs.href && !attribs.href.startsWith('/') && !attribs.href.startsWith('#'))) {
                return {
                    tagName: 'a',
                    attribs: {
                        ...attribs,
                        rel: 'noopener noreferrer'
                    }
                };
            }
            return { tagName, attribs };
        }
    }
};

/**
 * Sanitize post HTML content before saving to database
 */
export function sanitizePostHtml(dirtyHtml) {
    if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';
    return sanitizeHtml(dirtyHtml, SANITIZE_OPTIONS);
}
