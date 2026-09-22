const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

const token   = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

if (!token) window.location.href = 'admin.html';

document.getElementById('nomeUsuario').textContent = usuario.nome || 'Usuário';

document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'admin.html';
});

// ── Mapeamentos ─────────────────────────────────────────────────────────────

const statusMap = {
    aberta:          { texto: 'Nova',            classe: 'badge-info' },
    em_analise:      { texto: 'Em Análise',      classe: 'badge-warning' },
    em_investigacao: { texto: 'Em Investigação', classe: 'badge-warning' },
    concluida:       { texto: 'Concluída',       classe: 'badge-success' },
    arquivada:       { texto: 'Arquivada',       classe: 'badge-gray' }
};

const tipoMap = {
    assedio_moral:    'Assédio Moral',
    saude_fisica:     'Saúde Física',
    saude_mental:     'Saúde Mental',
    condicao_insegura:'Condição Insegura',
    outro:            'Outra',
    // compat. antigos
    assedio_sexual:   'Assédio Moral',
    discriminacao:    'Outra',
    risco_saude:      'Saúde Física'
};

const orgaosEncaminhamento = [
    { value: '',                   label: 'Sem encaminhamento externo' },
    { value: 'CIPA',               label: 'CIPA — Comissão Interna de Prevenção de Acidentes' },
    { value: 'Ministério do Trabalho', label: 'Ministério do Trabalho e Emprego' },
    { value: 'Delegacia do Trabalho', label: 'Delegacia Regional do Trabalho' },
    { value: 'Outro',              label: 'Outro órgão competente' }
];

// ── Estatísticas ─────────────────────────────────────────────────────────────

