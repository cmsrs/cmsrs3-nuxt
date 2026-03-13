// tests/nuxt/useLocale.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useLocale } from '~/composables/useLocale'

// Zmienna pozwalająca zmieniać ścieżkę w każdym teście
let mockRoutePath = '/en/cms/about/about-me'

// Mockujemy useRoute – za każdym razem zwraca obiekt z aktualną mockRoutePath
mockNuxtImport('useRoute', () => {
  return () => ({
    path: mockRoutePath
  })
})

// Mockujemy store (nie potrzebujemy go w tym teście, ale kompozycyjny go używa)
vi.mock('~/stores/app', () => ({
  useAppStore: () => ({
    defaultLang: 'en',
    currentLang: 'en'
  })
}))

describe('useLocale', () => {
  it('switchLocalePath zwraca poprawną polską ścieżkę', () => {
    mockRoutePath = '/en/cms/about/about-me'
    const { switchLocalePath } = useLocale()
    expect(switchLocalePath('pl')).toBe('/pl/cms/about/about-me')
  })

  it('switchLocalePath zwraca / dla angielskiej strony głównej', () => {
    mockRoutePath = '/en'
    const { switchLocalePath } = useLocale()
    expect(switchLocalePath('en')).toBe('/')
  })
})