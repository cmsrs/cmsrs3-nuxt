<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'

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

const modules = [Pagination]
</script>

<style scoped>
.swiper {
  max-height: 400px;
}

.swiper-slide {
  height: 400px;
  overflow: hidden;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #000;
}

.img-fluid {
  width: 100%;
  height: auto;
  display: block;
}
</style>



<template>
  <Swiper
    :slides-per-view="1"
    :loop="true"
    :pagination="{ clickable: true }"
    :modules="modules"
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