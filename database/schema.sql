-- ============================================================
-- SALUTAR — Canal de Registro de Denúncia
-- Schema PostgreSQL — Modelo multiempresa (multi-tenant)
-- Conformidade: LGPD, NR-1, NR-5
-- ============================================================

-- Tabela de Empresas (tenants)
CREATE TABLE empresas (
    id             SERIAL PRIMARY KEY,
    nome           VARCHAR(200) NOT NULL,
    cnpj           VARCHAR(18)  UNIQUE NOT NULL,
    email_contato  VARCHAR(100),
    ativo          BOOLEAN      DEFAULT true,
    data_cadastro  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários Administrativos
CREATE TABLE usuarios (
    id            SERIAL PRIMARY KEY,
    empresa_id    INTEGER REFERENCES empresas(id) NOT NULL,
    nome          VARCHAR(150) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    senha_hash    VARCHAR(255) NOT NULL,
    perfil        VARCHAR(20)  CHECK (perfil IN ('admin', 'cipa', 'rh', 'gestor')) NOT NULL,
    ativo         BOOLEAN      DEFAULT true,
    data_cadastro TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Denúncias / Registros de Ocorrência
-- Categorias alinhadas ao prompt: assedio_moral, saude_fisica, saude_mental,
--   condicao_insegura, outro
-- is_anonymous / anonima: true → NUNCA armazenar nome, e-mail ou metadados do denunciante
CREATE TABLE denuncias (
    id                  SERIAL PRIMARY KEY,
    empresa_id          INTEGER REFERENCES empresas(id) NOT NULL,

    -- Protocolo único, não sequencial (formato SAL-YYYY-XXXXXXXX)
    protocolo           VARCHAR(20) UNIQUE NOT NULL,

    -- Classificação
    tipo                VARCHAR(30) CHECK (tipo IN (
                            'assedio_moral', 'saude_fisica', 'saude_mental',
                            'condicao_insegura', 'outro'
                        )) NOT NULL,
    titulo              VARCHAR(200),

    -- Conteúdo
    descricao           TEXT NOT NULL,

    -- Privacidade — LGPD coleta mínima
    anonima             BOOLEAN DEFAULT true,
    denunciante_nome    VARCHAR(150),   -- NULL obrigatório se anonima=true
    denunciante_email   VARCHAR(100),   -- NULL obrigatório se anonima=true

    -- Contexto operacional
    setor_envolvido     VARCHAR(100),
    data_ocorrencia     DATE,

    -- Ciclo de vida
    status              VARCHAR(20) CHECK (status IN (
                            'aberta', 'em_analise', 'em_investigacao',
                            'concluida', 'arquivada'
                        )) DEFAULT 'aberta',
    prioridade          VARCHAR(10) CHECK (prioridade IN (
                            'baixa', 'media', 'alta', 'urgente'
                        )) DEFAULT 'media',

    -- Triagem e encaminhamento (CIPA, Ministério do Trabalho, Delegacia do Trabalho, etc.)
    -- Campo interno — nunca exposto na consulta pública
    referral_agency     VARCHAR(100),

    -- Timestamps
    data_registro       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Anexos
CREATE TABLE anexos (
    id              SERIAL PRIMARY KEY,
    denuncia_id     INTEGER REFERENCES denuncias(id) ON DELETE CASCADE,
    nome_original   VARCHAR(255) NOT NULL,
    nome_arquivo    VARCHAR(255) NOT NULL,   -- nome interno seguro (UUID)
    tipo_arquivo    VARCHAR(50),
    tamanho         INTEGER,
    data_upload     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Tratativas / Comentários Internos
-- Visíveis APENAS para usuários administrativos, NUNCA na consulta pública
CREATE TABLE tratativas (
    id              SERIAL PRIMARY KEY,
    denuncia_id     INTEGER REFERENCES denuncias(id) ON DELETE CASCADE,
    usuario_id      INTEGER REFERENCES usuarios(id),
    descricao       TEXT NOT NULL,
    acao_tomada     TEXT,
    data_tratativa  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Logs de Auditoria
CREATE TABLE logs_auditoria (
    id          SERIAL PRIMARY KEY,
    usuario_id  INTEGER REFERENCES usuarios(id),
    empresa_id  INTEGER REFERENCES empresas(id),
    acao        VARCHAR(100) NOT NULL,
    tabela      VARCHAR(50),
    registro_id INTEGER,
    detalhes    TEXT,
    ip_origem   VARCHAR(45),
    data_log    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Índices para performance ──────────────────────────────────────────────────
CREATE INDEX idx_denuncias_empresa    ON denuncias(empresa_id);
CREATE INDEX idx_denuncias_status     ON denuncias(status);
CREATE INDEX idx_denuncias_protocolo  ON denuncias(protocolo);
CREATE INDEX idx_denuncias_tipo       ON denuncias(tipo);
CREATE INDEX idx_denuncias_data       ON denuncias(data_registro);
CREATE INDEX idx_usuarios_empresa     ON usuarios(empresa_id);
CREATE INDEX idx_usuarios_email       ON usuarios(email);
CREATE INDEX idx_logs_usuario         ON logs_auditoria(usuario_id);
CREATE INDEX idx_logs_empresa         ON logs_auditoria(empresa_id);
CREATE INDEX idx_logs_data            ON logs_auditoria(data_log);
CREATE INDEX idx_tratativas_denuncia  ON tratativas(denuncia_id);

-- ── Trigger: atualizar data_atualizacao automaticamente ──────────────────────
CREATE OR REPLACE FUNCTION atualizar_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_denuncia
BEFORE UPDATE ON denuncias
FOR EACH ROW
EXECUTE FUNCTION atualizar_timestamp();

-- ── Dados iniciais (seed) ─────────────────────────────────────────────────────
INSERT INTO empresas (nome, cnpj, email_contato) VALUES
    ('Empresa Demo LTDA', '12.345.678/0001-90', 'contato@empresademo.com.br');

-- Para gerar o hash correto, execute no Node.js:
--   const bcrypt = require('bcrypt');
--   bcrypt.hash('admin123', 10).then(console.log);
-- Depois substitua o hash abaixo pelo gerado.
INSERT INTO usuarios (empresa_id, nome, email, senha_hash, perfil) VALUES
    (1, 'Administrador SALUTAR', 'admin@empresademo.com.br',
     '$2b$10$SUBSTITUIR_PELO_HASH_GERADO_VIA_BCRYPT', 'admin');
