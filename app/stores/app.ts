import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    defaultLang: '' as string,
    initialized: false,
    menus: [] as any[],
    currentLang: '' as string,
    langs: [] as string[],
    urlMap: {} as Record<string, number>,   // mapa url -> page_id
    pageUrls: {} as Record<number, Record<string, string>>,
    innerPages: [] as any[], 
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
      await this.fetchInnerPages(config) 

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

    async fetchInnerPages(config: ReturnType<typeof useRuntimeConfig>) {
      const response: any = await $fetch(`${config.public.apiBase}/pages-type/inner`)
      if (response?.success) {
        this.innerPages = response.data
      } else {
        console.warn('Failed to fetch inner pages')
      }
    },    
    
    buildUrlMap() {
      const urlMap: Record<string, number> = {}
      const pageUrls: Record<number, Record<string, string>> = {}

      for (const menu of this.menus) {
        // Pojedyncze strony (np. kontakt)
        if (menu.url) {
          pageUrls[menu.page_id] = menu.url
          Object.entries(menu.url).forEach(([lang, url]) => {
            urlMap[url as string] = menu.page_id
          })
        }

        if (!menu.pages) continue

        for (const page of menu.pages) {
          if (page.url) {
            pageUrls[page.page_id] = page.url
            Object.entries(page.url).forEach(([lang, url]) => {
              urlMap[url as string] = page.page_id
            })
          }

          if (!page.children) continue

          for (const child of page.children) {
            if (child.url) {
              pageUrls[child.page_id] = child.url
              Object.entries(child.url).forEach(([lang, url]) => {
                urlMap[url as string] = child.page_id
              })
            }
          }
        }
      }

      this.urlMap = urlMap
      this.pageUrls = pageUrls
    },

  },
})