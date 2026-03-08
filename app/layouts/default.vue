<script setup lang="ts">
const store = useAppStore()
await store.init()
const { switchLocalePath } = useLocale()

const localizedUrl = (url?: string) => {
  if (!url) return '/'
  // Usuń domenę (jeśli jest)
  url = url.replace(/^https?:\/\/[^/]+/, '')
  // Usuń istniejący prefiks językowy (jeśli jest)
  const withoutLang = url.replace(/^\/[a-z]{2}\//, '/')
  // Dodaj aktualny język (jeśli nie domyślny)
  if (store.currentLang === store.defaultLang) {
    return withoutLang || '/'
  }
  return `/${store.currentLang}${withoutLang === '/' ? '' : withoutLang}`
}
</script>

<style scoped>
.logo {
  max-height: 40px;    /* lub inna wartość */
  width: auto;         /* zachowaj proporcje */
}
</style>

<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <NuxtLink class="navbar-brand" to="/">
      <img src="/images/logo_cmsrs.svg" alt="cmsRS" class="logo" >
    </NuxtLink>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#mainNavbar"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="mainNavbar">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li
          v-for="menu in store.menus"
          :key="menu.menu_name"
          class="nav-item"
          :class="{ dropdown: menu.pages?.length > 1 }"
        >
          <NuxtLink
            v-if="menu.pages?.length === 0"
            class="nav-link"
            :to="localizedUrl(menu.url)"
          >
            {{ menu.menu_name }}
          </NuxtLink>

          <template v-else>
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              {{ menu.menu_name }}
            </a>

            <ul class="dropdown-menu">
              <li v-for="page in menu.pages" :key="page.page_id">
                <NuxtLink
                  class="dropdown-item"
                  :to="localizedUrl(page.url)"
                >
                  {{ page.short_title }}
                </NuxtLink>

                <NuxtLink
                  v-for="child in page.children"
                  :key="child.page_id"
                  class="dropdown-item ms-3"
                  :to="localizedUrl(child.url)"
                >
                  {{ child.short_title }}
                </NuxtLink>
              </li>
            </ul>
          </template>
        </li>
      </ul>

      <ul class="nav navbar-nav ms-auto">
        <li class="d-flex flex-row">
          <div class="ms-2 nav-item">
            <NuxtLink
              class="changelang nav-link"
              :class="{ active: store.currentLang === 'en' }"
              :to="switchLocalePath('en')"
            >
              <img src="/images/en.png" alt="en" /> EN
            </NuxtLink>
          </div>
          <div class="ms-2 nav-item">
            <NuxtLink
              class="changelang nav-link"
              :class="{ active: store.currentLang === 'pl' }"
              :to="switchLocalePath('pl')"
            >
              <img src="/images/pl.png" alt="pl" /> PL
            </NuxtLink>
          </div>
        </li>
      </ul>
    </div>
  </div>
</nav>

<div class="container mt-4">
  <slot />
</div>
</template>