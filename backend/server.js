const express = require("express");
const { Pool } = require("pg")

const app = express()
const PORT = process.env.PORT || 3000


const pool = new Pool({
    user: "username",
    host: "localhost",
    database: "database",
    password: "pass",
    port: 5432

})

app.use(express.json())

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
    const { title, content } = req.body;
    try {
        const result = await pool.query('INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *', [title, content])
    } catch (error) {
        console.error("Err creating a note", err)
        res.status(500).json({ error: "INT server error" })
    }
})

// updateNote

app.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const result = await pool.query(
            'UPDATE notes SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
            [title, content, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// getAllNotes

app.get("/notes", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notes');
        res.json(result.rows)
    } catch (err) {
        console.error("error getting all notes", err);
        res.status(500).json({ error: "INT Server Error" })
    }
})

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
    console.log("SERVER Running")
})