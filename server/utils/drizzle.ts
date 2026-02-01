import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../database/schema';

export const useDrizzle = () => {
    const config = useRuntimeConfig();
    const queryClient = postgres(config.databaseUrl);
    return drizzle(queryClient, { schema });
};
