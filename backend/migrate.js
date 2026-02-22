const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  try {
    console.log('Iniciando migração do banco de dados...');

    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(sql);

    console.log('✓ Migração concluída com sucesso!');
    console.log('✓ Tabelas criadas');
    console.log('✓ Índices criados');
    console.log('✓ Funções e triggers criados');
    console.log('✓ Dados iniciais inseridos');
    
    process.exit(0);
  } catch (erro) {
    console.error('✗ Erro na migração:', erro.message);
    process.exit(1);
  }
}

migrate();
