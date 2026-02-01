import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../database/schema';

// Singleton pattern: Create connection once and reuse
let _queryClient: postgres.Sql | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export const useDrizzle = () => {
    if (!_db) {
        const config = useRuntimeConfig();

        if (!config.databaseUrl) {
            throw new Error('DATABASE_URL is not configured');
        }

        // Create connection with connection pooling
        _queryClient = postgres(config.databaseUrl, {
            max: 10, // Maximum 10 connections in pool
            idle_timeout: 20, // Close idle connections after 20s
            connect_timeout: 10, // Connection timeout 10s
        });

        _db = drizzle(_queryClient, { schema });

        console.log('✅ Database connection initialized');
    }

    return _db;
};
