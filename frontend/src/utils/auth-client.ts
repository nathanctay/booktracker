import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields, usernameClient } from "better-auth/client/plugins";

export const { signIn, signUp, useSession, signOut, requestPasswordReset, resetPassword } = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields({
            user: {
                username: {
                    type: "string"
                }
            }
        }),
        usernameClient(),
        
    ]
})