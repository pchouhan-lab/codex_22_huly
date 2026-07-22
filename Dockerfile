FROM node:22-alpine AS deps
WORKDIR /app
ENV DATABASE_URL="file:./dev.db"
RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /app
ENV DATABASE_URL="file:./dev.db"
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"
RUN apk add --no-cache openssl
COPY --from=builder /app ./
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run db:seed && npm start"]
