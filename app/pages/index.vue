<script setup lang="ts">
const config = useRuntimeConfig()
const { fetchApi } = useApi()

// default lang
const defaultLang = await fetchApi(
  `${config.public.apiBase}/config`
).then(r => r.default_lang)

// inner pages
const inner = await fetchApi(
  `${config.public.apiBase}/pages-type/inner`
)

// filtr
const slider = inner.find(
  (i: any) => i.short_title?.[defaultLang] === 'main_page_slider'
)

const box1 = inner.find(
  (i: any) => i.short_title?.[defaultLang] === 'main_page_box1'
)

const box2 = inner.find(
  (i: any) => i.short_title?.[defaultLang] === 'main_page_box2'
)

const box3 = inner.find(
  (i: any) => i.short_title?.[defaultLang] === 'main_page_box3'
)
</script>

<template>
  <div>

    <!-- 🔵 Slider -->
    <div v-if="slider">
      <div
        v-for="img in slider.images"
        :key="img.id"
      >
        <img
          :src="config.public.domain + img.fs.medium"
          :alt="img.alt?.[defaultLang]"
          width="600"
        />
      </div>
    </div>

    <hr />

    <!-- 🟢 3 kolumny -->
    <div style="display:flex; gap:20px">
      <div v-if="box1" v-html="box1.content[defaultLang]" />
      <div v-if="box2" v-html="box2.content[defaultLang]" />
      <div v-if="box3" v-html="box3.content[defaultLang]" />
    </div>

  </div>
</template>
