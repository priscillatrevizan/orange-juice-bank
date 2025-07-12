#Registro de correção de bugs


### [12/07/2025] Correção de erros de conexão com o banco de dados (PostgreSQL + Prisma)

**Problemas identificados:**
- Erro de autenticação (Prisma P1000): password authentication failed for user "postgres".
- Erro de conectividade (Prisma P1001): Can't reach database server at db:5432.

**Causas:**
- Senha incorreta ou inconsistente entre os arquivos `.env`, `docker-compose.yml` e o banco.
- Prisma CLI local tentando acessar o host `db`, que só é resolvido dentro do Docker.

**Soluções aplicadas:**
1. Padronização da senha para `12345` em:
   - `.env`
   - `docker-compose.yml` (serviço db e serviço app)

2. Limpeza completa dos containers, imagens e volumes com:
   ```
   docker-compose down --rmi all --volumes

3. Reconstrução com:
  ```
  docker-compose up -d --build
  Ajuste da variável DATABASE_URL no .env local para:
  ```

4. Ajuste da variável DATABASE_URL no .env local para:
  ```
  DATABASE_URL=postgresql://postgres:12345@localhost:5432/orangejuicebank?schema=public
  ```

5. Adição temporária de prisma.$connect() no server.js para validar a conexão.
Execução bem-sucedida do comando:

6. Execução bem-sucedida do comando:
  ```
    npx prisma migrate dev
  ```

Resultado:

- Conexão backend ↔ banco de dados funcionando dentro do Docker.
- Comandos Prisma CLI funcionam corretamente no ambiente local.