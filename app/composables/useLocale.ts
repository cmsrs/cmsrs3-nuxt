export const useLocale = () => {
  const route = useRoute()
  const store = useAppStore()

  const switchLocalePath = (locale: string): string => {
    const currentPath = route.path
    const segments = currentPath.split('/').filter(Boolean)

    // 1. Usuń istniejący prefiks (pl lub en)
    if (segments.length > 0 && /^(pl|en)$/.test(segments[0])) {
      segments.shift()
    }

    const pathWithoutPrefix = '/' + segments.join('/')

    // 2. Specjalny przypadek: Strona główna w języku angielskim ma być czystym "/"
    if (locale === 'en' && pathWithoutPrefix === '/') {
      return '/'
    }

    // 3. Dla każdego innego przypadku dodajemy prefiks (np. /pl/kontakt, /en/about)
    return `/${locale}${pathWithoutPrefix === '/' ? '' : pathWithoutPrefix}`
  }

  return { switchLocalePath }
}