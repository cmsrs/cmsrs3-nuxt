// tests/nuxt/useLocale.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useLocale } from '~/composables/useLocale'

let mockRoutePath = '/en/cms/about/about-me'

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    public: {
      domain: 'http://localhost',
      apiBase: 'http://localhost/api/headless'
    },
    app: { baseURL: '/' }   // <-- add this
  })
})

vi.mock('~/stores/app', () => ({
  useAppStore: () => ({
    defaultLang: 'en',
    currentLang: 'en',
    init: vi.fn(),                // added
    setCurrentLang: vi.fn(),       // added
  })
}))

describe('useLocale', () => {
  it('switchLocalePath returns correct Polish path', () => {
    mockRoutePath = '/en/cms/about/about-me'
    const { switchLocalePath } = useLocale()
    expect(switchLocalePath('pl')).toBe('/pl/cms/about/about-me')
  })

  it('switchLocalePath returns / for English home', () => {
    mockRoutePath = '/en'
    const { switchLocalePath } = useLocale()
    expect(switchLocalePath('en')).toBe('/')
  })
})