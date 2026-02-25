const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';

const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('nomeUsuario').textContent = usuario.nome;

document.getElementById('btnLogout').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
});

async function carregarEstatisticas() {
    try {
        const response = await fetch(`${API_URL}/denuncias/estatisticas/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const stats = await response.json();

        document.getElementById('estatisticas').innerHTML = `
            <div class="stat-card">
                <h3>${stats.total}</h3>
                <p>Total de Denúncias</p>
            </div>
            <div class="stat-card">
                <h3>${stats.abertas}</h3>
                <p>Abertas</p>
            </div>
            <div class="stat-card">
                <h3>${stats.em_analise}</h3>
                <p>Em Análise</p>
            </div>
            <div class="stat-card">
                <h3>${stats.concluidas}</h3>
                <p>Concluídas</p>
            </div>
        `;
    } catch (erro) {
        console.error('Erro ao carregar estatísticas:', erro);
    }
}

async function carregarDenuncias(status = '', tipo = '') {
    try {
        let url = `${API_URL}/denuncias?`;
        if (status) url += `status=${status}&`;
        if (tipo) url += `tipo=${tipo}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const denuncias = await response.json();

        if (denuncias.length === 0) {
            document.getElementById('listaDenuncias').innerHTML = '<p>Nenhuma denúncia encontrada.</p>';
            return;
        }

        const statusMap = {
            'aberta': { texto: 'Aberta', classe: 'badge-info' },
            'em_analise': { texto: 'Em Análise', classe: 'badge-warning' },
            'em_investigacao': { texto: 'Em Investigação', classe: 'badge-warning' },
            'concluida': { texto: 'Concluída', classe: 'badge-success' },
            'arquivada': { texto: 'Arquivada', classe: 'badge-danger' }
        };

        const tipoMap = {
            'assedio_moral': 'Assédio Moral',
            'assedio_sexual': 'Assédio Sexual',
            'discriminacao': 'Discriminação',
            'condicao_insegura': 'Condição Insegura',
            'risco_saude': 'Risco à Saúde',
            'outro': 'Outro'
        };

        let html = '<table class="table"><thead><tr><th>Protocolo</th><th>Tipo</th><th>Status</th><th>Data</th><th>Ações</th></tr></thead><tbody>';

        denuncias.forEach(d => {
            const status = statusMap[d.status];
            const tipo = tipoMap[d.tipo];
            const data = new Date(d.data_registro).toLocaleDateString('pt-BR');

            html += `
                <tr>
                    <td>${d.protocolo}</td>
                    <td>${tipo}</td>
                    <td><span class="badge ${status.classe}">${status.texto}</span></td>
                    <td>${data}</td>
                    <td>
                        <button class="btn btn-primary" onclick="verDetalhes(${d.id})">Ver</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        document.getElementById('listaDenuncias').innerHTML = html;
    } catch (erro) {
        console.error('Erro ao carregar denúncias:', erro);
    }
}

document.getElementById('btnFiltrar').addEventListener('click', function() {
    const status = document.getElementById('filtroStatus').value;
    const tipo = document.getElementById('filtroTipo').value;
    carregarDenuncias(status, tipo);
});

function verDetalhes(id) {
    window.location.href = `detalhes.html?id=${id}`;
}

carregarEstatisticas();
carregarDenuncias();
