import { useState } from 'react';

const API = 'http://localhost:8080/api';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  // Login form submit
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setLoggedIn(true);
        fetchItems();
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Login error');
    }
  };

  // Fetch items
  const fetchItems = async () => {
    const res = await fetch(`${API}/items`);
    const data = await res.json();
    setItems(data);
  };

  // Add new item
  const handleAdd = async () => {
    if (!newItem) return;
    const res = await fetch(`${API}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem }),
    });
    const data = await res.json();
    setItems([...items, data]);
    setNewItem('');
  };

  // Update item
  const handleUpdate = async (id) => {
    const name = prompt('Enter new name:');
    if (!name) return;
    const res = await fetch(`${API}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setItems(items.map(item => (item.id === id ? data : item)));
  };

  // Delete item
  const handleDelete = async (id) => {
    await fetch(`${API}/items/${id}`, { method: 'DELETE' });
    setItems(items.filter(item => item.id !== id));
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Login</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Item Manager</h2>
      <input
        placeholder="New item"
        value={newItem}
        onChange={e => setNewItem(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} {' '}
            <button onClick={() => handleUpdate(item.id)}>Edit</button> {' '}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;