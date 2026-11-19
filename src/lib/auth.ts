import { createAuthClient } from 'better-auth/react'

const authBaseUrl = import.meta.env.VITE_NEON_AUTH_URL || ''

if (!authBaseUrl) {
  console.warn('VITE_NEON_AUTH_URL não configurada no ambiente.')
}

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
})

export const { signIn, signUp, signOut, useSession, getSession } = authClient

