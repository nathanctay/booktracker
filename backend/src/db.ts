import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './db/schema';
import * as relations from './db/relations';

export const db = drizzle(process.env.DATABASE_URL!, { schema: { ...schema, ...relations } });
