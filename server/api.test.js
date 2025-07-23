const request = require('supertest');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

let items = [];

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false });
});

app.get('/api/items', (req, res) => res.json(items));
app.post('/api/items', (req, res) => {
  const item = { id: Date.now(), ...req.body };
  items.push(item);
  res.json(item);
});

describe('API Tests', () => {
  it('logs in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: '1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('fails login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'user', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  it('adds and fetches items', async () => {
    await request(app)
      .post('/api/items')
      .send({ name: 'Test Item' });
    
    const res = await request(app).get('/api/items');
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe('Test Item');
  });
});
