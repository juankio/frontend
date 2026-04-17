<script setup lang="ts">
// Navbar simple invisible / difuminado
const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
})
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Navbar Premium -->
    <header 
      class="fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4 flex justify-between items-center"
      :class="isScrolled ? 'bg-[#F9F8F6]/80 backdrop-blur-md border-b border-wood-200/50 py-3' : 'bg-transparent py-6'"
    >
      <div class="text-2xl font-serif tracking-widest font-medium uppercase">
        Artisan.
      </div>
      
      <nav class="hidden md:flex gap-8 items-center text-sm tracking-wide font-medium">
        <NuxtLink to="/" class="hover:text-wood-500 transition-colors">Home</NuxtLink>
        <NuxtLink to="/shop" class="hover:text-wood-500 transition-colors">Collection</NuxtLink>
        <NuxtLink to="/about" class="hover:text-wood-500 transition-colors">Our Craft</NuxtLink>
      </nav>

      <div class="flex items-center gap-4">
        <UButton variant="ghost" color="neutral" icon="i-lucide-shopping-cart" />
        <UButton class="md:hidden" variant="ghost" color="neutral" icon="i-lucide-menu" />
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="bg-wood-950 text-wood-50 py-24 px-6 md:px-24">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 class="text-3xl font-serif mb-6">Artisan.</h3>
          <p class="text-wood-300 max-w-sm">Crafting timeless wooden pieces for the modern home. Built to last generations.</p>
        </div>
        <div>
          <h4 class="font-bold mb-6 text-sm tracking-wider uppercase text-wood-400">Shop</h4>
          <ul class="space-y-4 text-wood-300">
            <li><a href="#" class="hover:text-white transition">Chairs</a></li>
            <li><a href="#" class="hover:text-white transition">Tables</a></li>
            <li><a href="#" class="hover:text-white transition">Lounge</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold mb-6 text-sm tracking-wider uppercase text-wood-400">Legal</h4>
          <ul class="space-y-4 text-wood-300">
            <li><a href="#" class="hover:text-white transition">Terms</a></li>
            <li><a href="#" class="hover:text-white transition">Privacy</a></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>