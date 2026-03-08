export const useLocale = () => {
  const route = useRoute()
  const store = useAppStore()

  const switchLocalePath = (locale: string): string => {
    // Pobierz aktualną ścieżkę bez prefiksu językowego
    const currentPath = route.path
    const pathWithoutPrefix = currentPath.replace(/^\/[a-z]{2}/, '') || '/'

    // Dla języka domyślnego – brak prefiksu
    if (locale === store.defaultLang) {
      return pathWithoutPrefix
    }

    // Dla innych języków – dodaj prefiks
    return `/${locale}${pathWithoutPrefix === '/' ? '' : pathWithoutPrefix}`
  }

  return { switchLocalePath }
}