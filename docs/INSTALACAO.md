# Guia de Instalação e Configuração

## Pré-requisitos

- Node.js (versão 16 ou superior)
- PostgreSQL (versão 12 ou superior)
- Git

## Passo 1: Configurar o Banco de Dados

1. Instale o PostgreSQL
2. Crie um banco de dados:

```sql
CREATE DATABASE canal_denuncias;
```

3. Execute o script de criação das tabelas:

```bash
psql -U postgres -d canal_denuncias -f database/schema.sql
```

## Passo 2: Configurar o Backend

1. Entre na pasta do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
copy .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=canal_denuncias
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta_minimo_32_caracteres
```

5. Inicie o servidor:

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## Passo 3: Configurar o Frontend

1. Abra o arquivo `frontend/js/denuncia.js`, `frontend/js/consulta.js`, `frontend/js/login.js` e `frontend/js/dashboard.js`

2. Verifique se a constante `API_URL` está apontando para o endereço correto do backend:

```javascript
const API_URL = 'http://localhost:3000/api';
```

3. Para servir o frontend, você pode:

   - Abrir diretamente o arquivo `frontend/index.html` no navegador
   - Usar um servidor web simples como `live-server`:

```bash
npm install -g live-server
cd frontend
live-server
```

## Passo 4: Testar a Aplicação

### Credenciais de Teste

O script SQL cria um usuário administrador padrão:

- **Email**: admin@empresademo.com.br
- **Senha**: admin123

**IMPORTANTE**: Altere esta senha em produção!

### Fluxo de Teste

1. Acesse `http://localhost:8080` (ou o endereço do seu servidor)
2. Clique em "Fazer Denúncia"
3. Preencha o formulário (use empresa_id = 1 para testes)
4. Anote o protocolo gerado
5. Consulte o protocolo na página de consulta
6. Faça login na área administrativa
7. Visualize as denúncias no dashboard

## Estrutura de Pastas

```
projeto/
├── backend/
│   ├── config/          # Configurações
│   ├── controllers/     # Lógica de negócio
│   ├── middleware/      # Middlewares
│   ├── routes/          # Rotas da API
│   ├── uploads/         # Arquivos enviados
│   ├── .env.example     # Exemplo de variáveis
│   ├── package.json     # Dependências
│   └── server.js        # Servidor principal
├── frontend/
│   ├── css/             # Estilos
│   ├── js/              # Scripts
│   ├── index.html       # Página inicial
│   ├── denuncia.html    # Formulário de denúncia
│   ├── consulta.html    # Consulta de protocolo
│   ├── login.html       # Login administrativo
│   └── dashboard.html   # Painel administrativo
├── database/
│   └── schema.sql       # Script do banco
└── docs/
    └── INSTALACAO.md    # Este arquivo
```

## Solução de Problemas

### Erro de conexão com o banco

- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -U postgres -d canal_denuncias`

### Erro CORS no frontend

- Verifique se o backend está rodando
- Confirme a variável `CORS_ORIGIN` no `.env`
- Use o mesmo protocolo (http/https) em ambos

### Token inválido

- Limpe o localStorage do navegador
- Faça login novamente

## Segurança em Produção

Antes de colocar em produção:

1. Altere todas as senhas padrão
2. Use HTTPS (SSL/TLS)
3. Configure CORS adequadamente
4. Use variáveis de ambiente seguras
5. Implemente backup do banco de dados
6. Configure logs de auditoria
7. Revise permissões de usuários

## Suporte

Para dúvidas ou problemas, consulte a documentação completa no README.md
