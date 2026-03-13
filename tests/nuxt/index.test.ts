import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

// 1. Mockujemy tylko store, ale w sposób, który nie psuje reszty aplikacji
vi.mock('~/stores/app', () => ({
  useAppStore: () => ({
    initialized: true,
    defaultLang: 'en',
    currentLang: 'en',
    langs: ['en', 'pl'],
    menus: [],
    urlMap: {},
    init: vi.fn(),
    setCurrentLang: vi.fn(),
  })
}))

// USUNĘLIŚMY vi.mock('#app', ...) - Nuxt Test Utils zajmie się tym automatycznie

describe('IndexPage', () => {
  it('renders without crashing', async () => {
    // mountSuspended jest kluczowe dla komponentów Nuxt 3 (obsługuje asynchroniczny setup)
    const wrapper = await mountSuspended(IndexPage)
    
    expect(wrapper.exists()).toBe(true)
    console.log('IndexPage rendered successfully')
  })
})
