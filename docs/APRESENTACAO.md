# Apresentação do Projeto

## Plataforma Web de Canal de Denúncias Anônimas para CIPA

### Projeto Integrador - Univesp

---

## 📋 Visão Geral

Sistema web multiempresa para gestão de denúncias relacionadas a:
- Assédio moral e sexual
- Discriminação
- Condições inseguras de trabalho
- Riscos à saúde física e mental
- Violações às normas de segurança

---

## 🎯 Objetivos

### Objetivo Geral
Desenvolver um sistema web seguro, multiempresa e escalável que funcione como canal oficial de denúncias e gestão de ocorrências trabalhistas.

### Objetivos Específicos
- ✅ Permitir registro de denúncias anônimas ou identificadas
- ✅ Garantir confidencialidade e proteção dos dados
- ✅ Organizar fluxo de análise das ocorrências
- ✅ Registrar histórico e evidências
- ✅ Gerar relatórios e indicadores
- ✅ Atender múltiplas empresas (SaaS)
- ✅ Implementar boas práticas de segurança e LGPD

---

## ⚖️ Fundamentação Legal

### Normas Regulamentadoras
- **NR-5**: Responsabilidades da CIPA
- **NR-1**: Gestão de riscos ocupacionais e saúde mental

### Legislação
- **LGPD** (Lei nº 13.709/2018): Proteção de dados pessoais
- **CLT**: Direitos trabalhistas

---

## 🏗️ Arquitetura Técnica

### Backend
- **Node.js** + Express
- **PostgreSQL** (banco relacional)
- **JWT** (autenticação)
- **bcrypt** (criptografia)

### Frontend
- **HTML5** + CSS3 + JavaScript
- Interface responsiva
- Design acessível

### Segurança
- HTTPS obrigatório
- Rate limiting
- Logs de auditoria
- Validação de entrada

---

## 💾 Modelo de Dados

### Principais Entidades
1. **Empresas**: Cadastro multiempresa
2. **Usuários**: Admin, CIPA, RH, Gestores
3. **Denúncias**: Registro de ocorrências
4. **Tratativas**: Histórico de ações
5. **Anexos**: Evidências
6. **Logs**: Auditoria completa

### Relacionamentos
- Segregação por empresa
- Rastreabilidade total
- Integridade referencial

---

## 🔐 Conformidade LGPD

### Princípios Aplicados
- ✅ Finalidade específica
- ✅ Necessidade (coleta mínima)
- ✅ Transparência
- ✅ Segurança técnica
- ✅ Prevenção de danos
- ✅ Não discriminação

### Bases Legais
- Cumprimento de obrigação legal (NR-5, NR-1)
- Exercício regular de direitos
- Proteção da vida

### Direitos dos Titulares
- Confirmação e acesso
- Correção de dados
- Anonimização/bloqueio
- Portabilidade
- Informação sobre compartilhamento

---

## 👥 Funcionalidades por Perfil

### Trabalhadores
- ✅ Registro de denúncias (anônimas ou identificadas)
- ✅ Geração de protocolo
- ✅ Upload de evidências
- ✅ Consulta de status

### CIPA/RH/Gestores
- ✅ Painel administrativo
- ✅ Gestão de denúncias por status
- ✅ Histórico de tratativas
- ✅ Relatórios estatísticos
- ✅ Controle de usuários

---

## 📊 Dashboard Administrativo

### Indicadores
- Total de denúncias
- Denúncias abertas
- Em análise/investigação
- Concluídas

### Filtros
- Por status
- Por tipo
- Por período
- Por setor

### Ações
- Atualizar status
- Adicionar tratativas
- Visualizar histórico
- Exportar relatórios

---

## 🔒 Medidas de Segurança

### Técnicas
- Criptografia de senhas (bcrypt)
- Tokens JWT com expiração
- HTTPS (SSL/TLS)
- Prepared statements (anti SQL injection)
- Helmet.js (headers de segurança)
- Rate limiting (anti DDoS)

### Organizacionais
- Controle de acesso por perfil
- Logs de auditoria completos
- Segregação multiempresa
- Política de senhas fortes
- Backup automático

---

## 📈 Resultados Alcançados

### Técnicos
- ✅ Sistema funcional completo
- ✅ API REST documentada
- ✅ Interface responsiva
- ✅ Banco de dados normalizado
- ✅ Segurança implementada

