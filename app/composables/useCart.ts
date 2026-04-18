export const useCart = () => {
  const items = useState<any[]>('cart_items', () => [])
  const isOpen = useState<boolean>('cart_is_open', () => false)

  const addToCart = (product: any) => {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity++
      }
    } else {
      items.value.push({ product, quantity: 1 })
    }
    isOpen.value = true
  }

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter(i => i.product.id !== productId)
  }

  const cartCount = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0))
  
  const cartTotal = computed(() => {
    const total = items.value.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(total)
  })

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  return {
    items,
    isOpen,
    addToCart,
    removeFromCart,
    cartCount,
    cartTotal,
    toggleCart
  }
}
