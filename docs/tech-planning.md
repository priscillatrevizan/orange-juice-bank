# Execution Checklist - OrangeJuiceBank Hackathon

## 1. Preparação Inicial

- [x] Utilizar o template do repositório do desafio
- [x] Criar repositório no GitHub
- [x] Clonar repositório localmente
- [x] Adicionar `README.md` com informações básicas
- [x] Adicionar `execution-checklist.md` com o planejamento de Execução do Projeto
- [x] Criar as branches: `main`, `development`, `docs`
- [x] Criar primeira branch de feature: `feat/init-setup`

## 2. Estrutura Inicial do Projeto (Backend)

- [x] Criar projeto Node.js com Express
- [x] Estruturar pastas com base em arquitetura modular limpa

```
    src/
    ├── api/
    │   └── v1/
    │       └── users/
    ├── config/
    ├── middlewares/
    ├── models/
    ├── services/
    ├── utils/
    ├── app.js
    └── server.js
```

- [x] Inicializar e instalar dependências base: `express`, `cors`, `dotenv`, `pg`, `prisma`, `@prisma/client`
- [x] Instalar dependências de desenvolvimento: `nodemon`, `eslint`, `prisma`

## 3. Banco de Dados

- [x] Criar banco PostgreSQL via Docker
- [x] Adicionar `prisma` para migrations e ORM
- [x] Inicializar Prisma com `npx prisma init`
- [x] Criar esquema inicial com:
  ```
    User
    Account (corrente/investimento)
    Transaction
    Asset
    Investment
  ```
- [x] Criar script de `seed` com base nos mocks fornecidos
- [x] Testar criação e seed com `npx prisma migrate dev` e `npm run seed`

## 4. Docker

- [x] Criar `Dockerfile` para o backend
- [x] Criar `docker-compose.yml` com serviços:
```
    - app (Node.js)
    - db (PostgreSQL)
```
- [x] Configurar `DATABASE_URL` via `.env`
- [x] Testar aplicação rodando com `docker-compose up --build`
- [x] Adicionar instruções no `README.md`

## 5. 5. Funcionalidades Backend

### Endpoints públicos
- [x] Cadastro de usuário
- [x] Login com JWT

### Middlewares
- [x] Autenticação via token com `authMiddleware.js`

### Funcionalidades implementadas
- [x] Consulta de saldo (corrente e investimento)
- [x] Transferência interna entre contas do mesmo usuário
- [x] Transferência externa entre usuários (com taxa de 0.5%)
- [x] Registro de movimentações (compra, venda, transferência, saque e depósito)
- [x] Compra de ações e renda fixa (com taxa de 1% para ações)
- [x] Venda de ações e renda fixa (com IR: 15% ações, 22% renda fixa)
- [x] Endpoint de extrato unificado com filtro por tipo, data e conta
- [x] Depósito em conta corrente
- [x] Saque da conta corrente

---

## 6. Regras de Negócio

- [x] Serviços separados por tipo de movimentação (buy, sell, transfer)
- [x] Verificação de saldo antes de toda movimentação
- [x] Impedimento de operações com valor inválido ou contas iguais
- [x] Criação automática de contas ao criar usuário
- [x] Validação de tipo de ativo (não pode comprar ação e renda fixa juntas)
- [x] Restrições nas transferências externas (somente conta corrente)
- [ ] Serviços isolados de validação/taxas ainda estão acoplados a service principal (refatorar se houver tempo)
- [ ] Verificação de pendências (não aplicável por enquanto)

---

## Status Geral do Backend

- [x] Fluxo de autenticação completo
- [x] Operações financeiras testadas e funcionais
- [x] Respostas com status HTTP apropriados
- [x] Organização por rotas, controllers e services
- [x] Documentação da API será feita via Postman (Swagger não será utilizado)
- [x] Testes automatizados em andamento

## 7. Documentação e Testes

- [x] Documentar e testar endpoints no Postman (Swagger não será utilizado)
- [x] Criar testes unitários com Jest para regras de negócio
- [x] Criar testes de integração com Supertest

## 8. Frontend Vue

- [ ] Criar projeto com Vite + Vue.js
- [ ] Configurar Pinia, Vue Router
- [ ] Criar layout com CSS puro e variáveis :root
- [ ] Criar telas:
```
    - Login
    - Dashboard
    - Depósito
    - Saque
    - Transferência
    - Investimento
    - Relatórios
```
- [ ] Conectar à API via Axios

## 9. Extras (se houver tempo)

- [ ] Simulador de mercado com variação de preços de ações
- [ ] Alertas de vencimento e variações expressivas
- [ ] Sistema de badges por ações ou conquistas

## 10. Finalização

- [ ] Gerar `README.md` completo
- [ ] Gerar diagrama Mermaid da arquitetura
- [ ] Gravar vídeo de demonstração ou tirar prints
- [ ] Subir versão final para a branch `main`
- [x] Garantir que projeto esteja rodando via Docker
