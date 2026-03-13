// tests/nuxt/slug.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, registerEndpoint, mockNuxtImport } from '@nuxt/test-utils/runtime'
import SlugPage from '~/pages/[...slug].vue'

// Mock the store with all required methods and data
const mockStore = {
  initialized: true,
  defaultLang: 'en',
  currentLang: 'en',
  langs: ['en', 'pl'],
  menus: [
    {
      menu_name: { en: 'About', pl: 'O mnie' },
      pages: [
        {
          page_id: 7,
          url: {
            en: '/en/cms/about/about-me',
            pl: '/pl/cms/o-mnie/o-mnie'
          },
          short_title: { en: 'About me', pl: 'O mnie' },
          children: []
        }
      ]
    }
  ],
  urlMap: {
    '/en/cms/about/about-me': 7,
    '/pl/cms/o-mnie/o-mnie': 7
  },
  init: vi.fn(),
  setCurrentLang: vi.fn((lang) => { mockStore.currentLang = lang }),
  fetchMenus: vi.fn(),
  buildUrlMap: vi.fn(),
}

vi.mock('~/stores/app', () => ({
  useAppStore: () => mockStore
}))

// Mock runtime config
mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    public: {
      domain: 'http://localhost',
      apiBase: 'http://localhost/api/headless'
    }
  })
})

// Mock useRouter to provide the afterEach method required by the test utils
mockNuxtImport('useRouter', () => {
  return () => ({
    afterEach: vi.fn(),
    currentRoute: { value: { path: '/en/cms/about/about-me' } },
    push: vi.fn(),
    replace: vi.fn(),
  })
})

// Mock useRoute to return the path we want (dynamic per test)
let mockRoutePath = '/en/cms/about/about-me'
mockNuxtImport('useRoute', () => {
  return () => ({ path: mockRoutePath })
})

// Register API endpoints for page 7 in both languages
registerEndpoint('/api/headless/page/7/en', {
  handler: () => ({
    success: true,
    data: {
      id: 7,
      title: 'About me',
      content: '<p>This is the about me page.</p>',
      type: 'cms',
      images: []
    }
  })
})

registerEndpoint('/api/headless/page/7/pl', {
  handler: () => ({
    success: true,
    data: {
      id: 7,
      title: 'O mnie',
      content: '<p>To jest strona o mnie.</p>',
      type: 'cms',
      images: []
    }
  })
})

describe('Slug page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.currentLang = 'en'
    mockRoutePath = '/en/cms/about/about-me'
  })

  it('renders the correct page for /en/cms/about/about-me', async () => {
    const wrapper = await mountSuspended(SlugPage, {
      route: '/en/cms/about/about-me'
    })

    expect(mockStore.setCurrentLang).toHaveBeenCalledWith('en')
    expect(wrapper.html()).toContain('About me')
    expect(wrapper.html()).toContain('This is the about me page')
  })

  it('renders the correct page for /pl/cms/o-mnie/o-mnie', async () => {
    mockRoutePath = '/pl/cms/o-mnie/o-mnie'
    const wrapper = await mountSuspended(SlugPage, {
      route: '/pl/cms/o-mnie/o-mnie'
    })

    expect(mockStore.setCurrentLang).toHaveBeenCalledWith('pl')
    expect(wrapper.html()).toContain('O mnie')
    expect(wrapper.html()).toContain('To jest strona o mnie')
  })
})