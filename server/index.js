const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock user
const USER = {
  username: 'admin',
  password: '1234',
};

// In-memory item list
let items = [];

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Add new item
app.post('/api/items', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  items.push(item);
  res.json(item);
});

// Update item
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(item => item.id == id);
  if (index > -1) {
    items[index] = { ...items[index], ...req.body };
    res.json(items[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  items = items.filter(item => item.id != req.params.id);
  res.json({ success: true });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
