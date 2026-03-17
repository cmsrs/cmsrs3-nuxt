<script setup lang="ts">
const store = useAppStore()
const { switchLocalePath } = useLocale()

const lang = computed(() => store.currentLang || store.defaultLang)

const homePath = computed(() => {
  return lang.value === store.defaultLang ? '/' : `/${lang.value}`
})

const companyData = computed(() => {
  return store.innerPages.find(p => p.short_title?.[store.defaultLang] === 'company_data')
})
</script>

<style scoped>
.logo {
  max-height: 40px;
  width: auto;
}
.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

/* 🔥 MOBILE FIRST – wszystko pod sobą */
.footer-left,
.footer-center,
.footer-right {
  flex: 100%;
  text-align: center;
}

/* 🔥 żeby długi tekst nie rozwalał layoutu */
.footer-center {
  overflow-wrap: anywhere;
}

/* 💻 większe ekrany */
@media (min-width: 768px) {
  .footer-left {
    flex: 1;
    text-align: left;
  }

  .footer-center {
    flex: 2;
    text-align: center;
  }

  .footer-right {
    flex: 1;
    text-align: right;
  }
}

.footer-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: 0.2s ease;
}

.footer-link:hover {
  color: #0d6efd;
  text-decoration: underline;
}
</style>

<template>
  <!-- Główny kontener flex o minimalnej wysokości 100vh -->
  <div class="d-flex flex-column min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <NuxtLink class="navbar-brand" :to="homePath">
          <img src="/images/logo_cmsrs.svg" alt="cmsRS" class="logo" />
        </NuxtLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li
              v-for="menu in store.menus"
              :key="menu.menu_name"
              class="nav-item"
              :class="{ dropdown: menu.pages?.length > 1 }"
            >
              <NuxtLink
                v-if="menu.pages?.length === 0"
                class="nav-link"
                :to="menu.url?.[lang]"
              >
                {{ menu.menu_name?.[lang] }}
              </NuxtLink>

              <template v-else>
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  {{ menu.menu_name?.[lang] }}
                </a>

                <ul class="dropdown-menu">
                  <li v-for="page in menu.pages" :key="page.page_id">
                    <NuxtLink
                      class="dropdown-item"
                      :to="page.url?.[lang]"
                    >
                      {{ page.short_title?.[lang] }}
                    </NuxtLink>

                    <NuxtLink
                      v-for="child in page.children"
                      :key="child.page_id"
                      class="dropdown-item ms-3"
                      :to="child.url?.[lang]"
                    >
                      {{ child.short_title?.[lang] }}
                    </NuxtLink>
                  </li>
                </ul>
              </template>
            </li>
          </ul>

          <ul class="nav navbar-nav ms-auto">
            <li class="d-flex flex-row">
              <div
                v-for="langCode in store.langs"
                :key="langCode"
                class="ms-2 nav-item"
              >
                <NuxtLink
                  class="changelang nav-link"
                  :class="{ active: store.currentLang === langCode }"
                  :to="switchLocalePath(langCode)"
                >
                  <img :src="`/images/${langCode}.png`" :alt="langCode" />
                  {{ langCode.toUpperCase() }}
                </NuxtLink>
              </div>
            </li>
          </ul>


        </div>
      </div>
    </nav>

    <!-- Główna treść - rozciąga się, zajmując całą dostępną przestrzeń -->
    <main class="flex-grow-1">
      <div class="container mt-4">
        <slot />
      </div>
    </main>

    <!-- Stopka zawsze na dole -->
    <footer class="bg-dark text-white py-4 mt-5">
      <div class="container">
        <div class="footer-row">
          
          <!-- LEWA STRONA -->
          <div class="footer-left">
            <a href="https://www.cmsrs.pl" class="footer-link">
              www.cmsrs.pl
            </a>
          </div>

          <!-- ŚRODEK -->
          <div class="footer-center">
            <div v-if="companyData" v-html="companyData.content?.[lang]"></div>
          </div>

          <!-- PRAWA STRONA -->
          <div class="footer-right">
            <p class="mb-0">&copy; 2026 cmsRS</p>
          </div>

        </div>
      </div>
    </footer>
  </div>
</template>