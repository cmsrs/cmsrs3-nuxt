import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    defaultLang: null as string | null,
    initialized: false,
    menus: [] as any[],          // menu dla aktualnego języka
    currentLang: null as string | null,
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
      await this.fetchMenus(lang)
    },

    async fetchMenus(lang: string) {
      const config = useRuntimeConfig()
      const menuData: any = await $fetch(`${config.public.apiBase}/menus/${lang}`)

      if (menuData?.success) {
        this.menus = menuData.data
      }
    },
  },
})