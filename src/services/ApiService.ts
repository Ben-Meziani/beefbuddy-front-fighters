import axios from 'axios'
import { getXsrfToken } from '@/utils/auth'

const baseUrl = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
})

const getHome = async () => {
    const response = await api.get(`/home-fighter`, {
      headers: {
        'X-XSRF-TOKEN': getXsrfToken(),
      },
    })
    return response.data
}

export default {
    api,
    getHome
}