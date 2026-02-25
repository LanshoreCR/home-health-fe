import axios from 'axios'
import { API_URL } from './config'

const axiosInstance = axios.create({
  baseURL: API_URL
})

export function setToken (token: string, common = false): void {
  if (common) {
    axiosInstance.defaults.headers.common['x-api-key'] = token
  } else {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
  }
}

export { axiosInstance }
