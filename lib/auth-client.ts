import { createAuthClient } from "better-auth/react"
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
export const authClient = createAuthClient({
    baseURL: `${BASE_URL}/admin/api/auth`,
})

export const { signIn, signUp, useSession, signOut, requestPasswordReset, getSession } = authClient