<script setup lang="ts">
const authCookie = useCookie('auth_token')
const userCookie = useCookie<any>('user_data')
const router = useRouter()
const { products, pending, refresh } = useProducts()

// Basic Auth Guard
onMounted(() => {
  if (!authCookie.value || userCookie.value?.role !== 'admin') {
    router.push('/login')
  }
})

const logout = () => {
  authCookie.value = null
  userCookie.value = null
  router.push('/login')
}

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const errorMsg = ref('')

const form = ref({
  id: null as number | null,
  name: '',
  price: 0,
  description: '',
  material: '',
  dimensions: '',
  coverImage: '',
  hotspots: '',
  stock: 1
})

const resetForm = () => {
  form.value = {
    id: null, name: '', price: 0, description: '', material: '', dimensions: '', coverImage: '', hotspots: '', stock: 1
  }
}

const openAddModal = () => {
  resetForm()
  isModalOpen.value = true
}

const openEditModal = (product: any) => {
  form.value = {
    id: product.id,
    name: product.name || '',
    price: product.price, // It's in COP integers
    description: product.description || '',
    material: product.material || '',
    dimensions: product.dimensions || '',
    coverImage: product.coverImage || '',
    hotspots: product.hotspots || '',
    stock: product.stock !== undefined ? product.stock : 1
  }
  isModalOpen.value = true
}

const saveProduct = async () => {
  isSubmitting.value = true
  errorMsg.value = ''
  
  try {
    const payload = {
      name: form.value.name,
      price: Math.round(Number(form.value.price)),
      description: form.value.description,
      material: form.value.material,
      dimensions: form.value.dimensions,
      coverImage: form.value.coverImage,
      hotspots: form.value.hotspots || null,
      stock: form.value.stock
    }
    
    let res: any;
    if (form.value.id) {
      res = await $fetch(`http://127.0.0.1:5000/api/products/${form.value.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authCookie.value}` },
        body: payload
      })
    } else {
      res = await $fetch('http://127.0.0.1:5000/api/products', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authCookie.value}` },
        body: payload
      })
    }
    
    if (res.success) {
      isModalOpen.value = false
      await refresh()
    } else {
      errorMsg.value = res.message || 'Error al guardar'
    }
  } catch (e: any) {
    errorMsg.value = e.data?.message || 'Error de conexión'
  } finally {
    isSubmitting.value = false
  }
}

const deleteProduct = async (id: number) => {
  if(!confirm('¿Seguro que deseas eliminar esta pieza?')) return
  try {
    await $fetch(`http://127.0.0.1:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authCookie.value}`
      }
    })
    await refresh()
  } catch(e) {
    alert('Error al eliminar')
  }
}

useHead({ title: 'Admin Dashboard | Artisan' })
</script>

