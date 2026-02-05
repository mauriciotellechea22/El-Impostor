import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test connection but don't crash if it fails
pool.connect()
    .then(client => {
        console.log('✅ Database connected');
        client.release();
    })
    .catch(err => {
        console.warn('⚠️  Database not ready:', err.message);
    });

// Get random theme by category
export async function getRandomTheme(category = null) {
    const client = await pool.connect();
    try {
        let query = 'SELECT * FROM themes';
        let params = [];

        if (category) {
            query += ' WHERE category = $1';
            params.push(category);
        }

        query += ' ORDER BY RANDOM() LIMIT 1';

        const result = await client.query(query, params);
        return result.rows[0];
    } finally {
        client.release();
    }
}

// Get all categories
export async function getCategories() {
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT DISTINCT category, COUNT(*) as count FROM themes GROUP BY category'
        );
        return result.rows;
    } finally {
        client.release();
    }
}

// Save game result
export async function saveGame(gameData) {
    const client = await pool.connect();
    try {
        const { theme_id, players, impostor_player, winner, rounds, clues } = gameData;

        const result = await client.query(
            `INSERT INTO games (theme_id, players, impostor_player, winner, rounds, clues) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
            [theme_id, JSON.stringify(players), impostor_player, winner, rounds, JSON.stringify(clues)]
        );

        return result.rows[0];
    } finally {
        client.release();
    }
}

export { pool };
