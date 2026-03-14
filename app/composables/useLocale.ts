// app/composables/useLocale.ts
export const useLocale = () => {
  const route = useRoute()
  const store = useAppStore()

  const switchLocalePath = (locale: string): string => {
    const currentPath = route.path

    if(! store.langs.includes(locale)) {
      console.warn(`[useLocale] No locale found for ${locale}`)
      return '/'
    }
    const pathParts = currentPath.split('/').filter(Boolean)
    const firstSegment = pathParts[0] || ''
    

    // Strona główna
    const isHome = currentPath === '/'
    const isRoot = pathParts.length === 0 || 
                   (pathParts.length === 1 && store.langs.includes(firstSegment))

    if (isHome || isRoot) {
      return locale === store.defaultLang ? '/' : `/${locale}`
    }

    // Znajdź page_id na podstawie bieżącego URL
    const pageId = store.urlMap[currentPath]
    if (pageId && store.pageUrls[pageId]?.[locale]) {
      return store.pageUrls[pageId][locale]
    }

    // Fallback – tylko gdyby coś poszło nie tak
    console.warn(`[useLocale] Brak URL dla strony ${pageId} w języku ${locale}`)
    return '/'
  }

  return { switchLocalePath }
}