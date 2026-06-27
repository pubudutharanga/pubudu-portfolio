import { generate } from 'critical';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.resolve(__dirname, '../dist');

generate({
    base: basePath,
    src: 'index.html',
    target: 'index.html',
    inline: true,
    width: 1300,
    height: 900,
}).then(() => {
    console.log('Critical CSS generated and inlined successfully!');
}).catch(err => {
    console.error('Error generating critical CSS:', err);
    process.exit(1);
});