async function carregarEstatisticas() {
    try {
        const response = await fetch(`${API_URL}/denuncias/estatisticas/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) { logout(); return; }

        const stats = await response.json();

        document.getElementById('estatisticas').innerHTML = `
            <div class="stat-card">
                <span class="stat-icon">📋</span>
                <h3>${stats.total || 0}</h3>
                <p>Total de Registros</p>
            </div>
            <div class="stat-card">
                <span class="stat-icon">🔴</span>
                <h3>${stats.abertas || 0}</h3>
                <p>Novos</p>
            </div>
            <div class="stat-card">
                <span class="stat-icon">🟡</span>
                <h3>${stats.em_analise || 0}</h3>
                <p>Em Análise</p>
            </div>
            <div class="stat-card">
                <span class="stat-icon">✅</span>
                <h3>${stats.concluidas || 0}</h3>
                <p>Concluídos</p>
            </div>
        `;
    } catch (erro) {
        console.error('Erro ao carregar estatísticas:', erro);
    }
}

// ── Listagem de registros ────────────────────────────────────────────────────

async function carregarDenuncias(status = '', tipo = '', protocolo = '') {
    const lista = document.getElementById('listaDenuncias');
    lista.innerHTML = `<div class="empty-state"><div class="empty-icon">⏳</div><p>Carregando...</p></div>`;

    try {
        let url = `${API_URL}/denuncias?`;
        if (status)    url += `status=${encodeURIComponent(status)}&`;
        if (tipo)      url += `tipo=${encodeURIComponent(tipo)}&`;
        if (protocolo) url += `protocolo=${encodeURIComponent(protocolo)}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) { logout(); return; }

        const denuncias = await response.json();
        document.getElementById('totalFiltrado').textContent =
            `${denuncias.length} registro${denuncias.length !== 1 ? 's' : ''}`;

        if (denuncias.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>Nenhum registro encontrado com os filtros selecionados.</p>
                </div>`;
            return;
        }

        lista.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Protocolo</th>
                        <th>Categoria</th>
                        <th>Título</th>
                        <th>Modalidade</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${denuncias.map(d => `
                        <tr>
                            <td style="font-family:monospace; font-weight:600; color:var(--primary); white-space:nowrap;">${d.protocolo}</td>
                            <td>${tipoMap[d.tipo] || d.tipo}</td>
                            <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escHtml(d.titulo || d.descricao)}">${escHtml(d.titulo || '—')}</td>
                            <td><span class="badge ${d.anonima ? 'badge-gray' : 'badge-info'}">${d.anonima ? '👤 Anônimo' : '✅ Identificado'}</span></td>
                            <td><span class="badge ${statusMap[d.status]?.classe || 'badge-gray'}">${statusMap[d.status]?.texto || d.status}</span></td>
                            <td style="color:var(--secondary); font-size:0.85rem; white-space:nowrap;">${new Date(d.data_registro).toLocaleDateString('pt-BR')}</td>
                            <td>
                                <button class="btn btn-secondary btn-sm" onclick="abrirDetalhes(${d.id})" style="margin-top:0;">Ver / Gerir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (erro) {
        lista.innerHTML = `<div class="alert alert-error" style="margin:1rem;">❌ Erro ao carregar registros.</div>`;
    }
}

// ── Modal de detalhes ────────────────────────────────────────────────────────

async function abrirDetalhes(id) {
    const modal = document.getElementById('modalDetalhes');
    const corpo = document.getElementById('modalConteudo');
    modal.style.display = 'flex';
    corpo.innerHTML = `<div class="empty-state"><div class="empty-icon">⏳</div><p>Carregando...</p></div>`;

    try {
        const [resReg, resTrat] = await Promise.all([
            fetch(`${API_URL}/denuncias/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_URL}/denuncias/${id}/tratativas`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const d     = await resReg.json();
        const trats = await resTrat.json();

        const optStatus = ['aberta','em_analise','em_investigacao','concluida','arquivada']
            .map(s => `<option value="${s}" ${d.status === s ? 'selected' : ''}>${statusMap[s]?.texto || s}</option>`)
            .join('');

        const optOrgaos = orgaosEncaminhamento
            .map(o => `<option value="${o.value}" ${d.referral_agency === o.value ? 'selected' : ''}>${o.label}</option>`)
            .join('');

        const tratsHtml = trats.length
            ? trats.map(t => `
                <div class="comentario-item">
                    <div class="comentario-meta">
                        <strong>${escHtml(t.usuario_nome || 'Usuário')}</strong>
                        <span>${new Date(t.data_tratativa).toLocaleString('pt-BR')}</span>
                    </div>
                    <p>${escHtml(t.descricao)}</p>
                </div>`).join('')
            : `<p style="color:var(--secondary); font-size:0.875rem;">Nenhum comentário interno registrado.</p>`;

        corpo.innerHTML = `
            <div class="detalhe-section">
                <div class="detalhe-row">
                    <span class="detalhe-label">Protocolo</span>
                    <span style="font-family:monospace; font-weight:700; color:var(--primary);">${d.protocolo}</span>
                </div>
                <div class="detalhe-row">
                    <span class="detalhe-label">Categoria</span>
                    <span>${tipoMap[d.tipo] || d.tipo}</span>
                </div>
                <div class="detalhe-row">
                    <span class="detalhe-label">Modalidade</span>
                    <span>${d.anonima ? '👤 Anônimo' : '✅ Identificado'}</span>
                </div>
                ${!d.anonima && d.denunciante_nome ? `<div class="detalhe-row"><span class="detalhe-label">Nome</span><span>${escHtml(d.denunciante_nome)}</span></div>` : ''}
                ${!d.anonima && d.denunciante_email ? `<div class="detalhe-row"><span class="detalhe-label">E-mail</span><span>${escHtml(d.denunciante_email)}</span></div>` : ''}
                ${d.setor_envolvido ? `<div class="detalhe-row"><span class="detalhe-label">Setor</span><span>${escHtml(d.setor_envolvido)}</span></div>` : ''}
                <div class="detalhe-row">
                    <span class="detalhe-label">Registrado em</span>
                    <span>${new Date(d.data_registro).toLocaleString('pt-BR')}</span>
                </div>
            </div>

            ${d.titulo ? `<div class="detalhe-section"><p class="detalhe-label">Título</p><p style="font-weight:600;">${escHtml(d.titulo)}</p></div>` : ''}

            <div class="detalhe-section">
                <p class="detalhe-label">Descrição</p>
                <p style="white-space:pre-wrap; font-size:0.9rem; line-height:1.7;">${escHtml(d.descricao)}</p>
            </div>

            <!-- Alterar status -->
            <div class="detalhe-section">
                <p class="detalhe-label" style="margin-bottom:0.5rem;">Alterar Status</p>
                <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
                    <select id="selectStatus_${d.id}" style="padding:0.5rem 0.9rem; border:1.5px solid var(--border); border-radius:var(--radius-sm); font-size:0.875rem; font-family:inherit; outline:none;">${optStatus}</select>
                    <button class="btn btn-primary btn-sm" onclick="atualizarStatus(${d.id})" style="margin-top:0;">Salvar status</button>
                </div>
            </div>

            <!-- Encaminhamento -->
            <div class="detalhe-section">
                <p class="detalhe-label" style="margin-bottom:0.5rem;">Encaminhamento a Órgão Competente</p>
                <p style="font-size:0.8rem; color:var(--secondary); margin-bottom:0.5rem;">Registro interno — não exibido na consulta pública.</p>
                <div style="display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center;">
                    <select id="selectOrgao_${d.id}" style="padding:0.5rem 0.9rem; border:1.5px solid var(--border); border-radius:var(--radius-sm); font-size:0.875rem; font-family:inherit; outline:none; flex:1; min-width:200px;">${optOrgaos}</select>
                    <button class="btn btn-primary btn-sm" onclick="salvarEncaminhamento(${d.id})" style="margin-top:0;">Salvar encaminhamento</button>
                </div>
                <div id="msgEncaminhamento_${d.id}" style="margin-top:0.5rem;"></div>
            </div>

            <!-- Comentários internos -->
            <div class="detalhe-section">
                <p class="detalhe-label" style="margin-bottom:0.75rem;">Comentários Internos</p>
                <p style="font-size:0.8rem; color:var(--secondary); margin-bottom:0.75rem;">Visíveis apenas para a equipe administrativa. Não exibidos na consulta pública.</p>
                <div id="listaComentarios_${d.id}">${tratsHtml}</div>
                <div style="margin-top:1rem;">
                    <textarea id="novoComentario_${d.id}" rows="3" placeholder="Adicionar comentário interno..." style="width:100%; padding:0.7rem 1rem; border:1.5px solid var(--border); border-radius:var(--radius-sm); font-size:0.875rem; font-family:inherit; resize:vertical; outline:none;"></textarea>
                    <button class="btn btn-primary btn-sm" onclick="adicionarComentario(${d.id})" style="margin-top:0.5rem;">Adicionar comentário</button>
                    <div id="msgComentario_${d.id}" style="margin-top:0.5rem;"></div>
                </div>
            </div>
        `;
    } catch (erro) {
        corpo.innerHTML = `<div class="alert alert-error">Erro ao carregar detalhes.</div>`;
    }
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
}

document.getElementById('modalDetalhes').addEventListener('click', function (e) {
    if (e.target === this) fecharModal();
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharModal();
});

// ── Atualizar status ─────────────────────────────────────────────────────────

async function atualizarStatus(id) {
    const sel = document.getElementById(`selectStatus_${id}`);
    if (!sel || !sel.value) return;

    try {
        const response = await fetch(`${API_URL}/denuncias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: sel.value })
        });

        if (response.ok) {
            await carregarEstatisticas();
            await carregarDenuncias(
                document.getElementById('filtroStatus').value,
                document.getElementById('filtroTipo').value,
                document.getElementById('buscaProtocolo').value.trim()
            );
            fecharModal();
        } else {
            alert('Erro ao atualizar status. Tente novamente.');
        }
    } catch {
        alert('Erro de conexão ao atualizar status.');
    }
}

// ── Salvar encaminhamento ─────────────────────────────────────────────────────

async function salvarEncaminhamento(id) {
    const sel = document.getElementById(`selectOrgao_${id}`);
    const msg = document.getElementById(`msgEncaminhamento_${id}`);
    if (!sel) return;

    try {
        const response = await fetch(`${API_URL}/denuncias/${id}/encaminhamento`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ referral_agency: sel.value || null })
        });

        if (response.ok) {
            msg.innerHTML = `<span style="color:var(--success); font-size:0.85rem;">✅ Encaminhamento salvo.</span>`;
            setTimeout(() => { msg.innerHTML = ''; }, 3000);
        } else {
            msg.innerHTML = `<span style="color:var(--danger); font-size:0.85rem;">❌ Erro ao salvar.</span>`;
        }
    } catch {
        msg.innerHTML = `<span style="color:var(--danger); font-size:0.85rem;">❌ Erro de conexão.</span>`;
    }
}

// ── Adicionar comentário interno ──────────────────────────────────────────────

async function adicionarComentario(id) {
    const textarea = document.getElementById(`novoComentario_${id}`);
    const msg      = document.getElementById(`msgComentario_${id}`);
    const texto    = textarea.value.trim();

    if (!texto) {
        msg.innerHTML = `<span style="color:var(--danger); font-size:0.85rem;">Informe o comentário antes de enviar.</span>`;
        return;
    }

    try {
        const response = await fetch(`${API_URL}/denuncias/tratativas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ denuncia_id: id, descricao: texto })
        });

        if (response.ok) {
            textarea.value = '';
            msg.innerHTML  = `<span style="color:var(--success); font-size:0.85rem;">✅ Comentário adicionado.</span>`;
            const resTrat = await fetch(`${API_URL}/denuncias/${id}/tratativas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const trats = await resTrat.json();
            const listaEl = document.getElementById(`listaComentarios_${id}`);
            listaEl.innerHTML = trats.length
                ? trats.map(t => `
                    <div class="comentario-item">
                        <div class="comentario-meta">
                            <strong>${escHtml(t.usuario_nome || 'Usuário')}</strong>
                            <span>${new Date(t.data_tratativa).toLocaleString('pt-BR')}</span>
                        </div>
                        <p>${escHtml(t.descricao)}</p>
                    </div>`).join('')
                : `<p style="color:var(--secondary); font-size:0.875rem;">Nenhum comentário interno registrado.</p>`;
            setTimeout(() => { msg.innerHTML = ''; }, 3000);
        } else {
            msg.innerHTML = `<span style="color:var(--danger); font-size:0.85rem;">❌ Erro ao adicionar comentário.</span>`;
        }
    } catch {
        msg.innerHTML = `<span style="color:var(--danger); font-size:0.85rem;">❌ Erro de conexão.</span>`;
    }
}

// ── Filtros ──────────────────────────────────────────────────────────────────

document.getElementById('btnFiltrar').addEventListener('click', () => {
    carregarDenuncias(
        document.getElementById('filtroStatus').value,
        document.getElementById('filtroTipo').value,
        document.getElementById('buscaProtocolo').value.trim().toUpperCase()
    );
});

document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('filtroStatus').value   = '';
    document.getElementById('filtroTipo').value     = '';
    document.getElementById('buscaProtocolo').value = '';
    carregarDenuncias();
});

// ── Utilitários ──────────────────────────────────────────────────────────────

function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'admin.html';
}

// ── Init ─────────────────────────────────────────────────────────────────────
carregarEstatisticas();
carregarDenuncias();
