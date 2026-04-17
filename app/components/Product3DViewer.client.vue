<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, useGLTF, Environment } from '@tresjs/cientos'
import { shallowRef } from 'vue'
import { PCFShadowMap } from 'three'

const props = defineProps<{
  modelPath: string
}>()

const modelRef = shallowRef()
const gltf = await useGLTF(props.modelPath, { draco: true })
const scene = gltf.scene || gltf.nodes?.Scene || gltf

watch(() => scene, (newScene) => {
  if (newScene && newScene.traverse) {
    newScene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }
}, { immediate: true })
</script>

<template>
  <TresCanvas alpha :clear-color="'#EAE3D9'" :shadows="true" :shadow-map-type="PCFShadowMap">
    <TresPerspectiveCamera :position="[3, 1.5, 4]" />
    <OrbitControls 
      :enable-zoom="true" 
      :enable-pan="false" 
      :auto-rotate="true" 
      :auto-rotate-speed="1.0" 
      :min-distance="2"
      :max-distance="10"
    />
    
    <Suspense>
      <Environment preset="studio" />
    </Suspense>
    
    <TresAmbientLight :intensity="1.5" />
    <TresDirectionalLight
      :position="[5, 5, 5]"
      :intensity="2"
      cast-shadow
    />

    <!-- Centramos ligeramente el modelo usando position y scale si es necesario -->
    <primitive v-if="scene" :object="scene" ref="modelRef" />
  </TresCanvas>
</template>