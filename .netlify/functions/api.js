const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Defina JWT_SECRET nas variáveis de ambiente da Netlify (Site configuration > Environment variables).
// O valor abaixo é apenas um fallback temporário e deve ser removido após configurar a variável.
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_netlify_12345678901234567890';

let denuncias = [];
let usuarios = [{
  id: 1,
  nome: 'Administrador',
  email: 'admin@empresademo.com.br',
  senha_hash: bcrypt.hashSync('admin123', 10),
  perfil: 'admin',
  empresa_id: 1
}];

// Mesmo formato do backend Express: SAL-AAAA-XXXXXXXX (não sequencial, sem caracteres ambíguos)
const gerarProtocolo = () => {
  const ano = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let sufixo = '';
  for (let i = 0; i < 8; i++) sufixo += chars[Math.floor(Math.random() * chars.length)];
  return `SAL-${ano}-${sufixo}`;
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
      const isAnonima = body.anonima === true || body.anonima === 'true';
      const denuncia = {
        id: denuncias.length + 1,
        empresa_id: body.empresa_id || 1,
        protocolo: gerarProtocolo(),
        tipo: body.tipo,
        titulo: body.titulo,
        descricao: body.descricao,
        anonima: isAnonima,
        // registros anônimos nunca guardam dados pessoais
        denunciante_nome: isAnonima ? null : (body.denunciante_nome || null),
        denunciante_email: isAnonima ? null : (body.denunciante_email || null),
        setor_envolvido: body.setor_envolvido,
        data_ocorrencia: body.data_ocorrencia,
        status: 'aberta',
        prioridade: 'media',
        data_registro: new Date().toISOString()
      };
      
      denuncias.push(denuncia);
      // devolve só o necessário para a tela de confirmação
      return { statusCode: 201, headers, body: JSON.stringify({ protocolo: denuncia.protocolo, status: denuncia.status, data_registro: denuncia.data_registro }) };
    }

    if (method === 'GET' && path.startsWith('/denuncias/protocolo/')) {
      const protocolo = path.split('/').pop();
      const denuncia = denuncias.find(d => d.protocolo === protocolo);
      
      if (!denuncia) {
        return { statusCode: 404, headers, body: JSON.stringify({ erro: 'Denúncia não encontrada' }) };
      }
      
      // consulta pública: apenas campos não sensíveis (sem descrição, nome, e-mail ou encaminhamento)
      const publico = { protocolo: denuncia.protocolo, tipo: denuncia.tipo, anonima: denuncia.anonima, status: denuncia.status, data_registro: denuncia.data_registro, data_atualizacao: denuncia.data_atualizacao || denuncia.data_registro };
      return { statusCode: 200, headers, body: JSON.stringify(publico) };
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
