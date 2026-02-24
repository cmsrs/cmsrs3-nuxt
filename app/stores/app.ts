import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    defaultLang: null as string | null,
    initialized: false,
    menus: [] as any[]
  }),

  actions: {
    async init() {
      if (this.initialized) return

      const config = useRuntimeConfig()

      // 🔥 używamy $fetch zamiast useFetch
      const cfgData: any = await $fetch(
        `${config.public.apiBase}/config`
      )

      if (cfgData?.success) {
        this.defaultLang = cfgData.data.default_lang
      }

      const menuData: any = await $fetch(
        `${config.public.apiBase}/menus/${this.defaultLang}`
      )

      if (menuData?.success) {
        this.menus = menuData.data
      }

      this.initialized = true
    }
  }
})