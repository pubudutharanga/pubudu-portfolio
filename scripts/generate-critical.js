import { generate } from 'critical';
import { preview } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.resolve(__dirname, '../dist');

async function run() {
    // Vercel's build environment doesn't have the necessary OS shared libraries to run Puppeteer/Chrome.
    // We skip the critical CSS generation on Vercel to prevent the build from failing (Error Code 127).
    if (process.env.VERCEL) {
        console.log('Skipping critical CSS generation on Vercel to avoid Puppeteer missing library errors.');
        return;
    }

    const server = await preview({
        preview: { port: 4173 },
        configFile: false,
        root: path.resolve(__dirname, '..'),
    });
    
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Critical CSS generation timed out after 10s')), 10000)
    );

    try {
        await Promise.race([
            generate({
                base: basePath,
                src: 'http://localhost:4173/',
                target: 'index.html',
                inline: true,
                width: 1300,
                height: 900,
            }),
            timeoutPromise
        ]);
        console.log('Critical CSS generated and inlined successfully!');
    } catch (err) {
        console.warn('Critical CSS generation skipped or timed out (proceeding with preloaded CSS):', err.message || err);
        // Do not fail build for an optional critical CSS optimization
    } finally {
        if (server && server.httpServer) {
            server.httpServer.close(() => {
                process.exit(0);
            });
            // Fallback timeout in case keep-alive sockets remain open
            setTimeout(() => process.exit(0), 2000);
        } else {
            process.exit(0);
        }
    }
}

run();
