export const useProducts = () => {
  const { data: products, pending, error, refresh } = useFetch('http://127.0.0.1:5000/api/products', {
    lazy: true,
    transform: (response: any) => {
      if (!response?.success) return []
      
      return response.data.map((p: any) => ({
        ...p,
        // Precio en COP (enteros)
        formattedPrice: new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0
        }).format(p.price)
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