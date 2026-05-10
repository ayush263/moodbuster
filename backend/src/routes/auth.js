const express = require('express');
const router = express.Router();

let users = [];
let authId = 1;

router.post('/register', (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = {
      id: authId++,
      email,
      password,
      name,
      created_at: new Date().toISOString()
    };

    users.push(newUser);

    const token = Buffer.from(JSON.stringify({ id: newUser.id, email })).toString('base64');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, email, name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, email })).toString('base64');

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
