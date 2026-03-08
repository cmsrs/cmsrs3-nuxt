import type { NavigationGuard } from 'vue-router'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useAppStore()  
  await store.init()  

  // Wyciągnij język z pierwszej części ścieżki (jeśli istnieje)
  const path = to.path
  const match = path.match(/^\/([a-z]{2})\//)
  let lang = store.defaultLang || 'en'

  if (match && match[1] && ['en', 'pl'].includes(match[1])) {
    lang = match[1]
  } else if (path === '/') {
    // Strona główna – domyślny język
    lang = store.defaultLang || 'en'
  }

  store.setCurrentLang(lang)

})