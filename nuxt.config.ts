//import { defineNuxtConfig } from 'nuxt'

const domain = process.env.NUXT_PUBLIC_DOMAIN || 'http://localhost:8080'

export default defineNuxtConfig({
  compatibilityDate: '2026-02-24',
  modules: ['@pinia/nuxt'],
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'swiper/vue',
        'swiper/modules',
      ]
    }
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'swiper/css/pagination',
    'swiper/css'
  ],
  routeRules: {
    '/**': { prerender: true } // SSG
  },
  runtimeConfig: {
    public: {
      domain,
      apiBase: `${domain}/api/headless`
    }
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }        
      ],      
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
          defer: true
        }
      ]
    }
  }
})