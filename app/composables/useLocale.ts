export const useLocale = () => {
  const route = useRoute()
  const store = useAppStore()

  const switchLocalePath = (locale: string): string => {
    const currentPath = route.path
    const segments = currentPath.split('/').filter(Boolean)

    // Usuń istniejący prefiks językowy (jeśli jest)
    if (segments.length > 0 && /^[a-z]{2}$/.test(segments[0] || '/')) {
      segments.shift()
    }

    const pathWithoutPrefix = '/' + segments.join('/')

    // Dla języka domyślnego – brak prefiksu
    if (locale === store.defaultLang) {
      return pathWithoutPrefix === '' ? '/' : pathWithoutPrefix
    }

    // Dla innych języków – dodaj prefiks
    return `/${locale}${pathWithoutPrefix === '/' ? '' : pathWithoutPrefix}`
  }

  return { switchLocalePath }
}