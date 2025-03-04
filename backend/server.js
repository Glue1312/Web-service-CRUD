const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Buat koneksi ke database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'notes_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Create a new note
app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    const query = 'INSERT INTO notes (title, content) VALUES (?, ?)';
    db.query(query, [title, content], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send({ id: result.insertId, title, content });
    });
});

// Get all notes
app.get('/notes', (req, res) => {
    const query = 'SELECT * FROM notes ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(results);
    });
});


// Get a note by id
app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM notes WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            res.status(200).send(results[0]);
        } else {
            res.status(404).send({ message: 'Note not found' });
        }
    });
});

// Update a note by id
app.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
    db.query(query, [title, content, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows > 0) {
            res.status(200).send({ id, title, content });
        } else {
            res.status(404).send({ message: 'Note not found' });
        }
    });
});

// Delete a note by id
app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM notes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).send({ message: 'Note not found' });
        }
    });
});

// Update a note by id
app.put('/notes/:id', (req, res) => {
    const id = req.params.id;
    const { title, content } = req.body;
    const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
    db.query(query, [title, content, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows > 0) {
            res.status(200).send({ id, title, content });
        } else {
            res.status(404).send({ message: 'Note not found' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});