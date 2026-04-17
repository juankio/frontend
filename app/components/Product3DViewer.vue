<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, useGLTF, Environment } from '@tresjs/cientos'
import { shallowRef, watch } from 'vue'

const props = defineProps<{
  modelPath: string
}>()

const { scene } = await useGLTF(props.modelPath, { draco: true })
const modelRef = shallowRef()

// Sombras
watch(scene, (newScene) => {
  if (newScene) {
    newScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }
}, { immediate: true })

</script>

<template>
  <TresCanvas clear-color="transparent" shadows alpha>
    <TresPerspectiveCamera :position="[2, 1.5, 3]" />
    <OrbitControls :enable-zoom="false" :enable-pan="false" :auto-rotate="true" :auto-rotate-speed="0.5" />
    
    <Environment preset="studio" />
    
    <TresAmbientLight :intensity="0.5" />
    <TresDirectionalLight
      :position="[5, 5, 5]"
      :intensity="1"
      cast-shadow
    />

    <primitive :object="scene" ref="modelRef" />
  </TresCanvas>
</template>