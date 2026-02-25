# Deploy no Netlify (MAIS SIMPLES)

## 🚀 Passo a Passo

### 1. Commit e Push

```powershell
git add .
git commit -m "Configura para Netlify"
git push
```

### 2. Deploy no Netlify

1. Acesse: https://app.netlify.com
2. Clique em **"Sign up"** ou **"Log in"**
3. Escolha **"GitHub"**
4. Clique em **"Add new site"** → **"Import an existing project"**
5. Escolha **"Deploy with GitHub"**
6. Selecione o repositório: `horacio-crypto/salutar`
7. Configure:
   - **Branch**: `main`
   - **Build command**: (deixe vazio)
   - **Publish directory**: `frontend`
8. Clique em **"Deploy site"**

### 3. Aguardar

O Netlify vai gerar uma URL tipo: `seu-site-123.netlify.app`

### 4. Testar

Acesse a URL e teste tudo!

**Credenciais**: `admin@empresademo.com.br` / `admin123`

---

## ⚠️ Se não funcionar

Delete o projeto no Vercel e use o Netlify. É mais simples e confiável para este tipo de projeto!

---

**Pronto! 🎉**
