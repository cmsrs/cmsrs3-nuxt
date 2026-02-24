<script setup lang="ts">
import { findPageIdByUrl } from '~/composables/useMenu'

const store = useAppStore()
const config = useRuntimeConfig()
const route = useRoute()

await store.init()

const page = ref<any>(null)

const loadPage = async () => {
  const currentUrl = route.path
  const pageId = findPageIdByUrl(store.menus, currentUrl)

  if (!pageId) {
    throw createError({ statusCode: 404 })
  }

  const response: any = await $fetch(
    `${config.public.apiBase}/page-id/${pageId}/${store.defaultLang}`
  )

  if (!response?.success) {
    throw createError({ statusCode: 404 })
  }

  page.value = response.data
}

await loadPage()

// 🔥 reaguje na zmianę route
watch(() => route.fullPath, loadPage)
</script>

<template>
  <div v-if="page">
    <h1 class="mb-3">{{ page.title }}</h1>
    <div v-html="page.content"></div>
  </div>
</template>