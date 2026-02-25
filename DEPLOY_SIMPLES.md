# Deploy Simples no Vercel

## ✅ Projeto Adaptado!

O projeto agora funciona 100% no Vercel:
- ✅ Frontend estático
- ✅ API serverless (sem PostgreSQL)
- ✅ Dados em memória (para testes)

## 🚀 Passo a Passo

### 1. Commitar as Mudanças

```powershell
cd "C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp"

git add .
git commit -m "Adapta projeto para Vercel com API serverless"
git push
```

### 2. Deploy no Vercel

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New..."** → **"Project"**
4. Selecione o repositório: `horacio-crypto/salutar`
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (deixe vazio ou raiz)
   - **Build Command**: (deixe vazio)
   - **Output Directory**: `frontend`
6. Clique em **"Deploy"**

### 3. Aguardar Deploy

O Vercel vai:
- Instalar dependências
- Configurar a API serverless
- Publicar o frontend
- Gerar uma URL (ex: `salutar.vercel.app`)

### 4. Testar

Acesse a URL gerada e teste:
- ✅ Criar denúncia
- ✅ Consultar protocolo
- ✅ Login: `admin@empresademo.com.br` / `admin123`
- ✅ Dashboard

## ⚠️ Limitações (Modo Teste)

- ❌ Dados são perdidos quando a função serverless reinicia
- ❌ Não há persistência real
- ✅ Perfeito para demonstração e testes
- ✅ Funciona 100% no Vercel gratuitamente

## 🔄 Testar Localmente Antes

```powershell
# Instalar dependências
npm install

# Testar backend
node backend/server-teste.js

# Abrir frontend
# Abra frontend/index.html no navegador
```

## 📝 Credenciais

- **Email**: admin@empresademo.com.br
- **Senha**: admin123
- **Empresa ID**: 1

## 🎯 Próximos Passos (Opcional)

Para ter persistência real de dados:
1. Use Vercel KV (Redis) - pago
2. Use Supabase (PostgreSQL gratuito)
3. Use MongoDB Atlas (gratuito)

Mas para demonstração, o modo atual funciona perfeitamente! 🚀

## ❓ Problemas?

### Deploy falhou
- Verifique se commitou todos os arquivos
- Veja os logs no painel do Vercel

### API não funciona
- Verifique se a pasta `api/` está no repositório
- Verifique se `package.json` está na raiz

### Frontend não carrega
- Configure Output Directory como `frontend`
- Verifique se os arquivos HTML estão na pasta frontend

---

**Pronto! Seu projeto está no ar! 🎉**

URL: https://seu-projeto.vercel.app
