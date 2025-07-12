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

## 5. Funcionalidades Backend

- [ ] Criar endpoints públicos:
```
    - Cadastro de usuário
    - Login com JWT
```
- [ ] Criar middlewares de autenticação
- [ ] Implementar:
```
    - Consulta de saldo (corrente e investimento)
    - Depósito em conta corrente
    - Saque da conta corrente
    - Transferência interna entre contas
    - Transferência externa (com taxa)
    - Registro de movimentações
    - Compra e venda de ativos
    - Cálculo de taxas e impostos
```

## 6. Regras de Negócio

- [ ] Criar serviços isolados para validações e cálculos:
```
    - Validação de transferências
    - Cálculo de taxa e tributo
    - Verificação de pendências em contas
```
- [ ] Separar essas regras da camada de persistência
- [ ] Checar o atendimento de todas as [Regras de negócio](./regradenegocio.md)

## 7. Documentação e Testes

- [ ] Configurar Swagger com `swagger-ui-express`
- [ ] Criar endpoints no Postman e exportar collection
- [ ] Criar testes unitários com Jest para regras de negócio
- [ ] Criar testes de integração com Supertest

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
