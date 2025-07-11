# Levantamento de Requisitos - OrangeJuiceBank

## 1. Requisitos Funcionais

### 1.1 Gestão de Usuários
- [ ] Criar contas de usuários
- [ ] Login via e-mail ou CPF
- [ ] Autenticação e autorização com JWT
- [ ] Validação de credenciais com mensagens de erro claras

### 1.2 Contas Bancárias
- [ ] Criar duas contas distintas para cada usuário:
  - Conta Corrente
  - Conta Investimento
- [ ] Separar saldos entre as contas
- [ ] Consultar saldos individualmente

### 1.3 Operações Financeiras
- [ ] Realizar depósitos em Conta Corrente
- [ ] Realizar saques da Conta Corrente
- [ ] Realizar transferências:
  - Entre contas do mesmo usuário (corrente ↔ investimento)
  - Para Conta Corrente de outro usuário
- [ ] Aplicar taxa de 0,5% nas transferências externas
- [ ] Validar saldo, valor e existência da conta destino
- [ ] Bloquear transferências de Conta Investimento caso haja operações pendentes

### 1.4 Investimentos
- [ ] Listar ativos disponíveis para compra:
  - Renda variável (ações)
  - Renda fixa (CDB e Tesouro Direto)
- [ ] Comprar ativos utilizando saldo da Conta Investimento
- [ ] Vender ativos e creditar saldo na Conta Investimento
- [ ] Calcular automaticamente:
  - Taxa de corretagem de 1% para ações
  - Imposto sobre lucro:
    - 15% para ações
    - 22% para renda fixa

### 1.5 Histórico de Movimentações
- [ ] Registrar todas as movimentações:
  - Depósitos, saques, transferências, compras e vendas
- [ ] Cada registro deve conter:
  - Data e hora
  - Tipo de movimentação
  - Valor
  - Contas envolvidas

### 1.6 Relatórios
- [ ] Relatório de Imposto de Renda (lucros e impostos pagos)
- [ ] Extrato da Conta Corrente
- [ ] Extrato da Conta Investimento
- [ ] Resumo de rentabilidade por ativo

### 1.7 Simulador de Mercado (Opcional)
- [ ] Atualizar preços de ações a cada 5 minutos com variação aleatória
- [ ] Exibir histórico de preços das ações
- [ ] Exibir rentabilidade acumulada de CDB e Tesouro Direto

### 1.8 Gamificação e Notificações (Opcional)
- [ ] Enviar alertas sobre:
  - Vencimento de investimentos
  - Variações expressivas de preço (acima de 5%)
- [ ] Conceder badges e exibir conquistas
- [ ] Criar rankings ou desafios entre usuários

## 2. Requisitos Não Funcionais

### 2.1 Arquitetura e Código
- [ ] Backend com Node.js + Express (alternativa ao .NET)
- [ ] Frontend com Vue.js, Pinia e CSS puro
- [ ] Arquitetura modular com separação de camadas:
  - Domain
  - Use Cases
  - Infrastructure
  - Interfaces (API)
- [ ] Aplicação monolítica com organização escalável
- [ ] Aplicação containerizada com Docker

### 2.2 Persistência e Banco de Dados
- [ ] Banco relacional PostgreSQL
- [ ] Uso de ORM com migrations (Prisma)
- [ ] Dados de usuários e ativos carregados por seed

### 2.3 Segurança
- [ ] Autenticação via token JWT
- [ ] Validação de entradas (ex: valor > 0, saldo suficiente)
- [ ] Rotas protegidas por autenticação

### 2.4 Testes
- [ ] Cobertura de testes unitários para regras de negócio
- [ ] Testes de integração para endpoints
- [ ] Uso de Jest e Supertest

### 2.5 Documentação
- [ ] Swagger com todos os endpoints da API
- [ ] Postman Collection para testes manuais
- [ ] README com instruções de instalação, execução e uso
- [ ] Diagrama da arquitetura com Mermaid

### 2.6 Interface do Usuário
- [ ] Design responsivo (mobile e desktop)
- [ ] Navegação fluida entre telas
- [ ] Exibição clara de mensagens de erro e sucesso

### 2.7 Versionamento e Colaboração
- [ ] Uso de Git com branches:
  - `main`, `dev`, `staging`, `feat/nome`, `fix/nome`
- [ ] Commits semânticos no estilo Conventional Commits
- [ ] Organização de tarefas por branch

