const API_URL = 'http://localhost:3000/api';

document.getElementById('formConsulta').addEventListener('submit', async function(e) {
    e.preventDefault();

    const protocolo = document.getElementById('protocolo').value.trim();

    try {
        const response = await fetch(`${API_URL}/denuncias/protocolo/${protocolo}`);
        const denuncia = await response.json();

        if (response.ok) {
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

            const status = statusMap[denuncia.status];
            const tipo = tipoMap[denuncia.tipo];

            document.getElementById('resultado').innerHTML = `
                <div class="alert alert-success">
                    <h3>Denúncia Encontrada</h3>
                    <p><strong>Protocolo:</strong> ${denuncia.protocolo}</p>
                    <p><strong>Tipo:</strong> ${tipo}</p>
                    <p><strong>Status:</strong> <span class="badge ${status.classe}">${status.texto}</span></p>
                    <p><strong>Data de Registro:</strong> ${new Date(denuncia.data_registro).toLocaleDateString('pt-BR')}</p>
                    ${denuncia.setor_envolvido ? `<p><strong>Setor:</strong> ${denuncia.setor_envolvido}</p>` : ''}
                </div>
            `;
        } else {
            document.getElementById('resultado').innerHTML = `
                <div class="alert alert-error">
                    Protocolo não encontrado. Verifique o número e tente novamente.
                </div>
            `;
        }
    } catch (erro) {
        document.getElementById('resultado').innerHTML = `
            <div class="alert alert-error">
                Erro ao consultar protocolo. Verifique sua conexão.
            </div>
        `;
    }
});
