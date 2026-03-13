// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    alias: {
      'vitest/environments': 'vitest/runtime'
    }
  }
})