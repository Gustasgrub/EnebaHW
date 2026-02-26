const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows your React frontend to communicate with this API
app.use(express.json());

// Initialize SQLite Database (using a local file so data persists between restarts)
const db = new sqlite3.Database('./games.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Database Setup and Seeding
db.serialize(() => {
    // 1. Create the table based on the data points seen in the screenshot
    db.run(`CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        platform TEXT,
        cover_image TEXT,
        original_price REAL,
        current_price REAL,
        discount TEXT,
        cashback REAL,
        likes INTEGER
    )`);

    // 2. Check if the database is already seeded
    db.get("SELECT COUNT(*) AS count FROM games", (err, row) => {
        if (row && row.count === 0) {
            console.log("Seeding database with initial game data...");
            const stmt = db.prepare(`INSERT INTO games 
                (title, platform, cover_image, original_price, current_price, discount, cashback, likes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
            
            // Seed 1: Split Fiction (Xbox)
            stmt.run("Split Fiction", "Xbox Series X|S, Xbox One Global", "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Split_Fiction_cover_art.jpg/250px-Split_Fiction_cover_art.jpg", 59.99, 40.93, "-32%", 0.82, 1012);
            // Seed 2: Split Fiction (Switch)
            stmt.run("Split Fiction", "Nintendo Switch (EU)", "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Split_Fiction_cover_art.jpg/250px-Split_Fiction_cover_art.jpg", 59.99, 35.15, "-41%", 0.70, 450);
            // Seed 3: FIFA 23
            stmt.run("Fifa 23", "PC Global", "https://upload.wikimedia.org/wikipedia/en/a/a6/FIFA_23_Cover.jpg", 69.99, 25.50, "-63%", 0.50, 2300);
            // Seed 4: Red Dead Redemption 2
            stmt.run("Red Dead Redemption 2", "Rockstar Games Global", "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg", 59.99, 19.99, "-66%", 0.40, 5000);

            stmt.finalize();
        }
    });
});

// --- API Endpoints ---

// GET /list & GET /list?search=<gamename>
app.get('/list', (req, res) => {
    const searchQuery = req.query.search;

    console.log("Ieškoma žodžio:", searchQuery); 

    if (searchQuery) {
        // PATOBULINIMAS: Ieškome tiek pagal pavadinimą, tiek pagal platformą
        if (searchQuery.toLowerCase().trim() === 'europe') {
            searchQuery = 'eu';
        }
        const sql = `
            SELECT * FROM games 
            WHERE LOWER(title) LIKE LOWER(?) 
            OR LOWER(platform) LIKE LOWER(?)
        `;
        // Kadangi SQL užklausoje turime du klaustukus (?), turime paduoti paieškos žodį du kartus
        const searchTerm = `%${searchQuery.trim()}%`;
        const params = [searchTerm, searchTerm];

        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error("Duomenų bazės klaida:", err);
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    } else {
        // Nėra paieškos žodžio - grąžiname viską
        const sql = `SELECT * FROM games`;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});