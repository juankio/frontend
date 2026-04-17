export const useProducts = () => {
  // En Nuxt, useFetch es ideal para SSR + Fetch.
  // URL quemada por ahora, pero lo ideal es usar runtimeConfig
  const { data: products, pending, error, refresh } = useFetch('http://127.0.0.1:5000/api/products', {
    transform: (response: any) => {
      if (!response?.success) return []
      
      return response.data.map((p: any) => ({
        ...p,
        // Precio viene en centavos (ej: 85000 -> 850)
        formattedPrice: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(p.price / 100)
      }))
    }
  })

  return {
    products,
    pending,
    error,
    refresh
  }
}