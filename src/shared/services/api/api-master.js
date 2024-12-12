import axios from 'axios'
import { API_URL } from './config'

class ApiMaster {
  constructor() {
    if (!ApiMaster.instance) {
      this.axiosInstance = axios.create({
        baseURL: API_URL,
        headers: {
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': '*'
        }
      })

      ApiMaster.instance = this
    }

    return ApiMaster.instance
  }

  setToken(token, common = false) {
    console.log("🚀 ~ ApiMaster ~ setToken ~ token:", token)
    if (common) {
      this.axiosInstance.defaults.headers.common['x-api-key'] = token
    } else {
      this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
    }
    this.axiosInstance.defaults.headers.common['Access-Control-Allow-Credentials'] = true
    this.axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
  }

  getInstance() {
    return this.axiosInstance
  }
}

const apiMaster = new ApiMaster()
Object.freeze(apiMaster)

export default apiMaster
