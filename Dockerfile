# Dockerfile for Nuxt 4 + Railway
# Using npm for compatibility

# Stage 1: Build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies (try npm, fallback if lockfile mismatch)
RUN npm install

# Copy all files
COPY . .

# Build the application
ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

# Expose port (Railway will override with $PORT)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NITRO_PRESET=node-server
ENV PORT=3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxtjs -u 1001
USER nuxtjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the application
CMD ["node", ".output/server/index.mjs"]
