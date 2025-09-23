# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy lockfile + package.json ก่อน
COPY package.json yarn.lock ./

# ติดตั้ง dependencies (รวม dev เพราะต้อง build TS)
RUN yarn install --frozen-lockfile

# Stage 2: Build Next.js
FROM node:20-alpine AS builder
WORKDIR /app

# Copy source ทั้งหมด
COPY . .

# Copy node_modules จาก deps
COPY --from=deps /app/node_modules ./node_modules

# Build (Next.js จะ compile TypeScript)
RUN yarn build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Copy เฉพาะไฟล์ที่รันจริง
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000
CMD ["yarn", "start"]
