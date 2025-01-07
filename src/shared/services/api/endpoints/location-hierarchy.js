import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const getLocationHierarchy = async ({ BusinessLineID, RegionID, RegionalDirectorID, ExecutiveDirectorID, Controller } = {
  BusinessLineID: '0', RegionID: '0', RegionalDirectorID: '0', ExecutiveDirectorID: '0', Controller: 0
}) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const resp = await axiosInstance.get(ENDPOINTS.GET_LOCATION_HIERARCHY, {
      params: {
        BusinessLineID,
        RegionID,
        RegionalDirectorID,
        ExecutiveDirectorID,
        Controller
      }
    })
    const data = resp.data

    const elements = data.map((item) => ({
      businessLineId: item.businessLine_ID,
      businessLine: item.businessLine,
      regionId: item.region_ID,
      regionName: item.regionName,
      rdIda: item.rD_IDa,
      rdName: item.rdName,
      edId: item.eD_ID,
      edName: item.edName,
      locationId: item.locationID,
      locationName: item.locationName
    }))
    return elements
  } catch (error) {
    console.error('Error fetching user info:', error)
    throw error
  }
}
