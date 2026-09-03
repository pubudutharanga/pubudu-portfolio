import 'dotenv/config';
import { MongoClient } from 'mongodb';
import dns from 'dns';

// Ensure IPv4 lookup precedence on Windows to prevent DNS resolution failures
try {
    dns.setDefaultResultOrder('ipv4first');
} catch {}

let client = null;

export async function getDatabase() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || 'portfolio';

    if (!uri) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env or Vercel settings');
    }

    // Reuse connected client if active
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        global._mongoClientPromise = client.connect().catch((err) => {
            // Reset on failure so subsequent requests can re-connect cleanly
            global._mongoClientPromise = null;
            throw err;
        });
    }

    try {
        const connectedClient = await global._mongoClientPromise;
        return connectedClient.db(dbName);
    } catch (err) {
        global._mongoClientPromise = null;
        throw err;
    }
}

export default getDatabase;
