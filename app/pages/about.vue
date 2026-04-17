<script setup lang="ts">
useHead({
  title: 'Nuestro Oficio | Artisan Woodworks'
})
</script>

<template>
  <div class="min-h-screen pt-32 pb-24 px-6 bg-[#F9F8F6]">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        <!-- Texto -->
        <div>
          <h1 class="text-4xl md:text-6xl font-serif text-[#1C1A17] mb-8">Nuestro Oficio</h1>
          <p class="text-[#715233] text-lg leading-relaxed mb-6">
            En Artisan, creemos que los muebles no son solo objetos funcionales, sino piezas de historia que habitan en tu hogar. Cada silla, mesa o estantería nace del respeto absoluto por la materia prima.
          </p>
          <p class="text-[#715233] text-lg leading-relaxed mb-10">
            Combinamos las técnicas de ebanistería tradicional, heredadas de generaciones de maestros carpinteros, con una visión de diseño contemporánea y minimalista. Seleccionamos cuidadosamente maderas nobles como el roble y el nogal, asegurando un origen sostenible.
          </p>
          
          <UButton to="/shop" color="neutral" size="xl" class="px-8 rounded-none uppercase tracking-widest bg-[#1C1A17] text-white hover:bg-[#4B3723] transition-colors">
            Ver la Colección
          </UButton>
        </div>

        <!-- Imagen / Decoración -->
        <div class="relative aspect-[4/5] bg-[#EAE3D9] rounded-2xl overflow-hidden shadow-sm">
          <img src="https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?q=80&w=1000&auto=format&fit=crop" alt="Artesano trabajando la madera" class="absolute inset-0 w-full h-full object-cover opacity-90" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#1C1A17]/40 to-transparent"></div>
        </div>

      </div>
    </div>
  </div>
</template>