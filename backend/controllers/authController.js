const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { registrarLog } = require('../middleware/logger');

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const resultado = await db.query(
      `SELECT u.*, e.nome as empresa_nome 
       FROM usuarios u 
       JOIN empresas e ON u.empresa_id = e.id 
       WHERE u.email = $1 AND u.ativo = true AND e.ativo = true`,
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = resultado.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        perfil: usuario.perfil,
        empresa_id: usuario.empresa_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await registrarLog(usuario.id, usuario.empresa_id, 'LOGIN', 'usuarios', usuario.id, 'Login realizado', req.ip);

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
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ erro: 'Erro ao realizar login' });
  }
};

const registrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, perfil, empresa_id } = req.body;

    const usuarioExiste = await db.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await db.query(
      `INSERT INTO usuarios (nome, email, senha_hash, perfil, empresa_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, perfil`,
      [nome, email, senhaHash, perfil, empresa_id]
    );

    await registrarLog(null, empresa_id, 'REGISTRO', 'usuarios', resultado.rows[0].id, 'Novo usuário registrado', req.ip);

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao registrar usuário:', erro);
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
};

module.exports = { login, registrarUsuario };
