# Como Instalar o PostgreSQL no Windows

## 📥 Download

1. Acesse: https://www.postgresql.org/download/windows/
2. Clique em **"Download the installer"**
3. Escolha a versão mais recente (ex: PostgreSQL 16)
4. Baixe o instalador para Windows x86-64

**Link direto**: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

## 🔧 Instalação

1. **Execute o instalador** baixado (postgresql-16-windows-x64.exe)

2. **Clique em "Next"** nas telas iniciais

3. **Escolha os componentes** (deixe todos marcados):
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (interface gráfica)
   - ✅ Stack Builder
   - ✅ Command Line Tools

4. **Escolha a pasta de instalação** (pode deixar o padrão)

5. **IMPORTANTE - Defina a senha do superusuário (postgres)**:
   - Digite uma senha que você vai lembrar
   - **Anote essa senha!** Você vai precisar dela
   - Exemplo: `postgres123` ou `admin123`
   - Confirme a senha

6. **Porta** (deixe o padrão): `5432`

7. **Locale** (deixe o padrão): `Portuguese, Brazil`

8. **Clique em "Next"** e depois **"Install"**

9. Aguarde a instalação (pode demorar alguns minutos)

10. **Desmarque** "Stack Builder" no final e clique em "Finish"

## 🔑 Suas Credenciais

Após a instalação, suas credenciais serão:

- **Usuário**: `postgres` (padrão, não muda)
- **Senha**: A que você definiu durante a instalação
- **Host**: `localhost`
- **Porta**: `5432`

## ✅ Testar a Instalação

### Opção 1: pgAdmin (Interface Gráfica)

1. Abra o **pgAdmin 4** (procure no menu Iniciar)
2. Ele pedirá para criar uma senha mestra (pode ser a mesma)
3. No painel esquerdo, clique em **"Servers"** → **"PostgreSQL 16"**
4. Digite a senha que você criou
5. Se conectar, está funcionando! ✅

### Opção 2: Terminal (psql)

```powershell
# Abra o PowerShell e digite:
psql -U postgres

# Digite a senha quando solicitado
# Se aparecer "postgres=#", está funcionando!

# Para sair:
\q
```

## 🔄 Esqueceu a Senha?

Se você esqueceu a senha do postgres:

1. Abra o arquivo: `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
2. Procure a linha: `host all all 127.0.0.1/32 scram-sha-256`
3. Mude para: `host all all 127.0.0.1/32 trust`
4. Salve o arquivo
5. Reinicie o PostgreSQL:
   - Abra "Serviços" do Windows (Win + R → `services.msc`)
   - Procure "postgresql-x64-16"
   - Clique com botão direito → "Reiniciar"
6. Conecte sem senha: `psql -U postgres`
7. Mude a senha:
   ```sql
   ALTER USER postgres PASSWORD 'nova_senha_aqui';
   ```
8. Reverta o arquivo `pg_hba.conf` (volte para `scram-sha-256`)
9. Reinicie o serviço novamente

## 📝 Configurar o Projeto

Depois de instalar o PostgreSQL, edite o arquivo `.env` do projeto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=canal_denuncias
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_AQUI  # Coloque a senha que você criou
```

## 🎯 Próximo Passo

Agora você pode criar o banco de dados do projeto:

### Usando pgAdmin:
1. Abra o pgAdmin
2. Conecte ao servidor
3. Botão direito em "Databases" → "Create" → "Database"
4. Nome: `canal_denuncias`
5. Save
6. Botão direito no banco → "Query Tool"
7. Abra o arquivo `database/schema.sql`
8. Execute (F5)

### Usando Terminal:
```powershell
cd "C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp\database"
psql -U postgres -c "CREATE DATABASE canal_denuncias;"
psql -U postgres -d canal_denuncias -f schema.sql
```

## ❓ Problemas Comuns

### "psql não é reconhecido como comando"
- Adicione ao PATH: `C:\Program Files\PostgreSQL\16\bin`
- Ou use o "SQL Shell (psql)" do menu Iniciar

### "Conexão recusada"
- Verifique se o serviço está rodando:
  - Win + R → `services.msc`
  - Procure "postgresql-x64-16"
  - Status deve ser "Em execução"

### "Senha incorreta"
- Verifique se está usando a senha correta
- Tente resetar a senha (veja seção "Esqueceu a Senha?")

---

**Resumo**: 
1. Baixe em https://www.postgresql.org/download/windows/
2. Instale e **anote a senha** que você criar
3. Usuário sempre será: `postgres`
4. Use essa senha no arquivo `.env` do projeto
