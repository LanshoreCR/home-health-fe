import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const getTeamAuditors = async () => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const response = await axiosInstance
      .get(ENDPOINTS.GET_TEAM_AUDITORS, {})
    const data = response.data

    const auditors = data.map((item) => ({
      employeeId: item.employeeID,
      name: item.preferredName
    }))

    return auditors
  } catch (error) {
    console.error(error)
    return new Error('cannot get locations from audit by package id')
  }
}

export const getAssignedTeamMembers = async ({ auditTeamId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const params = {
      AuditTeamID: auditTeamId
    }

    const response = await axiosInstance
      .get(ENDPOINTS.GET_ASSIGNED_TEAM_MEMBERS, { params })
    const data = response.data

    const members = data.map((item) => ({
      employeeId: item.teamMemberID,
      name: item.preferredName
    }))

    return members
  } catch (error) {
    console.error(error)
    return new Error('cannot get locations from audit by package id')
  }
}

export const manageTeamAuditors = async ({ auditTeamId, auditors, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = auditors.map((auditor) => ({
      AuditorID: auditor.employeeId,
      AuditTeamID: auditTeamId,
      ModifiedBy: userId,
      Flag: 1
    }))

    const response = await axiosInstance
      .post(ENDPOINTS.MANAGE_TEAM_AUDITORS, body, {})
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot get locations from audit by package id')
  }
}

export const reassignAuditor = async ({ auditorId, packageTemplateId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = {
      AuditorID: auditorId,
      PackageTemplateID: packageTemplateId
    }

    const response = await axiosInstance
      .put(ENDPOINTS.REASSIGN_AUDITOR, body, {})
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot get locations from audit by package id')
  }
}

export const reassignTeamLead = async ({ auditTeamId, auditorId, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = {
      AuditorID: auditorId,
      AuditTeamID: auditTeamId,
      ModifiedBy: userId
    }

    const response = await axiosInstance
      .put(ENDPOINTS.REASSIGN_TEAM_LEAD, body, {})
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot get locations from audit by package id')
  }
}
