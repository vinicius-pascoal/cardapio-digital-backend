FROM node:20-bookworm-slim

WORKDIR /app

# OpenSSL + Certs (Debian-based, Prisma engines friendly)
RUN apt-get update && apt-get install -y --no-install-recommends     openssl ca-certificates  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TS
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/index.js"]
