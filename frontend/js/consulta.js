const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

const statusMap = {
<<<<<<< HEAD
    aberta:          { texto: 'Nova',        classe: 'badge-info' },
    em_analise:      { texto: 'Em Análise',  classe: 'badge-warning' },
    em_investigacao: { texto: 'Em Análise',  classe: 'badge-warning' },
    concluida:       { texto: 'Concluída',   classe: 'badge-success' },
    arquivada:       { texto: 'Concluída',   classe: 'badge-gray' }
=======
    aberta:          { texto: 'Aberta',          classe: 'badge-info' },
    em_analise:      { texto: 'Em Análise',       classe: 'badge-warning' },
    em_investigacao: { texto: 'Em Investigação',  classe: 'badge-warning' },
    concluida:       { texto: 'Concluída',        classe: 'badge-success' },
    arquivada:       { texto: 'Arquivada',        classe: 'badge-gray' }
>>>>>>> d8679d82bb5a4133b8092739db6dc789b5b514dc
};

const tipoMap = {
    assedio_moral:    'Assédio Moral',
<<<<<<< HEAD
    saude_fisica:     'Saúde Física',
    saude_mental:     'Saúde Mental',
    condicao_insegura:'Condição Insegura de Trabalho',
    outro:            'Outra',
    // compatibilidade com registros antigos
    assedio_sexual:   'Assédio Moral',
    discriminacao:    'Outra',
    risco_saude:      'Saúde Física'
=======
    assedio_sexual:   'Assédio Sexual',
    discriminacao:    'Discriminação',
    condicao_insegura:'Condição Insegura de Trabalho',
    risco_saude:      'Risco à Saúde',
    outro:            'Outro'
>>>>>>> d8679d82bb5a4133b8092739db6dc789b5b514dc
};

document.getElementById('protocolo').addEventListener('input', function () {
    this.value = this.value.toUpperCase();
});

document.getElementById('formConsulta').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Consultando...';

<<<<<<< HEAD
    const protocolo = document.getElementById('protocolo').value.trim().toUpperCase();

    if (!protocolo) {
        document.getElementById('resultado').innerHTML =
            `<div class="alert alert-error">Informe o número do protocolo.</div>`;
        btn.disabled  = false;
        btn.textContent = '🔍 Consultar';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/denuncias/protocolo/${encodeURIComponent(protocolo)}`);
        const dados    = await response.json();

        if (response.ok) {
            const status    = statusMap[dados.status] || { texto: dados.status, classe: 'badge-gray' };
            const categoria = tipoMap[dados.tipo] || dados.tipo;
            const dataReg   = new Date(dados.data_registro).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
            const dataUpd   = new Date(dados.data_atualizacao).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
=======
    const protocolo = document.getElementById('protocolo').value.trim();

    try {
        const response = await fetch(`${API_URL}/denuncias/protocolo/${protocolo}`);
        const denuncia = await response.json();

        if (response.ok) {
            const status = statusMap[denuncia.status] || { texto: denuncia.status, classe: 'badge-gray' };
            const tipo = tipoMap[denuncia.tipo] || denuncia.tipo;
            const data = new Date(denuncia.data_registro).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
>>>>>>> d8679d82bb5a4133b8092739db6dc789b5b514dc

            document.getElementById('resultado').innerHTML = `
                <div class="protocolo-card">
                    <div class="protocolo-header">
<<<<<<< HEAD
                        <span class="protocolo-numero">${dados.protocolo}</span>
=======
                        <span class="protocolo-numero">${denuncia.protocolo}</span>
>>>>>>> d8679d82bb5a4133b8092739db6dc789b5b514dc
                        <span class="badge ${status.classe}">${status.texto}</span>
                    </div>
                    <div class="protocolo-info">
                        <div class="protocolo-info-item">
<<<<<<< HEAD
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
                    <div class="alert alert-info" style="margin-top:1rem; margin-bottom:0;">
                        ℹ️ Apenas informações públicas são exibidas nesta consulta. Comentários internos e dados de análise são restritos à organização.
                    </div>
=======
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
>>>>>>> d8679d82bb5a4133b8092739db6dc789b5b514dc
                </div>
            `;
        } else {
            document.getElementById('resultado').innerHTML = `
                <div class="alert alert-error">
                    🔍 Protocolo não encontrado. Verifique o número e tente novamente.
                </div>`;
        }
    } catch {
<<<<<<< HEAD
        document.getElementById('resultado').innerHTML =
            `<div class="alert alert-error">❌ Erro ao consultar. Verifique sua conexão.</div>`;
    } finally {
        btn.disabled    = false;
=======
        document.getElementById('resultado').innerHTML = `
            <div class="alert alert-error">❌ Erro ao consultar. Verifique sua conexão.</div>`;
    } finally {
        btn.disabled = false;
>>>>>>> d8679d82bb5a4133b8092739db6dc789b5b514dc
        btn.textContent = '🔍 Consultar';
    }
});