<template>
  <div class="min-h-screen bg-[#F9F6F0] p-8 md:p-16 font-['DM_Sans',sans-serif]">
    <!-- Header -->
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end mb-16 border-b-2 border-[#2C241B] pb-8 gap-6">
      <div>
        <p class="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Administración</p>
        <h1 class="text-5xl font-['Fraunces',serif] text-[#2C241B] tracking-tight">Artisan Atelier</h1>
      </div>
      <div class="flex gap-4">
        <button @click="openAddModal" class="bg-[#2C241B] text-[#F9F6F0] hover:bg-[#C5A059] hover:text-[#2C241B] rounded-sm px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-300">
          Añadir Pieza
        </button>
        <button @click="logout" class="border border-[#EAE5DC] text-[#2C241B] hover:border-[#2C241B] rounded-sm px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-300">
          Salir
        </button>
      </div>
    </div>

    <!-- Lista de Productos -->
    <div class="max-w-7xl mx-auto">
      <div v-if="pending" class="flex justify-center items-center py-32">
        <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-[#C5A059] animate-spin" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div v-for="product in products" :key="product.id" class="bg-[#FDFBF7] flex flex-col border border-[#EAE5DC] group hover:border-[#C5A059]/40 transition-colors duration-500 rounded-sm overflow-hidden shadow-[0_4px_24px_rgba(44,36,27,0.03)]">
          <div class="w-full aspect-[4/5] bg-[#F9F6F0] overflow-hidden border-b border-[#EAE5DC] relative p-8 flex items-center justify-center">
            <img v-if="product.coverImage" :src="product.coverImage" class="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-105" />
            <div v-if="product.model3DUrl" class="absolute top-4 right-4 bg-[#2C241B] text-[#F9F6F0] px-3 py-1.5 rounded-sm flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold">
              <UIcon name="i-lucide-box" class="w-3.5 h-3.5" /> 3D
            </div>
          </div>
          <div class="p-8 flex flex-col flex-1">
            <h3 class="font-['Fraunces',serif] text-2xl text-[#2C241B] line-clamp-2 leading-tight">{{ product.name }}</h3>
            <p class="text-[#C5A059] font-['Fraunces',serif] italic mt-2 text-lg">{{ product.formattedPrice }}</p>
            
            <div class="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C241B]/50">
              <span>Stock: {{ product.stock }}</span>
            </div>
            
            <div class="mt-8 flex gap-6 pt-6 border-t border-[#EAE5DC]">
              <button @click="openEditModal(product)" class="flex-1 text-left text-[#2C241B] hover:text-[#C5A059] text-[10px] uppercase tracking-widest font-bold transition-colors">
                Editar Pieza
              </button>
              <button @click="deleteProduct(product.id)" class="text-right text-[#2C241B]/30 hover:text-red-700 text-[10px] uppercase tracking-widest font-bold transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Añadir Producto -->
    <UModal v-model:open="isModalOpen" :ui="{ content: 'rounded-sm sm:rounded-sm sm:max-w-3xl border border-[#EAE5DC] shadow-2xl bg-[#FDFBF7]' }">
      <template #content>
        <div class="bg-[#FDFBF7] p-8 md:p-14 font-['DM_Sans',sans-serif] border-[3px] border-double border-[#EAE5DC] m-2">
          <div class="border-b-2 border-t-2 border-[#2C241B] py-6 mb-10 text-center">
            <h2 class="font-['Fraunces',serif] text-3xl md:text-4xl text-[#2C241B] uppercase tracking-widest">
              {{ form.id ? 'Edición de Pieza' : 'Registro de Pieza' }}
            </h2>
            <p class="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mt-3 font-bold">Artisan Atelier // Formulario Oficial</p>
          </div>

          <form @submit.prevent="saveProduct" class="flex flex-col gap-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="border-b border-[#EAE5DC] pb-2 relative">
                <label class="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-3">Nombre de la pieza</label>
                <input v-model="form.name" required type="text" class="w-full bg-transparent border-none focus:ring-0 p-0 text-[#2C241B] text-lg font-['Fraunces',serif] placeholder-[#2C241B]/20 focus:outline-none" placeholder="Ej. Silla Nórdica" />
              </div>
              <div class="border-b border-[#EAE5DC] pb-2 relative">
                <label class="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-3">Precio (COP)</label>
                <input v-model="form.price" required type="number" class="w-full bg-transparent border-none focus:ring-0 p-0 text-[#2C241B] text-lg font-['Fraunces',serif] placeholder-[#2C241B]/20 focus:outline-none" placeholder="850000" />
              </div>
            </div>

            <div class="border-b border-[#EAE5DC] pb-2 relative">
              <label class="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-3">Descripción (Historia y Origen)</label>
              <textarea v-model="form.description" required rows="3" class="w-full bg-transparent border-none focus:ring-0 p-0 text-[#2C241B] resize-none placeholder-[#2C241B]/20 focus:outline-none" placeholder="Narra la historia de esta pieza..."></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="border-b border-[#EAE5DC] pb-2 relative">
                <label class="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-3">Material (Madera)</label>
                <input v-model="form.material" required type="text" class="w-full bg-transparent border-none focus:ring-0 p-0 text-[#2C241B] placeholder-[#2C241B]/20 focus:outline-none" placeholder="Ej. Roble Macizo" />
              </div>
              <div class="border-b border-[#EAE5DC] pb-2 relative">
                <label class="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-3">Dimensiones</label>
                <input v-model="form.dimensions" required type="text" class="w-full bg-transparent border-none focus:ring-0 p-0 text-[#2C241B] placeholder-[#2C241B]/20 focus:outline-none" placeholder="Ej. 80cm x 60cm x 45cm" />
              </div>
            </div>

            <div class="border-b border-[#EAE5DC] pb-2 relative">
              <label class="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-3">URL Imagen (Fotografía Oficial)</label>
              <input v-model="form.coverImage" required type="url" class="w-full bg-transparent border-none focus:ring-0 p-0 text-[#2C241B] placeholder-[#2C241B]/20 focus:outline-none" placeholder="https://..." />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="border-b border-[#EAE5DC] pb-2 relative">
                <label class="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-3">Hotspots (JSON Array - x, y, title, description)</label>
                <textarea v-model="form.hotspots" rows="3" class="w-full bg-transparent border-none focus:ring-0 p-0 text-[#2C241B] resize-none placeholder-[#2C241B]/20 focus:outline-none font-mono text-[10px]" placeholder='[{"x":30,"y":35,"title":"Veta","description":"..."}]'></textarea>
              </div>
              <div class="border-b border-[#EAE5DC] pb-2 relative">
                <label class="block text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059] mb-3">Inventario Físico</label>
                <input v-model="form.stock" required type="number" class="w-full bg-transparent border-none focus:ring-0 p-0 text-[#2C241B] placeholder-[#2C241B]/20 focus:outline-none" />
              </div>
            </div>

            <p v-if="errorMsg" class="text-red-800 bg-red-50 p-4 border border-red-200 text-xs font-bold uppercase tracking-widest text-center">{{ errorMsg }}</p>

            <div class="mt-8 flex justify-between items-center pt-8 border-t border-[#EAE5DC]">
              <button type="button" @click="isModalOpen = false" class="text-[#2C241B]/50 hover:text-[#2C241B] uppercase tracking-[0.2em] text-[10px] font-bold transition-colors">
                Anular Formulario
              </button>
              <button type="submit" :disabled="isSubmitting" class="bg-[#2C241B] text-[#F9F6F0] hover:bg-[#C5A059] hover:text-[#2C241B] rounded-sm px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-300 disabled:opacity-50">
                {{ isSubmitting ? 'Archivando...' : 'Archivar en Colección' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </UModal>
  </div>
</template>