# OrangeJuiceBank - Backend

Este é o backend da aplicação OrangeJuiceBank, desenvolvido para o desafio do Orange Hackathon. A API RESTful simula uma plataforma de investimentos digital, permitindo gerenciamento de contas, movimentações financeiras e operações de ativos.

## Tecnologias Utilizadas

- **Node.js + Express**: Ambiente e framework robustos para construção de APIs REST de forma rápida e eficiente.
- **JavaScript**: Linguagem dinâmica, escolhida para acelerar o desenvolvimento inicial da V0.
- **PostgreSQL**: Banco de dados relacional, ideal para transações financeiras complexas.
- **Prisma**: ORM moderno, com migrations e validações integradas.
- **JWT**: Para autenticação e proteção de rotas.
- **Docker**: Para ambiente padronizado e fácil setup.

## Estrutura e Arquitetura

Utilizamos uma **arquitetura limpa e modular**, com separação clara entre domínios, casos de uso, infraestrutura e interfaces.

```
    src/
    ├── domain/ # Entidades e regras puras
    ├── usecases/ # Casos de uso do sistema
    ├── infrastructure/ # Acesso ao banco de dados e serviços
    ├── interfaces/ # Rotas, controladores e middlewares
    ├── database/ # Migrations e seed
    ├── config/ # Variáveis e setup
    └── main.ts # Inicialização do servidor
```

## Justificativas das Escolhas

- **Node.js com Express** permite agilidade na entrega e alinhamento com a experiência prévia da equipe.
- **PostgreSQL** é confiável para consistência em operações bancárias simuladas.
- **Prisma** acelera o desenvolvimento de queries com tipagem automática, e facilita a manutenção dos dados.
- **Arquitetura limpa** foi adotada para separar as responsabilidades e permitir testes isolados e manutenção escalável.


## Princípios SOLID

O backend foi planejado de acordo com os princípios SOLID para garantir maior organização, desacoplamento e testabilidade do código:

- **S** - *Single Responsibility*: cada classe, serviço ou rota tem uma única responsabilidade bem definida.
- **O** - *Open/Closed*: os módulos são abertos para extensão (ex: novos ativos ou serviços de validação) e fechados para modificação.
- **L** - *Liskov Substitution*: usamos abstrações como `ITransferValidator` ou `IAssetService` que podem ser substituídas por implementações específicas.
- **I** - *Interface Segregation*: cada serviço expõe apenas os métodos necessários (sem interfaces genéricas ou inchadas).
- **D** - *Dependency Inversion*: as dependências (repositórios, validadores) são injetadas nas classes principais, permitindo fácil mock e troca de implementações.

O uso desses princípios reforça a separação entre camadas e proporciona clareza no fluxo de regras de negócio, o que é essencial em um domínio financeiro como este.



