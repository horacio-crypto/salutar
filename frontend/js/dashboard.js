const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

if (!token) window.location.href = 'login.html';

document.getElementById('nomeUsuario').textContent = usuario.nome || 'Usuário';
document.getElementById('dataAtual').textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
});

const statusMap = {
    aberta:          { texto: 'Aberta',          classe: 'badge-info' },
    em_analise:      { texto: 'Em Análise',       classe: 'badge-warning' },
    em_investigacao: { texto: 'Em Investigação',  classe: 'badge-warning' },
    concluida:       { texto: 'Concluída',        classe: 'badge-success' },
    arquivada:       { texto: 'Arquivada',        classe: 'badge-gray' }
};

const tipoMap = {
    assedio_moral:    'Assédio Moral',
    assedio_sexual:   'Assédio Sexual',
    discriminacao:    'Discriminação',
    condicao_insegura:'Condição Insegura',
    risco_saude:      'Risco à Saúde',
    outro:            'Outro'
};

async function carregarEstatisticas() {
    try {
        const response = await fetch(`${API_URL}/denuncias/estatisticas/dashboard`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await response.json();

        document.getElementById('estatisticas').innerHTML = `
            <div class="stat-card">
                <span class="stat-icon">📋</span>
                <h3>${stats.total}</h3>
                <p>Total de Denúncias</p>
            </div>
            <div class="stat-card">
                <span class="stat-icon">🔴</span>
                <h3>${stats.abertas}</h3>
                <p>Abertas</p>
            </div>
            <div class="stat-card">
                <span class="stat-icon">🟡</span>
                <h3>${stats.em_analise}</h3>
                <p>Em Análise</p>
            </div>
            <div class="stat-card">
                <span class="stat-icon">✅</span>
                <h3>${stats.concluidas}</h3>
                <p>Concluídas</p>
            </div>
        `;
    } catch (erro) {
        console.error('Erro ao carregar estatísticas:', erro);
    }
}

async function carregarDenuncias(status = '', tipo = '') {
    const lista = document.getElementById('listaDenuncias');
    lista.innerHTML = `<div class="empty-state"><div class="empty-icon">⏳</div><p>Carregando...</p></div>`;

    try {
        let url = `${API_URL}/denuncias?`;
        if (status) url += `status=${status}&`;
        if (tipo) url += `tipo=${tipo}`;

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const denuncias = await response.json();

        document.getElementById('totalFiltrado').textContent = `${denuncias.length} registro${denuncias.length !== 1 ? 's' : ''}`;

        if (denuncias.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <p>Nenhuma denúncia encontrada com os filtros selecionados.</p>
                </div>`;
            return;
        }

        lista.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Protocolo</th>
                        <th>Tipo</th>
                        <th>Setor</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${denuncias.map(d => `
                        <tr>
                            <td style="font-family: monospace; font-weight: 600; color: var(--primary);">${d.protocolo}</td>
                            <td>${tipoMap[d.tipo] || d.tipo}</td>
                            <td style="color: var(--secondary);">${d.setor_envolvido || '—'}</td>
                            <td><span class="badge ${statusMap[d.status]?.classe || 'badge-gray'}">${statusMap[d.status]?.texto || d.status}</span></td>
                            <td style="color: var(--secondary); font-size: 0.85rem;">${new Date(d.data_registro).toLocaleDateString('pt-BR')}</td>
                            <td>
                                <select class="select-status" data-id="${d.id}" style="padding: 0.3rem 0.6rem; border: 1px solid var(--border); border-radius: 6px; font-size: 0.8rem; font-family: inherit; cursor: pointer;">
                                    <option value="">Alterar status</option>
                                    <option value="aberta">Aberta</option>
                                    <option value="em_analise">Em Análise</option>
                                    <option value="em_investigacao">Em Investigação</option>
                                    <option value="concluida">Concluída</option>
                                    <option value="arquivada">Arquivada</option>
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.querySelectorAll('.select-status').forEach(select => {
            select.addEventListener('change', async function () {
                if (!this.value) return;
                await atualizarStatus(this.dataset.id, this.value);
            });
        });

    } catch (erro) {
        lista.innerHTML = `<div class="alert alert-error" style="margin: 1rem;">❌ Erro ao carregar denúncias.</div>`;
    }
}

async function atualizarStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/denuncias/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            await carregarEstatisticas();
            await carregarDenuncias(
                document.getElementById('filtroStatus').value,
                document.getElementById('filtroTipo').value
            );
        }
    } catch (erro) {
        console.error('Erro ao atualizar status:', erro);
    }
}

document.getElementById('btnFiltrar').addEventListener('click', () => {
    carregarDenuncias(
        document.getElementById('filtroStatus').value,
        document.getElementById('filtroTipo').value
    );
});

document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroTipo').value = '';
    carregarDenuncias();
});

carregarEstatisticas();
carregarDenuncias();
