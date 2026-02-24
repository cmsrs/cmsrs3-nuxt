<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'

interface Image {
  id: number
  fs: { medium: string }
  alt: Record<string, string>
}

defineProps<{
  images: Image[]
  lang: string
  domain: string
}>()
</script>

<template>
  <Swiper
    :slides-per-view="1"
    :loop="true"
    :pagination="{ clickable: true }"
  >
    <SwiperSlide v-for="img in images" :key="img.id">
      <img
        class="img-fluid"
        :src="domain + img.fs.medium"
        :alt="img.alt[lang]"
        loading="lazy"
      />
    </SwiperSlide>
  </Swiper>
</template>