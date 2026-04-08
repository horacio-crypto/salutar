const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

document.getElementById('anonima').addEventListener('change', function () {
    const secao = document.getElementById('dadosIdentificacao');
    secao.style.display = this.checked ? 'none' : 'block';
});

document.getElementById('formDenuncia').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const anonima = document.getElementById('anonima').checked;

    const dados = {
        empresa_id: parseInt(document.getElementById('empresa_id').value),
        tipo: document.getElementById('tipo').value,
        descricao: document.getElementById('descricao').value,
        setor_envolvido: document.getElementById('setor_envolvido').value,
        data_ocorrencia: document.getElementById('data_ocorrencia').value,
        anonima,
        denunciante_nome: anonima ? null : document.getElementById('denunciante_nome').value,
        denunciante_email: anonima ? null : document.getElementById('denunciante_email').value,
        denunciante_telefone: anonima ? null : document.getElementById('denunciante_telefone').value
    };

    try {
        const response = await fetch(`${API_URL}/denuncias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (response.ok) {
            document.getElementById('mensagem').innerHTML = `
                <div class="alert alert-success">
                    <div>
                        <strong>✅ Denúncia registrada com sucesso!</strong><br>
                        <span style="font-size:0.85rem;">Guarde o protocolo abaixo para acompanhar sua denúncia.</span>
                    </div>
                </div>
                <div style="background: var(--white); border: 2px solid var(--primary); border-radius: var(--radius); padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
                    <p style="font-size: 0.8rem; color: var(--secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">Número do Protocolo</p>
                    <p style="font-size: 1.8rem; font-weight: 700; color: var(--primary); font-family: monospace; letter-spacing: 2px;">${resultado.protocolo}</p>
                    <a href="consulta.html" class="btn btn-primary btn-sm" style="margin-top: 0.8rem;">Consultar Status</a>
                </div>
            `;
            this.reset();
            document.getElementById('dadosIdentificacao').style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            document.getElementById('mensagem').innerHTML = `<div class="alert alert-error">❌ ${resultado.erro}</div>`;
        }
    } catch {
        document.getElementById('mensagem').innerHTML = `<div class="alert alert-error">❌ Erro ao enviar. Verifique sua conexão.</div>`;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar Denúncia';
    }
});
