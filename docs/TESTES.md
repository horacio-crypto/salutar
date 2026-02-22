# Guia de Testes

## Testes Manuais

### 1. Teste de Denúncia Anônima

**Objetivo**: Verificar se é possível criar uma denúncia anônima

**Passos**:
1. Acesse `http://localhost:8080/denuncia.html`
2. Preencha os campos:
   - Código da Empresa: 1
   - Tipo: Assédio Moral
   - Descrição: "Teste de denúncia anônima"
   - Mantenha "Denúncia Anônima" marcado
3. Clique em "Enviar Denúncia"

**Resultado Esperado**:
- Mensagem de sucesso
- Protocolo gerado (ex: DEN202402170001)
- Campos do formulário limpos

### 2. Teste de Denúncia Identificada

**Objetivo**: Verificar se é possível criar uma denúncia identificada

**Passos**:
1. Acesse `http://localhost:8080/denuncia.html`
2. Desmarque "Denúncia Anônima"
3. Preencha todos os campos incluindo dados pessoais
4. Clique em "Enviar Denúncia"

**Resultado Esperado**:
- Denúncia criada com dados do denunciante
- Protocolo gerado

### 3. Teste de Consulta de Protocolo

**Objetivo**: Verificar consulta pública de denúncia

**Passos**:
1. Acesse `http://localhost:8080/consulta.html`
2. Digite o protocolo obtido no teste anterior
3. Clique em "Consultar"

**Resultado Esperado**:
- Informações da denúncia exibidas
- Status atual visível
- Dados sensíveis não expostos

### 4. Teste de Login

**Objetivo**: Verificar autenticação de usuários

**Passos**:
1. Acesse `http://localhost:8080/login.html`
2. Digite:
   - Email: admin@empresademo.com.br
   - Senha: admin123
3. Clique em "Entrar"

**Resultado Esperado**:
- Redirecionamento para dashboard
- Token armazenado no localStorage
- Nome do usuário exibido

### 5. Teste de Dashboard

**Objetivo**: Verificar painel administrativo

**Passos**:
1. Após login, verifique o dashboard
2. Observe as estatísticas
3. Teste os filtros de status e tipo
4. Clique em "Ver" em uma denúncia

**Resultado Esperado**:
- Estatísticas corretas
- Filtros funcionando
- Lista de denúncias atualizada

### 6. Teste de Logout

**Objetivo**: Verificar encerramento de sessão

**Passos**:
1. No dashboard, clique em "Sair"

**Resultado Esperado**:
- Redirecionamento para login
- Token removido do localStorage
- Acesso ao dashboard bloqueado

### 7. Teste de Segurança - Acesso Não Autorizado

**Objetivo**: Verificar proteção de rotas

**Passos**:
1. Sem fazer login, tente acessar `http://localhost:8080/dashboard.html`

**Resultado Esperado**:
- Redirecionamento automático para login

### 8. Teste de Validação de Campos

**Objetivo**: Verificar validações do formulário

**Passos**:
1. Tente enviar denúncia sem preencher campos obrigatórios
2. Tente fazer login com email inválido

**Resultado Esperado**:
- Mensagens de erro apropriadas
- Formulário não enviado

## Testes de API (usando curl ou Postman)

### Criar Denúncia

```bash
curl -X POST http://localhost:3000/api/denuncias \
  -H "Content-Type: application/json" \
  -d '{
    "empresa_id": 1,
    "tipo": "assedio_moral",
    "descricao": "Teste via API",
    "anonima": true
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@empresademo.com.br",
    "senha": "admin123"
  }'
```

### Listar Denúncias (com token)

```bash
curl -X GET http://localhost:3000/api/denuncias \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Consultar por Protocolo

```bash
curl -X GET http://localhost:3000/api/denuncias/protocolo/DEN202402170001
```

### Obter Estatísticas

```bash
curl -X GET http://localhost:3000/api/denuncias/estatisticas/dashboard \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## Testes de Banco de Dados

