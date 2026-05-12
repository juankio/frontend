import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setAuth(newUser: any, newToken: string) {
    user.value = newUser
    token.value = newToken
    
    const authCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
    const userCookie = useCookie('user_data', { maxAge: 60 * 60 * 24 * 7 })
    authCookie.value = newToken
    userCookie.value = newUser
  }

  function logout() {
    user.value = null
    token.value = null
    
    const authCookie = useCookie('auth_token')
    const userCookie = useCookie('user_data')
    authCookie.value = null
    userCookie.value = null
  }

  function loadFromCookies() {
    const authCookie = useCookie('auth_token')
    const userCookie = useCookie('user_data')
    if (authCookie.value && userCookie.value) {
      token.value = authCookie.value as string
      try {
        user.value = typeof userCookie.value === 'string' ? JSON.parse(userCookie.value) : userCookie.value
      } catch (e) {
        user.value = userCookie.value
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    setAuth,
    logout,
    loadFromCookies
  }
})
