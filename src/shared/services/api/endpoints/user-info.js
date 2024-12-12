import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const getUserInfo = async () => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const resp = await axiosInstance.get(ENDPOINTS.GET_USER_INFO)
    const data = resp.data
    return {
      employeeId: data.employeeId,
      businessLineId: data.businessLine_ID,
      businessLineName: data.businessLineName,
      regionId: data.region_ID,
      regionName: data.regionName,
      rdIda: data.rD_IDa,
      rdName: data.rdName,
      edId: data.eD_ID,
      edName: data.edName,
      locationId: data.locationID,
      locationName: data.locationName
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
    throw error
  }
}
