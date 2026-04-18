<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

onMounted(() => {
  authStore.loadFromCookies()
})

const logout = () => {
  authStore.logout()
  reloadNuxtApp() // Recargar para limpiar estado
}

const isDarkNav = computed(() => route.path === '/' || route.path.startsWith('/product'))
</script>

<template>
  <div class="font-['DM_Sans',sans-serif] bg-[#F9F6F0] text-[#2C241B] min-h-screen flex flex-col relative z-0 selection:bg-[#C5A059] selection:text-white">
    <!-- SVG Noise Layer -->
    <div class="pointer-events-none fixed inset-0 z-[-1] opacity-[0.03] mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-40 bg-[#F9F6F0]/95 backdrop-blur-md text-[#2C241B] border-b border-[#EAE5DC] shadow-[0_4px_30px_rgba(44,36,27,0.02)]">
      <div class="max-w-[90rem] mx-auto px-4 md:px-8 lg:px-12 h-24 flex items-center justify-between">
        <NuxtLink to="/" class="text-4xl font-['Fraunces',serif] font-medium tracking-wide">
          Artisan<span class="text-[#C5A059] italic">.</span>
        </NuxtLink>
        
        <nav class="hidden md:flex items-center gap-12 font-['DM_Sans',sans-serif] text-xs font-semibold tracking-[0.15em] uppercase text-[#2C241B]/70">
          <NuxtLink to="/" class="hover:text-[#C5A059] transition-colors duration-300" active-class="text-[#C5A059]">Inicio</NuxtLink>
          <NuxtLink to="/shop" class="hover:text-[#C5A059] transition-colors duration-300" active-class="text-[#C5A059]">Colección</NuxtLink>
          <NuxtLink to="/about" class="hover:text-[#C5A059] transition-colors duration-300" active-class="text-[#C5A059]">Nuestro Oficio</NuxtLink>
        </nav>

        <div class="flex items-center gap-8">
          <ClientOnly>
            <div v-if="authStore.isAuthenticated" class="flex items-center gap-6 font-['DM_Sans',sans-serif] text-xs font-semibold tracking-[0.15em] uppercase text-[#2C241B]/70">
              <span class="hidden sm:inline-block">Hola, {{ authStore.user?.name }}</span>
              <NuxtLink v-if="authStore.isAdmin" to="/admin" class="hover:text-[#C5A059] transition-colors">Admin</NuxtLink>
              <button @click="logout" class="hover:text-[#C5A059] transition-colors">Salir</button>
            </div>
            <div v-else class="flex items-center font-['DM_Sans',sans-serif] text-xs font-semibold tracking-[0.15em] uppercase text-[#2C241B]/70">
              <NuxtLink to="/login" class="hover:text-[#C5A059] transition-colors duration-300">Entrar</NuxtLink>
            </div>
            <template #fallback>
              <div class="w-12 h-3 bg-black/5 animate-pulse"></div>
            </template>
          </ClientOnly>
          
          <button @click="cartStore.toggleCart" class="relative text-[#2C241B] hover:text-[#C5A059] transition-colors duration-300">
            <UIcon name="i-lucide-shopping-bag" class="w-5 h-5 font-light" />
            <span v-if="cartStore.cartCount > 0" class="absolute -top-1 -right-2 bg-[#C5A059] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {{ cartStore.cartCount }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Shopping Cart Slideover (Tailwind Custom for max control) -->
    <ClientOnly>
      <div v-if="cartStore.isOpen" class="fixed inset-0 z-[100] flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-[#2C241B]/20 backdrop-blur-sm transition-opacity" @click="cartStore.toggleCart"></div>
        
        <!-- Panel -->
        <div class="relative w-full max-w-md h-full bg-[#FDFBF7] shadow-2xl border-l border-[#EAE5DC] flex flex-col transform transition-transform duration-500">
          <!-- Header Cart -->
          <div class="px-8 py-8 flex items-center justify-between border-b border-[#EAE5DC]">
            <h2 class="font-['Fraunces',serif] text-3xl text-[#2C241B]">Tu Cesta</h2>
            <button @click="cartStore.toggleCart" class="text-[#2C241B]/50 hover:text-[#2C241B] transition-colors">
              <UIcon name="i-lucide-x" class="w-6 h-6" />
            </button>
          </div>
          
          <!-- Cart Items -->
          <div class="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
            <div v-if="cartStore.items.length === 0" class="flex flex-col items-center justify-center h-full text-[#2C241B]/50 gap-4">
              <UIcon name="i-lucide-shopping-bag" class="w-12 h-12 text-[#EAE5DC]" />
              <p class="text-xs uppercase tracking-[0.2em] font-semibold">Tu cesta está vacía</p>
            </div>
            
            <div v-else v-for="item in cartStore.items" :key="item.product.id" class="flex gap-4 items-center bg-white p-3 rounded-sm border border-[#EAE5DC] shadow-sm">
              <div class="w-20 h-24 bg-[#F9F6F0] rounded-sm overflow-hidden flex-shrink-0 relative">
                <img v-if="item.product.coverImage" :src="item.product.coverImage" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1">
                <h4 class="font-['Fraunces',serif] text-lg text-[#2C241B] line-clamp-1">{{ item.product.name }}</h4>
                <p class="text-xs text-[#2C241B]/60 mt-1">Cantidad: {{ item.quantity }}</p>
                <p class="text-sm font-['Fraunces',serif] text-[#C5A059] italic mt-2">{{ item.product.formattedPrice }}</p>
              </div>
              <button @click="cartStore.removeFromCart(item.product.id)" class="text-red-400 hover:text-red-600 transition-colors p-2">
                <UIcon name="i-lucide-trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Cart Footer -->
          <div v-if="cartStore.items.length > 0" class="p-8 border-t border-[#EAE5DC] bg-[#F9F6F0]">
            <div class="flex justify-between items-center mb-6">
              <span class="text-sm uppercase tracking-widest font-semibold text-[#2C241B]/60">Subtotal</span>
              <span class="font-['Fraunces',serif] text-2xl text-[#2C241B]">{{ cartStore.cartTotal }}</span>
            </div>
            <UButton to="/shop" @click="cartStore.toggleCart" :ui="{ rounded: 'rounded-sm' }" class="w-full py-4 uppercase tracking-[0.2em] bg-[#2C241B] text-[#F9F6F0] hover:bg-[#C5A059] hover:text-[#2C241B] justify-center text-xs font-bold transition-all duration-300">
              Seguir Comprando
            </UButton>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Page Content -->
    <main class="flex-grow pt-28">
      <slot />
    </main>
    
    <!-- Footer Raw Brutalist -->
    <footer class="bg-[#1A1510] text-[#F9F6F0] pt-24 pb-12 px-8 md:px-16 mt-auto">
      <div class="max-w-[90rem] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
        <div>
          <div class="text-4xl font-['Fraunces',serif] tracking-wide font-light mb-4">
            Artisan<span class="text-[#C5A059] italic">.</span>
          </div>
          <p class="text-[#F9F6F0]/60 font-['DM_Sans',sans-serif] text-sm tracking-wide max-w-sm pl-4 border-l border-[#C5A059]/30">
            Ebanistería de autor. Piezas únicas talladas con precisión para espacios extraordinarios.
          </p>
        </div>
        <div class="flex flex-col items-end gap-6">
          <div class="flex gap-8 text-[#C5A059]">
            <UIcon name="i-simple-icons-instagram" class="w-5 h-5 hover:text-white transition-colors duration-300 cursor-pointer" />
            <UIcon name="i-simple-icons-pinterest" class="w-5 h-5 hover:text-white transition-colors duration-300 cursor-pointer" />
          </div>
        </div>
      </div>
      <div class="max-w-[90rem] mx-auto border-t border-[#F9F6F0]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-['DM_Sans',sans-serif] text-xs tracking-widest uppercase text-[#F9F6F0]/40">
        <p>© 2026 ARTISAN WOODWORKS.</p>
        <div class="flex gap-8">
          <NuxtLink to="/privacy" class="hover:text-[#C5A059] transition-colors">PRIVACIDAD</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-[#C5A059] transition-colors">TÉRMINOS</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>