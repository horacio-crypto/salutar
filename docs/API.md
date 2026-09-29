# Documentação da API

## Base URL

```
http://localhost:3000/api
```

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer {token}
```

## Endpoints

### Autenticação

#### POST /auth/login

Realiza login e retorna token JWT.

**Request:**
```json
{
  "email": "usuario@empresa.com",
  "senha": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Nome do Usuário",
    "email": "usuario@empresa.com",
    "perfil": "admin",
    "empresa": "Empresa Demo LTDA"
  }
}
```

#### POST /auth/registrar

Registra novo usuário (requer autenticação e perfil admin).

**Request:**
```json
{
  "nome": "Novo Usuário",
  "email": "novo@empresa.com",
  "senha": "senha123",
  "perfil": "cipa",
  "empresa_id": 1
}
```

### Denúncias

#### POST /denuncias

Cria nova denúncia (não requer autenticação).

**Request:**
```json
{
  "empresa_id": 1,
  "tipo": "assedio_moral",
  "descricao": "Descrição detalhada da ocorrência",
  "anonima": true,
  "setor_envolvido": "Produção",
  "data_ocorrencia": "2024-02-15"
}
```

**Response:**
```json
{
  "id": 1,
  "protocolo": "DEN202402170001",
  "status": "aberta",
  "data_registro": "2024-02-17T10:30:00.000Z"
}
```

#### GET /denuncias/protocolo/:protocolo

Consulta denúncia por protocolo (não requer autenticação).

**Response:**
```json
{
  "id": 1,
  "protocolo": "DEN202402170001",
  "tipo": "assedio_moral",
  "status": "aberta",
  "data_registro": "2024-02-17T10:30:00.000Z",
  "setor_envolvido": "Produção"
}
```

#### GET /denuncias

Lista denúncias (requer autenticação).

**Query Parameters:**
- `status`: Filtrar por status (opcional)
- `tipo`: Filtrar por tipo (opcional)

**Response:**
```json
[
  {
    "id": 1,
    "protocolo": "DEN202402170001",
    "tipo": "assedio_moral",
    "status": "aberta",
    "data_registro": "2024-02-17T10:30:00.000Z"
  }
]
```

#### PUT /denuncias/:id

Atualiza status da denúncia (requer autenticação e perfil admin/cipa/rh/gestor).

**Request:**
```json
{
  "status": "em_analise",
  "prioridade": "alta"
}
```

#### POST /denuncias/tratativas

Adiciona tratativa à denúncia (requer autenticação).

**Request:**
```json
{
  "denuncia_id": 1,
  "descricao": "Iniciada investigação",
  "acao_tomada": "Entrevista com envolvidos"
}
```

#### GET /denuncias/:denuncia_id/tratativas

Lista tratativas de uma denúncia (requer autenticação).

#### GET /denuncias/estatisticas/dashboard

Retorna estatísticas das denúncias (requer autenticação).

**Response:**
```json
{
  "total": 50,
  "abertas": 10,
  "em_analise": 15,
  "concluidas": 20,
  "assedio_moral": 12,
  "condicao_insegura": 8
}
```

## Tipos de Denúncia

- `assedio_moral`: Assédio Moral
- `assedio_sexual`: Assédio Sexual
- `discriminacao`: Discriminação
- `condicao_insegura`: Condição Insegura de Trabalho
- `risco_saude`: Risco à Saúde
- `outro`: Outro

## Status de Denúncia

- `aberta`: Aberta
- `em_analise`: Em Análise
- `em_investigacao`: Em Investigação
- `concluida`: Concluída
- `arquivada`: Arquivada

## Perfis de Usuário

- `admin`: Administrador do sistema
- `cipa`: Membro da CIPA
- `rh`: Recursos Humanos
- `gestor`: Gestor/Supervisor

## Códigos de Status HTTP

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Requisição inválida
- `401`: Não autenticado
- `403`: Acesso negado
- `404`: Não encontrado
- `500`: Erro interno do servidor

## Rate Limiting

A API possui limite de 100 requisições por 15 minutos por IP.

## LGPD e Privacidade

- Dados sensíveis são criptografados
- Denúncias anônimas não armazenam dados pessoais
- Logs de auditoria registram todas as ações
- Dados são segregados por empresa
