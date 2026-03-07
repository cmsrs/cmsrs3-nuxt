<script setup lang="ts">
import { findPageIdByUrl } from '~/composables/useMenu'

const store = useAppStore()
const config = useRuntimeConfig()
const route = useRoute()

// 🔹 czekamy, aż store zostanie zainicjalizowany
if (!store.initialized) await store.init()

// 🔹 bierzemy ścieżkę i normalizujemy
const currentUrl = route.path

const pageId = findPageIdByUrl(store.menus, currentUrl)

if (!pageId) {
  console.warn('Nie znaleziono page_id dla URL:', currentUrl, store.menus)
  throw createError({ statusCode: 404 })
}

// 🔹 pobieramy stronę po page_id
//const pageResponse: any = await $fetch(`${config.public.apiBase}/page-id/${pageId}/${store.defaultLang}`)
const pageResponse: any = await $fetch(`${config.public.apiBase}/page/${pageId}/${store.defaultLang}`)

if (!pageResponse?.data) throw createError({ statusCode: 404 })

const page = pageResponse.data

const email = ref('')
const message = ref('')
const emailErr = ref('')
const messageErr = ref('')
const messageInfo = ref('')

const contact = async (event: Event) => {
  event.preventDefault()
  emailErr.value = ''
  messageErr.value = ''
  messageInfo.value = ''

  if (!email.value) {
    emailErr.value = 'Email is required'
    return
  }
  if (!message.value) {
    messageErr.value = 'Message is required'
    return
  }

  try {
    await $fetch(`${config.public.domain}/api/contact/${store.defaultLang}`, {
      method: 'POST',
      body: { email: email.value, message: message.value, pageId: page.id }
    })
    messageInfo.value = 'Message sent successfully'
    email.value = ''
    message.value = ''
  } catch (error) {
    messageInfo.value = "We're sorry, but this action is not available in the demo version." //'Error sending message'
  }
}
</script>
<template>
  <div>
    <h1 class="mb-3">{{ page.title }}</h1>
    <div v-if="page.type === 'contact'">
      <form @submit="contact">
        <div class="mb-4">
          <input
        v-model="email"
        type="email"
        placeholder="Your email"
        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span v-if="emailErr" class="text-red-500 text-sm">{{ emailErr }}</span>
        </div>
        <div class="mb-6">
          <textarea
        v-model="message"
        placeholder="Your message"
        rows="8"
        class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <span v-if="messageErr" class="text-red-500 text-sm">{{ messageErr }}</span>
        </div>
        <button type="submit" class="btn btn-secondary">
          Send
        </button>
        <div v-if="messageInfo" class="mt-3 text-green-500">{{ messageInfo }}</div>
      </form>
    </div>
    <div v-else-if="page.type === 'shop'">
    <h2 class="mb-6 text-2xl font-bold">{{ page.title }}</h2>
      <div class="grid grid-cols-1 gap-6">
      <div v-for="product in page.products" :key="product.id" class="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <div v-if="product.images?.length" class="relative bg-gray-200 h-64">
      <img
        :src="`${config.public.domain}${product.images[0].fs.medium}`"
        :alt="product.images[0].alt || product.product_name"
        class="w-full h-full object-cover"
      />
      </div>
      <div class="p-4">
      <h3 class="text-lg font-semibold mb-2">{{ product.product_name }}</h3>
      <p class="text-gray-600 text-sm mb-3">{{ product.product_description }}</p>
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold text-blue-600">{{ product.price_description }}</span>
        <button class="btn btn-primary text-sm">Add to Cart</button>
      </div>
      </div>
      </div>
      </div>
    </div>
    <div v-else>
      <div v-html="page.content"></div>
      <div v-if="page.images" class="images-gallery mt-6">
        <img
          v-for="image in page.images"
          :key="image.id"
          :src="`${config.public.domain}${image.fs.medium}`"
          :alt="(store.defaultLang && image.alt[store.defaultLang]) || image.name"
          class="mb-4"
        />
      </div>
    </div>
  </div>
</template>