### Verificar Criação de Tabelas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Resultado Esperado**: 6 tabelas (empresas, usuarios, denuncias, anexos, tratativas, logs_auditoria)

### Verificar Dados Iniciais

```sql
SELECT * FROM empresas;
SELECT * FROM usuarios;
```

**Resultado Esperado**: 1 empresa e 1 usuário admin

### Verificar Trigger de Atualização

```sql
-- Criar denúncia
INSERT INTO denuncias (empresa_id, protocolo, tipo, descricao, anonima)
VALUES (1, 'TEST001', 'outro', 'Teste', true);

-- Aguardar alguns segundos e atualizar
UPDATE denuncias SET status = 'em_analise' WHERE protocolo = 'TEST001';

-- Verificar se data_atualizacao mudou
SELECT data_registro, data_atualizacao FROM denuncias WHERE protocolo = 'TEST001';
```

**Resultado Esperado**: data_atualizacao diferente de data_registro

### Verificar Logs de Auditoria

```sql
SELECT * FROM logs_auditoria ORDER BY data_log DESC LIMIT 10;
```

**Resultado Esperado**: Logs de ações realizadas

## Testes de Segurança

### 1. SQL Injection

Tente inserir SQL malicioso nos campos:
```
' OR '1'='1
```

**Resultado Esperado**: Entrada tratada como string, não executada

### 2. XSS (Cross-Site Scripting)

Tente inserir script na descrição:
```html
<script>alert('XSS')</script>
```

**Resultado Esperado**: Script não executado, exibido como texto

### 3. Força Bruta

Tente fazer múltiplos logins incorretos rapidamente

**Resultado Esperado**: Rate limiting bloqueia após limite

### 4. Token Expirado

1. Faça login e copie o token
2. Aguarde 24 horas (ou altere JWT_EXPIRES_IN para 1m)
3. Tente usar o token

**Resultado Esperado**: Erro 401 - Token inválido

## Testes de Performance

### Carga de Denúncias

Criar 100 denúncias e verificar tempo de resposta:

```bash
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/denuncias \
    -H "Content-Type: application/json" \
    -d "{\"empresa_id\": 1, \"tipo\": \"outro\", \"descricao\": \"Teste $i\", \"anonima\": true}"
done
```

**Resultado Esperado**: Todas criadas com sucesso, tempo razoável

### Consulta com Muitos Registros

```sql
SELECT COUNT(*) FROM denuncias;
```

Verificar se índices estão sendo usados:

```sql
EXPLAIN ANALYZE SELECT * FROM denuncias WHERE empresa_id = 1;
```

## Checklist de Testes

- [ ] Denúncia anônima criada com sucesso
- [ ] Denúncia identificada criada com sucesso
- [ ] Consulta de protocolo funcionando
- [ ] Login com credenciais corretas
- [ ] Login com credenciais incorretas bloqueado
- [ ] Dashboard exibindo estatísticas
- [ ] Filtros de denúncias funcionando
- [ ] Logout removendo sessão
- [ ] Acesso não autorizado bloqueado
- [ ] Validações de formulário funcionando
- [ ] API respondendo corretamente
- [ ] Banco de dados com estrutura correta
- [ ] Triggers funcionando
- [ ] Logs de auditoria sendo criados
- [ ] Proteção contra SQL Injection
- [ ] Proteção contra XSS
- [ ] Rate limiting ativo
- [ ] Tokens expirando corretamente
- [ ] Performance adequada com muitos registros

## Relatório de Bugs

Documente qualquer problema encontrado:

1. **Descrição**: O que aconteceu
2. **Passos para Reproduzir**: Como chegar ao erro
3. **Resultado Esperado**: O que deveria acontecer
4. **Resultado Obtido**: O que realmente aconteceu
5. **Ambiente**: Navegador, SO, versão do Node.js
6. **Severidade**: Crítico, Alto, Médio, Baixo
