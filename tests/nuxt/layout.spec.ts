// tests/nuxt/layout.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DefaultLayout from '~/layouts/default.vue'

vi.mock('~/stores/app', () => ({
  useAppStore: () => ({
    defaultLang: 'en',
    currentLang: 'en',
    langs: ['en', 'pl'],
    menus: [],
    innerPages: [],
    init: vi.fn(),
    setCurrentLang: vi.fn(),
  })
}))

vi.mock('~/composables/useLocale', () => ({
  useLocale: () => ({
    switchLocalePath: (locale: string) => locale === 'pl' ? '/pl' : '/'
  })
}))

describe('default layout', () => {
  it('renders language switcher with correct links', async () => {
    const wrapper = await mountSuspended(DefaultLayout, {
      slots: { default: () => '<div>Page content</div>' }
    })

    const enLink = wrapper.find('a[href="/"]')
    const plLink = wrapper.find('a[href="/pl"]')
    expect(enLink.exists()).toBe(true)
    expect(plLink.exists()).toBe(true)
  })
})