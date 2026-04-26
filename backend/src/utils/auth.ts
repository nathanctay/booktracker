import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { openAPI, username } from "better-auth/plugins";

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
});

export type AuthType = {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
}