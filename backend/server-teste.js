const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'chave_secreta_temporaria_para_testes_12345678';

app.use(cors());
app.use(express.json());

// Dados em memória
let denuncias = [];
let usuarios = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@empresademo.com.br',
    senha_hash: bcrypt.hashSync('admin123', 10),
    perfil: 'admin',
    empresa_id: 1,
    empresa_nome: 'Empresa Demo'
  }
];

// Gerar protocolo
const gerarProtocolo = () => {
  const data = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DEN${data}${random}`;
};

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

// Rotas
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), modo: 'TESTE SEM BANCO' });
});

// Login
app.post('/api/auth/login', async (req, res) => {
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
  
  res.json({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      empresa: usuario.empresa_nome
    }
  });
});

// Criar denúncia
app.post('/api/denuncias', (req, res) => {
  const { tipo, descricao, anonima, denunciante_nome, denunciante_email, denunciante_telefone, setor_envolvido, data_ocorrencia, empresa_id } = req.body;
  
  const denuncia = {
    id: denuncias.length + 1,
    empresa_id: empresa_id || 1,
    protocolo: gerarProtocolo(),
    tipo,
    descricao,
    anonima: anonima !== false,
    denunciante_nome: anonima ? null : denunciante_nome,
    denunciante_email: anonima ? null : denunciante_email,
    denunciante_telefone: anonima ? null : denunciante_telefone,
    setor_envolvido,
    data_ocorrencia,
    status: 'aberta',
    prioridade: 'media',
    data_registro: new Date().toISOString(),
    data_atualizacao: new Date().toISOString()
  };
  
  denuncias.push(denuncia);
  res.status(201).json(denuncia);
});

// Consultar por protocolo
app.get('/api/denuncias/protocolo/:protocolo', (req, res) => {
  const denuncia = denuncias.find(d => d.protocolo === req.params.protocolo);
  
  if (!denuncia) {
    return res.status(404).json({ erro: 'Denúncia não encontrada' });
  }
  
  res.json(denuncia);
});

// Listar denúncias
app.get('/api/denuncias', authMiddleware, (req, res) => {
  const { status, tipo } = req.query;
  let resultado = denuncias.filter(d => d.empresa_id === req.usuario.empresa_id);
  
  if (status) resultado = resultado.filter(d => d.status === status);
  if (tipo) resultado = resultado.filter(d => d.tipo === tipo);
  
  res.json(resultado);
});

// Estatísticas
app.get('/api/denuncias/estatisticas/dashboard', authMiddleware, (req, res) => {
  const empresaDenuncias = denuncias.filter(d => d.empresa_id === req.usuario.empresa_id);
  
  res.json({
    total: empresaDenuncias.length,
    abertas: empresaDenuncias.filter(d => d.status === 'aberta').length,
    em_analise: empresaDenuncias.filter(d => d.status === 'em_analise').length,
    concluidas: empresaDenuncias.filter(d => d.status === 'concluida').length,
    assedio_moral: empresaDenuncias.filter(d => d.tipo === 'assedio_moral').length,
    condicao_insegura: empresaDenuncias.filter(d => d.tipo === 'condicao_insegura').length
  });
});

// Atualizar denúncia
app.put('/api/denuncias/:id', authMiddleware, (req, res) => {
  const { status, prioridade } = req.body;
  const denuncia = denuncias.find(d => d.id === parseInt(req.params.id) && d.empresa_id === req.usuario.empresa_id);
  
  if (!denuncia) {
    return res.status(404).json({ erro: 'Denúncia não encontrada' });
  }
  
  denuncia.status = status || denuncia.status;
  denuncia.prioridade = prioridade || denuncia.prioridade;
  denuncia.data_atualizacao = new Date().toISOString();
  
  res.json(denuncia);
});

app.listen(PORT, () => {
  console.log('===========================================');
  console.log('🚀 SERVIDOR DE TESTE (SEM BANCO DE DADOS)');
  console.log('===========================================');
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('📝 Credenciais de teste:');
  console.log('   Email: admin@empresademo.com.br');
  console.log('   Senha: admin123');
  console.log('');
  console.log('⚠️  ATENÇÃO: Dados em memória (serão perdidos ao reiniciar)');
  console.log('===========================================');
});
