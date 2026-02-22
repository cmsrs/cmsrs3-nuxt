<script setup lang="ts">
const config = useRuntimeConfig()
const { fetchApi } = useApi()

// 1️⃣ default lang
const defaultLang = await fetchApi(
  `${config.public.apiBase}/config`
).then(r => r.default_lang)

// 2️⃣ menu
const menus = await fetchApi(
  `${config.public.apiBase}/menus/${defaultLang}`
)
</script>

<template>
  <div>
    <nav>
      <ul>
        <li v-for="menu in menus" :key="menu.menu_name">

          <!-- jeśli ma page_id (np Contact) -->
          <NuxtLink
            v-if="menu.page_id"
            :to="`/page/${menu.page_id}`"
          >
            {{ menu.menu_name }}
          </NuxtLink>

          <template v-else>
            <strong>{{ menu.menu_name }}</strong>

            <ul>
              <li v-for="page in menu.pages" :key="page.page_id">
                <NuxtLink :to="`/page/${page.page_id}`">
                  {{ page.short_title }}
                </NuxtLink>

                <!-- children -->
                <ul v-if="page.children">
                  <li
                    v-for="child in page.children"
                    :key="child.page_id"
                  >
                    <NuxtLink :to="`/page/${child.page_id}`">
                      - {{ child.short_title }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </template>

        </li>
      </ul>
    </nav>

    <hr />

    <slot />
  </div>
</template>
