import { createAuthClient } from "better-auth/react"
// export const authClient = createAuthClient({
export const { signIn, signUp, useSession, signOut, requestPasswordReset, resetPassword } = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: import.meta.env.VITE_BACKEND_URL
})