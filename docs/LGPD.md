# Conformidade com LGPD

## Princípios Aplicados

### 1. Finalidade
- Dados coletados exclusivamente para gestão de denúncias trabalhistas
- Propósito específico e legítimo

### 2. Adequação
- Tratamento compatível com as finalidades informadas
- Alinhado com expectativas do titular

### 3. Necessidade
- Coleta limitada ao mínimo necessário
- Opção de denúncia anônima disponível

### 4. Transparência
- Informações claras sobre coleta e uso de dados
- Acesso garantido ao titular

### 5. Segurança
- Criptografia de senhas (bcrypt)
- Autenticação JWT
- HTTPS obrigatório em produção
- Logs de auditoria

### 6. Prevenção
- Medidas técnicas para evitar danos
- Backup regular dos dados

### 7. Não Discriminação
- Tratamento não abusivo ou discriminatório
- Igualdade de acesso

## Bases Legais

O tratamento de dados pessoais nesta plataforma se fundamenta em:

1. **Cumprimento de obrigação legal** (Art. 7º, II da LGPD)
   - NR-5: Obrigações da CIPA
   - NR-1: Gestão de riscos ocupacionais

2. **Exercício regular de direitos** (Art. 7º, VI da LGPD)
   - Proteção do trabalhador
   - Prevenção de riscos

3. **Proteção da vida** (Art. 7º, VII da LGPD)
   - Situações de risco à saúde e segurança

## Dados Coletados

### Dados Obrigatórios (Denúncia Anônima)
- Tipo de denúncia
- Descrição da ocorrência
- Data da ocorrência (opcional)
- Setor envolvido (opcional)

### Dados Opcionais (Denúncia Identificada)
- Nome completo
- Email
- Telefone

### Dados Administrativos
- Nome do usuário
- Email corporativo
- Perfil de acesso
- Empresa vinculada

## Direitos dos Titulares

### Confirmação e Acesso
- Consulta de denúncia por protocolo
- Acesso ao status da ocorrência

### Correção
- Possibilidade de adicionar informações via tratativas

### Anonimização/Bloqueio/Eliminação
- Dados podem ser anonimizados após conclusão
- Retenção conforme legislação trabalhista

### Portabilidade
- Exportação de dados mediante solicitação

### Informação sobre Compartilhamento
- Dados não são compartilhados com terceiros
- Acesso restrito a CIPA, RH e gestores autorizados

## Medidas de Segurança Implementadas

### Técnicas
- Criptografia de senhas (bcrypt com salt)
- Tokens JWT com expiração
- HTTPS (obrigatório em produção)
- Rate limiting (proteção contra ataques)
- Validação de entrada de dados
- Prepared statements (proteção SQL injection)
- Helmet.js (headers de segurança)

### Organizacionais
- Controle de acesso por perfil
- Logs de auditoria completos
- Segregação de dados por empresa
- Política de senhas fortes
- Treinamento de usuários

### Banco de Dados
- Isolamento multiempresa
- Backup automático
- Índices para performance
- Triggers para auditoria

## Retenção de Dados

### Denúncias
- Mantidas enquanto houver necessidade legal/regulatória
- Mínimo: 5 anos (conforme legislação trabalhista)
- Após período: anonimização ou exclusão

### Logs de Auditoria
- Mantidos por 6 meses a 1 ano
- Essenciais para investigações

### Dados de Usuários
- Mantidos enquanto vínculo ativo
- Exclusão mediante solicitação (respeitando obrigações legais)

## Incidentes de Segurança

### Procedimentos
1. Identificação e contenção
2. Avaliação de impacto
3. Notificação à ANPD (se aplicável)
4. Comunicação aos titulares afetados
5. Medidas corretivas
6. Documentação do incidente

### Prazo de Notificação
- ANPD: prazo razoável (geralmente 72h)
- Titulares: imediatamente se houver risco

## Encarregado de Dados (DPO)

Cada empresa deve designar um encarregado responsável por:
- Aceitar reclamações
- Prestar esclarecimentos
- Orientar funcionários
- Interagir com a ANPD

## Transferência Internacional

- Sistema projetado para operação nacional
- Caso necessário: adequação aos requisitos do Art. 33 da LGPD

## Auditoria e Compliance

### Registros Mantidos
- Todas as operações de tratamento
- Finalidade e base legal
- Medidas de segurança
- Incidentes ocorridos

### Relatórios
- Dashboard com estatísticas anonimizadas
- Relatórios de impacto à proteção de dados (RIPD)

## Responsabilidades

### Controlador (Empresa)
- Define finalidades e meios de tratamento
- Garante conformidade com LGPD
- Responde perante titulares e ANPD

### Operador (Sistema)
- Realiza tratamento conforme instruções
- Implementa medidas de segurança
- Auxilia o controlador

## Consentimento

Para denúncias identificadas:
- Consentimento livre e informado
- Finalidade específica
- Possibilidade de revogação

## Anonimização

Técnicas aplicadas:
- Remoção de identificadores diretos
- Generalização de dados
- Supressão de detalhes específicos

## Checklist de Conformidade

- [x] Mapeamento de dados pessoais
- [x] Identificação de bases legais
- [x] Implementação de medidas de segurança
- [x] Controle de acesso
- [x] Logs de auditoria
- [x] Política de retenção
- [x] Procedimentos para direitos dos titulares
- [x] Plano de resposta a incidentes
- [x] Documentação técnica
- [ ] Designação de encarregado (DPO)
- [ ] Treinamento de usuários
- [ ] Avaliação de impacto (RIPD)
- [ ] Termos de uso e política de privacidade

## Referências Legais

- Lei nº 13.709/2018 (LGPD)
- NR-5 (CIPA)
- NR-1 (Gestão de Riscos)
- CLT (Consolidação das Leis do Trabalho)
- Portaria MTP nº 4.219/2022
