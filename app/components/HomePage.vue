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
    <div class="alert alert-danger" role="alert">
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
        <div class="card p-3 mb-3" v-html="box.content?.[store.currentLang!]"></div>
      </div>
    </div>
  </div>
</template>