<script setup lang="ts">
const store = useAppStore()
const config = useRuntimeConfig()

await store.init()

interface InnerPage {
  id: number
  short_title: Record<string, string>
  content: Record<string, string>
  images?: any[]
}

const { data: response } = await useFetch(
  `${config.public.apiBase}/pages-type/inner`
)

const inner = response.value?.data || []


const slider = inner.find(i => i.short_title[store.defaultLang] === 'main_page_slider')
const boxes = inner.filter(i => i.short_title[store.defaultLang].includes('main_page_box'))
</script>

<template>
  <div>
    <Slider v-if="slider" :images="slider.images" :lang="store.defaultLang" :domain="config.public.apiBase.replace('/api/headless','')" />

    <div class="row mt-4">
      <div v-for="box in boxes" :key="box.id" class="col-md-4">
        <div class="card p-3 mb-3" v-html="box.content[store.defaultLang]"></div>
      </div>
    </div>
  </div>
</template>