const db = require('../config/database');

const gerarProtocolo = () => {
  const data = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DEN${data}${random}`;
};

const criarDenuncia = async (req, res) => {
  try {
    const { tipo, descricao, anonima, denunciante_nome, denunciante_email, denunciante_telefone, setor_envolvido, data_ocorrencia, empresa_id } = req.body;
    
    const protocolo = gerarProtocolo();

    const resultado = await db.query(
      `INSERT INTO denuncias (empresa_id, protocolo, tipo, descricao, anonima, denunciante_nome, denunciante_email, denunciante_telefone, setor_envolvido, data_ocorrencia)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [empresa_id, protocolo, tipo, descricao, anonima, denunciante_nome, denunciante_email, denunciante_telefone, setor_envolvido, data_ocorrencia]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao criar denúncia:', erro);
    res.status(500).json({ erro: 'Erro ao criar denúncia' });
  }
};

const listarDenuncias = async (req, res) => {
  try {
    const { status, tipo } = req.query;
    const empresaId = req.usuario.empresa_id;

    let query = 'SELECT * FROM denuncias WHERE empresa_id = $1';
    const params = [empresaId];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (tipo) {
      params.push(tipo);
      query += ` AND tipo = $${params.length}`;
    }

    query += ' ORDER BY data_registro DESC';

    const resultado = await db.query(query, params);
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao listar denúncias:', erro);
    res.status(500).json({ erro: 'Erro ao listar denúncias' });
  }
};

const buscarDenunciaPorProtocolo = async (req, res) => {
  try {
    const { protocolo } = req.params;

    const resultado = await db.query(
      'SELECT * FROM denuncias WHERE protocolo = $1',
      [protocolo]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Denúncia não encontrada' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao buscar denúncia:', erro);
    res.status(500).json({ erro: 'Erro ao buscar denúncia' });
  }
};

const atualizarDenuncia = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, prioridade } = req.body;
    const empresaId = req.usuario.empresa_id;

    const resultado = await db.query(
      `UPDATE denuncias SET status = $1, prioridade = $2 
       WHERE id = $3 AND empresa_id = $4 RETURNING *`,
      [status, prioridade, id, empresaId]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Denúncia não encontrada' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao atualizar denúncia:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar denúncia' });
  }
};

const adicionarTratativa = async (req, res) => {
  try {
    const { denuncia_id, descricao, acao_tomada } = req.body;
    const usuarioId = req.usuario.id;

    const resultado = await db.query(
      `INSERT INTO tratativas (denuncia_id, usuario_id, descricao, acao_tomada)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [denuncia_id, usuarioId, descricao, acao_tomada]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao adicionar tratativa:', erro);
    res.status(500).json({ erro: 'Erro ao adicionar tratativa' });
  }
};

const listarTratativas = async (req, res) => {
  try {
    const { denuncia_id } = req.params;

    const resultado = await db.query(
      `SELECT t.*, u.nome as usuario_nome 
       FROM tratativas t 
       JOIN usuarios u ON t.usuario_id = u.id 
       WHERE t.denuncia_id = $1 
       ORDER BY t.data_tratativa DESC`,
      [denuncia_id]
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao listar tratativas:', erro);
    res.status(500).json({ erro: 'Erro ao listar tratativas' });
  }
};

const obterEstatisticas = async (req, res) => {
  try {
    const empresaId = req.usuario.empresa_id;

    const stats = await db.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'aberta') as abertas,
        COUNT(*) FILTER (WHERE status = 'em_analise') as em_analise,
        COUNT(*) FILTER (WHERE status = 'concluida') as concluidas,
        COUNT(*) FILTER (WHERE tipo = 'assedio_moral') as assedio_moral,
        COUNT(*) FILTER (WHERE tipo = 'condicao_insegura') as condicao_insegura
       FROM denuncias WHERE empresa_id = $1`,
      [empresaId]
    );

    res.json(stats.rows[0]);
  } catch (erro) {
    console.error('Erro ao obter estatísticas:', erro);
    res.status(500).json({ erro: 'Erro ao obter estatísticas' });
  }
};

module.exports = {
  criarDenuncia,
  listarDenuncias,
  buscarDenunciaPorProtocolo,
  atualizarDenuncia,
  adicionarTratativa,
  listarTratativas,
  obterEstatisticas
};
