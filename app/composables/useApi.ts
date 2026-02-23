export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const fetchData = async <T>(endpoint: string): Promise<T | null> => {
    try {
      const res = await $fetch<{ success: boolean; data: T }>(`${baseURL}${endpoint}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      return res.success ? res.data : null
    } catch (e) {
      console.error('API error:', e)
      return null
    }
  }

  return {
    fetchData,
    baseURL
  }
}