const express = require('express');
const router = express.Router();

// transactions routes
router.get('/', (req, res) => {
  res.json({ message: 'transactions endpoint', data: [] });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'transactions detail', id: req.params.id });
});

router.post('/', (req, res) => {
  res.json({ message: 'transactions created', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'transactions updated', id: req.params.id });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'transactions deleted', id: req.params.id });
});

module.exports = router;
