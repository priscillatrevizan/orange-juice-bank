# Execution Checklist - OrangeJuiceBank Hackathon

## 1. Preparação Inicial

- [ ]   Utilizar o template do repositório do desafio
- [ ]   Criar repositório no GitHub
- [ ]   Clonar repositório localmente
- [ ]   Adicionar `README.md` com informações básicas
- [ ]   Adicionar `execution-checklist.md` com o planejamento de Execução do Projeto
- [ ]   Criar as branches: `main`, `development`, `docs`
- [ ]   Criar primeira branch de feature: `feat/init-setup`

## 2. Estrutura Inicial do Projeto (Backend)

- [ ]   Criar projeto Node.js com Express e TypeScript
- [ ]   Estruturar pastas com base em Clean Architecture

```
    src/
    ├── domain/
    ├── usecases/
    ├── infrastructure/
    ├── interfaces/
    ├── database/
    ├── config/
    └── main.ts
```

- [ ]   Inicializar e dependências base: `express`, `cors`, `dotenv`, `pg`
- [ ]   Instalar dependências de desenvolvimento: `typescript`, `ts-node-dev`, `@types/express`, `@types/node`

## 3. Banco de Dados

- [ ]   Criar banco PostgreSQL local
- [ ]   Adicionar `prisma` para migrations e ORM
- [ ]   Inicializar Prisma com `npx prisma init`
- [ ]   Criar esquema inicial com:
  ```
    `User`
    `Account` (corrente/investimento)
    `Transaction`
    `Asset`
    `Investment`
  ```
- [ ]   Criar script de `seed` com base nos mocks fornecidos
- [ ]   Testar criação e seed com `npx prisma db push` e `npx ts-node prisma/seed`

## 4. Docker

- [ ]   Criar `Dockerfile` para o backend
- [ ]   Criar `docker-compose.yml` com serviços:
```
    - app (Node.js)
    - db (PostgreSQL)
```
- [ ]   Configurar `DATABASE_URL` via `.env`
- [ ]   Testar aplicação rodando com `docker-compose up --build`
- [ ]   Adicionar instruções no `README.md`

## 5. Funcionalidades Backend

- [ ]   Criar endpoints públicos:
```
    - Cadastro de usuário
    - Login com JWT
```
- [ ]   Criar middlewares de autenticação
- [ ]   Implementar:
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

- [ ]   Criar serviços isolados para validações e cálculos:
```
    - Validação de transferências
    - Cálculo de taxa e tributo
    - Verificação de pendências em contas
```
- [ ]   Separar essas regras da camada de persistência
- [ ]   Checar o atendimento de todas as [Regras de negócio](./regradenegocio.md)

## 7. Documentação e Testes

- [ ]   Configurar Swagger com `swagger-ui-express`
- [ ]   Criar endpoints no Postman e exportar collection
- [ ]   Criar testes unitários com Jest para regras de negócio
- [ ]   Criar testes de integração com Supertest

## 8. Frontend Vue

- [ ]   Criar projeto com Vite + Vue.js
- [ ]   Configurar Pinia, Vue Router
- [ ]   Criar layout com CSS puro e variáveis :root
- [ ]   Criar telas:
```
    - Login
    - Dashboard
    - Depósito
    - Saque
    - Transferência
    - Investimento
    - Relatórios
```
- [ ]   Conectar à API via Axios


## 9. Extras (se houver tempo)

- [ ]   Simulador de mercado com variação de preços de ações
- [ ]   Alertas de vencimento e variações expressivas
- [ ]   Sistema de badges por ações ou conquistas

## 10. Finalização

- [ ]   Gerar `README.md` completo
- [ ]   Gerar diagrama Mermaid da arquitetura
- [ ]   Gravar vídeo de demonstração ou tirar prints
- [ ]   Subir versão final para a branch `main`
- [ ]   Garantir que projeto esteja rodando via Docker
