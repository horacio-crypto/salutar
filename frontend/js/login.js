const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';

document.getElementById('formLogin').addEventListener('submit', async function(e) {
    e.preventDefault();

    const dados = {
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
    };

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (response.ok) {
            localStorage.setItem('token', resultado.token);
            localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            window.location.href = 'dashboard.html';
        } else {
            mostrarMensagem(`<div class="alert alert-error">${resultado.erro}</div>`);
        }
    } catch (erro) {
        mostrarMensagem('<div class="alert alert-error">Erro ao realizar login. Verifique sua conexão.</div>');
    }
});

function mostrarMensagem(html) {
    document.getElementById('mensagem').innerHTML = html;
}
