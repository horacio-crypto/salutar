const db = require('../config/database');

// Gera protocolo único no formato SAL-YYYY-XXXXXXXX (não sequencial)
const gerarProtocolo = () => {
    const ano    = new Date().getFullYear();
    const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem 0, O, I, 1 para evitar confusão
    let sufixo   = '';
    for (let i = 0; i < 8; i++) {
        sufixo += chars[Math.floor(Math.random() * chars.length)];
    }
    return `SAL-${ano}-${sufixo}`;
};

// Categorias aceitas
const CATEGORIAS_VALIDAS = [
    'assedio_moral', 'saude_fisica', 'saude_mental', 'condicao_insegura', 'outro'
];

// ── Criar denúncia (público) ──────────────────────────────────────────────────

const criarDenuncia = async (req, res) => {
    try {
        const {
            tipo, titulo, descricao, anonima,
            denunciante_nome, denunciante_email,
            setor_envolvido, data_ocorrencia, empresa_id
        } = req.body;

        // Validações básicas
        if (!empresa_id || isNaN(parseInt(empresa_id))) {
            return res.status(400).json({ erro: 'Identificador da organização inválido.' });
        }
        if (!tipo || !CATEGORIAS_VALIDAS.includes(tipo)) {
            return res.status(400).json({ erro: 'Categoria inválida.' });
        }
        if (!titulo || titulo.trim().length < 5) {
            return res.status(400).json({ erro: 'Título deve ter pelo menos 5 caracteres.' });
        }
        if (!descricao || descricao.trim().length < 20) {
            return res.status(400).json({ erro: 'Descrição deve ter pelo menos 20 caracteres.' });
        }

        const isAnonima = anonima === true || anonima === 'true';

        // Garantia de privacidade: nunca armazenar dados pessoais em registros anônimos
        const nomeGuardado  = isAnonima ? null : (denunciante_nome?.trim() || null);
        const emailGuardado = isAnonima ? null : (denunciante_email?.trim() || null);

        const protocolo = gerarProtocolo();

        const resultado = await db.query(
            `INSERT INTO denuncias
               (empresa_id, protocolo, tipo, titulo, descricao, anonima,
                denunciante_nome, denunciante_email, setor_envolvido, data_ocorrencia)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
             RETURNING protocolo, status, data_registro`,
            [
                parseInt(empresa_id), protocolo, tipo,
                titulo.trim(), descricao.trim(), isAnonima,
                nomeGuardado, emailGuardado,
                setor_envolvido?.trim() || null,
                data_ocorrencia || null
            ]
        );

        // Retorna apenas protocolo e status — sem expor dados internos
        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao criar denúncia:', erro);
        res.status(500).json({ erro: 'Erro ao registrar ocorrência.' });
    }
};

// ── Listar denúncias (admin — filtrado por empresa) ───────────────────────────

const listarDenuncias = async (req, res) => {
    try {
        const { status, tipo, protocolo } = req.query;
        const empresaId = req.usuario.empresa_id;

        let query  = `SELECT id, protocolo, tipo, titulo, descricao, anonima,
                             denunciante_nome, denunciante_email, setor_envolvido,
                             status, referral_agency, data_registro, data_atualizacao
                      FROM denuncias WHERE empresa_id = $1`;
        const params = [empresaId];

        if (status) {
            params.push(status);
            query += ` AND status = $${params.length}`;
        }
        if (tipo) {
            params.push(tipo);
            query += ` AND tipo = $${params.length}`;
        }
        if (protocolo) {
            params.push(protocolo.toUpperCase());
            query += ` AND protocolo = $${params.length}`;
        }

        query += ' ORDER BY data_registro DESC';

        const resultado = await db.query(query, params);
        res.json(resultado.rows);
    } catch (erro) {
        console.error('Erro ao listar denúncias:', erro);
        res.status(500).json({ erro: 'Erro ao listar registros.' });
    }
};

// ── Buscar por protocolo (público) — retorna apenas campos não-sensíveis ──────

const buscarDenunciaPorProtocolo = async (req, res) => {
    try {
        const { protocolo } = req.params;

        const resultado = await db.query(
            `SELECT protocolo, tipo, anonima, status, data_registro, data_atualizacao
             FROM denuncias WHERE protocolo = $1`,
            [protocolo.trim().toUpperCase()]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Protocolo não encontrado.' });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao buscar denúncia:', erro);
        res.status(500).json({ erro: 'Erro ao consultar protocolo.' });
    }
};

// ── Buscar denúncia completa por ID (admin) ───────────────────────────────────

const buscarDenunciaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const empresaId = req.usuario.empresa_id;

        const resultado = await db.query(
            `SELECT id, protocolo, tipo, titulo, descricao, anonima,
                    denunciante_nome, denunciante_email, setor_envolvido,
                    status, referral_agency, data_registro, data_atualizacao
             FROM denuncias WHERE id = $1 AND empresa_id = $2`,
            [id, empresaId]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Registro não encontrado.' });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao buscar denúncia por ID:', erro);
        res.status(500).json({ erro: 'Erro ao carregar registro.' });
    }
};

// ── Atualizar denúncia (status / prioridade) ──────────────────────────────────

const atualizarDenuncia = async (req, res) => {
    try {
        const { id }    = req.params;
        const empresaId = req.usuario.empresa_id;
        const { status, prioridade } = req.body;

        const STATUS_VALIDOS = ['aberta','em_analise','em_investigacao','concluida','arquivada'];
        if (status && !STATUS_VALIDOS.includes(status)) {
            return res.status(400).json({ erro: 'Status inválido.' });
        }

        const resultado = await db.query(
            `UPDATE denuncias
             SET status     = COALESCE($1, status),
                 prioridade = COALESCE($2, prioridade)
             WHERE id = $3 AND empresa_id = $4
             RETURNING id, protocolo, status`,
            [status || null, prioridade || null, id, empresaId]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Registro não encontrado.' });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao atualizar denúncia:', erro);
        res.status(500).json({ erro: 'Erro ao atualizar registro.' });
    }
};

