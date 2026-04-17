<script setup lang="ts">
const route = useRoute()
const { products, pending, refresh } = useProducts()

const productId = computed(() => Number(route.params.id))
const product = computed(() => products.value?.find((p: any) => p.id === productId.value))

const isGenerating = ref(false)
const isCheckoutOpen = ref(false)
const isProcessingPayment = ref(false)
const paymentStatus = ref<'idle' | 'success' | 'error'>('idle')

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

const generate3D = async () => {
  if (!product.value || product.value.model3DUrl) return

  isGenerating.value = true
  
  try {
    const res = await $fetch('http://127.0.0.1:5000/api/generate-3d', {
      method: 'POST',
      body: { productId: product.value.id, imageUrl: product.value.coverImage }
    })
    
    if (res.success) {
      await refresh() // Recarga productos
    }
  } catch (err) {
    console.error(err)
  } finally {
    isGenerating.value = false
  }
}

const initiateCheckout = async () => {
  if (!product.value) return
  
  // Basic validation
  if (!checkoutForm.value.name || !checkoutForm.value.email || !checkoutForm.value.address) {
    alert("Por favor completa los datos de envío primero.")
    return
  }
  
  isProcessingPayment.value = true
  
  try {
    const res = await $fetch('http://127.0.0.1:5000/api/create-payment-intent', {
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
      <UButton to="/shop" :ui="{ rounded: 'rounded-sm' }" class="bg-transparent border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2C241B] hover:border-[#C5A059] uppercase tracking-[0.2em] px-8 py-3 text-xs font-bold transition-all duration-500">
        Volver a la colección
      </UButton>
    </div>

    <!-- Layout Dividido 50/50 -->
    <div v-else class="flex flex-col md:flex-row min-h-screen pt-24 md:pt-0">
      
      <!-- Lado Izquierdo: Info del Producto -->
      <div class="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center order-2 md:order-1 overflow-y-auto">
        <NuxtLink to="/shop" class="text-[#C5A059] hover:text-[#2C241B] flex items-center gap-3 mb-16 w-max transition-colors text-[10px] uppercase tracking-[0.2em] font-bold">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Volver a la galería
        </NuxtLink>
        
        <h1 class="text-5xl md:text-7xl font-['Fraunces',serif] text-[#2C241B] mb-8 leading-[1.1]">{{ product.name }}</h1>
        <p class="text-[#2C241B]/70 text-lg mb-10 leading-relaxed max-w-lg">{{ product.description }}</p>
        
        <div class="grid grid-cols-2 gap-8 mb-10 border-y border-[#EAE5DC] py-8">
          <div v-if="product.material">
            <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-2">Material</p>
            <p class="text-[#2C241B] text-sm">{{ product.material }}</p>
          </div>
          <div v-if="product.dimensions">
            <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-2">Dimensiones</p>
            <p class="text-[#2C241B] text-sm">{{ product.dimensions }}</p>
          </div>
        </div>
        
        <div class="text-4xl font-['Fraunces',serif] text-[#2C241B] mb-12 italic"><span class="text-[#C5A059] mr-1"></span>{{ product.formattedPrice }}</div>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <UButton @click="isCheckoutOpen = true" :disabled="product.stock <= 0" :ui="{ rounded: 'rounded-sm' }" class="px-10 py-5 uppercase tracking-[0.2em] bg-[#2C241B] text-[#F9F6F0] hover:bg-[#C5A059] hover:text-[#2C241B] border border-transparent hover:border-[#C5A059] justify-center text-xs font-bold transition-all duration-500 shadow-lg shadow-[#2C241B]/10 hover:shadow-xl">
            {{ product.stock > 0 ? 'Adquirir Pieza' : 'Agotado' }}
          </UButton>
          
          <UButton v-if="!product.model3DUrl" @click="generate3D" :loading="isGenerating" :ui="{ rounded: 'rounded-sm' }" class="px-10 py-5 uppercase tracking-[0.2em] justify-center bg-transparent border border-[#C5A059]/40 text-[#2C241B] hover:bg-[#EAE5DC] hover:border-[#C5A059] text-xs font-bold transition-all duration-500">
            {{ isGenerating ? 'Procesando IA...' : 'Render 3D' }}
          </UButton>
        </div>

        <div class="mt-16 pt-8 border-t border-[#EAE5DC]">
          <div class="flex items-center gap-4 text-xs font-medium tracking-widest text-[#2C241B]/50 uppercase">
            <UIcon name="i-lucide-package" class="w-4 h-4 text-[#C5A059]" />
            <span v-if="product.stock > 0">Stock disponible ({{ product.stock }} unidades)</span>
            <span v-else class="text-red-700">Agotado temporalmente</span>
          </div>
        </div>
      </div>

      <!-- Lado Derecho: Visor 3D o Imagen -->
      <div class="w-full md:w-1/2 h-[60vh] md:h-screen bg-[#FDFBF7] relative order-1 md:order-2 border-l border-[#EAE5DC]">
        
        <div v-if="!product.model3DUrl" class="absolute inset-0 z-10 flex flex-col items-center justify-center text-[#2C241B] pointer-events-none bg-[#F9F6F0]/20 backdrop-blur-sm">
          <UIcon :name="isGenerating ? 'i-lucide-loader-2' : 'i-lucide-box'" class="w-12 h-12 mb-6 text-[#C5A059]" :class="{ 'animate-spin': isGenerating, 'opacity-80': !isGenerating }" />
          <p class="font-['Fraunces',serif] text-2xl tracking-wide mb-3">{{ isGenerating ? 'Modelando en 3D...' : 'Perspectiva 360°' }}</p>
          <p class="text-[10px] tracking-[0.2em] font-bold uppercase text-[#C5A059]" v-if="!isGenerating">Presiona "Render 3D" para inspeccionar</p>
        </div>
        
        <!-- Imagen de Portada -->
        <img v-if="!product.model3DUrl && !isGenerating" :src="product.coverImage" :alt="product.name" class="absolute inset-0 w-full h-full object-cover opacity-60" />

        <!-- El componente 3D -->
        <ClientOnly v-if="product.model3DUrl">
          <div class="absolute inset-0 w-full h-full z-10">
            <Suspense>
              <Product3DViewer class="w-full h-full cursor-grab active:cursor-grabbing" :modelPath="product.model3DUrl" />
              <template #fallback>
                <div class="w-full h-full flex flex-col items-center justify-center text-[#2C241B] absolute inset-0 z-20 bg-[#FDFBF7]">
                  <UIcon name="i-lucide-loader-2" class="w-10 h-10 mb-6 animate-spin text-[#C5A059]" />
                  <p class="text-[10px] tracking-[0.2em] font-bold uppercase text-[#C5A059]">Importando Texturas...</p>
                </div>
              </template>
            </Suspense>
          </div>
        </ClientOnly>

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