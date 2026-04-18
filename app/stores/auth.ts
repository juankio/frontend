import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    token: null as string | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    setAuth(user: any, token: string) {
      this.user = user
      this.token = token
      
      const authCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
      const userCookie = useCookie('user_data', { maxAge: 60 * 60 * 24 * 7 })
      authCookie.value = token
      userCookie.value = user
    },
    logout() {
      this.user = null
      this.token = null
      
      const authCookie = useCookie('auth_token')
      const userCookie = useCookie('user_data')
      authCookie.value = null
      userCookie.value = null
    },
    loadFromCookies() {
      const authCookie = useCookie('auth_token')
      const userCookie = useCookie('user_data')
      if (authCookie.value && userCookie.value) {
        this.token = authCookie.value
        this.user = userCookie.value
      }
    }
  }
})