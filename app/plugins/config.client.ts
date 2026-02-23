export default defineNuxtPlugin(async () => {
  const { fetchData } = useApi()
  const defaultLang = useState<string>('defaultLang', () => '')

  if (!defaultLang.value) {
    const config = await fetchData<{ default_lang: string }>('/config')
    if (config?.default_lang) {
      defaultLang.value = config.default_lang
    }
  }
})