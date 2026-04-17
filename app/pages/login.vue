<script setup lang="ts">
const router = useRouter()
const authCookie = useCookie('auth_token')
const userCookie = useCookie('user_data')

const isLogin = ref(true)
const isLoading = ref(false)
const errorMsg = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  address: ''
})

const submitForm = async () => {
  isLoading.value = true
  errorMsg.value = ''
  
  const endpoint = isLogin.value ? '/api/login' : '/api/register'
  
  try {
    const res = await $fetch(`http://127.0.0.1:5000${endpoint}`, {
      method: 'POST',
      body: form.value
    })
    
    if (res.success) {
      authCookie.value = res.token
      userCookie.value = res.user
      
      if (res.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/shop')
      }
    } else {
      errorMsg.value = res.message || 'Error en autenticación'
    }
  } catch (err: any) {
    errorMsg.value = err.data?.message || 'Error al conectar con el servidor'
  } finally {
    isLoading.value = false
  }
}

useHead({ title: 'Cuenta | Artisan' })
</script>

<template>
  <div class="flex min-h-screen bg-[#F9F8F6]">
    
    <!-- Imagen Split-screen -->
    <div class="hidden lg:block lg:w-1/2 relative bg-[#1C1A17]">
      <img 
        src="https://images.unsplash.com/photo-1611082697843-26a100650ed3?q=80&w=2070&auto=format&fit=crop" 
        alt="Textura madera y herramientas" 
        class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1C1A17]/90 via-[#1C1A17]/20 to-transparent"></div>
      
      <div class="absolute bottom-16 left-16 right-16">
        <h2 class="text-4xl font-serif text-white mb-4 leading-tight">Artesanía en<br>cada detalle.</h2>
        <p class="text-[#DCD0C0] text-sm tracking-wide font-light max-w-sm">Tradición, diseño y materiales honestos para espacios verdaderamente atemporales.</p>
      </div>
    </div>

    <!-- Formulario -->
    <div class="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 sm:px-16 lg:px-24">
      <div class="w-full max-w-sm">
        
        <div class="mb-12">
          <h1 class="text-4xl font-serif text-[#1C1A17] mb-3 tracking-tight">
            {{ isLogin ? 'Bienvenido' : 'Crear cuenta' }}
          </h1>
          <p class="text-[#715233] text-sm font-light tracking-wide">
            {{ isLogin ? 'Accede a tu historial y modelos 3D.' : 'Únete a Artisan y descubre el confort.' }}
          </p>
        </div>
        
        <form @submit.prevent="submitForm" class="flex flex-col gap-8">
          
          <div v-if="!isLogin">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#8C6A42] mb-2 font-medium">Nombre Completo</label>
            <div class="border-b border-[#DCD0C0] focus-within:border-[#1C1A17] transition-colors pb-1">
              <UInput 
                v-model="form.name" 
                required 
                icon="i-lucide-user" 
                variant="none" 
                class="w-full px-0"
                placeholder="Ej. Juan Pérez"
              />
            </div>
          </div>

          <div>
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#8C6A42] mb-2 font-medium">Correo Electrónico</label>
            <div class="border-b border-[#DCD0C0] focus-within:border-[#1C1A17] transition-colors pb-1">
              <UInput 
                v-model="form.email" 
                type="email" 
                required 
                icon="i-lucide-mail" 
                variant="none" 
                class="w-full px-0"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#8C6A42] mb-2 font-medium">Contraseña</label>
            <div class="border-b border-[#DCD0C0] focus-within:border-[#1C1A17] transition-colors pb-1">
              <UInput 
                v-model="form.password" 
                type="password" 
                required 
                icon="i-lucide-lock" 
                variant="none" 
                class="w-full px-0"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div v-if="!isLogin">
            <label class="block text-[10px] uppercase tracking-[0.2em] text-[#8C6A42] mb-2 font-medium">Dirección de envío (Opcional)</label>
            <div class="border-b border-[#DCD0C0] focus-within:border-[#1C1A17] transition-colors pb-1">
              <UInput 
                v-model="form.address" 
                icon="i-lucide-map-pin" 
                variant="none" 
                class="w-full px-0"
                placeholder="Cra 15 # 45-20, Bogotá"
              />
            </div>
          </div>

          <p v-if="errorMsg" class="text-red-500 text-xs font-medium">{{ errorMsg }}</p>
          
          <UButton 
            type="submit" 
            :loading="isLoading"
            class="w-full mt-2 justify-center bg-[#1C1A17] hover:bg-[#322D28] text-white rounded-sm py-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors"
          >
            {{ isLogin ? 'Ingresar' : 'Registrarse' }}
          </UButton>
        </form>
        
        <div class="mt-12 text-center">
          <button @click="isLogin = !isLogin" class="text-[10px] uppercase tracking-widest text-[#A5845C] hover:text-[#1C1A17] transition-colors font-medium border-b border-transparent hover:border-[#1C1A17] pb-1">
            {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&display=swap');

.font-serif {
  font-family: 'Fraunces', serif;
}
</style>