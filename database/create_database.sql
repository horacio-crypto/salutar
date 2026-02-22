-- Execute este script no pgAdmin ou psql para criar o banco de dados
-- Conecte-se ao PostgreSQL como usuário postgres primeiro

CREATE DATABASE canal_denuncias
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE canal_denuncias IS 'Banco de dados da plataforma de denúncias CIPA';
