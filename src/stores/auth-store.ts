import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const AUTH_USER = 'auth_user_data'

export interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    isAuthenticated: () => boolean
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  // Cargar estado inicial desde cookies
  const cookieToken = getCookie(ACCESS_TOKEN)
  const cookieUser = getCookie(AUTH_USER)

  const initToken = cookieToken ? JSON.parse(cookieToken) : ''
  const initUser = cookieUser ? JSON.parse(cookieUser) : null

  return {
    auth: {
      user: initUser,
      accessToken: initToken,

      setUser: (user) =>
        set((state) => {
          // Guardar usuario en cookie
          if (user) {
            setCookie(AUTH_USER, JSON.stringify(user))
          } else {
            removeCookie(AUTH_USER)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),

      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),

      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),

      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(AUTH_USER)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),

      isAuthenticated: () => {
        const { user, accessToken } = get().auth

        // Verificar si existe token y usuario
        if (!accessToken || !user) return false

        // Verificar si el token no ha expirado
        if (user.exp && Date.now() > user.exp) {
          // Token expirado - limpiar sesión
          get().auth.reset()
          return false
        }

        return true
      },
    },
  }
})
