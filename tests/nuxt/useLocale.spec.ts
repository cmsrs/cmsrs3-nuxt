// tests/nuxt/useLocale.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useLocale } from '~/composables/useLocale'

let mockRoutePath = '/en/cms/about/about-me'

mockNuxtImport('useRoute', () => {
  return () => ({
    get path() { return mockRoutePath }
  })
})

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    public: {
      domain: 'http://localhost',
      apiBase: 'http://localhost/api/headless'
    },
    app: { baseURL: '/' }
  })
})

vi.mock('~/stores/app', () => ({
  useAppStore: () => ({
    defaultLang: 'en',
    currentLang: 'en',
    langs: ['en', 'pl'],
    init: vi.fn(),
    setCurrentLang: vi.fn(),
    urlMap: {
      '/en/cms/about/about-me': 7,
      '/pl/cms/o-mnie/o-mnie': 7
    },
    pageUrls: {
      7: {
        en: '/en/cms/about/about-me',
        pl: '/pl/cms/o-mnie/o-mnie'
      }
    }
  })
}))

describe('useLocale', () => {
  it('switchLocalePath returns correct Polish path', () => {
    mockRoutePath = '/en/cms/about/about-me'
    const { switchLocalePath } = useLocale()
    expect(switchLocalePath('pl')).toBe('/pl/cms/o-mnie/o-mnie')
  })

  it('switchLocalePath returns / for English home', () => {
    mockRoutePath = '/'
    const { switchLocalePath } = useLocale()
    expect(switchLocalePath('en')).toBe('/')
  })
})