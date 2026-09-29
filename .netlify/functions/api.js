const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'chave_secreta_netlify_12345678901234567890';

let denuncias = [];
let usuarios = [{
  id: 1,
  nome: 'Administrador',
  email: 'admin@empresademo.com.br',
  senha_hash: bcrypt.hashSync('admin123', 10),
  perfil: 'admin',
  empresa_id: 1
}];

const gerarProtocolo = () => {
  const data = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DEN${data}${random}`;
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;
  const body = event.body ? JSON.parse(event.body) : {};

  try {
    if (method === 'GET' && path === '/health') {
      return { statusCode: 200, headers, body: JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }) };
    }

    if (method === 'POST' && path === '/auth/login') {
      const { email, senha } = body;
      const usuario = usuarios.find(u => u.email === email);
      
      if (!usuario || !await bcrypt.compare(senha, usuario.senha_hash)) {
        return { statusCode: 401, headers, body: JSON.stringify({ erro: 'Credenciais inválidas' }) };
      }
      
      const token = jwt.sign({ id: usuario.id, email: usuario.email, perfil: usuario.perfil, empresa_id: usuario.empresa_id }, JWT_SECRET, { expiresIn: '24h' });
      
      return { statusCode: 200, headers, body: JSON.stringify({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, empresa: 'Empresa Demo' } }) };
    }

    if (method === 'POST' && path === '/denuncias') {
      const denuncia = {
        id: denuncias.length + 1,
        empresa_id: body.empresa_id || 1,
        protocolo: gerarProtocolo(),
        tipo: body.tipo,
        descricao: body.descricao,
        anonima: body.anonima !== false,
        denunciante_nome: body.anonima ? null : body.denunciante_nome,
        denunciante_email: body.anonima ? null : body.denunciante_email,
        denunciante_telefone: body.anonima ? null : body.denunciante_telefone,
        setor_envolvido: body.setor_envolvido,
        data_ocorrencia: body.data_ocorrencia,
        status: 'aberta',
        prioridade: 'media',
        data_registro: new Date().toISOString()
      };
      
      denuncias.push(denuncia);
      return { statusCode: 201, headers, body: JSON.stringify(denuncia) };
    }

    if (method === 'GET' && path.startsWith('/denuncias/protocolo/')) {
      const protocolo = path.split('/').pop();
      const denuncia = denuncias.find(d => d.protocolo === protocolo);
      
      if (!denuncia) {
        return { statusCode: 404, headers, body: JSON.stringify({ erro: 'Denúncia não encontrada' }) };
      }
      
      return { statusCode: 200, headers, body: JSON.stringify(denuncia) };
    }

    if (method === 'GET' && path === '/denuncias/estatisticas/dashboard') {
      const token = event.headers.authorization?.split(' ')[1];
      if (!token) return { statusCode: 401, headers, body: JSON.stringify({ erro: 'Token não fornecido' }) };
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const empresaDenuncias = denuncias.filter(d => d.empresa_id === decoded.empresa_id);
      
      return { statusCode: 200, headers, body: JSON.stringify({
        total: empresaDenuncias.length,
        abertas: empresaDenuncias.filter(d => d.status === 'aberta').length,
        em_analise: empresaDenuncias.filter(d => d.status === 'em_analise').length,
        concluidas: empresaDenuncias.filter(d => d.status === 'concluida').length,
        assedio_moral: empresaDenuncias.filter(d => d.tipo === 'assedio_moral').length,
        condicao_insegura: empresaDenuncias.filter(d => d.tipo === 'condicao_insegura').length
      }) };
    }

    if (method === 'GET' && path === '/denuncias') {
      const token = event.headers.authorization?.split(' ')[1];
      if (!token) return { statusCode: 401, headers, body: JSON.stringify({ erro: 'Token não fornecido' }) };
      
      const decoded = jwt.verify(token, JWT_SECRET);
      const resultado = denuncias.filter(d => d.empresa_id === decoded.empresa_id);
      
      return { statusCode: 200, headers, body: JSON.stringify(resultado) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ erro: 'Rota não encontrada' }) };

  } catch (erro) {
    return { statusCode: 500, headers, body: JSON.stringify({ erro: 'Erro interno', detalhes: erro.message }) };
  }
};
