<script setup lang="ts">
const route = useRoute()
const userCookie = useCookie<{ id: number, name: string, role: string } | null>('user_data')
const authCookie = useCookie('auth_token')

const logout = () => {
  authCookie.value = null
  userCookie.value = null
  reloadNuxtApp() // Recargar para limpiar estado
}
</script>

<template>
  <div class="font-['DM_Sans',sans-serif] bg-[#F9F6F0] text-[#2C241B] min-h-screen flex flex-col relative z-0 selection:bg-[#C5A059] selection:text-white">
    <!-- SVG Noise Layer -->
    <div class="pointer-events-none fixed inset-0 z-[-1] opacity-[0.03] mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-[#F9F6F0]/95 backdrop-blur-md text-[#2C241B] border-b border-[#EAE5DC] shadow-[0_4px_30px_rgba(44,36,27,0.02)]">
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
            <div v-if="userCookie" class="flex items-center gap-6 font-['DM_Sans',sans-serif] text-xs font-semibold tracking-[0.15em] uppercase text-[#2C241B]/70">
              <span class="hidden sm:inline-block">Hola, {{ userCookie.name }}</span>
              <NuxtLink v-if="userCookie.role === 'admin'" to="/admin" class="hover:text-[#C5A059] transition-colors">Admin</NuxtLink>
              <button @click="logout" class="hover:text-[#C5A059] transition-colors">Salir</button>
            </div>
            <div v-else class="flex items-center font-['DM_Sans',sans-serif] text-xs font-semibold tracking-[0.15em] uppercase text-[#2C241B]/70">
              <NuxtLink to="/login" class="hover:text-[#C5A059] transition-colors duration-300">Entrar</NuxtLink>
            </div>
            <template #fallback>
              <div class="w-12 h-3 bg-black/5 animate-pulse"></div>
            </template>
          </ClientOnly>
          
          <button class="text-[#2C241B] hover:text-[#C5A059] transition-colors duration-300">
            <UIcon name="i-lucide-shopping-bag" class="w-5 h-5 font-light" />
          </button>
        </div>
      </div>
    </header>

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