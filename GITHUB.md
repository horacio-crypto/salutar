# Guia: Configurar Git e Enviar para GitHub

## 📋 Pré-requisitos

1. **Instalar o Git**
   - Download: https://git-scm.com/download/win
   - Execute o instalador (deixe as opções padrão)
   - Verifique: `git --version`

2. **Criar conta no GitHub**
   - Acesse: https://github.com
   - Clique em "Sign up"
   - Crie sua conta gratuita

## 🔧 Passo 1: Configurar seu Usuário Git

Abra o PowerShell e execute:

```powershell
# Configure seu nome (use seu nome real ou apelido)
git config --global user.name "Seu Nome Aqui"

# Configure seu email (use o mesmo email do GitHub)
git config --global user.email "seuemail@exemplo.com"

# Verificar configuração
git config --global --list
```

**Exemplo:**
```powershell
git config --global user.name "Niwan Silva"
git config --global user.email "niwan@exemplo.com"
```

## 📦 Passo 2: Inicializar o Repositório Local

```powershell
# Navegue até a pasta do projeto
cd "C:\Users\niw-s\Documents\Niwan - Programação\Projeto Integrador - Univesp"

# Inicialize o repositório Git
git init

# Adicione todos os arquivos
git add .

# Faça o primeiro commit
git commit -m "Projeto inicial: Plataforma de Canal de Denúncias CIPA"
```

## 🌐 Passo 3: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `canal-denuncias-cipa`
   - **Description**: `Plataforma web para gestão de denúncias trabalhistas - Projeto Integrador Univesp`
   - **Visibilidade**: 
     - ✅ Public (se quiser compartilhar)
     - ✅ Private (se quiser manter privado)
3. **NÃO marque** "Add a README file"
4. Clique em **"Create repository"**

## 🚀 Passo 4: Conectar e Enviar para o GitHub

Após criar o repositório, o GitHub mostrará comandos. Use estes:

```powershell
# Adicione o repositório remoto (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/canal-denuncias-cipa.git

# Renomeie a branch para main (padrão do GitHub)
git branch -M main

# Envie os arquivos para o GitHub
git push -u origin main
```

**Exemplo:**
```powershell
git remote add origin https://github.com/niwansilva/canal-denuncias-cipa.git
git branch -M main
git push -u origin main
```

### 🔐 Autenticação

O GitHub pedirá autenticação. Você tem 2 opções:

#### Opção A: Personal Access Token (Recomendado)

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Dê um nome: `Git Local`
4. Marque: `repo` (acesso completo aos repositórios)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (você não verá novamente!)
7. Quando o Git pedir senha, cole o token

#### Opção B: GitHub CLI

```powershell
# Instale o GitHub CLI
winget install GitHub.cli

# Faça login
gh auth login

# Siga as instruções na tela
```

## ✅ Verificar se Funcionou

Acesse seu repositório no GitHub:
```
https://github.com/SEU_USUARIO/canal-denuncias-cipa
```

Você deve ver todos os arquivos do projeto!

## 🔄 Comandos Úteis para o Dia a Dia

### Fazer alterações e enviar

```powershell
# Ver arquivos modificados
git status

# Adicionar arquivos modificados
git add .

# Fazer commit com mensagem
git commit -m "Descrição das alterações"

# Enviar para o GitHub
git push
```

### Baixar alterações do GitHub

```powershell
git pull
```

### Ver histórico de commits

```powershell
git log --oneline
```

## 📝 Exemplo de Fluxo Completo

```powershell
# 1. Fazer alterações nos arquivos
# 2. Ver o que mudou
git status

# 3. Adicionar as mudanças
git add .

# 4. Fazer commit
git commit -m "Adiciona funcionalidade X"

# 5. Enviar para GitHub
git push
```

## 🎯 Mensagens de Commit Recomendadas

Use mensagens claras:

```powershell
git commit -m "Adiciona autenticação JWT"
git commit -m "Corrige bug no formulário de denúncia"
git commit -m "Atualiza documentação da API"
git commit -m "Implementa dashboard administrativo"
git commit -m "Melhora segurança com rate limiting"
```

## 🔒 Arquivos que NÃO devem ir para o GitHub

O arquivo `.gitignore` já está configurado para ignorar:

- ❌ `node_modules/` (dependências)
- ❌ `.env` (senhas e configurações)
- ❌ `uploads/` (arquivos enviados)
- ✅ `.env.example` (exemplo sem senhas) - PODE enviar

## 📊 Adicionar README Bonito

O projeto já tem um `README.md` completo! Ele aparecerá automaticamente na página do GitHub.

## 🌟 Dicas Extras

### Adicionar Badge no README

Edite o `README.md` e adicione no topo:

```markdown
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
```

### Criar Releases

Quando terminar uma versão:

1. No GitHub, vá em "Releases"
2. Clique em "Create a new release"
3. Tag: `v1.0.0`
4. Title: `Versão 1.0 - Lançamento Inicial`
5. Descrição: Liste as funcionalidades
6. Clique em "Publish release"

## ❓ Problemas Comuns

### "git não é reconhecido"
- Reinicie o PowerShell após instalar o Git
- Ou adicione ao PATH: `C:\Program Files\Git\bin`

### "Permission denied"
- Use Personal Access Token em vez de senha
- Ou configure SSH keys

### "Conflito ao fazer push"
```powershell
git pull --rebase
git push
```

### Desfazer último commit (antes do push)
```powershell
git reset --soft HEAD~1
```

## 📞 Comandos de Emergência

### Desfazer todas as alterações locais
```powershell
git reset --hard HEAD
```

### Ver diferenças antes de commitar
```powershell
git diff
```

### Remover arquivo do Git (mas manter local)
```powershell
git rm --cached arquivo.txt
```

## 🎓 Resumo Rápido

```powershell
# 1. Configurar usuário (uma vez)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# 2. Inicializar projeto (uma vez)
cd "caminho/do/projeto"
git init
git add .
git commit -m "Primeiro commit"

# 3. Conectar ao GitHub (uma vez)
git remote add origin https://github.com/SEU_USUARIO/REPO.git
git branch -M main
git push -u origin main

# 4. Dia a dia
git add .
git commit -m "Mensagem"
git push
```

---

**Pronto! Seu projeto estará no GitHub! 🎉**

Qualquer dúvida, consulte: https://docs.github.com/pt
