const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// ── Busca local (localStorage) ──────────────────────────────────────────────

const STORAGE_KEY = 'salutar_denuncias';

function buscarLocal(protocolo) {
    const lista = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return lista.find(d => d.protocolo === protocolo) || null;
}

const statusMap = {
    aberta:          { texto: 'Nova',             classe: 'badge-info' },
    em_analise:      { texto: 'Em Análise',       classe: 'badge-warning' },
    em_investigacao: { texto: 'Em Investigação',  classe: 'badge-warning' },
    concluida:       { texto: 'Concluída',        classe: 'badge-success' },
    arquivada:       { texto: 'Arquivada',        classe: 'badge-gray' }
};

const tipoMap = {
    assedio_moral:    'Assédio Moral',
    saude_fisica:     'Saúde Física',
    saude_mental:     'Saúde Mental',
    condicao_insegura:'Condição Insegura de Trabalho',
    outro:            'Outra',
    // compatibilidade com registros antigos
    assedio_sexual:   'Assédio Moral',
    discriminacao:    'Outra',
    risco_saude:      'Saúde Física'
};

document.getElementById('protocolo').addEventListener('input', function () {
    this.value = this.value.toUpperCase();
});

document.getElementById('formConsulta').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Consultando...';

    const protocolo = document.getElementById('protocolo').value.trim().toUpperCase();

    if (!protocolo) {
        document.getElementById('resultado').innerHTML =
            `<div class="alert alert-error">Informe o número do protocolo.</div>`;
        btn.disabled    = false;
        btn.textContent = '🔍 Consultar';
        return;
    }

    function renderizarResultado(dados) {
        const status    = statusMap[dados.status] || { texto: dados.status, classe: 'badge-gray' };
        const categoria = tipoMap[dados.tipo] || dados.tipo;
        const dataReg   = new Date(dados.data_registro).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
        const dataUpd   = new Date(dados.data_atualizacao).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
        const origemNote = dados._origem === 'local'
            ? `<div class="alert alert-info" style="margin-top:1rem; margin-bottom:0;">
                   📁 Este registro está salvo localmente neste dispositivo.
               </div>`
            : `<div class="alert alert-info" style="margin-top:1rem; margin-bottom:0;">
                   ℹ️ Apenas informações públicas são exibidas nesta consulta. Comentários internos e dados de análise são restritos à organização.
               </div>`;

        document.getElementById('resultado').innerHTML = `
            <div class="protocolo-card">
                <div class="protocolo-header">
                    <span class="protocolo-numero">${dados.protocolo}</span>
                    <span class="badge ${status.classe}">${status.texto}</span>
                </div>
                <div class="protocolo-info">
                    <div class="protocolo-info-item">
                        <label>Categoria</label>
                        <span>${categoria}</span>
                    </div>
                    <div class="protocolo-info-item">
                        <label>Registrado em</label>
                        <span>${dataReg}</span>
                    </div>
                    <div class="protocolo-info-item">
                        <label>Última atualização</label>
                        <span>${dataUpd}</span>
                    </div>
                    <div class="protocolo-info-item">
                        <label>Modalidade</label>
                        <span>${dados.anonima ? '👤 Anônima' : '✅ Identificada'}</span>
                    </div>
                </div>
                ${origemNote}
            </div>
        `;
    }

    // 1. Busca primeiro no localStorage
    const registroLocal = buscarLocal(protocolo);
    if (registroLocal) {
        renderizarResultado(registroLocal);
        btn.disabled    = false;
        btn.textContent = '🔍 Consultar';
        document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    // 2. Se não encontrou localmente, tenta a API
    try {
        const response = await fetch(`${API_URL}/denuncias/protocolo/${encodeURIComponent(protocolo)}`);
        const dados    = await response.json();

        if (response.ok) {
            renderizarResultado(dados);
            document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            document.getElementById('resultado').innerHTML = `
                <div class="alert alert-error">
                    🔍 Protocolo não encontrado. Verifique o número e tente novamente.
                </div>`;
        }
    } catch {
        document.getElementById('resultado').innerHTML =
            `<div class="alert alert-error">🔍 Protocolo não encontrado. Verifique o número e tente novamente.</div>`;
    } finally {
        btn.disabled    = false;
        btn.textContent = '🔍 Consultar';
    }
});
