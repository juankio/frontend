<script setup lang="ts">
import Lenis from 'lenis'

useHead({
  title: 'Artisan Woodworks',
  htmlAttrs: { lang: 'en' }
})

onMounted(() => {
  const lenis = new Lenis({
    lerp: 0.08, 
    wheelMultiplier: 1,
  })

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
  // @ts-expect-error
  window.lenis = lenis
})

onBeforeUnmount(() => {
  // @ts-expect-error
  if (window.lenis) window.lenis.destroy()
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#A5845C" :height="4" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>