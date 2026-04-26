import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './migrations',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.ADMIN_DATABASE_URL!,
    },
});