// ── Atualizar encaminhamento ──────────────────────────────────────────────────

const atualizarEncaminhamento = async (req, res) => {
    try {
        const { id }    = req.params;
        const empresaId = req.usuario.empresa_id;
        const { referral_agency } = req.body;

        const resultado = await db.query(
            `UPDATE denuncias
             SET referral_agency = $1
             WHERE id = $2 AND empresa_id = $3
             RETURNING id, protocolo, referral_agency`,
            [referral_agency || null, id, empresaId]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: 'Registro não encontrado.' });
        }

        res.json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao atualizar encaminhamento:', erro);
        res.status(500).json({ erro: 'Erro ao salvar encaminhamento.' });
    }
};

// ── Tratativas / comentários internos ────────────────────────────────────────

const adicionarTratativa = async (req, res) => {
    try {
        const { denuncia_id, descricao, acao_tomada } = req.body;
        const usuarioId = req.usuario.id;
        const empresaId = req.usuario.empresa_id;

        if (!denuncia_id || !descricao?.trim()) {
            return res.status(400).json({ erro: 'Informe o registro e o comentário.' });
        }

        // Garantir que a denúncia pertence à mesma empresa
        const check = await db.query(
            'SELECT id FROM denuncias WHERE id = $1 AND empresa_id = $2',
            [denuncia_id, empresaId]
        );
        if (check.rows.length === 0) {
            return res.status(403).json({ erro: 'Acesso negado.' });
        }

        const resultado = await db.query(
            `INSERT INTO tratativas (denuncia_id, usuario_id, descricao, acao_tomada)
             VALUES ($1,$2,$3,$4) RETURNING *`,
            [denuncia_id, usuarioId, descricao.trim(), acao_tomada?.trim() || null]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        console.error('Erro ao adicionar comentário:', erro);
        res.status(500).json({ erro: 'Erro ao adicionar comentário.' });
    }
};

const listarTratativas = async (req, res) => {
    try {
        const { denuncia_id } = req.params;
        const empresaId = req.usuario.empresa_id;

        // Valida que a denúncia pertence à empresa do usuário
        const check = await db.query(
            'SELECT id FROM denuncias WHERE id = $1 AND empresa_id = $2',
            [denuncia_id, empresaId]
        );
        if (check.rows.length === 0) {
            return res.status(403).json({ erro: 'Acesso negado.' });
        }

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
        res.status(500).json({ erro: 'Erro ao listar comentários.' });
    }
};

// ── Estatísticas do dashboard ─────────────────────────────────────────────────

const obterEstatisticas = async (req, res) => {
    try {
        const empresaId = req.usuario.empresa_id;

        const stats = await db.query(
            `SELECT
                COUNT(*)                                          AS total,
                COUNT(*) FILTER (WHERE status = 'aberta')        AS abertas,
                COUNT(*) FILTER (WHERE status IN ('em_analise','em_investigacao')) AS em_analise,
                COUNT(*) FILTER (WHERE status = 'concluida')     AS concluidas,
                COUNT(*) FILTER (WHERE anonima = true)           AS anonimas,
                COUNT(*) FILTER (WHERE referral_agency IS NOT NULL AND referral_agency != '') AS encaminhados
             FROM denuncias WHERE empresa_id = $1`,
            [empresaId]
        );

        res.json(stats.rows[0]);
    } catch (erro) {
        console.error('Erro ao obter estatísticas:', erro);
        res.status(500).json({ erro: 'Erro ao obter estatísticas.' });
    }
};

// ── Relatório mensal ──────────────────────────────────────────────────────────

const relatorioMensal = async (req, res) => {
    try {
        const empresaId = req.usuario.empresa_id;
        const ano = new Date().getFullYear();

        const resultado = await db.query(
            `SELECT
                EXTRACT(MONTH FROM data_registro)::INT AS mes,
                TO_CHAR(data_registro, 'Mon/YYYY')     AS periodo,
                COUNT(*)                               AS total,
                COUNT(*) FILTER (WHERE tipo = 'assedio_moral')    AS assedio_moral,
                COUNT(*) FILTER (WHERE tipo = 'saude_fisica')     AS saude_fisica,
                COUNT(*) FILTER (WHERE tipo = 'saude_mental')     AS saude_mental,
                COUNT(*) FILTER (WHERE tipo = 'condicao_insegura') AS condicao_insegura,
                COUNT(*) FILTER (WHERE tipo = 'outro')            AS outro,
                COUNT(*) FILTER (WHERE status = 'concluida')      AS concluidos,
                COUNT(*) FILTER (WHERE referral_agency IS NOT NULL AND referral_agency != '') AS encaminhados
             FROM denuncias
             WHERE empresa_id = $1
               AND EXTRACT(YEAR FROM data_registro) = $2
             GROUP BY mes, periodo
             ORDER BY mes`,
            [empresaId, ano]
        );

        res.json({ ano, meses: resultado.rows });
    } catch (erro) {
        console.error('Erro ao gerar relatório:', erro);
        res.status(500).json({ erro: 'Erro ao gerar relatório.' });
    }
};

module.exports = {
    criarDenuncia,
    listarDenuncias,
    buscarDenunciaPorProtocolo,
    buscarDenunciaPorId,
    atualizarDenuncia,
    atualizarEncaminhamento,
    adicionarTratativa,
    listarTratativas,
    obterEstatisticas,
    relatorioMensal
};
