import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { openAPI, username } from "better-auth/plugins";
import { lists, user as userTable } from "../db/schema";
import { sql } from "drizzle-orm";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    user: {
        additionalFields: {
            username: {
                type: "string",
            }
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username(),
        openAPI()
    ],
    basePath: '/auth',
    trustedOrigins: [process.env.CORS_ORIGIN ?? 'http://localhost:5173'],
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await db.execute(sql`SELECT set_config('app.current_user_id', ${user.id}, 
  false)`)
                    await db
                        .insert(lists)
                        .values({ name: "default", userId: user.id, isDefault: true })
                }
            }
        }
    }, advanced: {
        crossSubDomainCookies: {
            enabled: true,
        },
        defaultCookieAttributes: {
            sameSite: 'none',
            secure: true,
        }
    },
});

export type AuthType = {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
}