# Estágio de build
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY tsconfig.json ./
COPY app.ts tracing.ts ./

RUN npx tsc

# Estágio de execução
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/app.js"]