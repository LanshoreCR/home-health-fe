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
      auditDate: tool.auditDate,
      startOfCareDate: tool.startOfCareDate,
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
    throw new Error('cannot get audit tools')
  }
}

export const updateToolStatus = async ({ packageTemplateId, templateStatusId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = {
      TemplateStatusID: templateStatusId,
      PackageTemplateID: packageTemplateId
    }

    const response = await axiosInstance.post(ENDPOINTS.UPDATE_TOOL_STATUS, body, {})
    if (response.status !== 200) return new Error('error updating tool status')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot update tool status')
  }
}

export const deleteTool = async ({ packageTemplateId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    
    const endpoint = `${ENDPOINTS.DELETE_TOOL}/${packageTemplateId}`;
    const response = await axiosInstance.delete(endpoint);
    if (response.status !== 200) return new Error('error deleting tool from database')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot delete tool')
  }
}
