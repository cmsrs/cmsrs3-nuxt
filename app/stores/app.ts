import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    defaultLang: null as string | null,
    initialized: false,
    menus: [] as any[],
    currentLang: null as string | null,
    urlMap: {} as Record<string, number>,   // 🔥 mapa url -> page_id
  }),

  actions: {
    async init() {
      if (this.initialized) return

      const config = useRuntimeConfig()
      const cfgData: any = await $fetch(`${config.public.apiBase}/config`)

      if (cfgData?.success) {
        this.defaultLang = cfgData.data.default_lang
      }

      this.initialized = true
    },

    async setCurrentLang(lang: string) {
      if (this.currentLang === lang && this.menus.length) return

      this.currentLang = lang
      await this.fetchMenus()
    },

    async fetchMenus() {
      const config = useRuntimeConfig()

      // 🔥 NOWE API (bez lang)
      const menuData: any = await $fetch(`${config.public.apiBase}/menus`)

      if (menuData?.success) {
        this.menus = menuData.data
        this.buildUrlMap()
      }
    },

    
    buildUrlMap() {
      const map: Record<string, number> = {}

      for (const menu of this.menus) {

        // menu typu kontakt
        if (menu.url) {
          Object.values(menu.url).forEach((url: any) => {
            map[url] = menu.page_id
          })
        }

        if (!menu.pages) continue

        for (const page of menu.pages) {

          if (page.url) {
            Object.values(page.url).forEach((url: any) => {
              map[url] = page.page_id
            })
          }

          if (!page.children) continue

          for (const child of page.children) {
            Object.values(child.url).forEach((url: any) => {
              map[url] = child.page_id
            })
          }

        }
      }

      this.urlMap = map
    },
  },
})