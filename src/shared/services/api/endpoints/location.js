import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const getLocations = async ({ packageId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const params = {
      PackageID: packageId
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_LOCATIONS_BY_PACKAGE_ID, { params })
    const data = response.data

    const locations = data.map((item) => ({
      id: item.locationNumber,
      name: item.locationName
    }))

    return locations
  } catch (error) {
    console.error(error)
    return new Error('cannot get locations from audit by package id')
  }
}
