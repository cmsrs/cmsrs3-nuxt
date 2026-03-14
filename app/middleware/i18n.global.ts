export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useAppStore()
  
  const segments = to.path.split('/').filter(Boolean)

  // Przypadek strony głównej "/"
  if (segments.length === 0) {
    await store.setCurrentLang(store.defaultLang)
    return // Zakończ middleware tutaj
  }

  const firstSegment = segments[0] || store.defaultLang
  if ( store.langs.includes(firstSegment)) {
    await store.setCurrentLang(firstSegment)
  } else {
    await store.setCurrentLang(store.defaultLang)
  }
})