### Acadêmicos
- ✅ Aplicação de Banco de Dados
- ✅ Desenvolvimento Web
- ✅ Segurança da Informação
- ✅ Engenharia de Software
- ✅ Conformidade Legal (LGPD)

### Sociais
- ✅ Ferramenta de proteção ao trabalhador
- ✅ Promoção de ambiente saudável
- ✅ Transparência organizacional
- ✅ Cumprimento de legislação

---

## 🚀 Diferenciais

1. **Multiempresa (SaaS)**: Atende várias organizações
2. **Anonimato Garantido**: Opção de denúncia anônima
3. **Conformidade LGPD**: Desde o design
4. **Rastreabilidade**: Logs completos de auditoria
5. **Escalabilidade**: Arquitetura preparada para crescimento
6. **Acessibilidade**: Interface simples e intuitiva

---

## 📦 Estrutura de Entrega

```
projeto/
├── backend/          # API REST
├── frontend/         # Interface web
├── database/         # Scripts SQL
├── docs/            # Documentação completa
│   ├── API.md
│   ├── INSTALACAO.md
│   ├── LGPD.md
│   ├── DIAGRAMA_ER.md
│   └── TESTES.md
└── README.md        # Visão geral
```

---

## 🔄 Fluxo de Uso

### 1. Trabalhador
Acessa site → Preenche denúncia → Recebe protocolo → Acompanha status

### 2. CIPA/RH
Recebe notificação → Analisa denúncia → Investiga → Toma ações → Registra tratativas → Conclui

### 3. Gestão
Visualiza dashboard → Analisa indicadores → Toma decisões estratégicas

---

## 📊 Métricas de Sucesso

### Técnicas
- Tempo de resposta < 2s
- Disponibilidade > 99%
- Zero vulnerabilidades críticas
- 100% de cobertura LGPD

### Negócio
- Redução de tempo de resposta a denúncias
- Aumento de transparência
- Melhoria do clima organizacional
- Conformidade legal garantida

---

## 🌟 Potencial de Mercado

### Público-Alvo
- Empresas de médio e grande porte
- Organizações sem sistema de ouvidoria
- Empresas buscando conformidade NR-5/NR-1

### Modelo de Negócio
- SaaS (Software as a Service)
- Assinatura mensal por empresa
- Escalável e sustentável

---

## 🔮 Próximos Passos

### Melhorias Futuras
- [ ] Aplicativo mobile
- [ ] Notificações por email/SMS
- [ ] Integração com sistemas de RH
- [ ] Análise de sentimento (IA)
- [ ] Relatórios avançados (BI)
- [ ] Múltiplos idiomas

### Expansão
- [ ] Certificação ISO 27001
- [ ] Auditoria externa de segurança
- [ ] Marketplace de integrações
- [ ] Consultoria em compliance

---

## 👨‍💻 Tecnologias Utilizadas

### Backend
- Node.js 18+
- Express 4.18
- PostgreSQL 12+
- JWT, bcrypt, helmet

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Design responsivo
- Acessibilidade WCAG

### DevOps
- Git (controle de versão)
- npm (gerenciamento de pacotes)
- Documentação completa

---

## 📚 Aprendizados

### Técnicos
- Arquitetura de APIs REST
- Modelagem de banco de dados
- Segurança da informação
- Autenticação e autorização
- Frontend responsivo

### Conceituais
- LGPD na prática
- Normas regulamentadoras
- Gestão de riscos
- Compliance organizacional
- Ética profissional

---

## 🎓 Conclusão

O projeto demonstra a aplicação prática dos conhecimentos adquiridos nas disciplinas de:
- **Banco de Dados**: Modelagem, normalização, SQL
- **Internet e Web**: HTML, CSS, JavaScript, APIs
- **Segurança**: Criptografia, autenticação, LGPD
- **Engenharia de Software**: Arquitetura, documentação, testes

Além do valor acadêmico, a solução possui **relevância social** ao contribuir para ambientes de trabalho mais seguros e saudáveis.

---

## 📞 Contato

**Projeto Integrador - Univesp**

Desenvolvido como trabalho de conclusão do curso de Tecnologia da Informação.

---

## 🙏 Agradecimentos

- Orientadores e professores da Univesp
- Comunidade open source
- Legislação brasileira de proteção ao trabalhador
- Todos que contribuíram para este projeto

---

**Obrigado!**

*"Tecnologia a serviço da dignidade humana no trabalho"*
