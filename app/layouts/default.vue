<template>
  <div>
    <header>
      <nav v-if="menus.length">
        <ul>
          <li v-for="menu in menus" :key="menu.menu_name">
            <span>{{ menu.menu_name }}</span>
            <ul v-if="menu.pages && menu.pages.length">
              <li v-for="page in menu.pages" :key="page.page_id">
                <NuxtLink :to="`/page/${page.page_id}`">
                  {{ page.short_title }}
                </NuxtLink>
                <!-- Nested children -->
                <ul v-if="page.children && page.children.length">
                  <li v-for="child in page.children" :key="child.page_id">
                    <NuxtLink :to="`/page/${child.page_id}`">
                      {{ child.short_title }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
            <!-- Handle menu without pages (like Contact) -->
            <NuxtLink v-else-if="menu.page_id" :to="`/page/${menu.page_id}`">
              {{ menu.menu_name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
interface Page {
  url: string
  short_title: string
  page_id: number
  children?: Page[]
}

interface Menu {
  menu_name: string
  pages: Page[]
  page_id?: number
  url?: string
}

const { fetchData } = useApi()
const defaultLang = useState<string>('defaultLang')

const menus = ref<Menu[]>([])

// Wait for defaultLang to be set
watch(defaultLang, async (lang) => {
  if (lang) {
    const data = await fetchData<Menu[]>(`/menus/${lang}`)
    if (data) menus.value = data
  }
}, { immediate: true })
</script>