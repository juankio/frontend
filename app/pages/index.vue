<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { products, pending, error, refresh } = useProducts()
const isGenerating = ref(false)
const activeProduct3D = ref<any>(null)
const isCheckoutOpen = ref(false)
const isProcessingPayment = ref(false)
const paymentStatus = ref<'idle' | 'success' | 'error'>('idle')

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

const generate3D = async (product: any) => {
  if (product.model3DUrl) {
    activeProduct3D.value = product
    return
  }

  isGenerating.value = true
  activeProduct3D.value = product
  
  try {
    const res = await $fetch('http://127.0.0.1:5000/api/generate-3d', {
      method: 'POST',
      body: { productId: product.id, imageUrl: product.coverImage }
    })
    
    if (res.success) {
      await refresh() // Recarga productos
      activeProduct3D.value = products.value?.find((p: any) => p.id === product.id)
    }
  } catch (err) {
    console.error(err)
  } finally {
    isGenerating.value = false
  }
}

const scrollToViewer = () => {
  if (import.meta.client) {
    document.getElementById('viewer3d')?.scrollIntoView({ behavior: 'smooth' })
  }
}

const initiateCheckout = async () => {
  if (!activeProduct3D.value) return
  
  isProcessingPayment.value = true
  isCheckoutOpen.value = true
  
  try {
    // 1. Obtener Client Secret de Stripe desde nuestro Backend
    const res = await $fetch('http://127.0.0.1:5000/api/create-payment-intent', {
      method: 'POST',
      body: { productId: activeProduct3D.value.id }
    })
    
    if(res.success) {
      // 2. Aquí invocaríamos Stripe.js Elements con el clientSecret real.
      // Como estamos simulando por seguridad, haremos un delay.
      setTimeout(() => {
        isProcessingPayment.value = false
        paymentStatus.value = 'success'
      }, 2500)
    } else {
      throw new Error("Fallo crear intento")
    }
  } catch(e) {
    console.error(e)
    isProcessingPayment.value = false
    paymentStatus.value = 'error'
  }
}

