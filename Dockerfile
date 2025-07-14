# Dockerfile para orquestração do projeto completo (multi-stage opcional)
# Exemplo: apenas referência, ajuste conforme sua stack

# Etapa 1: Backend
FROM node:20 AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Etapa 2: Frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Etapa 3: Produção (opcional, se for servir frontend estaticamente)
# FROM nginx:alpine
# COPY --from=frontend /app/frontend/dist /usr/share/nginx/html
# COPY --from=backend /app/backend /app/backend
# ...

# Para projetos fullstack, normalmente o docker-compose.yml é o principal
# Este Dockerfile é só um exemplo para deploys customizados
