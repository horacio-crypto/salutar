const express = require('express');
const router = express.Router();
const { 
  criarDenuncia, 
  listarDenuncias, 
  buscarDenunciaPorProtocolo, 
  atualizarDenuncia,
  adicionarTratativa,
  listarTratativas,
  obterEstatisticas
} = require('../controllers/denunciaController');
const { authMiddleware, verificarPerfil } = require('../middleware/auth');

router.post('/', criarDenuncia);
router.get('/protocolo/:protocolo', buscarDenunciaPorProtocolo);
router.get('/', authMiddleware, listarDenuncias);
router.put('/:id', authMiddleware, verificarPerfil('admin', 'cipa', 'rh', 'gestor'), atualizarDenuncia);
router.post('/tratativas', authMiddleware, verificarPerfil('admin', 'cipa', 'rh', 'gestor'), adicionarTratativa);
router.get('/:denuncia_id/tratativas', authMiddleware, listarTratativas);
router.get('/estatisticas/dashboard', authMiddleware, obterEstatisticas);

module.exports = router;
