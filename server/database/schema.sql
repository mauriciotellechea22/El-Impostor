-- El Impostor Database Schema

-- Themes table: Football entities (players, clubs, stadiums, matches)
CREATE TABLE IF NOT EXISTS themes (
    id SERIAL PRIMARY KEY,
    category VARCHAR(20) NOT NULL CHECK (category IN ('jugador', 'club', 'estadio', 'partido', 'dt')),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty INTEGER DEFAULT 2 CHECK (difficulty BETWEEN 1 AND 3),
    hints JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Games table: Game history for analytics
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    theme_id INTEGER REFERENCES themes(id),
    players JSONB NOT NULL,
    impostor_player VARCHAR(50),
    winner VARCHAR(20) CHECK (winner IN ('impostor', 'innocents')),
    rounds INTEGER DEFAULT 1,
    clues JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_themes_category ON themes(category);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);
