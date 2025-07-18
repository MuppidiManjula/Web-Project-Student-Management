const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Manju@3122',  // <-- change this
  database: 'studentdb'
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

// Get all students
app.get('/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

// Add new student
app.post('/students', (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || !age) {
    return res.status(400).json({ error: 'Missing data' });
  }

  db.query('INSERT INTO students (name, email, age) VALUES (?, ?, ?)', [name, email, age], (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert failed' });
    res.json({ id: result.insertId, name, email, age });
  });
});

// Delete student by id
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM students WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
