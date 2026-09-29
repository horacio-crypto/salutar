# Guia: Deploy no Vercel

## ⚠️ IMPORTANTE: Limitações do Vercel

O Vercel é otimizado para **frontend e APIs serverless**, mas tem limitações:

- ❌ **Não suporta PostgreSQL diretamente** (banco de dados)
- ❌ Funções serverless têm timeout de 10s (plano gratuito)
- ✅ Perfeito para hospedar o **frontend**
- ✅ Backend precisa de banco de dados externo

## 🎯 Opções de Deploy

### Opção 1: Frontend no Vercel + Backend em outro lugar (RECOMENDADO)

**Frontend no Vercel** (gratuito)
**Backend no Render/Railway** (gratuito com PostgreSQL)

### Opção 2: Tudo no Render ou Railway (MAIS FÁCIL)

Plataformas que suportam Node.js + PostgreSQL gratuitamente.

---

## 🚀 Opção 1: Deploy do Frontend no Vercel

### Passo 1: Preparar o Projeto

```powershell
cd "C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp"

# Commitar o arquivo vercel.json
git add vercel.json
git commit -m "Adiciona configuração do Vercel"
git push
```

### Passo 2: Deploy no Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign Up"** ou **"Login"**
3. Escolha **"Continue with GitHub"**
4. Autorize o Vercel a acessar seus repositórios
5. Clique em **"Import Project"**
6. Selecione o repositório: `horacio-crypto/salutar`
7. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (deixe vazio)
   - **Output Directory**: `frontend`
8. Clique em **"Deploy"**

### Passo 3: Configurar Variáveis de Ambiente

No painel do Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - `API_URL`: URL do seu backend (quando hospedar)

---

## 🚀 Opção 2: Deploy Completo no Render (RECOMENDADO)

### Por que Render?
- ✅ Suporta Node.js + PostgreSQL
- ✅ Plano gratuito generoso
- ✅ Deploy automático do GitHub
- ✅ Banco de dados PostgreSQL gratuito

### Passo 1: Criar conta no Render

1. Acesse: https://render.com
2. Clique em **"Get Started"**
3. Escolha **"Sign up with GitHub"**
4. Autorize o Render

### Passo 2: Criar Banco de Dados PostgreSQL

1. No dashboard, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `canal-denuncias-db`
   - **Database**: `canal_denuncias`
   - **User**: (gerado automaticamente)
   - **Region**: escolha o mais próximo
   - **Plan**: **Free**
3. Clique em **"Create Database"**
4. **Copie a "Internal Database URL"** (você vai precisar)

### Passo 3: Deploy do Backend

1. Clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório: `horacio-crypto/salutar`
3. Configure:
   - **Name**: `canal-denuncias-api`
   - **Region**: mesmo do banco
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: **Free**

4. **Environment Variables** (clique em "Advanced"):
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=(copie do Internal Database URL)
   DB_PORT=5432
   DB_NAME=canal_denuncias
   DB_USER=(copie do banco)
   DB_PASSWORD=(copie do banco)
   JWT_SECRET=sua_chave_secreta_super_segura_minimo_32_caracteres
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=*
   ```

5. Clique em **"Create Web Service"**

### Passo 4: Executar Migração do Banco

Após o deploy:
1. No painel do serviço, vá em **"Shell"**
2. Execute:
   ```bash
   npm run migrate
   ```

### Passo 5: Deploy do Frontend no Vercel

1. Acesse: https://vercel.com
2. Importe o repositório
3. Configure:
   - **Root Directory**: `frontend`
4. **Environment Variables**:
   ```
   API_URL=https://canal-denuncias-api.onrender.com
   ```
5. Deploy!

---

## 🚀 Opção 3: Tudo no Railway (ALTERNATIVA)

### Vantagens
- ✅ Mais rápido que Render
- ✅ PostgreSQL incluído
- ✅ $5 de crédito gratuito/mês

### Deploy

1. Acesse: https://railway.app
2. Login com GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Selecione seu repositório
5. Railway detecta automaticamente Node.js
6. Adicione PostgreSQL: **"New"** → **"Database"** → **"PostgreSQL"**
7. Configure variáveis de ambiente (Railway copia automaticamente do banco)
8. Deploy!

---

## 📝 Atualizar URLs no Frontend

Após hospedar o backend, atualize os arquivos JS:

```javascript
// frontend/js/denuncia.js
// frontend/js/consulta.js
// frontend/js/login.js
// frontend/js/dashboard.js

const API_URL = 'https://SEU-BACKEND.onrender.com/api';
```

Commit e push:
```powershell
git add .
git commit -m "Atualiza URL da API para produção"
git push
```

---

## ✅ Checklist de Deploy

- [ ] Código no GitHub
- [ ] Banco de dados PostgreSQL criado
- [ ] Backend deployado
- [ ] Migração do banco executada
- [ ] Frontend deployado
- [ ] URLs atualizadas
- [ ] Variáveis de ambiente configuradas
- [ ] Teste de login funcionando
- [ ] Teste de criação de denúncia funcionando

---

## 🎯 Recomendação Final

**Para este projeto, use:**

1. **Backend + Banco**: Render (gratuito, suporta PostgreSQL)
2. **Frontend**: Vercel (gratuito, super rápido)

**Ou tudo no Render** (mais simples, tudo em um lugar)

---

## 📞 Links Úteis

- Render: https://render.com
- Railway: https://railway.app
- Vercel: https://vercel.com
- Documentação Render: https://render.com/docs
- Documentação Vercel: https://vercel.com/docs

---

## ❓ Problemas Comuns

### "Cannot connect to database"
- Verifique as variáveis de ambiente
- Use a "Internal Database URL" do Render

### "CORS error"
- Configure `CORS_ORIGIN=*` no backend
- Ou adicione a URL específica do frontend

### "502 Bad Gateway"
- Aguarde alguns minutos (primeiro deploy demora)
- Verifique os logs no painel

### Frontend não conecta ao backend
- Verifique se atualizou a `API_URL` nos arquivos JS
- Verifique se o backend está rodando

---

**Escolha a opção que preferir e siga o passo a passo! 🚀**
