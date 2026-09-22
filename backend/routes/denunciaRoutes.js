const express = require('express');
<<<<<<< HEAD
const router  = express.Router();

const {
    criarDenuncia,
    listarDenuncias,
    buscarDenunciaPorProtocolo,
    buscarDenunciaPorId,
    atualizarDenuncia,
    atualizarEncaminhamento,
    adicionarTratativa,
    listarTratativas,
    obterEstatisticas,
    relatorioMensal
} = require('../controllers/denunciaController');

const { authMiddleware, verificarPerfil } = require('../middleware/auth');

const PERFIS_ADMIN = ['admin', 'cipa', 'rh', 'gestor'];

// ── Rotas públicas ────────────────────────────────────────────────────────────
router.post('/',                          criarDenuncia);
router.get('/protocolo/:protocolo',       buscarDenunciaPorProtocolo);

// ── Rotas administrativas ─────────────────────────────────────────────────────
router.get('/estatisticas/dashboard',     authMiddleware, obterEstatisticas);
router.get('/',                           authMiddleware, listarDenuncias);
router.get('/:id',                        authMiddleware, buscarDenunciaPorId);
router.put('/:id',                        authMiddleware, verificarPerfil(...PERFIS_ADMIN), atualizarDenuncia);
router.patch('/:id/encaminhamento',       authMiddleware, verificarPerfil(...PERFIS_ADMIN), atualizarEncaminhamento);
router.post('/tratativas',                authMiddleware, verificarPerfil(...PERFIS_ADMIN), adicionarTratativa);
router.get('/:denuncia_id/tratativas',    authMiddleware, listarTratativas);
router.get('/relatorios/mensal',          authMiddleware, relatorioMensal);
=======
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
>>>>>>> d8679d82bb5a4133b8092739db6dc789b5b514dc

module.exports = router;
