export const findPageIdByUrl = (menus: any[], currentUrl: string): number | null => {
  // 🔹 usuń prefiks języka /en, /pl/ itd. (wraz z opcjonalnym ukośnikiem)
  const normalize = (url: string) => url.replace(/^\/[a-z]{2}(\/|$)/, '/')

  const cleanUrl = normalize(currentUrl)

  for (const menu of menus) {
    if (menu.url && normalize(menu.url) === cleanUrl) return menu.page_id

    for (const page of menu.pages || []) {
      if (page.url && normalize(page.url) === cleanUrl) return page.page_id

      for (const child of page.children || []) {
        if (child.url && normalize(child.url) === cleanUrl) return child.page_id
      }
    }
  }

  return null
}