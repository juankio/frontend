<script setup lang="ts">
const { products, pending, error, refresh } = useProducts()

useHead({
  title: 'Inventario | Artisan Woodworks',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..400;1,9..144,300..400&display=swap' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-[#F9F6F0] text-[#2C241B] py-32 px-8">
    
    <header class="max-w-[1800px] mx-auto mb-20 text-center">
      <p class="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-semibold mb-6">Alta Ebanistería</p>
      <h1 class="text-5xl md:text-6xl font-['Fraunces',serif] font-medium text-[#2C241B]">Colección <em class="text-[#C5A059] font-light">Eterna</em></h1>
    </header>

    <div class="max-w-[1800px] mx-auto min-h-[50vh]">
      <div v-if="pending" class="flex justify-center items-center py-32">
          <UIcon name="i-lucide-loader-2" class="w-8 h-8 text-[#C5A059] animate-spin" />
      </div>
      <div v-else-if="error" class="text-center py-32 text-red-800 font-['DM_Sans',sans-serif] text-sm tracking-widest uppercase">
          Error al cargar catálogo.
      </div>
      <div v-else-if="!products || products.length === 0" class="text-center py-32 text-[#2C241B]/40 font-['DM_Sans',sans-serif] text-sm tracking-widest uppercase">
          Catálogo vacío.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
        
        <NuxtLink v-for="product in products" :key="product.id" :to="{ path: `/product/${product.id}` }" class="group cursor-pointer flex flex-col">
          
          <div class="w-full aspect-[4/5] overflow-hidden relative mb-8 rounded-sm shadow-[0_4px_24px_rgba(44,36,27,0.03)] group-hover:shadow-[0_12px_40px_rgba(44,36,27,0.08)] bg-[#FDFBF7] transition-all duration-500">
            <img v-if="product.coverImage" :src="product.coverImage" :alt="product.name" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105" />
            
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-[#2C241B]/0 group-hover:bg-[#2C241B]/10 transition-colors duration-500 flex items-center justify-center">
              <span class="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-[#F9F6F0] text-[#2C241B] px-6 py-3 rounded-sm text-xs font-bold tracking-[0.2em] uppercase border border-[#C5A059]/30 flex items-center gap-2">
                <UIcon name="i-lucide-eye" class="w-4 h-4 text-[#C5A059]" />
                Ver Detalles
              </span>
            </div>
            
            <div v-if="product.stock < 3" class="absolute top-6 right-6 bg-[#2C241B] text-[#F9F6F0] text-[10px] px-4 py-2 uppercase tracking-[0.2em] font-medium border border-[#C5A059]/40 rounded-sm">
              Edición Limitada
            </div>
          </div>
          
          <div class="flex flex-col items-center text-center px-4">
            <h4 class="font-['Fraunces',serif] text-2xl text-[#2C241B] mb-3 group-hover:text-[#C5A059] transition-colors">{{ product.name }}</h4>
            <span class="text-lg font-['Fraunces',serif] text-[#C5A059] italic">{{ product.formattedPrice }}</span>
          </div>
          
        </NuxtLink>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-fraunces {
  font-family: 'Fraunces', serif;
}
</style>