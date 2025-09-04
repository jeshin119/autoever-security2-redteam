const express = require('express');
const router = express.Router();

// notifications routes
router.get('/', (req, res) => {
  res.json({ message: 'notifications endpoint', data: [] });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'notifications detail', id: req.params.id });
});

router.post('/', (req, res) => {
  res.json({ message: 'notifications created', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'notifications updated', id: req.params.id });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'notifications deleted', id: req.params.id });
});

module.exports = router;
