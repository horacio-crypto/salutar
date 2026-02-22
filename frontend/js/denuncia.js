const API_URL = 'http://localhost:3000/api';

document.getElementById('anonima').addEventListener('change', function() {
    const dadosIdentificacao = document.getElementById('dadosIdentificacao');
    dadosIdentificacao.style.display = this.checked ? 'none' : 'block';
});

document.getElementById('formDenuncia').addEventListener('submit', async function(e) {
    e.preventDefault();

    const anonima = document.getElementById('anonima').checked;
    
    const dados = {
        empresa_id: parseInt(document.getElementById('empresa_id').value),
        tipo: document.getElementById('tipo').value,
        descricao: document.getElementById('descricao').value,
        setor_envolvido: document.getElementById('setor_envolvido').value,
        data_ocorrencia: document.getElementById('data_ocorrencia').value,
        anonima: anonima,
        denunciante_nome: anonima ? null : document.getElementById('denunciante_nome').value,
        denunciante_email: anonima ? null : document.getElementById('denunciante_email').value,
        denunciante_telefone: anonima ? null : document.getElementById('denunciante_telefone').value
    };

    try {
        const response = await fetch(`${API_URL}/denuncias`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (response.ok) {
            mostrarMensagem(`
                <div class="alert alert-success">
                    <h3>Denúncia registrada com sucesso!</h3>
                    <p><strong>Protocolo:</strong> ${resultado.protocolo}</p>
                    <p>Guarde este protocolo para acompanhar sua denúncia.</p>
                    <a href="consulta.html" class="btn btn-primary">Consultar Status</a>
                </div>
            `);
            document.getElementById('formDenuncia').reset();
        } else {
            mostrarMensagem(`<div class="alert alert-error">Erro: ${resultado.erro}</div>`);
        }
    } catch (erro) {
        mostrarMensagem('<div class="alert alert-error">Erro ao enviar denúncia. Verifique sua conexão.</div>');
    }
});

function mostrarMensagem(html) {
    document.getElementById('mensagem').innerHTML = html;
    window.scrollTo(0, 0);
}
