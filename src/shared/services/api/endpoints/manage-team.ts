import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'

export const getTeamAuditors = async () => {
  try {
    const response = await axiosInstance
      .get(ENDPOINTS.GET_TEAM_AUDITORS, {})
    const data = response.data as Array<Record<string, unknown>>

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

export const getAssignedTeamMembers = async ({ auditTeamId }: { auditTeamId: string }) => {
  try {
    const params = {
      AuditTeamID: auditTeamId
    }

    const response = await axiosInstance
      .get(ENDPOINTS.GET_ASSIGNED_TEAM_MEMBERS, { params })
    const data = response.data as Array<Record<string, unknown>>

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

interface AuditorItem { employeeId: string }

export const manageTeamAuditors = async ({ auditTeamId, auditors, userId }: { auditTeamId: string, auditors: AuditorItem[], userId: string }) => {
  try {
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

export const reassignAuditor = async ({ auditorId, packageTemplateId }: { auditorId: string, packageTemplateId: string }) => {
  try {
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

export const reassignTeamLead = async ({ auditTeamId, auditorId, userId }: { auditTeamId: string, auditorId: string, userId: string }) => {
  try {
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
