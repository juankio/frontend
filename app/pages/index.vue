<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { products, pending, error } = useProducts()

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
}

onMounted(() => {
  if (!import.meta.client) return

  // Parallax suave en el hero title
  gsap.to('.hero-title', {
    y: 100,
    opacity: 0.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
})
</script>

<template>
  <div class="bg-transparent min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-24 max-w-[90rem] mx-auto px-6 md:px-12">
      <div class="w-full text-center max-w-5xl mx-auto">
        <p class="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-semibold mb-8">Artesanía & Precisión</p>
        <h1 class="text-6xl md:text-8xl font-['Fraunces',serif] text-[#2C241B] mb-10 leading-[1.1]">
          Creado para la<br />
          <em class="text-[#C5A059] font-light italic">Eternidad.</em>
        </h1>
        <p class="text-[#2C241B]/70 text-lg md:text-xl font-['DM_Sans',sans-serif] max-w-2xl mx-auto leading-relaxed mb-12">
          Diseño noble. Madera real trabajada a mano.<br />Descubre nuestra colección de mobiliario de autor.
        </p>
        <UButton to="/shop" :ui="{ rounded: 'rounded-sm' }" class="bg-[#2C241B] text-[#F9F6F0] hover:bg-[#C5A059] hover:text-[#2C241B] border border-transparent hover:border-[#C5A059] transition-all duration-500 px-10 py-4 uppercase tracking-[0.2em] font-semibold text-xs ring-0 focus:ring-0 shadow-lg shadow-[#2C241B]/10 hover:shadow-xl">
          Explorar Colección
        </UButton>
      </div>
    </section>

    <!-- Lista de Productos -->
    <section class="py-32 max-w-[90rem] mx-auto px-6 md:px-12">
      <div class="w-full">
        <div class="flex flex-col md:flex-row justify-between items-end border-b border-[#EAE5DC] pb-8 mb-16">
          <h3 class="text-4xl md:text-5xl font-['Fraunces',serif] text-[#2C241B] m-0">Últimas Llegadas</h3>
          <span class="text-xs font-['DM_Sans',sans-serif] uppercase text-[#C5A059] font-semibold tracking-widest hidden md:block">Catálogo 2026</span>
        </div>
        
        <div v-if="pending" class="py-24 flex justify-center text-[#C5A059]">
          <UIcon name="i-lucide-loader-2" class="w-10 h-10 animate-spin" />
        </div>
        <div v-else-if="error" class="py-24 font-['DM_Sans',sans-serif] text-sm tracking-widest uppercase text-red-600 text-center">
          Error al cargar la colección.
        </div>
        <div v-else-if="!products || products.length === 0" class="py-24 font-['DM_Sans',sans-serif] text-sm tracking-widest uppercase text-[#2C241B]/50 text-center">
          La colección está vacía.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          
          <!-- Tarjeta de Producto -->
          <NuxtLink v-for="product in products" :key="product.id" :to="`/product/${product.id}`" class="group flex flex-col gap-6">
            
            <div class="w-full aspect-[4/5] bg-[#FDFBF7] relative overflow-hidden rounded-sm shadow-[0_4px_24px_rgba(44,36,27,0.03)] group-hover:shadow-[0_12px_40px_rgba(44,36,27,0.08)] transition-all duration-500">
              <img v-if="product.coverImage" :src="product.coverImage" :alt="product.name" class="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]" />
              
              <!-- Hover Overlay sutil con Oro -->
              <div class="absolute inset-0 bg-[#2C241B]/0 group-hover:bg-[#2C241B]/10 transition-colors duration-500 flex items-center justify-center">
                <span class="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-[#F9F6F0] text-[#2C241B] px-6 py-3 rounded-sm text-xs font-bold tracking-[0.2em] uppercase border border-[#C5A059]/30 flex items-center gap-2">
                  <UIcon name="i-lucide-eye" class="w-4 h-4 text-[#C5A059]" />
                  Ver Detalles
                </span>
              </div>
            </div>
            
            <div class="flex flex-col gap-2 px-2">
              <div class="flex justify-between items-start gap-4">
                <h4 class="font-['Fraunces',serif] text-2xl text-[#2C241B] transition-colors group-hover:text-[#C5A059]">{{ product.name }}</h4>
              </div>
              <span class="font-['Fraunces',serif] italic text-lg text-[#C5A059] whitespace-nowrap">{{ product.formattedPrice }}</span>
              <p class="font-['DM_Sans',sans-serif] text-sm text-[#2C241B]/60 line-clamp-2 leading-relaxed mt-2">{{ product.description }}</p>
            </div>
            
          </NuxtLink>
          
        </div>
      </div>
    </section>

  </div>
</template>