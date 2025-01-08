import { format } from '@formkit/tempo'
import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const createAudit = async ({ audit, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const { dateRange, edName, businessLineId, locationId } = audit
    const startDate = dateRange[0]
    const endDate = dateRange[1]

    const startDateFormatted = format(startDate, 'YYYY-MM-DD')
    const endDateFormatted = format(endDate, 'YYYY-MM-DD')

    const params = {
      EDName: edName,
      LocationId: locationId,
      CreatedBy: userId,
      BusinessLineID: businessLineId,
      StartDate: startDateFormatted,
      EndDate: endDateFormatted
    }

    const response = await axiosInstance.post(ENDPOINTS.CREATE_BANNER, {}, { params })
    if (response.status !== 200) return new Error('error getting audits from the database')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot post audit')
  }
}

export const getAudits = async ({ userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const params = {
      UserID: userId,
      Controller: 1,
      StartIndex: 0,
      PageSize: 15
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_ALL_BANNERS, { params })
    if (response.status !== 200) return new Error('error getting audits from the database')
    const data = response.data

    const audits = data.map((item) => ({
      packageId: item.packageID,
      packageName: item.packageName,
      isTeam: item.isTeam,
      packageStartDate: item.packageStartDate,
      quarter: item.quarter,
      packageStatus: item.packageStatus,
      createdOn: item.createdOn,
      packageScore: item.packageScore,
      teamLead: item.teamLead,
      teamLeadId: item.teamLeadID,
      auditTeamId: item.auditTeamID,
      folderId: item.folderID,
      businessLineId: item.businessLineID,
      businessLineIdInt: item.businessLineIDInt,
      capaDueDate: item.capaDueDate,
      allQuestionsAnswered: item.allQuestionsAnswered,
      initialDueDate: item.initialDueDate,
      edNumber: item.edNumber,
      edName: item.edName,
      capaFlag: item.capaFlag
    }))

    return audits
  } catch (error) {
    console.error(error)
    return new Error('cannot post audit')
  }
}

export const getAudit = async ({ id }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const params = {
      PackageID: id
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_BANNER_BY_PACKAGE_ID, { params })
    const data = response.data

    const audit = {
      packageId: data.packageID,
      packageName: data.packageName,
      isTeam: data.isTeam,
      packageStartDate: data.packageStartDate,
      quarter: data.quarter,
      packageStatus: data.packageStatus,
      createdOn: data.createdOn,
      packageScore: data.packageScore,
      teamLead: data.teamLead,
      teamLeadId: data.teamLeadID,
      auditTeamId: data.auditTeamID,
      folderId: data.folderID,
      businessLineId: data.businessLineID,
      businessLineIdInt: data.businessLineIDInt,
      capaDueDate: data.capaDueDate,
      allQuestionsAnswered: data.allQuestionsAnswered,
      initialDueDate: data.initialDueDate
    }
    return audit
  } catch (error) {
    console.error(error)
    return new Error('cannot get audit')
  }
}

export const changeAuditStatus = async ({ id, status, score }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const params = {
      TemplateStatusID: status,
      PackageID: id,
      Score: parseFloat(score)
    }

    const response = await axiosInstance.put(ENDPOINTS.UPDATE_BANNER_STATUS, {}, { params })
    if (response.status !== 200) return new Error('error getting banner status from database')
    const data = response.data

    const templateAnswerID = data.templateAnswerID
    return templateAnswerID
  } catch (error) {
    console.error(error)
    return new Error('cannot update audit status')
  }
}


export const deleteAudit = async ({ packageId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = {
      PackageID: packageId
    }

    const response = await axiosInstance.put(ENDPOINTS.DELETE_BANNER, body, {})
    if (response.status !== 200) return new Error('error deleting audit from database')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot delete audit')
  }
}
