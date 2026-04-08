const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

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
    condicao_insegura:'Condição Insegura de Trabalho',
    risco_saude:      'Risco à Saúde',
    outro:            'Outro'
};

document.getElementById('protocolo').addEventListener('input', function () {
    this.value = this.value.toUpperCase();
});

document.getElementById('formConsulta').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Consultando...';

    const protocolo = document.getElementById('protocolo').value.trim();

    try {
        const response = await fetch(`${API_URL}/denuncias/protocolo/${protocolo}`);
        const denuncia = await response.json();

        if (response.ok) {
            const status = statusMap[denuncia.status] || { texto: denuncia.status, classe: 'badge-gray' };
            const tipo = tipoMap[denuncia.tipo] || denuncia.tipo;
            const data = new Date(denuncia.data_registro).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

            document.getElementById('resultado').innerHTML = `
                <div class="protocolo-card">
                    <div class="protocolo-header">
                        <span class="protocolo-numero">${denuncia.protocolo}</span>
                        <span class="badge ${status.classe}">${status.texto}</span>
                    </div>
                    <div class="protocolo-info">
                        <div class="protocolo-info-item">
                            <label>Tipo</label>
                            <span>${tipo}</span>
                        </div>
                        <div class="protocolo-info-item">
                            <label>Data de Registro</label>
                            <span>${data}</span>
                        </div>
                        ${denuncia.setor_envolvido ? `
                        <div class="protocolo-info-item">
                            <label>Setor</label>
                            <span>${denuncia.setor_envolvido}</span>
                        </div>` : ''}
                        <div class="protocolo-info-item">
                            <label>Modalidade</label>
                            <span>${denuncia.anonima ? '👤 Anônima' : '✅ Identificada'}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('resultado').innerHTML = `
                <div class="alert alert-error">
                    🔍 Protocolo não encontrado. Verifique o número e tente novamente.
                </div>`;
        }
    } catch {
        document.getElementById('resultado').innerHTML = `
            <div class="alert alert-error">❌ Erro ao consultar. Verifique sua conexão.</div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = '🔍 Consultar';
    }
});
