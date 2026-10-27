const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/chatController');

// Ruta POST para recibir los mensajes del chat
router.post('/', chatWithBot);

module.exports = router;