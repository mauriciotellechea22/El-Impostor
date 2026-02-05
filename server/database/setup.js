import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
    const client = await pool.connect();

    try {
        console.log('🔧 Setting up database...');

        // Run schema
        const schemaSQL = fs.readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
        await client.query(schemaSQL);
        console.log('✅ Schema created');

        // Run seed data
        const seedSQL = fs.readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
        await client.query(seedSQL);
        console.log('✅ Seed data inserted');

        // Verify
        const result = await client.query('SELECT COUNT(*) FROM themes');
        console.log(`✅ Database ready with ${result.rows[0].count} themes`);

    } catch (error) {
        console.error('❌ Database setup failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

setupDatabase();
