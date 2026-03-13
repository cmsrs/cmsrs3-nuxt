<script setup lang="ts">
console.log('0000000000000000111')
const store = useAppStore()
const config = useRuntimeConfig()

// Upewniamy się, że store jest zainicjowany i currentLang ustawiony
//if (!store.initialized) {
//  await store.init()
//}

if (!store.currentLang) {
  await store.setCurrentLang(store.defaultLang || 'en')
}

// Pobieramy dane z API – zwraca wszystkie strony typu 'inner'
const { data: response } = await useFetch<{ success: boolean; data: any[] }>(
  `${config.public.apiBase}/pages-type/inner`
)

// Reaktywne obliczenia na podstawie danych
const inner = computed(() => response.value?.data || [])

// Używamy domyślnego języka do identyfikacji, bo short_title w domyślnym języku jest stały
const slider = computed(() =>
  inner.value.find(i => i.short_title?.[store.defaultLang!] === 'main_page_slider')
)

const boxes = computed(() =>
  inner.value.filter(i => i.short_title?.[store.defaultLang!]?.includes('main_page_box'))
)
</script>

<template>
  <div>
    <Slider
      v-if="slider"
      :images="slider.images || []"
      :lang="store.currentLang || store.defaultLang || 'en'"
      :domain="config.public.apiBase.replace('/api/headless', '')"
    />

    <div class="row mt-4">
      <div v-for="box in boxes" :key="box.id" class="col-md-4">
        <!-- Treść z aktualnego języka -->
        <div class="card p-3 mb-3" v-html="box.content?.[store.currentLang!]"></div>
      </div>
    </div>
  </div>
</template>