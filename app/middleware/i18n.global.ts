export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useAppStore()
  
  const segments = to.path.split('/').filter(Boolean)

  // Przypadek strony głównej "/"
  if (segments.length === 0) {
    await store.setCurrentLang(store.defaultLang || 'en')
    return // Zakończ middleware tutaj
  }

  const firstSegment = segments[0] || store.defaultLang || 'en'
  if (['pl', 'en'].includes(firstSegment)) {
    await store.setCurrentLang(firstSegment)
  } else {
    // Jeśli ktoś wejdzie na /kontakt, a nie ma prefixu, 
    // ustaw domyślny, ale nie rób nieskończonego przekierowania
    await store.setCurrentLang(store.defaultLang || 'en')
  }
})