# 🚀 Modo Teste (Sem PostgreSQL)

## Execute o projeto SEM instalar banco de dados!

### 1. Instalar Dependências

```powershell
cd backend
npm install
```

### 2. Iniciar Servidor de Teste

```powershell
node server-teste.js
```

Você verá:
```
===========================================
🚀 SERVIDOR DE TESTE (SEM BANCO DE DADOS)
===========================================
Servidor rodando na porta 3000
URL: http://localhost:3000
Health: http://localhost:3000/api/health

📝 Credenciais de teste:
   Email: admin@empresademo.com.br
   Senha: admin123

⚠️  ATENÇÃO: Dados em memória (serão perdidos ao reiniciar)
===========================================
```

### 3. Abrir o Frontend

Abra o arquivo no navegador:
```
C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp\frontend\index.html
```

### 4. Testar

1. **Criar Denúncia**:
   - Clique em "Fazer Denúncia"
   - Código da Empresa: `1`
   - Preencha os campos
   - Envie e anote o protocolo

2. **Consultar Protocolo**:
   - Clique em "Consultar"
   - Digite o protocolo
   - Veja os detalhes

3. **Login Administrativo**:
   - Clique em "Login"
   - Email: `admin@empresademo.com.br`
   - Senha: `admin123`
   - Acesse o dashboard

## ⚠️ Limitações do Modo Teste

- ❌ Dados são perdidos ao reiniciar o servidor
- ❌ Não há persistência
- ❌ Sem logs de auditoria
- ❌ Sem upload de arquivos
- ✅ Perfeito para testar a interface
- ✅ Todas as funcionalidades básicas funcionam

## 🔄 Voltar ao Modo Normal

Quando instalar o PostgreSQL, use:
```powershell
node server.js
```

## 📝 Comandos Úteis

```powershell
# Iniciar servidor de teste
node server-teste.js

# Parar servidor
Ctrl + C

# Testar API
curl http://localhost:3000/api/health
```

---

**Pronto! Agora você pode testar o projeto sem instalar PostgreSQL! 🎉**
