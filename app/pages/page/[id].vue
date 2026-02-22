<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const { fetchApi } = useApi()

// default lang
const defaultLang = await fetchApi(
  `${config.public.apiBase}/config`
).then(r => r.default_lang)

// strona
const page = await fetchApi(
  `${config.public.apiBase}/page/${route.params.id}/${defaultLang}`
)

// SEO
useSeoMeta({
  title: page.title,
  description: page.description
})
</script>

<template>
  <div v-if="page">

    <h1>{{ page.title }}</h1>

    <div v-html="page.content" />

    <div v-if="page.images?.length">
      <img
        v-for="img in page.images"
        :key="img.id"
        :src="config.public.domain + img.fs.medium"
        :alt="img.alt?.[defaultLang]"
        width="400"
      />
    </div>

  </div>
</template>
