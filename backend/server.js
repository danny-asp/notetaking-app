const express = require("express");
const cors = require('cors');
const { Pool } = require("pg")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = 'your_jwt_secret'

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "notetaking-app",
    password: "112358",
    port: 5432

})
app.use(cors());
app.use(express.json())


// authUser

const authUser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'token missing' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token.' });
    }
}

// regANewUser

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // CheckIfExists
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        // HashPasword
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // sendUserToDB
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        const user = result.rows[0];
        res.json(user);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// loginAUser
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // CheckUserExist
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        // CheckCorrectPassword
        const passwordMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid username or password.' });
        }

        // GenerateToken
        const token = jwt.sign({ user: { id: user.rows[0].id, username: user.rows[0].username } }, JWT_SECRET);
        res.json({ token, user });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// LogoutJust for the message
app.post('/logout', (req, res) => {
    // No action on the backend TODO in the frontend to remove the token
    res.json({ message: 'Logout successful' });
});

// GetUserInfo
app.get('/user', authUser, async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        console.error('Error fetching current user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// connectionTesting

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log("db connection error"), err
    } else {
        console.log("DB connected", res.rows[0])
    }
})

// createNote

app.post("/notes", async (req, res) => {
    const { title, content, userId } = req.body;
    try {
        const result = await pool.query('INSERT INTO notes (title, content, userId) VALUES ($1, $2, $3) RETURNING *', [title, content, userId])
        res.status(200).json({ message: "note added, all good :)" })
    } catch (error) {
        console.error("Err creating a note", error)
        res.status(500).json({ error: "INT server error" })
    }
})



// getAllNotes

app.get("/notes", async (req, res) => {
    const { userId } = req.body;
    try {
        const result = await pool.query('SELECT * FROM notes WHERE userid = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error getting notes for user", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/notes/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM notes WHERE userid = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error getting notes for user", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// delNote
app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM notes WHERE id = $1', [id]);
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`SERVER Running ${PORT}`)
})