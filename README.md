
# 🍊OrangeJuiceBank

Projeto fullstack de simulação bancária e investimentos, desenvolvido durante o Orange Hackathon.

## 🎯 Objetivo

Desenvolver uma **API RESTful (preferencialmente em .NET)** que simule as operações de uma plataforma de investimentos digital, além de uma interface **frontend** (web ou mobile) para interação com a API. O objetivo é representar o fluxo real de um banco de investimentos, incluindo movimentações financeiras, aplicações em diferentes tipos de ativos e a visualização dessas operações pelo usuário. O frontend deve permitir que os usuários criem contas, consultem saldos, realizem operações financeiras e acompanhem seus investimentos de forma intuitiva, proporcionando uma experiência próxima à de uma plataforma real de investimentos.

---

## 🧠 Contexto de Negócio

A FCamara atende bancos de investimentos e multiplos que possuem expressão a nível Global. Este desafio foi inspirado no domínio de negócio real que atuamos diariamente com nossos clientes, tornando esta uma oportunidade de exercitar habilidades técnicas em um cenário próximo da realidade.

---

## Visão Geral

O OrangeJuiceBank é composto por dois grandes módulos:
- **Backend**: API RESTful para operações bancárias, investimentos e autenticação.
- **Frontend**: Interface web responsiva para interação do usuário.

## Estrutura do Projeto

```
orange-juice-bank/
├── backend/                # Código-fonte e documentação do backend
│   └── README-backend.md
├── frontend/               # Código-fonte e documentação do frontend
│   └── README-frontend.md
├── docs/                   # Documentação auxiliar (requisitos, checklist, planejamento)
│   ├── requirements.md
│   ├── tech-planning.md
│   ├── execution-checklist.md
│   └── regradenegocio.md
├── docker-compose.yml      # Orquestração dos serviços
├── Dockerfile              # Build customizado (multi-stage)
├── render.yaml             # Configuração para deploy no Render.com
└── README.md               # Este arquivo
```

## Documentação Detalhada

- [Documentação do Backend](backend/README-backend.md)
- [Documentação do Frontend](frontend/README-frontend.md)
- [Documentos auxiliares e planejamento](docs/):
     - [Regras de Negócio](https://github.com/priscillatrevizan/orange-juice-bank/blob/main/docs/regradenegocio.md)
     - [Análise de Requisitos](https://github.com/priscillatrevizan/orange-juice-bank/blob/main/docs/requirements.md)
     - [Planejamento Tecnico](https://github.com/priscillatrevizan/orange-juice-bank/blob/main/docs/tech-planning.md)
     - [Checklist de Execução](https://github.com/priscillatrevizan/orange-juice-bank/blob/main/docs/execution-checklist.md)

## Como rodar o projeto

1. **Pré-requisitos**: Docker e Docker Compose instalados.
2. **Clone o repositório**:
   ```sh
   git clone https://github.com/priscillatrevizan/orange-juice-bank.git
   cd orange-juice-bank
   ```
3. **Suba os serviços**:
   ```sh
   docker-compose up --build
   ```
4. **Acesse**:
   - Frontend: http://localhost:5173
   - Backend/API: http://localhost:3000

5. **Mais detalhes**:
   - Para instruções específicas de cada módulo, consulte os READMEs em `backend/` e `frontend/`.
   
    

---

> Dúvidas ou sugestões? Consulte a documentação de cada módulo ou abra uma issue no repositório!
