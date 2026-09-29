const db = require('../config/database');

const registrarLog = async (usuarioId, empresaId, acao, tabela, registroId, detalhes, ipOrigem) => {
  try {
    await db.query(
      `INSERT INTO logs_auditoria (usuario_id, empresa_id, acao, tabela, registro_id, detalhes, ip_origem)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [usuarioId, empresaId, acao, tabela, registroId, detalhes, ipOrigem]
    );
  } catch (erro) {
    console.error('Erro ao registrar log:', erro);
  }
};

const logMiddleware = (acao, tabela) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const usuarioId = req.usuario?.id || null;
        const empresaId = req.usuario?.empresa_id || null;
        const registroId = data?.id || null;
        const ipOrigem = req.ip || req.connection.remoteAddress;
        
        registrarLog(usuarioId, empresaId, acao, tabela, registroId, JSON.stringify(data), ipOrigem);
      }
      return originalJson(data);
    };
    
    next();
  };
};

module.exports = { registrarLog, logMiddleware };
