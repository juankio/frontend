<template>
  <div class="absolute inset-0 w-full h-full z-20 bg-[#FDFBF7] overflow-hidden group/viewer transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]">
    <!-- Fondo suave radial que oscurece sutilmente las esquinas -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(44,36,27,0.06)_100%)]"></div>

    <!-- Imagen Original (Ampliación muy sutil, cinemática) -->
    <img :src="imageUrl" :alt="productName" class="absolute inset-0 w-full h-full object-contain p-8 md:p-16 transition-transform duration-[4s] ease-out scale-[1.02] group-hover/viewer:scale-[1.05]" />

    <!-- Overlay general ultra-sutil (Glassmorphism ligero) para no matar los colores de la foto -->
    <div class="absolute inset-0 bg-[#FDFBF7]/10 backdrop-blur-[2px] transition-all duration-1000"></div>

    <!-- Líneas guía decorativas (Aportan el toque "Técnico/Arquitectónico" sin ser feo) -->
    <div class="absolute inset-0 pointer-events-none opacity-20">
      <div class="absolute left-1/3 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#C5A059] to-transparent"></div>
      <div class="absolute right-1/3 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#C5A059] to-transparent"></div>
      <div class="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent"></div>
    </div>

    <!-- Hotspots dinámicos desde la BD -->
    <template v-if="parsedHotspots.length > 0">
      <div v-for="(hotspot, i) in parsedHotspots" :key="i" class="absolute z-30 group/hotspot" :style="{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }">
        <!-- El Botón Minimalista -->
        <button class="w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center relative cursor-crosshair">
          <!-- Anillo exterior fijo -->
          <span class="absolute inset-1 rounded-full border border-[#C5A059]/40 group-hover/hotspot:border-[#C5A059] transition-colors duration-500"></span>
          <!-- Anillo animado (sonar) -->
          <span class="absolute inset-1 rounded-full border border-[#C5A059] animate-ping opacity-30 duration-1000" :style="{ animationDelay: `${i * 0.4}s` }"></span>
          <!-- Núcleo -->
          <div class="w-1.5 h-1.5 rounded-full bg-[#C5A059] transition-all duration-500 group-hover/hotspot:scale-[2] group-hover/hotspot:bg-[#2C241B]"></div>
        </button>
        
        <!-- Tooltip Elegante -->
        <!-- Dinámicamente lo posicionamos a la derecha o izquierda para que no se salga de la pantalla -->
        <div :class="[
          'absolute top-1/2 -translate-y-1/2 w-64 bg-[#FDFBF7]/95 backdrop-blur-md border border-[#EAE5DC] text-[#2C241B] p-6 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none shadow-[0_20px_40px_-15px_rgba(44,36,27,0.1)] z-40',
          hotspot.x > 50 ? 'right-12 translate-x-4 group-hover/hotspot:translate-x-0' : 'left-12 -translate-x-4 group-hover/hotspot:translate-x-0'
        ]" class="group-hover/hotspot:opacity-100">
          <!-- Línea conectora visual -->
          <div :class="[
            'absolute top-1/2 w-4 h-[1px] bg-[#C5A059]/50',
            hotspot.x > 50 ? '-right-4' : '-left-4'
          ]"></div>
          <h4 class="font-['Fraunces',serif] text-lg text-[#2C241B] mb-2 italic">{{ hotspot.title }}</h4>
          <p class="font-['DM_Sans',sans-serif] text-xs leading-relaxed text-[#2C241B]/70">{{ hotspot.description }}</p>
        </div>
      </div>
    </template>
    
    <!-- Mensaje si no hay hotspots -->
    <div v-else class="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
       <p class="text-[#2C241B]/40 font-['DM_Sans',sans-serif] text-[10px] uppercase tracking-[0.4em] font-bold">Modo de Inspección Visual</p>
    </div>

    <!-- Texto decorativo inferior -->
    <div class="absolute bottom-8 w-full text-center z-10 pointer-events-none">
      <div class="inline-flex items-center gap-3">
        <div class="w-8 h-[1px] bg-[#C5A059]/30"></div>
        <p class="text-[#2C241B]/60 font-['DM_Sans',sans-serif] text-[9px] uppercase tracking-[0.4em] font-bold">
          {{ parsedHotspots.length > 0 ? 'Pase el cursor para explorar el oficio' : 'Detalle de la pieza' }}
        </p>
        <div class="w-8 h-[1px] bg-[#C5A059]/30"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  imageUrl: string,
  productName: string,
  hotspots?: string
}>()

const parsedHotspots = computed(() => {
  if (!props.hotspots) return []
  try {
    return JSON.parse(props.hotspots)
  } catch(e) {
    return []
  }
})
</script>
