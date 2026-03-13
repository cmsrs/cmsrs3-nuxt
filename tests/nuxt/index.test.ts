// tests/nuxt/index.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

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