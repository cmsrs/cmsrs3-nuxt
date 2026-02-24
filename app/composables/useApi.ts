export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchApi = async <T>(url: string): Promise<T> => {
    const { data, error } = await useFetch(url)
    if (error.value || !data.value?.success) throw new Error('API error')
    return data.value.data
  }

  return { fetchApi }
}