<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, useGLTF, Environment } from '@tresjs/cientos'
import { shallowRef } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps<{
  modelPath: string
}>()

const modelRef = shallowRef()
const gltf = await useGLTF(props.modelPath, { draco: true })
const scene = gltf.scene || gltf.nodes?.Scene || gltf

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
}

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

onMounted(() => {
  if (!import.meta.client || !scene?.children) return

  // Creamos la animación de "Desarme" de Nano Banana / Herman Miller Style
  // Separamos las piezas del modelo cuando el usuario hace scroll dentro del contenedor 3D
  setTimeout(() => {
    const pieces = scene.children.filter((c: any) => c.isMesh || c.isGroup)
    
    if(pieces.length > 0) {
      pieces.forEach((piece: any, index: number) => {
        // Guardamos posición original
        piece.userData.originalY = piece.position.y
        piece.userData.originalZ = piece.position.z
        
        const direction = index % 2 === 0 ? 1 : -1
        const offset = 0.5 * (index + 1)
        
        gsap.to(piece.position, {
          y: piece.userData.originalY + (offset * direction),
          z: piece.userData.originalZ + (offset),
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "#viewer3d",
            start: "top top",
            end: "bottom top",
            scrub: 1 // Suavizado brutal
          }
        })
      })
    }
  }, 1000)
})
</script>

<template>
  <TresCanvas alpha clear-color="transparent" :shadows="true">
    <TresPerspectiveCamera :position="[3, 1.5, 4]" />
    <OrbitControls :enable-zoom="false" :enable-pan="false" :auto-rotate="true" :auto-rotate-speed="0.5" />
    
    <Suspense>
      <Environment preset="studio" />
    </Suspense>
    
    <TresAmbientLight :intensity="1.5" />
    <TresDirectionalLight
      :position="[5, 5, 5]"
      :intensity="2"
      cast-shadow
    />

    <primitive v-if="scene" :object="scene" ref="modelRef" />
  </TresCanvas>
</template>