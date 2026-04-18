// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  ssr: false,

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      script: [
        { type: 'module', src: 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { href: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&display=swap', rel: 'stylesheet' }
      ]
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'lenis',
        'gsap',
        'gsap/ScrollTrigger'
      ]
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      }
    }
  },

  compatibilityDate: '2025-01-15',

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'model-viewer'
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})