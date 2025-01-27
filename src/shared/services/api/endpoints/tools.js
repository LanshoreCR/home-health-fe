import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const getTools = async ({ packageId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const params = {
      PackageID: packageId
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_TOOLS_BY_PACKAGE_ID, { params })
    if (response.status !== 200) return new Error('error getting audits from the database')
    const data = response.data
    const tools = data.map((tool) => ({
      templateName: tool.templateName,
      templateId: tool.templateID,
      templateStatus: tool.templateStatus,
      templateScore: tool.templateScore,
      assignedAuditor: tool.assignedAuditor,
      memberId: tool.memberID,
      packageTemplateId: tool.packageTemplateID,
      auditPlaceLocation: tool.auditPlaceLocation,
      locationName: tool.locationName,
      auditTeamId: tool.auditTeamID,
      customerName: tool.customerName,
      allQuestionsAnswered: tool.allQuestionsAnswered
    }))
    return tools
  } catch (error) {
    console.error(error)
    return new Error('cannot get audit tools')
  }
}

export const createTools = async ({ tools, packageId, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const toolsBody = tools.map((tool) => ({
      TemplateID: tool.templateId,
      AssignedAuditor: tool.assignedAuditor,
      LocationNumber: tool.locationNumber,
      CustomerName: tool.customerName,
      StartOfCareDate: tool.startOfCareDate
    }))
    const body = {
      PackageID: packageId,
      CreatedBy: userId,
      tools: toolsBody
    }

    const response = await axiosInstance.post(ENDPOINTS.CREATE_TOOLS, body, {})
    if (response.status !== 200) return new Error('error getting audits from the database')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot get audit tools')
  }
}

export const updateToolStatus = async ({ selectedTools }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = selectedTools.map((tool) => ({
      TemplateStatusID: 3,
      PackageTemplateID: tool.packageTemplateId
    }))

    const response = await axiosInstance.put(ENDPOINTS.UPDATE_TOOL_STATUS, body, {})
    if (response.status !== 200) return new Error('error getting banner status from database')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot update audit status')
  }
}

export const deleteTool = async ({ templateId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = {
      PackageTemplateID: templateId
    }

    const response = await axiosInstance.put(ENDPOINTS.DELETE_TOOL, body, {})
    if (response.status !== 200) return new Error('error deleting tool from database')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot delete tool')
  }
}
