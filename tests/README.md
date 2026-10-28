# Testes automatizados da API (SALUTAR)

Executados com o executor de testes nativo do Node.js (versão 18 ou superior), sem dependências extras.

1. Suba o banco PostgreSQL com `database/schema.sql` e o backend (`cd backend && npm start`).
2. Cadastre dois usuários de teste em organizações diferentes (ex.: `cipa@demo.local` na empresa 1 e `rh@outra.local` na empresa 2, senha `Demo@2026`), ou informe outros pelas variáveis abaixo.
3. Na raiz do projeto, rode:

```
API_URL=http://localhost:3000/api node --test tests/
```

Variáveis opcionais: TEST_EMAIL_A, TEST_SENHA_A, TEST_EMAIL_B, TEST_SENHA_B.

Resultado obtido em 27/10/2026: 10 testes, 10 aprovados.
