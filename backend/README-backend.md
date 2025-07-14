# OrangeJuiceBank - Backend

Este é o backend da aplicação OrangeJuiceBank, desenvolvido para o desafio do Orange Hackathon. A API RESTful simula uma plataforma de investimentos digital, permitindo gerenciamento de contas, movimentações financeiras e operações de ativos.

## Tecnologias Utilizadas

- Node.js + Express: Ambiente e framework robustos para construção de APIs REST de forma rápida e eficiente.
- JavaScript: Linguagem dinâmica, escolhida para acelerar o desenvolvimento inicial da V0.
- PostgreSQL: Banco de dados relacional, ideal para transações financeiras complexas.
- Prisma: ORM moderno, com migrations e validações integradas.
- JWT: Para autenticação e proteção de rotas.
- Docker: Para ambiente padronizado e fácil setup.

## Estrutura e Arquitetura

Utilizamos uma arquitetura limpa e modular, com separação clara entre domínios, casos de uso, infraestrutura e interfaces.

```
   ├── /src                    # Código-fonte da aplicação
   │   ├── /api                # Módulos da API (rotas, controladores, serviços)
   │   │   └── /v1             # Versionamento da API
   │   │       ├── /users      # Módulo de exemplo (ex: usuários)
   │   │       │   ├── users.routes.js
   │   │       │   ├── users.controller.js
   │   │       │   ├── users.service.js
   │   │       │   └── users.model.js
   │   │       └── index.js    # Agregador de rotas da v1
   │   ├── /config             # Arquivos de configuração
   │   ├── /middlewares        # Middlewares customizados
   │   ├── /models             # Modelos de dados
   │   ├── /services           # Lógica de negócio
   │   ├── /utils              # Funções utilitárias
   │   ├── app.js              # Configuração global do Express
   │   └── server.js           # Ponto de entrada do servidor
   ├── /tests                  # Testes automatizados
   │   ├── /integration
   │   └── /unit
   ├── /prisma                # Schema, client e seed do Prisma
   │   ├── schema.prisma
   │   ├── seed.js
   │   └── seed-data/
   │       ├── users-mock.json
   │       └── assets-mock.json
   ├── Dockerfile
   ├── docker-compose.yml
   ├── .dockerignore
   ├── .env
   ├── .gitignore
   ├── package.json
   └── README.md
```


## Justificativas das Escolhas

- Node.js com Express permite agilidade na entrega e alinhamento com a experiência prévia da equipe.
- PostgreSQL é confiável para consistência em operações bancárias simuladas.
- Prisma acelera o desenvolvimento de queries com tipagem automática, e facilita a manutenção dos dados.
- Arquitetura limpa foi adotada para separar as responsabilidades e permitir testes isolados e manutenção escalável.

## Princípios SOLID

O backend foi planejado de acordo com os princípios SOLID para garantir maior organização, desacoplamento e testabilidade do código:

- S - Single Responsibility: cada classe, serviço ou rota tem uma única responsabilidade bem definida.
- O - Open/Closed: os módulos são abertos para extensão (ex: novos ativos ou serviços de validação) e fechados para modificação.
- L - Liskov Substitution: usamos abstrações como `ITransferValidator` ou `IAssetService` que podem ser substituídas por implementações específicas.
- I - Interface Segregation: cada serviço expõe apenas os métodos necessários (sem interfaces genéricas ou inchadas).
- D - Dependency Inversion: as dependências (repositórios, validadores) são injetadas nas classes principais, permitindo fácil mock e troca de implementações.

## Executando com Docker

Siga os passos abaixo para rodar o backend em qualquer máquina com Docker instalado:

1. Clone este repositório:
   ```
   git clone https://github.com/seu-usuario/orangejuicebank.git
   cd orangejuicebank/backend
   ```

2. Crie o arquivo .env:
```
   DATABASE_URL="postgresql://postgres:12345@db:5432/orangejuicebank"
   PORT=3000
```

3. Construa e inicie os containers:
```
   docker-compose up --build
```

4. Acesse a API no navegador ou via terminal:
```
   http://localhost:3000
```

5. Popule o banco com os dados de mock:
```
   docker exec -it orangejuicebank-backend npm run seed
```

Isso irá importar os dados dos arquivos:

- prisma/seed-data/users-mock.json
- prisma/seed-data/assets-mock.json

Os dados incluem usuários, ações e produtos de renda fixa, disponíveis para uso imediato via API.

## Verificando os dados no pgAdmin

Após rodar o `seed.js`, o banco de dados local deve estar populado com os seguintes dados iniciais:

- **Usuários (User)**: 10 registros
- **Ações (Stock)**: 40 registros
- **Renda Fixa (FixedIncome)**: 6 registros

### Dica: Visualização no pgAdmin

O `pgAdmin` exibe apenas a última consulta executada por padrão. Para visualizar os dados corretamente:

1. **Execute cada `SELECT` individualmente** (uma por vez):
   ```sql
   SELECT * FROM "User";
   SELECT * FROM "Stock";
   SELECT * FROM "FixedIncome";
   ```
2. Ou execute os COUNT(*) para confirmar a quantidade de registros:
```sql
   SELECT COUNT(*) FROM "User";
   SELECT COUNT(*) FROM "Stock";
   SELECT COUNT(*) FROM "FixedIncome";
```

Se os resultados retornarem 10, 40 e 6 respectivamente, o seed foi concluído com sucesso 🎉