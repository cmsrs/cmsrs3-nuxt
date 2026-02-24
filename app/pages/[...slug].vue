<script setup lang="ts">
import { findPageIdByUrl } from '~/composables/useMenu'

const store = useAppStore()
const config = useRuntimeConfig()
const route = useRoute()

await store.init()

const currentUrl = route.path

// szukamy page_id w store.menus
const pageId = findPageIdByUrl(store.menus, currentUrl)

if (!pageId) throw createError({ statusCode: 404 })

// pobieramy stronę po page_id
const { data: pageResponse } = await useFetch(
  `${config.public.apiBase}/page-id/${pageId}/${store.defaultLang}`
)

if (!pageResponse.value?.success) throw createError({ statusCode: 404 })

const page = pageResponse.value.data
</script>

<template>
  <div>
    <h1 class="mb-3">{{ page.title }}</h1>
    <div v-html="page.content"></div>
  </div>
</template>