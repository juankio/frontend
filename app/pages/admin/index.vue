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
  model3DUrl: '',
  stock: 1
})

const resetForm = () => {
  form.value = {
    id: null, name: '', price: 0, description: '', material: '', dimensions: '', coverImage: '', model3DUrl: '', stock: 1
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
    model3DUrl: product.model3DUrl || '',
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
      model3DUrl: form.value.model3DUrl || null,
      stock: form.value.stock
    }
    
    let res;
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
  <div class="min-h-screen bg-[#F9F8F6] p-8 md:p-12">
    <!-- Header -->
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 border-b border-[#DCD0C0] pb-6 gap-4">
      <div>
        <h1 class="text-4xl font-serif text-[#1C1A17]">Artisan Atelier</h1>
        <p class="text-[#715233] mt-2">Panel de control y gestión de colección</p>
      </div>
      <div class="flex gap-4">
        <UButton @click="openAddModal" color="neutral" icon="i-lucide-plus" class="bg-[#1C1A17] text-white hover:bg-[#4B3723] rounded-none px-6 py-3 uppercase tracking-widest text-sm font-semibold transition-colors">
          Añadir Pieza
        </UButton>
        <UButton @click="logout" color="neutral" variant="outline" icon="i-lucide-log-out" class="border-[#DCD0C0] text-[#715233] hover:text-[#1C1A17] rounded-none px-6">
          Salir
        </UButton>
      </div>
    </div>

    <!-- Lista de Productos -->
    <div class="max-w-7xl mx-auto">
      <div v-if="pending" class="flex justify-center items-center py-20">
        <UIcon name="i-lucide-loader-2" class="w-12 h-12 text-[#A5845C] animate-spin" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="product in products" :key="product.id" class="bg-white p-6 rounded-2xl shadow-sm border border-[#EAE3D9] flex flex-col hover:shadow-md transition-shadow">
          <div class="flex gap-4 mb-6">
            <div class="w-24 h-24 bg-[#F7F5F2] rounded-xl overflow-hidden shrink-0">
              <img v-if="product.coverImage" :src="product.coverImage" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 class="font-serif text-xl text-[#1C1A17] line-clamp-1">{{ product.name }}</h3>
              <p class="text-[#8C6A42] font-medium">{{ product.formattedPrice }}</p>
              <div class="flex items-center gap-2 mt-2 text-xs">
                <span class="bg-[#EAE3D9] text-[#4B3723] px-2 py-1 rounded-full">Stock: {{ product.stock }}</span>
                <span v-if="product.model3DUrl" class="bg-[#1C1A17] text-white px-2 py-1 rounded-full flex items-center gap-1"><UIcon name="i-lucide-box" class="w-3 h-3" /> 3D</span>
              </div>
            </div>
          </div>
          <div class="mt-auto flex gap-3 border-t border-[#F7F5F2] pt-4">
            <UButton @click="openEditModal(product)" color="neutral" variant="ghost" class="text-[#8C6A42] hover:bg-[#FDFBF7]" icon="i-lucide-pencil">
              Editar
            </UButton>
            <UButton @click="deleteProduct(product.id)" color="error" variant="ghost" class="text-red-500 hover:bg-red-50" icon="i-lucide-trash-2">
              Eliminar
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Añadir Producto -->
    <UModal v-model:open="isModalOpen" title="Crear Nueva Pieza">
      <template #body>
        <form @submit.prevent="saveProduct" class="flex flex-col gap-5 p-2">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs uppercase tracking-widest font-semibold text-[#8C6A42] mb-1.5">Nombre de la pieza</label>
              <UInput v-model="form.name" required color="neutral" variant="outline" class="w-full" placeholder="Ej. Silla Nórdica" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest font-semibold text-[#8C6A42] mb-1.5">Precio (USD)</label>
              <UInput v-model="form.price" type="number" required color="neutral" variant="outline" icon="i-lucide-dollar-sign" class="w-full" placeholder="850" />
            </div>
          </div>

          <div>
            <label class="block text-xs uppercase tracking-widest font-semibold text-[#8C6A42] mb-1.5">Descripción</label>
            <UTextarea v-model="form.description" required color="neutral" variant="outline" :rows="3" class="w-full" placeholder="Narra la historia de esta pieza..." />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs uppercase tracking-widest font-semibold text-[#8C6A42] mb-1.5">Material (Madera)</label>
              <UInput v-model="form.material" required color="neutral" variant="outline" class="w-full" placeholder="Ej. Roble Macizo" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest font-semibold text-[#8C6A42] mb-1.5">Medidas</label>
              <UInput v-model="form.dimensions" required color="neutral" variant="outline" class="w-full" placeholder="Ej. 80cm x 60cm x 45cm" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs uppercase tracking-widest font-semibold text-[#8C6A42] mb-1.5">URL Imagen (Portada)</label>
              <UInput v-model="form.coverImage" required color="neutral" variant="outline" icon="i-lucide-image" class="w-full" placeholder="https://..." />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest font-semibold text-[#8C6A42] mb-1.5">URL Modelo 3D (.glb, opcional)</label>
              <UInput v-model="form.model3DUrl" color="neutral" variant="outline" icon="i-lucide-box" class="w-full" placeholder="https://.../mueble.glb" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-xs uppercase tracking-widest font-semibold text-[#8C6A42] mb-1.5">Stock Inicial</label>
              <UInput v-model="form.stock" type="number" required color="neutral" variant="outline" class="w-full" />
            </div>
          </div>

          <p v-if="errorMsg" class="text-red-500 text-sm font-medium mt-2">{{ errorMsg }}</p>

          <div class="mt-6 flex justify-end gap-3">
            <UButton type="button" @click="isModalOpen = false" color="neutral" variant="ghost" class="text-[#715233]">
              Cancelar
            </UButton>
            <UButton type="submit" :loading="isSubmitting" color="neutral" class="bg-[#1C1A17] text-white hover:bg-[#4B3723] rounded-none px-8 uppercase tracking-widest text-sm font-semibold">
              Guardar Pieza
            </UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>