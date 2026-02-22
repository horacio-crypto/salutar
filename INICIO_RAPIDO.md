# Guia Rápido - Windows

## Opção 1: Usando pgAdmin (Recomendado)

1. Abra o **pgAdmin**
2. Conecte-se ao servidor PostgreSQL
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `canal_denuncias`
5. Clique em "Save"
6. Clique com botão direito no banco criado → "Query Tool"
7. Abra o arquivo `database/schema.sql`
8. Execute (F5)

## Opção 2: Usando psql no Terminal

```bash
# Abra o PowerShell e navegue até a pasta database
cd "C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp\database"

# Execute o script de setup
.\setup.bat
```

## Opção 3: Comandos Manuais

```bash
# Criar banco
psql -U postgres -c "CREATE DATABASE canal_denuncias;"

# Executar schema
psql -U postgres -d canal_denuncias -f schema.sql
```

## Configurar Backend

1. Copie o arquivo de exemplo:
```bash
cd ..\backend
copy .env.example .env
```

2. Edite `.env` com suas credenciais do PostgreSQL

3. Instale dependências (já feito):
```bash
npm install
```

4. Inicie o servidor:
```bash
npm start
```

## Testar

1. Backend: http://localhost:3000/api/health
2. Frontend: Abra `frontend/index.html` no navegador

## Credenciais de Teste

- Email: admin@empresademo.com.br
- Senha: admin123
- Empresa ID: 1
