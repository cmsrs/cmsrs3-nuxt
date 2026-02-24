export const findPageIdByUrl = (menus: any[], currentUrl: string): number | null => {
  for (const menu of menus) {

    // jeśli menu ma bezpośredni url (np Contact)
    if (menu.url === currentUrl) {
      return menu.page_id
    }

    for (const page of menu.pages || []) {

      if (page.url === currentUrl) {
        return page.page_id
      }

      // children (1 poziom)
      for (const child of page.children || []) {
        if (child.url === currentUrl) {
          return child.page_id
        }
      }
    }
  }

  return null
}