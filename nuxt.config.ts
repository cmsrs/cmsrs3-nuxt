//import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  compatibilityDate: '2026-02-24',
  modules: ['@pinia/nuxt'],
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'swiper/css'
  ],
  routeRules: {
    '/**': { prerender: true } // SSG
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://demo-headless.cmsrs.pl/api/headless'
    }
  },
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
          defer: true
        }
      ]
    }
  }
})