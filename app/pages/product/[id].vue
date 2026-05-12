<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const { products, pending, refresh } = useProducts()
const cartStore = useCartStore()

const productId = computed(() => Number(route.params.id))
const product = computed(() => products.value?.find((p: any) => p.id === productId.value))


const isInspectingMode = ref(false)
const isCheckoutOpen = ref(false)
const isProcessingPayment = ref(false)
const paymentStatus = ref<'idle' | 'success' | 'error'>('idle')

// Watch for view change is no longer needed since we aren't loading 3d models

// Checkout Form
const userCookie = useCookie<{ name: string, email: string, address: string, id: number } | null>('user_data')

const checkoutForm = ref({
  name: userCookie.value?.name || '',
  email: userCookie.value?.email || '',
  address: userCookie.value?.address || '',
  cardNumber: '',
  expiry: '',
  cvc: ''
})

// Update the title
watchEffect(() => {
  if (product.value) {
    useHead({ title: `${product.value.name} | Artisan` })
  }
})

const toast = useToast()



const initiateCheckout = async () => {
  if (!product.value) return
  
  // Basic validation
  if (!checkoutForm.value.name || !checkoutForm.value.email || !checkoutForm.value.address) {
    alert("Por favor completa los datos de envío primero.")
    return
  }
  
  isProcessingPayment.value = true
  
  try {
    const res: any = await $fetch('http://127.0.0.1:5000/api/create-payment-intent', {
      method: 'POST',
      body: { 
        productId: product.value.id,
        userId: userCookie.value?.id || null,
        customerDetails: {
          name: checkoutForm.value.name,
          email: checkoutForm.value.email,
          address: checkoutForm.value.address
        }
      }
    })
    
    if(res.success) {
      setTimeout(() => {
        isProcessingPayment.value = false
        paymentStatus.value = 'success'
        refresh() // Actualizar el stock
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
</script>

<template>
  <div class="min-h-screen bg-[#F9F6F0] font-['DM_Sans',sans-serif]">
    
    <div v-if="pending" class="h-screen flex flex-col items-center justify-center">
      <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-[#C5A059] animate-spin mb-4" />
      <p class="text-[#C5A059] text-xs font-semibold tracking-[0.2em] uppercase">Preparando Pieza...</p>
    </div>

    <div v-else-if="!product" class="h-screen flex flex-col items-center justify-center text-[#2C241B]">
      <h1 class="text-4xl font-['Fraunces',serif] mb-6">Pieza no encontrada</h1>
      <UButton to="/shop"  class="bg-transparent border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2C241B] hover:border-[#C5A059] uppercase tracking-[0.2em] px-8 py-3 text-xs font-bold transition-all duration-500">
        Volver a la colección
      </UButton>
    </div>

    <!-- Layout Dividido 50/50 -->
    <div v-else class="flex flex-col md:flex-row min-h-[calc(100vh-7rem)]">
      
      <!-- Lado Izquierdo: Info del Producto -->
      <div class="w-full md:w-1/2 flex flex-col order-2 md:order-1">
        
        <!-- Bloque Principal -->
        <div class="p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <NuxtLink to="/shop" class="text-[#C5A059] hover:text-[#2C241B] flex items-center gap-3 mb-16 w-max transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
            Volver a la galería
          </NuxtLink>
        
        <h1 class="text-5xl md:text-7xl font-['Fraunces',serif] text-[#2C241B] mb-8 leading-[1.1]">{{ product.name }}</h1>
        <p class="text-[#2C241B]/70 text-lg mb-10 leading-relaxed max-w-lg">{{ product.description }}</p>
        
        <div class="grid grid-cols-3 gap-4 mb-10">
          <div v-if="product.material" class="bg-[#FDFBF7] border border-[#EAE5DC] p-4 rounded-sm flex flex-col items-center text-center gap-3 hover:border-[#C5A059]/40 transition-colors">
            <UIcon name="i-lucide-tree-deciduous" class="w-6 h-6 text-[#C5A059]" />
            <span class="text-[9px] uppercase tracking-[0.2em] font-bold text-[#2C241B]/60">Material</span>
            <span class="text-[#2C241B] text-xs font-semibold leading-tight">{{ product.material }}</span>
          </div>
          <div v-if="product.dimensions" class="bg-[#FDFBF7] border border-[#EAE5DC] p-4 rounded-sm flex flex-col items-center text-center gap-3 hover:border-[#C5A059]/40 transition-colors">
            <UIcon name="i-lucide-ruler" class="w-6 h-6 text-[#C5A059]" />
            <span class="text-[9px] uppercase tracking-[0.2em] font-bold text-[#2C241B]/60">Medidas</span>
            <span class="text-[#2C241B] text-xs font-semibold leading-tight">{{ product.dimensions }}</span>
          </div>
          <div class="bg-[#FDFBF7] border border-[#EAE5DC] p-4 rounded-sm flex flex-col items-center text-center gap-3 hover:border-[#C5A059]/40 transition-colors">
            <UIcon name="i-lucide-hammer" class="w-6 h-6 text-[#C5A059]" />
            <span class="text-[9px] uppercase tracking-[0.2em] font-bold text-[#2C241B]/60">Ensamblaje</span>
            <span class="text-[#2C241B] text-xs font-semibold leading-tight">Hecho a mano</span>
          </div>
        </div>
        
        <div class="text-4xl font-['Fraunces',serif] text-[#2C241B] mb-12 italic">{{ product.formattedPrice }}</div>
        
        <!-- Selector de Variantes (Simulado UI) -->
        <div class="mb-10">
          <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C6A42] mb-4">Seleccionar Acabado</p>
          <div class="flex gap-4">
            <!-- Opción 1 -->
            <button class="flex flex-col items-center gap-2 group cursor-pointer">
              <div class="w-12 h-12 rounded-full border-2 border-[#C5A059] p-0.5 transition-all">
                <div class="w-full h-full rounded-full bg-[#3E2723] shadow-inner"></div>
              </div>
              <span class="text-[9px] uppercase tracking-widest font-bold text-[#2C241B]">Nogal Oscuro</span>
            </button>
            <!-- Opción 2 -->
            <button class="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
              <div class="w-12 h-12 rounded-full border border-[#EAE5DC] p-0.5 group-hover:border-[#C5A059]/50 transition-all">
                <div class="w-full h-full rounded-full bg-[#8D6E63] shadow-inner"></div>
              </div>
              <span class="text-[9px] uppercase tracking-widest font-bold text-[#2C241B]/60 group-hover:text-[#2C241B]">Roble Tostado</span>
            </button>
            <!-- Opción 3 -->
            <button class="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
              <div class="w-12 h-12 rounded-full border border-[#EAE5DC] p-0.5 group-hover:border-[#C5A059]/50 transition-all">
                <div class="w-full h-full rounded-full bg-[#EFEBE9] shadow-inner"></div>
              </div>
              <span class="text-[9px] uppercase tracking-widest font-bold text-[#2C241B]/60 group-hover:text-[#2C241B]">Fresno Claro</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col xl:flex-row gap-4">
          <UButton @click="isCheckoutOpen = true" :disabled="product.stock <= 0"  class="px-8 py-5 uppercase tracking-[0.2em] bg-[#2C241B] text-[#F9F6F0] hover:bg-[#C5A059] hover:text-[#2C241B] border border-transparent hover:border-[#C5A059] justify-center text-xs font-bold transition-all duration-500 shadow-lg shadow-[#2C241B]/10 hover:shadow-xl flex-1">
            {{ product.stock > 0 ? 'Comprar Ahora' : 'Agotado' }}
          </UButton>
          
          <UButton @click="cartStore.addToCart(product)" :disabled="product.stock <= 0"  class="px-8 py-5 uppercase tracking-[0.2em] bg-transparent border border-[#EAE5DC] text-[#2C241B] hover:bg-[#FDFBF7] hover:border-[#C5A059] justify-center text-xs font-bold transition-all duration-500 flex-1">
            Añadir a Cesta
          </UButton>
        </div>

        <div class="mt-16 pt-8 border-t border-[#EAE5DC] mb-12">
          <div class="flex items-center justify-between text-xs font-medium tracking-widest text-[#2C241B]/60 uppercase">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-package" class="w-4 h-4 text-[#C5A059]" />
              <span v-if="product.stock > 0">Stock disponible ({{ product.stock }} uds)</span>
              <span v-else class="text-red-700">Agotado</span>
            </div>
            <div class="flex gap-4">
               <UTooltip text="Garantía de por vida" :popper="{ arrow: true }">
                 <UIcon name="i-lucide-shield-check" class="w-4 h-4 cursor-help hover:text-[#C5A059] transition-colors" />
               </UTooltip>
               <UTooltip text="Envío protegido 100%" :popper="{ arrow: true }">
                 <UIcon name="i-lucide-truck" class="w-4 h-4 cursor-help hover:text-[#C5A059] transition-colors" />
               </UTooltip>
               <UTooltip text="Madera sostenible" :popper="{ arrow: true }">
                 <UIcon name="i-lucide-leaf" class="w-4 h-4 cursor-help hover:text-[#C5A059] transition-colors" />
               </UTooltip>
            </div>
          </div>
        </div>

        <!-- Storytelling & El Oficio -->
        <div class="border-t border-[#EAE5DC] pt-16 mt-auto">
          <h2 class="font-['Fraunces',serif] text-3xl md:text-4xl text-[#2C241B] mb-8">El Oficio Detrás de la Pieza</h2>
          
          <div class="flex flex-col gap-12">
            <div class="flex items-start gap-6 group/story">
              <div class="w-16 h-16 shrink-0 bg-[#FDFBF7] rounded-sm border border-[#EAE5DC] flex items-center justify-center group-hover/story:border-[#C5A059]/50 transition-colors">
                <UIcon name="i-lucide-droplet" class="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h4 class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C6A42] mb-2">Acabado Orgánico</h4>
                <p class="text-[#2C241B]/70 text-sm leading-relaxed">
                  Tratamos cada superficie con una mezcla secreta de aceite de linaza y cera de abeja natural. Este proceso de tres días permite que la madera respire y desarrolle una pátina única con el paso de los años, sin sellar sus poros con barnices plásticos.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-6 group/story">
              <div class="w-16 h-16 shrink-0 bg-[#FDFBF7] rounded-sm border border-[#EAE5DC] flex items-center justify-center group-hover/story:border-[#C5A059]/50 transition-colors">
                <UIcon name="i-lucide-axe" class="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h4 class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C6A42] mb-2">Ensamblaje Tradicional</h4>
                <p class="text-[#2C241B]/70 text-sm leading-relaxed">
                  Rechazamos el uso de tornillos y clavos. Utilizamos uniones de cola de milano y caja y espiga cortadas a mano. Este método ancestral no solo es visualmente impresionante, sino que garantiza una estructura que durará por generaciones.
                </p>
              </div>
            </div>
            
            <div class="aspect-video w-full relative rounded-sm overflow-hidden bg-[#2C241B]">
               <img src="https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:scale-105 transition-transform duration-[2s]" />
               <div class="absolute inset-0 flex items-center justify-center">
                 <p class="font-['Fraunces',serif] text-white text-2xl italic">Taller de Bogotá, Colombia</p>
               </div>
            </div>
          </div>
        </div>

        <!-- Completa tu espacio (Cross-sell simulado) -->
        <div class="border-t border-[#EAE5DC] pt-16 mt-16 pb-16">
          <h2 class="font-['Fraunces',serif] text-2xl text-[#2C241B] mb-8">Completa tu espacio</h2>
          <div class="grid grid-cols-2 gap-6">
            <div class="group cursor-pointer">
              <div class="aspect-square bg-[#FDFBF7] rounded-sm border border-[#EAE5DC] mb-4 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=500&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <p class="font-['Fraunces',serif] text-[#2C241B] group-hover:text-[#C5A059] transition-colors">Mesa Rústica Auxiliar</p>
              <p class="text-[10px] tracking-widest uppercase text-[#8C6A42] mt-1">$450.000</p>
            </div>
            <div class="group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              <div class="aspect-square bg-[#FDFBF7] rounded-sm border border-[#EAE5DC] mb-4 overflow-hidden flex items-center justify-center">
                <UIcon name="i-lucide-lamp" class="w-8 h-8 text-[#C5A059]" />
              </div>
              <p class="font-['Fraunces',serif] text-[#2C241B] group-hover:text-[#C5A059] transition-colors">Lámpara de Pie Cobre</p>
              <p class="text-[10px] tracking-widest uppercase text-[#8C6A42] mt-1">$220.000</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <!-- Lado Derecho: Visor Fotográfico con Hotspots -->
      <div class="w-full md:w-1/2 h-[60vh] md:h-[calc(100vh-7rem)] bg-[#FDFBF7] relative order-1 md:order-2 border-l border-[#EAE5DC] flex flex-col items-center justify-center p-8 lg:p-16 md:sticky md:top-28 self-start">
        
        <div class="w-full aspect-[4/5] md:aspect-auto md:h-[80%] max-h-[800px] relative bg-[#F9F6F0] rounded-sm shadow-[0_20px_60px_rgba(44,36,27,0.05)] border border-[#EAE5DC] overflow-hidden group">
          
          <!-- View Toggle -->
          <div class="absolute top-4 right-4 z-50 flex bg-[#FDFBF7]/90 backdrop-blur-md rounded-sm shadow-[0_4px_20px_rgba(44,36,27,0.05)] border border-[#EAE5DC] p-1">
            <button @click="isInspectingMode = false" :class="!isInspectingMode ? 'bg-[#2C241B] text-[#F9F6F0]' : 'text-[#2C241B]/60 hover:text-[#2C241B]'" class="px-5 py-2 text-[9px] uppercase tracking-widest font-bold transition-all duration-300 rounded-sm">Galería</button>
            <button @click="isInspectingMode = true" :class="isInspectingMode ? 'bg-[#2C241B] text-[#F9F6F0]' : 'text-[#2C241B]/60 hover:text-[#2C241B]'" class="px-5 py-2 text-[9px] uppercase tracking-widest font-bold transition-all duration-300 rounded-sm">Detalles</button>
          </div>

          <!-- Imagen de Portada -->
          <img v-show="!isInspectingMode" :src="product.coverImage" :alt="product.name" class="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-[2s] group-hover:scale-[1.02]" />

          <!-- El componente de Detalles Artesanales (Hotspots) -->
          <ProductDetailsViewer v-if="isInspectingMode" :imageUrl="product.coverImage" :productName="product.name" :hotspots="product.hotspots" />
          
        </div>

        <button @click="isInspectingMode = true" v-if="!isInspectingMode" class="mt-8 flex items-center gap-2 text-[#C5A059] hover:text-[#2C241B] transition-colors text-[10px] font-bold uppercase tracking-[0.2em] z-30 relative">
          <UIcon name="i-lucide-search" class="w-4 h-4" />
          Análisis Artesanal
        </button>

      </div>
    </div>

    <!-- Modal de Checkout Premium -->
    <UModal v-model:open="isCheckoutOpen" title="Finalizar Compra">
      <template #body>
        <div v-if="isProcessingPayment" class="flex flex-col items-center justify-center text-center py-16">
          <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-[#A5845C] animate-spin mb-4 mx-auto" />
          <p class="text-[#1C1A17] font-medium text-lg">Procesando pago encriptado...</p>
          <p class="text-sm text-[#8C6A42] mt-2">Por favor, no cierres esta ventana.</p>
        </div>

        <div v-else-if="paymentStatus === 'success'" class="flex flex-col items-center justify-center text-center py-12">
          <div class="w-20 h-20 bg-[#EAE3D9] text-[#4B3723] rounded-full flex items-center justify-center mx-auto mb-6">
            <UIcon name="i-lucide-check" class="w-10 h-10" />
          </div>
          <p class="text-3xl font-serif text-[#1C1A17] mb-4">¡Orden Confirmada!</p>
          <p class="text-[#715233] mb-6">Hemos enviado los detalles a {{ checkoutForm.email }}</p>
          <UButton @click="isCheckoutOpen = false" color="neutral" class="bg-[#1C1A17] text-white px-8 py-3 rounded-none uppercase tracking-widest text-sm font-semibold">
            Volver a la tienda
          </UButton>
        </div>

        <div v-else-if="paymentStatus === 'error'" class="flex flex-col items-center justify-center text-center py-12">
          <div class="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-lucide-x" class="w-8 h-8" />
          </div>
          <p class="text-2xl font-serif text-[#1C1A17] mb-2">Pago Rechazado</p>
          <p class="text-sm text-[#715233] mb-6">El banco ha declinado la transacción. Por favor, revisa tus datos e intenta de nuevo.</p>
          <UButton @click="paymentStatus = 'idle'" color="neutral" variant="outline" class="px-8 py-3 rounded-none uppercase tracking-widest text-sm font-semibold">
            Intentar de nuevo
          </UButton>
        </div>

        <form v-else @submit.prevent="initiateCheckout" class="flex flex-col gap-6 p-2">
          <div class="mb-4 pb-4 border-b border-[#EAE3D9]">
            <h3 class="font-serif text-xl text-[#1C1A17] mb-1">Resumen del Pedido</h3>
            <div class="flex justify-between items-center text-[#715233]">
              <span>{{ product?.name }}</span>
              <span class="font-medium text-[#1C1A17]">{{ product?.formattedPrice }}</span>
            </div>
          </div>

          <div>
            <h4 class="text-sm uppercase tracking-widest font-semibold text-[#8C6A42] mb-4">Datos de Envío</h4>
            <div class="grid grid-cols-1 gap-4">
              <UInput v-model="checkoutForm.name" required color="neutral" variant="outline" placeholder="Nombre completo" icon="i-lucide-user" />
              <UInput v-model="checkoutForm.email" type="email" required color="neutral" variant="outline" placeholder="Correo electrónico" icon="i-lucide-mail" />
              <UInput v-model="checkoutForm.address" required color="neutral" variant="outline" placeholder="Dirección de envío completa" icon="i-lucide-map-pin" />
            </div>
          </div>

          <div>
            <h4 class="text-sm uppercase tracking-widest font-semibold text-[#8C6A42] mb-4 mt-2">Detalles de Pago (Simulado)</h4>
            <div class="grid grid-cols-1 gap-4">
              <UInput v-model="checkoutForm.cardNumber" required color="neutral" variant="outline" placeholder="0000 0000 0000 0000" icon="i-lucide-credit-card" />
              <div class="grid grid-cols-2 gap-4">
                <UInput v-model="checkoutForm.expiry" required color="neutral" variant="outline" placeholder="MM/YY" />
                <UInput v-model="checkoutForm.cvc" required color="neutral" variant="outline" placeholder="CVC" />
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-[#EAE3D9] flex justify-between items-center">
            <span class="text-[#715233] text-sm">Total a pagar</span>
            <span class="font-serif text-2xl text-[#1C1A17]">{{ product?.formattedPrice }}</span>
          </div>

          <UButton type="submit" color="neutral" class="bg-[#1C1A17] text-white hover:bg-[#4B3723] rounded-none w-full justify-center py-4 uppercase tracking-widest font-semibold transition-colors mt-2">
            Pagar {{ product?.formattedPrice }}
          </UButton>
        </form>
      </template>
    </UModal>
  </div>
</template>