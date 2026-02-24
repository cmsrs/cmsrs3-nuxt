import type { NavigationGuard } from 'vue-router'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useAppStore()  
  await store.init()  
})