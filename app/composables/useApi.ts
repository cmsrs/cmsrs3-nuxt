interface ApiResponse<T> {
  success: boolean
  data: T
}

export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchApi = async <T>(url: string): Promise<T> => {
    const { data, error } = await useFetch<ApiResponse<T>>(url)

    if (error.value || !data.value?.success) {
      throw new Error('API error')
    }

    return data.value.data
  }

  return { fetchApi }
}