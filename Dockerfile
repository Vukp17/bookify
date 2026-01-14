# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json nx.json tsconfig.base.json jest.preset.js ./
RUN npm ci

# Copy source
COPY apps ./apps
COPY libs ./libs

# Generate Prisma client and build backend
RUN npm run prisma:generate
RUN npm run backend:build -- --configuration=production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/dist/apps/backend ./dist/apps/backend

RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

EXPOSE 3000
CMD ["node", "dist/apps/backend/src/main.js"]
