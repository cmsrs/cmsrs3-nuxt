// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // Nie definiujemy runtimeConfig – będziemy je mockować w testach
  }
})