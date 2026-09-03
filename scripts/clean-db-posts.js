import 'dotenv/config';
import { getDatabase } from '../api/lib/mongodb.js';

async function cleanPosts() {
    try {
        const db = await getDatabase();
        const collection = db.collection('blogs');
        const posts = await collection.find({}).toArray();

        let count = 0;
        for (const p of posts) {
            if (p.content && (p.content.startsWith('{') || p.content.includes('"title":'))) {
                const firstTag = p.content.indexOf('<');
                if (firstTag !== -1) {
                    const cleanHtml = p.content.substring(firstTag);
                    await collection.updateOne({ _id: p._id }, { $set: { content: cleanHtml } });
                    console.log(`✅ Cleaned post: "${p.title}"`);
                    count++;
                }
            }
        }
        console.log(`\n🎉 Total posts cleaned in MongoDB Atlas: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error('Database clean error:', err);
        process.exit(1);
    }
}

cleanPosts();
