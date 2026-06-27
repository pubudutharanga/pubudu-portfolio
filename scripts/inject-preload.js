import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.resolve(__dirname, '../dist/index.html');

try {
    let html = fs.readFileSync(indexPath, 'utf-8');

    // Find the CSS file name
    const cssMatch = html.match(/<link rel="stylesheet".*?href="([^"]+\.css)"/);
    // Find the main JS file name
    const jsMatch = html.match(/<script type="module" crossorigin src="([^"]+\/index-[^"]+\.js)"/);

    let preloadTags = '';

    if (cssMatch && cssMatch[1]) {
        preloadTags += `<link rel="preload" href="${cssMatch[1]}" as="style">\n    `;
    }

    if (jsMatch && jsMatch[1]) {
        preloadTags += `<link rel="preload" href="${jsMatch[1]}" as="script" crossorigin="anonymous">\n    `;
    }

    if (preloadTags) {
        // Insert right before </head>
        html = html.replace('</head>', `${preloadTags}</head>`);
        fs.writeFileSync(indexPath, html, 'utf-8');
        console.log('Successfully injected preload hints for critical CSS and JS.');
    } else {
        console.log('No matching CSS or JS found for preload injection.');
    }
} catch (err) {
    console.error('Error injecting preload hints:', err.message);
}
