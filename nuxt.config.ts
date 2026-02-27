//import { defineNuxtConfig } from 'nuxt'

const domain = 'http://demo-headless.cmsrs.pl'

export default defineNuxtConfig({
  compatibilityDate: '2026-02-24',
  modules: ['@pinia/nuxt'],
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
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
          defer: true
        }
      ]
    }
  }
})