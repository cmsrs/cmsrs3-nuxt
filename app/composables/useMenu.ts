export const findPageIdByUrl = (menus: any[], currentUrl: string): number | null => {
  const normalize = (url: string) => {
    // 1. Zamień na małe litery
    // 2. Usuń prefiks języka /pl/ lub /en/
    // 3. Usuń prefiks /cms/ jeśli występuje
    // 4. Usuń końcowy ukośnik dla spójności
    return url
      .toLowerCase()
      .replace(/^\/(pl|en)(\/|$)/, '/')
      .replace(/^\/cms(\/|$)/, '/')
      .replace(/\/$/, '') || '/'
  }

  const cleanUrl = normalize(currentUrl)

  // Rekurencyjna funkcja przeszukująca menu
  const searchInMenu = (items: any[]): number | null => {
    for (const item of items) {
      if (item.url && normalize(item.url) === cleanUrl) return item.page_id
      
      if (item.pages && item.pages.length > 0) {
        const found = searchInMenu(item.pages)
        if (found) return found
      }
      
      if (item.children && item.children.length > 0) {
         const found = searchInMenu(item.children)
         if (found) return found
      }
    }
    return null
  }

  return searchInMenu(menus)
}