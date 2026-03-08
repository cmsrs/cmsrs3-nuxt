<script setup lang="ts">
const store = useAppStore()
await store.init()

const cleanUrl = (url?: string) => {
  if (!url) return '/'
  url = url.replace(/^https?:\/\/[^/]+/, '')
  url = url.replace(/^\/[a-z]{2}\//, '/')
  return url || '/'
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
            :to="cleanUrl(menu.url)"
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
                  :to="cleanUrl(page.url)"
                >
                  {{ page.short_title }}
                </NuxtLink>

                <NuxtLink
                  v-for="child in page.children"
                  :key="child.page_id"
                  class="dropdown-item ms-3"
                  :to="cleanUrl(child.url)"
                >
                  {{ child.short_title }}
                </NuxtLink>
              </li>
            </ul>
          </template>
        </li>
      </ul>

      <ul class="nav navbar-nav ms-auto" >
        <!-- Authentication Links -->
                          <li class="d-flex flex-row">
                                <div class="ms-2  nav-item">
              <a class="changelang nav-link  " href="/">
                <img src="/images/en.png" alt="en" /> EN
              </a>
            </div>
                                  <div class="ms-2  nav-item">
              <a class="changelang nav-link  active" href="/pl">
                <img src="/images/pl.png" alt="pl" /> PL
              </a>
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