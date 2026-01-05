const express = require('express');
const router = express.Router();

const users = require('../src/data/users');

// GET /users
router.get('/', (req, res) => {
  const { role } = req.query;
  if (!role) {
    return res.json(users);
  }
  const filtered = users.filter(u => u.role === role);
  res.json(filtered);
});

// GET /users/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

// POST /users
router.post('/', (req, res) => {
  const { name, role } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    role
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;
