<script setup lang="ts">
const store = useAppStore()
const { fetchApi } = useApi()
const config = useRuntimeConfig()


const inner = computed(() => store.innerPages)

const slider = computed(() =>
  inner.value.find(i => i.short_title?.[store.defaultLang] === 'main_page_slider')
)

const boxes = computed(() =>
  inner.value.filter(i => i.short_title?.[store.defaultLang]?.includes('main_page_box'))
)

const lang = computed(() => store.currentLang || store.defaultLang)

// Pobranie strony głównej z API
const data = await fetchApi<any[]>(`${config.public.apiBase}/pages-type/main_page`)
const homePageData = data?.[0] || null


if(homePageData.id){
  const pageUrl = store.pageUrls[homePageData.id]
  useHead({
    title: homePageData.title?.[store.currentLang],
    meta: [
      {
        name: 'description',
        content: homePageData.description?.[store.currentLang] || homePageData.title?.[store.currentLang]
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: config.public.domain + (pageUrl?.[store.currentLang])
      },
      ...(store.langs.length > 1
        ? store.langs.map(lang => ({
            rel: 'alternate',
            hreflang: lang,
            href: config.public.domain + (pageUrl?.[lang])
          }))
        : [])
    ]  
  })
}



// Komunikat demo w zależności od języka
const demoAlertMessage = computed(() => {
  return store.currentLang === 'pl'
    ? 'Ta wersja demo została stworzona wyłącznie w celach demonstracyjnych. Wszystkie produkty w sklepie są produktami testowymi, a sklep nie prowadzi sprzedaży rzeczywistych produktów.'
    : 'This demo version was created solely for demonstration purposes. All products in the store are test products, and the store does not sell real products.'
})
</script>

<template>
  <div>

    <h1>{{ homePageData.title?.[lang] }}</h1>

    <!-- Alert demo -->
    <div class="alert alert-danger mt-4 mb-4" role="alert">
      {{ demoAlertMessage }}
    </div>

    <Slider
      v-if="slider"
      :images="slider.images || []"
      :lang="store.currentLang || store.defaultLang"
      :domain="config.public.apiBase.replace('/api/headless', '')"
    />

    <div class="row mt-4">
      <div v-for="box in boxes" :key="box.id" class="col-md-4">
        <div class="card p-3 mb-3" v-html="box.content?.[lang]"></div>
      </div>
    </div>
  </div>
</template>