# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json nx.json tsconfig.base.json jest.preset.js ./
RUN npm ci

# Copy source
COPY apps ./apps
COPY libs ./libs

# Generate Prisma client
RUN npm run prisma:generate

# Build both frontend and backend (disable Nx daemon for Docker)
ENV NX_DAEMON=false
RUN npx nx build frontend --configuration=production
RUN npx nx build backend --configuration=production

# ===================================
# Stage 2: Nginx + Node.js Runtime
# ===================================
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install OpenSSL for Prisma and Nginx for frontend
RUN apk add --no-cache openssl libc6-compat nginx

# Setup Nginx
COPY --from=builder /app/dist/apps/frontend /usr/share/nginx/html
COPY <<EOF /etc/nginx/http.d/default.conf
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html/browser;
    index index.html;

    # Frontend - Angular routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Setup Node.js backend
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/dist/apps/backend ./dist/apps/backend

RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Create startup script
COPY <<'EOF' /app/start.sh
#!/bin/sh
set -e

# Start nginx in background
nginx

# Start backend (foreground)
exec node dist/apps/backend/src/main.js
EOF

RUN chmod +x /app/start.sh

EXPOSE 8080
CMD ["/app/start.sh"]
