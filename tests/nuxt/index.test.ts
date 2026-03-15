// tests/nuxt/index.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, registerEndpoint, mockNuxtImport } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

// Mock useRuntimeConfig to use relative API base
mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    public: {
      domain: '',
      apiBase: '/api/headless'
    },
    app: { baseURL: '/' }
  })
})

vi.mock('~/stores/app', () => ({
  useAppStore: () => ({
    initialized: true,
    defaultLang: 'en',
    currentLang: 'en',
    langs: ['en', 'pl'],
    menus: [],
    urlMap: {},
    innerPages: [],
    pageUrls: {
      1: { en: '/', pl: '/pl' } // home page URLs
    },
    init: vi.fn(),
    setCurrentLang: vi.fn(),
  })
}))

// Mock main page API
registerEndpoint('/api/headless/pages-type/main_page', {
  handler: () => ({
    success: true,
    data: [{
      id: 1,
      title: { en: 'Home', pl: 'Strona główna' },
      description: { en: 'Home page', pl: 'Strona główna' },
    }]
  })
})

registerEndpoint('/api/headless/pages-type/inner', {
  handler: () => ({
    success: true,
    data: []
  })
})

describe('IndexPage', () => {
  it('renders without crashing', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.exists()).toBe(true)
  })
})