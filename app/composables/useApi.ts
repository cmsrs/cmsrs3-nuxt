export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchApi = async (url: string) => {
    const { data, error } = await useFetch(url)

    if (error.value) {
      throw createError({
        statusCode: 500,
        statusMessage: 'API Error'
      })
    }

    if (!data.value?.success) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid API response'
      })
    }

    return data.value.data
  }

  return { fetchApi }
}
