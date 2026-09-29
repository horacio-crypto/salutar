const express = require('express');
const router = express.Router();
const { login, registrarUsuario } = require('../controllers/authController');
const { authMiddleware, verificarPerfil } = require('../middleware/auth');

router.post('/login', login);
router.post('/registrar', authMiddleware, verificarPerfil('admin'), registrarUsuario);

module.exports = router;
