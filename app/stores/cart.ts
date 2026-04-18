import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
    isOpen: false,
  }),
  getters: {
    cartCount: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
    cartTotal: (state) => {
      const total = state.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(total)
    }
  },
  actions: {
    addToCart(product: any) {
      const existing = this.items.find(i => i.product.id === product.id)
      if (existing) {
        if (existing.quantity < product.stock) {
          existing.quantity++
        }
      } else {
        const cleanProduct = JSON.parse(JSON.stringify(product))
        this.items.push({ product: cleanProduct, quantity: 1 })
      }
      this.isOpen = true
    },
    removeFromCart(productId: number) {
      this.items = this.items.filter(i => i.product.id !== productId)
    },
    toggleCart() {
      this.isOpen = !this.isOpen
    },
    clearCart() {
      this.items = []
    }
  }
})