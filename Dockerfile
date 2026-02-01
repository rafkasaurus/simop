# Dockerfile for Nuxt 4 + Railway
# Using pnpm for package management

# Stage 1: Build
FROM node:25-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build the application
ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# Stage 2: Production
FROM node:25-alpine

# Set working directory
WORKDIR /app

# Install pnpm (needed if you want to use pnpm commands in production)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built application from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server/database/migrations ./server/database/migrations

# Expose port (Railway will override with $PORT)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NITRO_PRESET=node-server
ENV PORT=3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxtjs -u 1001 && \
    chown -R nuxtjs:nodejs /app
USER nuxtjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the application
CMD ["node", ".output/server/index.mjs"]
