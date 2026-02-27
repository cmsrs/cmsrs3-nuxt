<script setup lang="ts">
import { findPageIdByUrl } from '~/composables/useMenu'

const store = useAppStore()
const config = useRuntimeConfig()
const route = useRoute()

// 🔹 czekamy, aż store zostanie zainicjalizowany
if (!store.initialized) await store.init()

// 🔹 bierzemy ścieżkę i normalizujemy
const currentUrl = route.path

const pageId = findPageIdByUrl(store.menus, currentUrl)

if (!pageId) {
  console.warn('Nie znaleziono page_id dla URL:', currentUrl, store.menus)
  throw createError({ statusCode: 404 })
}

// 🔹 pobieramy stronę po page_id
//const pageResponse: any = await $fetch(`${config.public.apiBase}/page-id/${pageId}/${store.defaultLang}`)
const pageResponse: any = await $fetch(`${config.public.apiBase}/page/${pageId}/${store.defaultLang}`)

if (!pageResponse?.data) throw createError({ statusCode: 404 })

const page = pageResponse.data
</script>

<template>
  <div>
    <h1 class="mb-3">{{ page.title }}</h1>
    <div v-html="page.content"></div>
    <div v-if="page.images" class="images-gallery mt-6">
      <img
        v-for="image in page.images"
        :key="image.id"
        :src="`${config.public.domain}${image.fs.medium}`"
        :alt="(store.defaultLang && image.alt[store.defaultLang]) || image.name"
        class="mb-4"
      />
    </div>
  </div>
</template>