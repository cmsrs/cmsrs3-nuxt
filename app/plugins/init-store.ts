// app/plugins/init-store.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
  const store = useAppStore()
  console.log('Plugin: initialising store...')
  await store.init()
  console.log('Plugin: store initialised')
})