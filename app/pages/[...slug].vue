<script setup lang="ts">

const store = useAppStore()
const config = useRuntimeConfig()
const route = useRoute()

// Pobierz język z URL
const currentUrl = route.path
const firstSegment = route.path.split('/')[1] || ''

let langFromUrl = store.defaultLang

if (firstSegment && store.langs.includes(firstSegment)) {
  langFromUrl = firstSegment
}

await store.setCurrentLang(langFromUrl)

// 5. Sprawdź, czy to strona główna
const isHome =
  currentUrl === '/' || store.langs.some(lang => currentUrl === `/${lang}`)

// Znajdź pageId
const normalisedUrl = currentUrl.replace(/\/$/, '') || '/'
const pageId = store.urlMap[normalisedUrl] || null


if (!isHome && !pageId) {
  console.warn('Nie znaleziono page_id dla URL:', currentUrl, store.menus)
  throw createError({ statusCode: 404, message: 'Page not found' })
}

// 6. Pobranie danych strony
let page = null
if (!isHome && pageId) {
  const pageResponse: any = await $fetch(`${config.public.apiBase}/page/${pageId}/${store.currentLang}`)
  if (!pageResponse?.success) throw createError({ statusCode: 404 })
  page = pageResponse.data

  const pageUrl = store.pageUrls[pageId]
  useHead({
    title: page.title,
    meta: [
      {
        name: 'description',
        content: page.description || page.title
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

// Komunikat productTestInfo w zależności od języka
const productTestInfo = computed(() => {
  return store.currentLang === 'pl'
    ? 'Produkt testowy'
    : 'Test Product'
})


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

<style scoped>
.product-test {
  color: rgb(255, 80, 80);
  font-weight: bold;
}
</style>


<template>
  <div>
    <!-- Strona główna (dla /pl, /en jeśli brak prefiksu itp.) -->
    <HomePage v-if="isHome" />

    <!-- Zwykłe strony -->
    <div v-else>
      <h1 class="mb-3">{{ page.title }}</h1>

      <!-- Strona kontaktowa -->
      <div v-if="page.type === 'contact'" class="row">
        <div class="col-md-8 col-lg-6">
          <form @submit="contact">
            <div class="mb-4">
              <input
                v-model="email"
                type="email"
                placeholder="Your email"
                class="form-control form-control-lg"
              />
              <span v-if="emailErr" class="text-red-500 text-sm">{{ emailErr }}</span>
            </div>
            <div class="mb-4">
              <textarea
                v-model="message"
                placeholder="Your message"
                rows="8"
                class="form-control form-control-lg"
              ></textarea>
              <span v-if="messageErr" class="text-red-500 text-sm">{{ messageErr }}</span>
            </div>
            
            <div v-if="messageInfo" class="mb-4 alert alert-danger" role="alert">{{ messageInfo }}</div>
            <div class="text-left">
              <button type="submit" class="btn btn-secondary btn-lg mt-4">
                Send
              </button>
            </div>
            
          </form>
        </div>
      </div>

      <!-- Strona sklepu -->
      <div v-else-if="page.type === 'shop'">
        <div class="row">
          <div v-for="product in page.products" :key="product.id" class="col-md-6 mb-5">
            <div class="row">
              <div class="col">
                  <img 
                    class="m-3" 
                    :src="`${config.public.domain}${product.images[0].fs.medium}`"
                    :alt="product.images[0].alt || product.product_name"
                  />
                <ul class="ms-3 list-unstyled">
                  <li class="product-test">{{ productTestInfo }}</li>                  
                  <li>{{ product.product_name }}</li>
                  <li>Nazwa: {{ product.product_name }}</li>
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
            class="mt-4 me-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>