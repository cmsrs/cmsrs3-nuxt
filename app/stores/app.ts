import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    defaultLang: null as string | null,
    initialized: false,
    menus: [] as any[],
    currentLang: null as string | null,
    langs: [] as string[],
    urlMap: {} as Record<string, number>,   // mapa url -> page_id
  }),

  actions: {
    async init() {
      
      if (this.initialized) return

      const config = useRuntimeConfig()
      const cfgData: any = await $fetch(`${config.public.apiBase}/config`)

      
      if (!cfgData?.success) {
        console.warn('Failed to fetch config:', cfgData)      
        throw createError({ statusCode: 500, message: 'Failed to fetch config' })
      }

      if (cfgData?.success) {
        this.defaultLang = cfgData.data.default_lang
        if (!this.defaultLang){
          console.warn('default_lang must be defined in config')
          throw createError({ statusCode: 500, message: 'default_lang must be defined' })
        }
        this.langs = cfgData.data.langs
        if (!this.langs){
          console.warn('langs must be defined in config')
          throw createError({ statusCode: 500, message: 'langs must be defined' })
        }
      }
      
      await this.fetchMenus(config)
      console.log('koniec init')

      this.initialized = true
    },

    async setCurrentLang(lang: string) {
      if (this.currentLang === lang ) return

      this.currentLang = lang
    },

    // app/stores/app.ts
    async fetchMenus(config: ReturnType<typeof useRuntimeConfig>) {
      // NOWE API (bez lang)
      const menuData: any = await $fetch(`${config.public.apiBase}/menus`)
      if (!menuData?.success) {
        console.warn('Failed to fetch menus:', menuData)      
        throw createError({ statusCode: 500, message: 'Failed to fetch menus' })
      }

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