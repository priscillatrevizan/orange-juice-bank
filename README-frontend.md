# OrangeJuiceBank - Frontend

Este é o frontend do projeto OrangeJuiceBank, desenvolvido durante o Orange Hackathon. A aplicação permite que o usuário interaja com a plataforma de investimentos simulada, realizando operações como login, depósito, saque, transferência, compra de ativos e visualização de relatórios financeiros.

## Tecnologias utilizadas

- **Vue.js 3**: Framework progressivo para construção de interfaces reativas.
- **Vite**: Ferramenta moderna de build para Vue com carregamento rápido e configuração mínima.
- **Pinia**: Gerenciador de estado oficial do Vue 3, mais intuitivo e leve que Vuex.
- **Vue Router**: Para navegação entre telas.
- **CSS Puro com variáveis :root**: Para maior controle visual e organização responsiva.

## Estrutura de diretórios

```
    src/
    ├── assets/
    ├── components/
    ├── views/
    ├── router/
    ├── stores/
    ├── styles/
    └── main.js
```

## Justificativas das escolhas

- **Vue.js com Vite** foi escolhido por ser uma stack na qual há domínio prévio, possibilitando desenvolvimento rápido com aproveitamento de componentes de meu portfólio e ótima performance no ambiente local.
- **Pinia** foi adotado por sua simplicidade na organização do estado global e melhor integração com Composition API.
- **CSS puro com variáveis globais** garante responsividade sem a dependência de frameworks externos, facilitando a manutenção visual.
- O foco está em uma interface clean e funcional, clara e acessível para usuários interagirem com a API de forma fluida.

## Funcionalidades  a serem implementadas

- Login e autenticação
- Dashboard com saldos
- Telas de depósito, saque e transferência
- Compra de ativos e relatórios
- Integração com a API via Axios