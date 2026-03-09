export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useAppStore()
  await store.init()

  const path = to.path
  const segments = path.split('/').filter(Boolean)
  const firstSegment = segments[0]

  // 1. Jeśli URL to po prostu "/" (brak segmentów) -> ustaw EN
  if (segments.length === 0) {
    await store.setCurrentLang('en')
    return
  }

  // 2. Jeśli pierwszy segment to pl lub en -> ustaw odpowiedni język
  if (firstSegment === 'pl' || firstSegment === 'en') {
    await store.setCurrentLang(firstSegment)
  } else {
    // 3. Jeśli brak prefiksu pl/en, a to nie jest "/" 
    // to domyślnie przyjmujemy angielski (możesz tu też zrobić przekierowanie)
    await store.setCurrentLang('en')
  }
})