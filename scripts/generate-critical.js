import { generate } from 'critical';
import { preview } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.resolve(__dirname, '../dist');

async function run() {
    const server = await preview({
        preview: { port: 4173 },
        configFile: false,
        root: path.resolve(__dirname, '..'),
    });
    
    try {
        await generate({
            base: basePath,
            src: 'http://localhost:4173/',
            target: 'index.html',
            inline: true,
            width: 1300,
            height: 900,
        });
        console.log('Critical CSS generated and inlined successfully!');
    } catch (err) {
        console.error('Error generating critical CSS:', err);
        process.exitCode = 1;
    } finally {
        server.httpServer.close();
    }
}

run();
