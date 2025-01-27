import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const getToolTemplates = async ({ locationId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const params = {
      LocationNumber: locationId
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_TOOL_TEMPLATES_BY_LOCATION_ID, { params })
    const data = response.data
    const toolTemplates = data.map((item) => ({
      templateId: item.templateID,
      templateDesc: item.templateDesc,
      sectionId: item.sectionID,
      sectionDesc: item.sectionDesc,
      subSection: item.subSection,
      sub_SectionDesc: item.sub_SectionDesc,
      state: item.state,
      locationNumber: item.locationNumber,
      templateTypeId: item.templateTypeID,
      businessLineId: item.businessLineID
    }))

    return toolTemplates
  } catch (error) {
    console.error(error)
    return new Error('cannot get locations from audit by package id')
  }
}
