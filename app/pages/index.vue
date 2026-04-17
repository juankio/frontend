<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  <div>
    <!-- Hero Section -->
    <section class="hero-section relative h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <!-- Textura abstracta de madera via CSS puro -->
        <div class="w-full h-full bg-[#EAE3D9] opacity-30" style="background-image: repeating-linear-gradient(45deg, #DCD0C0 25%, transparent 25%, transparent 75%, #DCD0C0 75%, #DCD0C0), repeating-linear-gradient(45deg, #DCD0C0 25%, #EAE3D9 25%, #EAE3D9 75%, #DCD0C0 75%, #DCD0C0); background-position: 0 0, 10px 10px; background-size: 20px 20px;"></div>
      </div>
      <div class="relative z-10 text-center px-4 mt-16">
        <h1 class="hero-title text-5xl md:text-8xl font-serif text-[#1C1A17] mb-6">
          Crafted for<br />Eternity.
        </h1>
        <p class="text-[#4B3723] text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto mb-10">
          Discover our collection of premium wooden furniture. Minimalist design meets traditional joinery.
        </p>
        <UButton color="neutral" size="xl" variant="solid" class="rounded-none px-8 py-4 tracking-widest uppercase font-semibold hover:bg-wood-900 transition-colors">
          Explore Collection
        </UButton>
      </div>
    </section>

    <!-- Scrollytelling 3D Section -->
    <section class="h-[200vh] relative bg-[#F7F5F2]">
      <div class="sticky top-0 h-screen flex items-center justify-center">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-7xl px-6">
          <div class="flex flex-col justify-center">
            <h2 class="text-4xl md:text-6xl font-serif mb-6 text-[#1C1A17]">The Anatomy of<br />Comfort</h2>
            <p class="text-[#715233] text-lg mb-8 max-w-md">
              Every joint is meticulously calculated. We don't use screws, we use friction and physics. Watch the masterpiece assemble itself.
            </p>
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-full border border-[#CBB9A2] flex items-center justify-center text-xs text-[#1C1A17]">01</div>
              <div class="w-12 h-12 rounded-full border border-[#CBB9A2] flex items-center justify-center text-xs text-[#1C1A17]">02</div>
              <div class="w-12 h-12 rounded-full border border-[#CBB9A2] flex items-center justify-center text-xs text-[#1C1A17]">03</div>
            </div>
          </div>
          
          <!-- Visor 3D -->
          <div class="h-[500px] w-full bg-[#EAE3D9] rounded-2xl relative flex items-center justify-center overflow-hidden border border-[#DCD0C0]">
             <div class="absolute z-10 flex flex-col items-center justify-center text-[#A5845C] pointer-events-none">
                <UIcon name="i-lucide-box" class="w-16 h-16 mb-4 opacity-50" />
                <p class="font-medium tracking-wide">Interactive 3D Viewer</p>
                <p class="text-xs mt-2 text-[#8C6A42]">TresJS + GSAP Engine</p>
             </div>
             
             <!-- El componente 3D iría aquí, de momento es un canvas placeholder -->
             <div class="absolute inset-0 bg-gradient-to-t from-[#DCD0C0]/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grid Productos -->
    <section class="py-32 px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <h3 class="text-3xl font-serif mb-16 text-center text-[#1C1A17]">Latest Arrivals</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div class="group cursor-pointer">
            <div class="bg-[#F7F5F2] aspect-[4/5] mb-6 overflow-hidden relative">
              <div class="absolute inset-0 bg-[#DCD0C0] transition-transform duration-700 group-hover:scale-105"></div>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-serif text-xl mb-1 text-[#1C1A17]">Oak Lounge</h4>
                <p class="text-[#A5845C] text-sm">Solid European Oak</p>
              </div>
              <span class="font-medium text-[#1C1A17]">$1,200</span>
            </div>
          </div>
          
          <div class="group cursor-pointer">
            <div class="bg-[#F7F5F2] aspect-[4/5] mb-6 overflow-hidden relative">
              <div class="absolute inset-0 bg-[#CBB9A2] transition-transform duration-700 group-hover:scale-105"></div>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-serif text-xl mb-1 text-[#1C1A17]">Walnut Stool</h4>
                <p class="text-[#A5845C] text-sm">American Walnut</p>
              </div>
              <span class="font-medium text-[#1C1A17]">$450</span>
            </div>
          </div>

          <div class="group cursor-pointer">
            <div class="bg-[#F7F5F2] aspect-[4/5] mb-6 overflow-hidden relative">
              <div class="absolute inset-0 bg-[#B79D7C] transition-transform duration-700 group-hover:scale-105"></div>
            </div>
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-serif text-xl mb-1 text-[#1C1A17]">Ash Dining Table</h4>
                <p class="text-[#A5845C] text-sm">White Ash Wood</p>
              </div>
              <span class="font-medium text-[#1C1A17]">$2,800</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  </div>
</template>