const closeCheckout = () => {
  isCheckoutOpen.value = false
}
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
          Creado para la<br />Eternidad.
        </h1>
        <p class="text-[#4B3723] text-lg md:text-xl font-light tracking-wide max-w-xl mx-auto mb-10">
          Descubre nuestra colección de muebles de madera premium. El diseño minimalista se encuentra con la ebanistería tradicional.
        </p>
        <UButton color="neutral" size="xl" variant="solid" class="rounded-none px-8 py-4 tracking-widest uppercase font-semibold hover:bg-wood-900 transition-colors" @click="scrollToViewer">
          Explorar Colección
        </UButton>
      </div>
    </section>

    <!-- Scrollytelling 3D Section -->
    <section class="h-[200vh] relative bg-[#F7F5F2]" id="viewer3d">
      <div class="sticky top-0 h-screen flex items-center justify-center">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-7xl px-6">
          <div class="flex flex-col justify-center">
            <h2 class="text-4xl md:text-6xl font-serif mb-6 text-[#1C1A17]">La Anatomía del<br />Confort</h2>
            <p class="text-[#715233] text-lg mb-8 max-w-md">
              <span v-if="activeProduct3D">Viendo ahora: <strong>{{ activeProduct3D.name }}</strong>. Observa cómo la obra maestra se ensambla y desensambla mediante el scroll.</span>
              <span v-else>Selecciona un producto de la colección abajo y genera su modelo 3D usando nuestro motor de IA.</span>
            </p>
            
            <div class="flex flex-col gap-6" v-if="activeProduct3D">
              <div class="text-3xl font-serif text-[#1C1A17]">{{ activeProduct3D.formattedPrice }}</div>
              <div class="flex gap-4">
                <UButton @click="initiateCheckout" color="neutral" size="lg" class="px-8 rounded-none uppercase tracking-widest bg-[#1C1A17] text-white">
                  Comprar Ahora
                </UButton>
              </div>
            </div>
          </div>
          
          <!-- Visor 3D -->
          <div class="h-[500px] w-full bg-[#EAE3D9] rounded-2xl relative flex items-center justify-center overflow-hidden border border-[#DCD0C0] shadow-inner">
             <div v-if="!activeProduct3D?.model3DUrl" class="absolute z-10 flex flex-col items-center justify-center text-[#A5845C] pointer-events-none">
                <UIcon :name="isGenerating ? 'i-lucide-loader-2' : 'i-lucide-box'" class="w-16 h-16 mb-4" :class="{ 'animate-spin': isGenerating, 'opacity-50': !isGenerating }" />
                <p class="font-medium tracking-wide">{{ isGenerating ? 'Motor IA Procesando Imagen...' : 'Ningún Modelo Seleccionado' }}</p>
                <p class="text-xs mt-2 text-[#8C6A42]">Haz clic en "Convertir a 3D" en un producto de abajo</p>
             </div>
             
             <!-- El componente 3D -->
             <ClientOnly v-if="activeProduct3D?.model3DUrl">
                <Suspense>
                  <Product3DViewer class="w-full h-full cursor-move" :modelPath="activeProduct3D.model3DUrl" />
                  <template #fallback>
                    <div class="w-full h-full flex items-center justify-center text-[#A5845C]">Cargando Geometría...</div>
                  </template>
                </Suspense>
             </ClientOnly>
          </div>
        </div>
      </div>
    </section>

    <!-- Grid Productos -->
    <section class="py-32 px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <h3 class="text-3xl font-serif mb-16 text-center text-[#1C1A17]">Últimas Llegadas</h3>
        
        <div v-if="pending" class="flex justify-center items-center py-20">
           <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-[#A5845C] animate-spin" />
        </div>
        <div v-else-if="error" class="text-center py-20 text-red-600">
           Error al cargar la colección: Asegúrate de que el backend esté corriendo (bun run start).
        </div>
        <div v-else-if="!products || products.length === 0" class="text-center py-20 text-[#A5845C]">
           No hay productos disponibles. Ejecuta "bun run db:seed" en el backend.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div v-for="product in products" :key="product.id" class="group relative">
            <div class="bg-[#F7F5F2] aspect-[4/5] mb-6 overflow-hidden relative rounded-xl">
              <img v-if="product.coverImage" :src="product.coverImage" :alt="product.name" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div v-else class="absolute inset-0 bg-[#DCD0C0] transition-transform duration-700 group-hover:scale-105"></div>
              
              <!-- Boton accion flotante -->
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <UButton
                  @click="generate3D(product); scrollToViewer()"
                  color="neutral"
                  variant="outline"
                  class="rounded-full px-6 font-medium shadow-xl bg-white"
                  :icon="product.model3DUrl ? 'i-lucide-eye' : 'i-lucide-wand-2'"
                >
                  {{ product.model3DUrl ? 'Ver 3D' : 'Convertir a 3D' }}
                </UButton>
              </div>
            </div>
            
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-serif text-xl mb-1 text-[#1C1A17]">{{ product.name }}</h4>
                <p class="text-[#A5845C] text-sm line-clamp-1">{{ product.description }}</p>
              </div>
              <span class="font-medium text-[#1C1A17]">{{ product.formattedPrice }}</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>

    <!-- Modal de Checkout -->
    <UModal v-model:open="isCheckoutOpen" title="Pago Seguro" @after:leave="paymentStatus = 'idle'">
      <template #body>
        <div class="flex flex-col items-center justify-center text-center py-6">
          <div v-if="isProcessingPayment">
            <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-[#A5845C] animate-spin mb-4 mx-auto" />
            <p class="text-[#1C1A17] font-medium">Contactando servidores de Stripe...</p>
            <p class="text-sm text-[#8C6A42] mt-2">Procesando tu pago para {{ activeProduct3D?.name }}</p>
          </div>

          <div v-else-if="paymentStatus === 'success'">
            <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-lucide-check" class="w-8 h-8" />
            </div>
            <p class="text-2xl font-serif text-[#1C1A17] mb-2">¡Pago Exitoso!</p>
            <p class="text-sm text-[#715233]">Tu pieza artesanal será creada y enviada en un plazo de 14 días. Hemos enviado un recibo a tu correo electrónico.</p>
          </div>

          <div v-else-if="paymentStatus === 'error'">
            <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-lucide-x" class="w-8 h-8" />
            </div>
            <p class="text-2xl font-serif text-[#1C1A17] mb-2">El pago falló</p>
            <p class="text-sm text-[#715233]">Hubo un problema al procesar tu tarjeta. Por favor intenta de nuevo.</p>
          </div>
        </div>
      </template>

      <template #footer v-if="paymentStatus !== 'idle'">
        <div class="flex justify-center w-full">
          <UButton @click="isCheckoutOpen = false" color="neutral" class="w-full justify-center py-3 uppercase tracking-widest font-semibold rounded-none">
            Cerrar
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>