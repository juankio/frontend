// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@tresjs/nuxt'
  ],

  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&display=swap', rel: 'stylesheet' }
      ]
    }
  },

  build: {
    transpile: [
      'three', 
      '@tresjs/core', 
      '@tresjs/cientos',
      'three-custom-shader-material',
      'stats.js'
    ]
  },

  vite: {
    resolve: {
      alias: {
        'stats.js': 'stats.js/src/Stats.js'
      }
    },
    optimizeDeps: {
      include: [
        'three', 
        '@tresjs/core', 
        '@tresjs/cientos',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'lenis',
        'gsap',
        'gsap/ScrollTrigger',
        'three-custom-shader-material',
        'object-hash',
        'glsl-token-string',
        'glsl-token-functions',
        'glsl-tokenizer',
        'stats.js'
      ]
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      }
    }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})