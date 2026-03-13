// app/composables/useLocale.ts
export const useLocale = () => {
  const route = useRoute()
  const store = useAppStore()

  const switchLocalePath = (locale: string): string => {
    const currentPath = route.path

    // Strona główna
    if (currentPath === '/' || currentPath === '/en' || currentPath === '/pl') {
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