# Guia de Execução do Projeto

## ⚠️ Observação Importante

Este projeto usa **Node.js**, não Python. Portanto, **não é necessário criar venv** (ambiente virtual Python).

## 📋 Pré-requisitos

1. **Node.js** (versão 16 ou superior)
   - Download: https://nodejs.org/
   - Verifique: `node --version`

2. **PostgreSQL** (versão 12 ou superior)
   - Download: https://www.postgresql.org/download/windows/
   - Verifique: `psql --version`

3. **Git** (opcional)
   - Download: https://git-scm.com/

## 🚀 Passo a Passo

### 1. Configurar o Banco de Dados

#### Opção A: Usando pgAdmin (Mais Fácil)

1. Abra o **pgAdmin**
2. Conecte ao servidor PostgreSQL (usuário: postgres)
3. Clique com botão direito em **"Databases"** → **"Create"** → **"Database"**
4. Digite o nome: `canal_denuncias`
5. Clique em **"Save"**
6. Clique com botão direito no banco `canal_denuncias` → **"Query Tool"**
7. Clique em **"Open File"** e selecione: `database/schema.sql`
8. Clique em **"Execute"** (F5)
9. Verifique se apareceu "Query returned successfully"

#### Opção B: Usando Terminal

```powershell
# Abra o PowerShell como Administrador
cd "C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp\database"

# Criar banco
psql -U postgres -c "CREATE DATABASE canal_denuncias;"

# Executar schema
psql -U postgres -d canal_denuncias -f schema.sql
```

### 2. Configurar o Backend

```powershell
# Navegue até a pasta backend
cd "C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp\backend"

# Copie o arquivo de configuração
copy .env.example .env

# Abra o arquivo .env no Bloco de Notas
notepad .env
```

**Edite o arquivo .env com suas configurações:**

```env
PORT=3000
NODE_ENV=development

# Coloque sua senha do PostgreSQL aqui
DB_HOST=localhost
DB_PORT=5432
DB_NAME=canal_denuncias
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI

JWT_SECRET=minha_chave_secreta_super_segura_com_mais_de_32_caracteres
JWT_EXPIRES_IN=24h

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

CORS_ORIGIN=*
```

**Salve e feche o arquivo.**

```powershell
# Instale as dependências (já foi feito, mas pode executar novamente)
npm install

# Inicie o servidor
npm start
```

**Você verá:**
```
Servidor rodando na porta 3000
Ambiente: development
```

### 3. Abrir o Frontend

#### Opção A: Abrir Diretamente no Navegador

1. Navegue até a pasta: `C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp\frontend`
2. Clique duas vezes em **`index.html`**
3. O navegador abrirá automaticamente

#### Opção B: Usar Live Server (Recomendado)

```powershell
# Instale o live-server globalmente (apenas uma vez)
npm install -g live-server

# Navegue até a pasta frontend
cd "C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp\frontend"

# Inicie o servidor
live-server
```

O navegador abrirá automaticamente em `http://127.0.0.1:8080`

## ✅ Testar o Sistema

### 1. Testar o Backend

Abra o navegador e acesse:
```
http://localhost:3000/api/health
```

Deve retornar:
```json
{"status":"OK","timestamp":"2024-02-17T..."}
```

### 2. Testar o Frontend

1. Acesse: `http://127.0.0.1:8080` (ou abra `index.html`)
2. Clique em **"Fazer Denúncia"**
3. Preencha:
   - Código da Empresa: `1`
   - Tipo: Assédio Moral
   - Descrição: "Teste do sistema"
   - Mantenha "Denúncia Anônima" marcado
4. Clique em **"Enviar Denúncia"**
5. Anote o protocolo gerado (ex: DEN202402170001)

### 3. Consultar Protocolo

1. Volte para página inicial
2. Clique em **"Consultar"**
3. Digite o protocolo
4. Clique em **"Consultar"**
5. Veja os detalhes da denúncia

### 4. Acessar Área Administrativa

1. Clique em **"Login"**
2. Digite:
   - **Email**: `admin@empresademo.com.br`
   - **Senha**: `admin123`
3. Clique em **"Entrar"**
4. Você verá o dashboard com estatísticas

## 🔧 Comandos Úteis

### Backend

```powershell
# Iniciar servidor
npm start

# Iniciar em modo desenvolvimento (reinicia automaticamente)
npm run dev

# Executar migração do banco
npm run migrate
```

### Parar o Servidor

Pressione `Ctrl + C` no terminal onde o servidor está rodando.

## 📁 Estrutura de Pastas

```
Projeto Integrador - Univesp/
├── backend/              # Servidor Node.js
│   ├── config/          # Configurações
│   ├── controllers/     # Lógica de negócio
│   ├── middleware/      # Autenticação e logs
│   ├── routes/          # Rotas da API
│   ├── .env            # Configurações (CRIAR)
│   ├── package.json    # Dependências
│   └── server.js       # Arquivo principal
├── frontend/            # Interface web
│   ├── css/            # Estilos
│   ├── js/             # Scripts
│   └── *.html          # Páginas
├── database/            # Scripts SQL
│   └── schema.sql      # Estrutura do banco
└── docs/               # Documentação
```

## 🐛 Solução de Problemas

### Erro: "Cannot find module"
```powershell
cd backend
npm install
```

### Erro: "ECONNREFUSED" ou "Connection refused"
- Verifique se o PostgreSQL está rodando
- Verifique as credenciais no arquivo `.env`
- Teste a conexão: `psql -U postgres -d canal_denuncias`

### Erro: "Port 3000 already in use"
- Outra aplicação está usando a porta 3000
- Mude a porta no `.env`: `PORT=3001`
- Ou finalize o processo que está usando a porta

### Erro: "Token inválido" no dashboard
- Limpe o cache do navegador
- Pressione `F12` → Console → Application → Local Storage → Clear
- Faça login novamente

### Frontend não conecta com Backend
- Verifique se o backend está rodando (`npm start`)
- Verifique se a URL está correta nos arquivos JS
- Abra o Console do navegador (F12) para ver erros

## 📝 Credenciais de Teste

- **Email**: admin@empresademo.com.br
- **Senha**: admin123
- **Empresa ID**: 1

⚠️ **IMPORTANTE**: Altere essas credenciais em produção!

## 🎯 Próximos Passos

1. ✅ Criar denúncias de teste
2. ✅ Testar consulta de protocolo
3. ✅ Acessar dashboard administrativo
4. ✅ Testar filtros e estatísticas
5. ✅ Verificar logs de auditoria no banco

## 📞 Suporte

Consulte a documentação completa em:
- `docs/INSTALACAO.md` - Instalação detalhada
- `docs/API.md` - Documentação da API
- `docs/TESTES.md` - Guia de testes
- `docs/LGPD.md` - Conformidade LGPD

---

**Projeto pronto para uso! 🚀**
