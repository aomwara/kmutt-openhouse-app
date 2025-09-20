# ----------- Base Build Stage -----------
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies only (cached)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy all project files
COPY . .

# Build Next.js app
RUN yarn build

# ----------- Production Stage -----------
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user for safety
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# Copy only needed files
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/yarn.lock ./yarn.lock
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./next.config.js

# Change ownership
RUN chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000

CMD ["yarn", "start"]
