# Plataforma de Canal de Denúncias - CIPA

Sistema web multiempresa para gestão de denúncias anônimas relacionadas a assédio moral, saúde do trabalhador e segurança no trabalho.

## Tecnologias

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: HTML5 + CSS3 + JavaScript
- **Segurança**: JWT, bcrypt, HTTPS
- **Conformidade**: LGPD

## Estrutura do Projeto

```
├── backend/          # API REST
├── frontend/         # Interface web
├── database/         # Scripts SQL
└── docs/            # Documentação
```

## Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run migrate
npm start
```

### Frontend
Abra `frontend/index.html` em um navegador ou use um servidor web.

## Funcionalidades

### Trabalhadores
- Registro de denúncias anônimas/identificadas
- Acompanhamento por protocolo
- Upload de evidências
- Consulta de status

### Administradores (CIPA/RH)
- Painel administrativo
- Gestão de denúncias
- Relatórios e indicadores
- Controle de usuários

## Segurança e LGPD

- Autenticação JWT
- Criptografia de senhas (bcrypt)
- Anonimização de dados
- Logs de auditoria
- Segregação multiempresa
- Coleta mínima de dados

## Licença

Projeto Integrador - Univesp
