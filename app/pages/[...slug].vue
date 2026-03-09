<script setup lang="ts">
import { findPageIdByUrl } from '~/composables/useMenu'

const store = useAppStore()
const config = useRuntimeConfig()
const route = useRoute()

// Inicjalizacja store
if (!store.initialized) await store.init()
if (!store.currentLang) await store.setCurrentLang(store.defaultLang || 'en')

// Pobierz bieżącą ścieżkę
const currentUrl = route.path

// Znajdź pageId na podstawie menu
const pageId = findPageIdByUrl(store.menus, currentUrl)

// Sprawdź, czy to strona główna (po normalizacji daje '/')
//const isHome = !pageId && currentUrl.replace(/^\/[a-z]{2}(\/|$)/, '/') === '/'
const isHome = currentUrl === '/' || 
               currentUrl === '/en' || 
               currentUrl === '/pl' || 
               currentUrl === '/en/' || 
               currentUrl === '/pl/'


if (!isHome && !pageId) {
  console.warn('Nie znaleziono page_id dla URL:', currentUrl, store.menus)
  throw createError({ statusCode: 404 })
}

let page = null
if (!isHome) {
  // Pobierz dane strony
  const pageResponse: any = await $fetch(`${config.public.apiBase}/page/${pageId}/${store.currentLang}`)
  if (!pageResponse?.data) throw createError({ statusCode: 404 })
  page = pageResponse.data
}

// Dane formularza kontaktowego (tylko dla stron kontaktowych)
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
      body: { email: email.value, message: message.value, pageId: page!.id }
    })
    messageInfo.value = 'Message sent successfully'
    email.value = ''
    message.value = ''
  } catch (error) {
    messageInfo.value = "We're sorry, but this action is not available in the demo version."
  }
}
</script>

<template>
  <div>
    <!-- Strona główna (dla /pl, /en jeśli brak prefiksu itp.) -->
    <HomePage v-if="isHome" />

    <!-- Zwykłe strony -->
    <div v-else>
      <h1 class="mb-3">{{ page.title }}</h1>

      <!-- Strona kontaktowa -->
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

      <!-- Strona sklepu -->
      <div v-else-if="page.type === 'shop'">
        <div class="row">
          <div v-for="product in page.products" :key="product.id" class="col-md-6 mb-5">
            <div class="row">
              <div class="col">
                <a v-if="product.images?.length" :href="`/${store.defaultLang}${product.url}`">
                  <img 
                    class="m-3" 
                    :src="`${config.public.domain}${product.images[0].fs.medium}`"
                    :alt="product.images[0].alt || product.product_name"
                  />
                </a>
                <ul class="ms-3 list-unstyled">
                  <li class="product-test">{{ product.product_name }}</li>
                  <li>Nazwa: <a :href="`/${store.defaultLang}${product.url}`">{{ product.product_name }}</a></li>
                  <li v-if="product.sku">Sku: {{ product.sku }}</li>
                  <li>Cena: {{ product.price_description }}</li>
                  <li v-if="product.product_description">{{ product.product_description }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Zwykła strona z treścią i obrazkami -->
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
  </div>
</template>