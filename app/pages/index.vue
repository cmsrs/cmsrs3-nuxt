<!-- pages/index.vue -->
<template>
  <div>
    <h1>Home Page</h1>

    <!-- Slider -->
    <section v-if="slider" class="slider">
      <h2>{{ slider.title?.[defaultLang] || 'Slider' }}</h2>
      <div v-if="slider.images && slider.images.length" class="slider-images">
        <div v-for="img in slider.images" :key="img.id" class="slide">
          <img :src="`http://demo-headless.cmsrs.pl${img.fs?.medium}`" :alt="img.alt?.[defaultLang] || ''" />
        </div>
      </div>
    </section>

    <!-- Three boxes -->
    <section class="boxes">
      <div v-for="box in boxes" :key="box.id" class="box">
        <h3>{{ box.title?.[defaultLang] }}</h3>
        <div v-html="box.content?.[defaultLang]"></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Image {
  id: number
  fs: { medium: string }
  alt: { [lang: string]: string }
}

interface InnerPage {
  id: number
  short_title: { [lang: string]: string }
  title: { [lang: string]: string }
  content: { [lang: string]: string }
  images: Image[]
}

const { fetchData } = useApi()
const defaultLang = useState<string>('defaultLang')

const innerPages = ref<InnerPage[]>([])
const slider = computed(() => innerPages.value.find(p => p.short_title?.[defaultLang.value] === 'main_page_slider'))
const boxes = computed(() => {
  const boxKeys = ['main_page_box1', 'main_page_box2', 'main_page_box3']
  return innerPages.value.filter(p => boxKeys.includes(p.short_title?.[defaultLang.value] || ''))
})

// Fetch inner pages when defaultLang is ready
watch(defaultLang, async (lang) => {
  if (lang) {
    const data = await fetchData<InnerPage[]>('/pages-type/inner')
    if (data) innerPages.value = data
  }
}, { immediate: true })
</script>

<style scoped>
.slider-images {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}
.slide img {
  max-width: 300px;
  height: auto;
}
.boxes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}
</style>