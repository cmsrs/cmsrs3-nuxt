// app/plugins/init-store.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
  const store = useAppStore()
  await store.init()
})