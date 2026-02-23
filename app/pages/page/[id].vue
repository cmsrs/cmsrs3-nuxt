<template>
  <div v-if="page">
    <h1>{{ page.title }}</h1>
    <div v-html="page.content"></div>
    <div v-if="page.images && page.images.length" class="page-images">
      <div v-for="img in page.images" :key="img.id">
        <img :src="`http://demo-headless.cmsrs.pl${img.fs?.medium}`" :alt="img.alt?.[defaultLang] || ''" />
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading page...</p>
  </div>
</template>

<script setup lang="ts">
interface PageDetail {
  id: number
  title: string
  content: string
  images: Array<{
    id: number
    fs: { medium: string }
    alt: { [lang: string]: string }
  }>
}

const route = useRoute()
const { fetchData } = useApi()
const defaultLang = useState<string>('defaultLang')

const pageId = computed(() => route.params.id as string)
const page = ref<PageDetail | null>(null)

// Watch for both lang and id changes
watch([defaultLang, pageId], async ([lang, id]) => {
  if (lang && id) {
    const data = await fetchData<PageDetail>(`/page/${id}/${lang}`)
    if (data) page.value = data
  }
}, { immediate: true })
</script>

