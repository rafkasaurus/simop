#!/bin/sh

# Run database migrations
echo "Running database migrations..."
npx drizzle-kit migrate --config=drizzle.config.ts

# Start the Nuxt server
echo "Starting Nuxt server..."
node .output/server/index.mjs