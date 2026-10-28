const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Defina JWT_SECRET nas variáveis de ambiente da Vercel (Settings > Environment Variables).
// O valor abaixo é apenas um fallback temporário e deve ser removido após configurar a variável.
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_vercel_12345678901234567890';

let denuncias = [];
let usuarios = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@empresademo.com.br',
    senha_hash: bcrypt.hashSync('admin123', 10),
    perfil: 'admin',
    empresa_id: 1
  }
];

// Mesmo formato do backend Express: SAL-AAAA-XXXXXXXX (não sequencial, sem caracteres ambíguos)
const gerarProtocolo = () => {
  const ano = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let sufixo = '';
  for (let i = 0; i < 8; i++) sufixo += chars[Math.floor(Math.random() * chars.length)];
  return `SAL-${ano}-${sufixo}`;
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, url } = req;
  const path = url.replace('/api', '');

  try {
    if (method === 'GET' && path === '/health') {
      return res.json({ status: 'OK', timestamp: new Date().toISOString(), modo: 'VERCEL' });
    }

    if (method === 'POST' && path === '/auth/login') {
      const { email, senha } = req.body;
      const usuario = usuarios.find(u => u.email === email);
      
      if (!usuario || !await bcrypt.compare(senha, usuario.senha_hash)) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
      
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, perfil: usuario.perfil, empresa_id: usuario.empresa_id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.json({
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, empresa: 'Empresa Demo' }
      });
    }

    if (method === 'POST' && path === '/denuncias') {
      const { tipo, titulo, descricao, anonima, denunciante_nome, denunciante_email, setor_envolvido, data_ocorrencia, empresa_id } = req.body;
      const isAnonima = anonima === true || anonima === 'true';
      
      const denuncia = {
        id: denuncias.length + 1,
        empresa_id: empresa_id || 1,
        protocolo: gerarProtocolo(),
        tipo,
        titulo,
        descricao,
        anonima: isAnonima,
        // registros anônimos nunca guardam dados pessoais
        denunciante_nome: isAnonima ? null : (denunciante_nome || null),
        denunciante_email: isAnonima ? null : (denunciante_email || null),
        setor_envolvido,
        data_ocorrencia,
        status: 'aberta',
        prioridade: 'media',
        data_registro: new Date().toISOString()
      };
      
      denuncias.push(denuncia);
      // devolve só o necessário para a tela de confirmação
      return res.status(201).json({ protocolo: denuncia.protocolo, status: denuncia.status, data_registro: denuncia.data_registro });
    }

    if (method === 'GET' && path.startsWith('/denuncias/protocolo/')) {
      const protocolo = path.split('/').pop();
      const denuncia = denuncias.find(d => d.protocolo === protocolo);
      
      if (!denuncia) {
        return res.status(404).json({ erro: 'Denúncia não encontrada' });
      }
      
      // consulta pública: apenas campos não sensíveis (sem descrição, nome, e-mail ou encaminhamento)
      const { tipo, anonima, status, data_registro } = denuncia;
      return res.json({ protocolo: denuncia.protocolo, tipo, anonima, status, data_registro, data_atualizacao: denuncia.data_atualizacao || data_registro });
    }

    if (method === 'GET' && path === '/denuncias/estatisticas/dashboard') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const empresaDenuncias = denuncias.filter(d => d.empresa_id === decoded.empresa_id);
      
      return res.json({
        total: empresaDenuncias.length,
        abertas: empresaDenuncias.filter(d => d.status === 'aberta').length,
        em_analise: empresaDenuncias.filter(d => d.status === 'em_analise').length,
        concluidas: empresaDenuncias.filter(d => d.status === 'concluida').length,
        assedio_moral: empresaDenuncias.filter(d => d.tipo === 'assedio_moral').length,
        condicao_insegura: empresaDenuncias.filter(d => d.tipo === 'condicao_insegura').length
      });
    }

    if (method === 'GET' && path === '/denuncias') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
      
      const decoded = jwt.verify(token, JWT_SECRET);
      let resultado = denuncias.filter(d => d.empresa_id === decoded.empresa_id);
      
      return res.json(resultado);
    }

    if (method === 'PUT' && path.startsWith('/denuncias/')) {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const id = parseInt(path.split('/').pop());
      const { status, prioridade } = req.body;
      
      const denuncia = denuncias.find(d => d.id === id && d.empresa_id === decoded.empresa_id);
      
      if (!denuncia) {
        return res.status(404).json({ erro: 'Denúncia não encontrada' });
      }
      
      denuncia.status = status || denuncia.status;
      denuncia.prioridade = prioridade || denuncia.prioridade;
      
      return res.json(denuncia);
    }

    return res.status(404).json({ erro: 'Rota não encontrada' });

  } catch (erro) {
    console.error('Erro:', erro);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};
