// Testes automatizados da API do SALUTAR (Node.js test runner — node --test)
// Pré-requisito: backend rodando (npm start) com banco criado pelo schema.sql
// e dois usuários de teste em organizações diferentes (ver tests/README.md).
// Executar: API_URL=http://localhost:3000/api node --test tests/
const { test } = require('node:test');
const assert = require('node:assert');

const API = process.env.API_URL || 'http://localhost:3000/api';
const USER_A = { email: process.env.TEST_EMAIL_A || 'cipa@demo.local', senha: process.env.TEST_SENHA_A || 'Demo@2026' };
const USER_B = { email: process.env.TEST_EMAIL_B || 'rh@outra.local', senha: process.env.TEST_SENHA_B || 'Demo@2026' };

const json = (method, path, body, token) => fetch(API + path, {
  method,
  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  body: body ? JSON.stringify(body) : undefined,
});
const login = async (u) => (await (await json('POST', '/auth/login', u)).json()).token;

const ocorrencia = (extra = {}) => ({
  empresa_id: 1, tipo: 'condicao_insegura', titulo: 'Teste automatizado',
  descricao: 'Descrição fictícia criada pelo teste automatizado.', anonima: true, ...extra,
});

test('API responde ao health check', async () => {
  const r = await json('GET', '/health');
  assert.strictEqual(r.status, 200);
});

test('registro anônimo gera protocolo no formato SAL-AAAA-XXXXXXXX', async () => {
  const r = await json('POST', '/denuncias', ocorrencia());
  assert.strictEqual(r.status, 201);
  const d = await r.json();
  assert.match(d.protocolo, /^SAL-\d{4}-[A-HJ-NP-Z2-9]{8}$/);
});

test('registro anônimo não armazena nome nem e-mail, mesmo se enviados', async () => {
  const d = await (await json('POST', '/denuncias', ocorrencia({ denunciante_nome: 'Fulano', denunciante_email: 'f@x.com' }))).json();
  const token = await login(USER_A);
  const lista = await (await json('GET', `/denuncias?protocolo=${d.protocolo}`, null, token)).json();
  assert.strictEqual(lista.length, 1);
  assert.strictEqual(lista[0].denunciante_nome, null);
  assert.strictEqual(lista[0].denunciante_email, null);
});

test('validação rejeita descrição com menos de 20 caracteres', async () => {
  const r = await json('POST', '/denuncias', ocorrencia({ descricao: 'curta' }));
  assert.strictEqual(r.status, 400);
});

test('validação rejeita categoria não prevista', async () => {
  const r = await json('POST', '/denuncias', ocorrencia({ tipo: 'qualquer_coisa' }));
  assert.strictEqual(r.status, 400);
});

test('consulta pública por protocolo não expõe descrição nem dados pessoais', async () => {
  const d = await (await json('POST', '/denuncias', ocorrencia({ anonima: false, denunciante_nome: 'Fulano' }))).json();
  const c = await (await json('GET', `/denuncias/protocolo/${d.protocolo}`)).json();
  assert.ok(c.status);
  for (const campo of ['descricao', 'denunciante_nome', 'denunciante_email', 'referral_agency', 'empresa_id']) {
    assert.ok(!(campo in c), `campo ${campo} não deveria aparecer`);
  }
});

test('rotas administrativas exigem autenticação', async () => {
  const r = await json('GET', '/denuncias');
  assert.strictEqual(r.status, 401);
});

test('login com senha errada é recusado', async () => {
  const r = await json('POST', '/auth/login', { email: USER_A.email, senha: 'errada' });
  assert.strictEqual(r.status, 401);
});

test('isolamento multiempresa: organização B não vê registros da organização A', async () => {
  const d = await (await json('POST', '/denuncias', ocorrencia())).json();
  const tokenB = await login(USER_B);
  const lista = await (await json('GET', `/denuncias?protocolo=${d.protocolo}`, null, tokenB)).json();
  assert.strictEqual(lista.length, 0);
});

test('encaminhamento é gravado internamente e não aparece na consulta pública', async () => {
  const d = await (await json('POST', '/denuncias', ocorrencia())).json();
  const token = await login(USER_A);
  const [reg] = await (await json('GET', `/denuncias?protocolo=${d.protocolo}`, null, token)).json();
  const r = await json('PATCH', `/denuncias/${reg.id}/encaminhamento`, { referral_agency: 'CIPA' }, token);
  assert.strictEqual(r.status, 200);
  const c = await (await json('GET', `/denuncias/protocolo/${d.protocolo}`)).json();
  assert.ok(!('referral_agency' in c));
});
