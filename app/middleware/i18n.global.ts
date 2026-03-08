export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useAppStore()
  await store.init()

  const path = to.path
  const supportedLocales = ['en', 'pl']
  const segments = path.split('/').filter(Boolean)

  // Sprawdź, czy pierwszy segment to dwuliterowy kod języka
  if (segments.length > 0 && /^[a-z]{2}$/.test(segments[0] || '')) {
    const lang = segments[0] || 'en'
    if (supportedLocales.includes(lang)) {
      await store.setCurrentLang(lang)
    } else {
      // Nieobsługiwany kod języka – przekieruj na ścieżkę bez prefiksu
      const newPath = '/' + segments.slice(1).join('/')
      return navigateTo(newPath || '/', { redirectCode: 301 })
    }
  } else {
    // Brak prefiksu językowego – ustaw domyślny
    await store.setCurrentLang(store.defaultLang!)
  }
})