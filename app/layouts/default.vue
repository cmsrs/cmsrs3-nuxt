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

<template>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <NuxtLink class="navbar-brand" to="/">CMSRS</NuxtLink>

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
            v-if="menu.pages?.length === 1"
            class="nav-link"
            :to="cleanUrl(menu.pages[0].url)"
          >
            {{ menu.pages[0].short_title }}
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
    </div>
  </div>
</nav>

<div class="container mt-4">
  <slot />
</div>
</template>