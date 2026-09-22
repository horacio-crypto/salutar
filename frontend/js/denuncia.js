const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

<<<<<<< HEAD
// ── Controle de etapas ──────────────────────────────────────────────────────

function escolherModalidade(tipo) {
    document.getElementById('modalidade').value = tipo;

    const dadosId = document.getElementById('dadosIdentificacao');
    const badge   = document.getElementById('badgeModalidade');

    if (tipo === 'anonimo') {
        dadosId.style.display = 'none';
        badge.textContent = '👤 Registro Anônimo';
        badge.className   = 'badge badge-info';
    } else {
        dadosId.style.display = 'block';
        badge.textContent = '✅ Registro Identificado';
        badge.className   = 'badge badge-success';
    }

    document.getElementById('etapaModalidade').style.display = 'none';
    document.getElementById('etapaFormulario').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function voltarModalidade() {
    document.getElementById('etapaFormulario').style.display = 'none';
    document.getElementById('etapaModalidade').style.display = 'block';
    document.getElementById('mensagem').innerHTML = '';
    limparErros();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Contador de caracteres ──────────────────────────────────────────────────

const descricaoEl = document.getElementById('descricao');
const charCountEl = document.getElementById('charCount');

descricaoEl.addEventListener('input', function () {
    const len = this.value.length;
    charCountEl.textContent = `${len} / 5000`;
    charCountEl.style.color = len > 4800 ? 'var(--danger)' : 'var(--secondary)';
});

// ── Validação inline ────────────────────────────────────────────────────────

function mostrarErro(id, msg) {
    const el = document.getElementById('err-' + id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    const input = document.getElementById(id);
    if (input) input.style.borderColor = 'var(--danger)';
}

function limparErro(id) {
    const el = document.getElementById('err-' + id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
    const input = document.getElementById(id);
    if (input) input.style.borderColor = '';
}

function limparErros() {
    ['empresa_id', 'tipo', 'titulo', 'descricao'].forEach(limparErro);
}

function validarFormulario() {
    limparErros();
    let valido = true;

    const empresaId = document.getElementById('empresa_id').value;
    if (!empresaId || parseInt(empresaId) < 1) {
        mostrarErro('empresa_id', 'Informe o identificador da organização.');
        valido = false;
    }

    const tipo = document.getElementById('tipo').value;
    if (!tipo) {
        mostrarErro('tipo', 'Selecione a categoria da ocorrência.');
        valido = false;
    }

    const titulo = document.getElementById('titulo').value.trim();
    if (!titulo || titulo.length < 5) {
        mostrarErro('titulo', 'O título deve ter pelo menos 5 caracteres.');
        valido = false;
    }

    const descricao = document.getElementById('descricao').value.trim();
    if (!descricao || descricao.length < 20) {
        mostrarErro('descricao', 'A descrição deve ter pelo menos 20 caracteres.');
        valido = false;
    }

    return valido;
}

// ── Envio do formulário ─────────────────────────────────────────────────────

document.getElementById('formDenuncia').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    const btn = document.getElementById('btnEnviar');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    const modalidade = document.getElementById('modalidade').value;
    const isAnonimo  = modalidade === 'anonimo';

    const dados = {
        empresa_id:          parseInt(document.getElementById('empresa_id').value),
        tipo:                document.getElementById('tipo').value,
        titulo:              document.getElementById('titulo').value.trim(),
        descricao:           document.getElementById('descricao').value.trim(),
        setor_envolvido:     document.getElementById('setor_envolvido').value.trim() || null,
        data_ocorrencia:     document.getElementById('data_ocorrencia').value || null,
        anonima:             isAnonimo,
        denunciante_nome:    isAnonimo ? null : (document.getElementById('denunciante_nome').value.trim() || null),
        denunciante_email:   isAnonimo ? null : (document.getElementById('denunciante_email').value.trim() || null),
=======
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
>>>>>>> d8679d82bb5a4133b8092739db6dc789b5b514dc
    };

    try {
        const response = await fetch(`${API_URL}/denuncias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (response.ok) {
<<<<<<< HEAD
            document.getElementById('etapaFormulario').style.display = 'none';
            document.getElementById('mensagem').innerHTML = `
                <div class="sucesso-card">
                    <div class="sucesso-icon">✅</div>
                    <h2>Registro realizado com sucesso!</h2>
                    <p>Guarde o número de protocolo abaixo para acompanhar sua ocorrência.</p>
                    <div class="protocolo-destaque">
                        <p class="protocolo-label">Número do Protocolo</p>
                        <p class="protocolo-numero-lg" id="numProtocolo">${resultado.protocolo}</p>
                        <button class="btn btn-secondary btn-sm" onclick="copiarProtocolo()">📋 Copiar protocolo</button>
                    </div>
                    <div style="margin-top:1.5rem; display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
                        <a href="consulta.html" class="btn btn-primary">Consultar status</a>
                        <a href="index.html" class="btn btn-secondary">Voltar ao início</a>
                    </div>
                </div>
            `;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            document.getElementById('mensagem').innerHTML =
                `<div class="alert alert-error">❌ ${resultado.erro || 'Erro ao enviar. Tente novamente.'}</div>`;
            document.getElementById('etapaFormulario').style.display = 'block';
        }
    } catch {
        document.getElementById('mensagem').innerHTML =
            `<div class="alert alert-error">❌ Erro de conexão. Verifique sua internet e tente novamente.</div>`;
        document.getElementById('etapaFormulario').style.display = 'block';
    } finally {
        btn.disabled  = false;
        btn.textContent = 'Enviar Registro';
    }
});

// ── Copiar protocolo ────────────────────────────────────────────────────────

function copiarProtocolo() {
    const num = document.getElementById('numProtocolo');
    if (!num) return;
    navigator.clipboard.writeText(num.textContent).then(() => {
        const btn = num.nextElementSibling;
        const orig = btn.textContent;
        btn.textContent = '✓ Copiado!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
    });
}
=======
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
>>>>>>> d8679d82bb5a4133b8092739db6dc789b5b514dc
