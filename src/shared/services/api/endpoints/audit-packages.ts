import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'
import { toast } from 'sonner'
import type { Audit } from '@shared/types'

export interface CreateAuditPayload {
  edId: string
  startDate: string
  endDate: string
}

export interface CreateAuditResponse {
  packageID: number
}

export const getAudits = async (): Promise<Audit[]> => {
  try {
    const response = await axiosInstance.get<Audit[]>(ENDPOINTS.GET_AUDITS_PACKAGES)
    if (response.status !== 200) {
      toast.error('Failed to fetch audits')
      throw new Error('error getting audits from the database')
    }
    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Failed to fetch audits')
    throw new Error('cannot get audits')
  }
}

interface GetAuditByIdResponse {
  packageID: number
  packageName: string
  packageStatus: number
  startDate: string
  endDate: string
  folderID: number | null
  packageScore: string
  edNumber?: string
  regionalDirector?: { id: string; name: string }
  executiveDirector?: { id: string; name: string }
}

export const getAuditById = async (id: string): Promise<Audit> => {
  try {
    const response = await axiosInstance.get<GetAuditByIdResponse>(
      `${ENDPOINTS.GET_AUDITS_PACKAGES}/${id}`,
      { params: { controller: 1 } }
    )
    if (response.status !== 200) {
      toast.error('Failed to fetch audit')
      throw new Error('error getting audit from the database')
    }
    const data = response.data
    return {
      packageID: data.packageID,
      packageName: data.packageName,
      packageStatus: data.packageStatus,
      edNumber: data.edNumber ?? '',
      startDate: data.startDate,
      endDate: data.endDate,
      folderID: data.folderID,
      packageScore: data.packageScore,
      regionalDirector: data.regionalDirector,
      executiveDirector: data.executiveDirector
    }
  } catch (error) {
    console.error(error)
    toast.error('Failed to fetch audit')
    throw new Error('cannot get audit')
  }
}

export const createAudit = async (payload: CreateAuditPayload): Promise<CreateAuditResponse> => {
  try {
    const response = await axiosInstance.post<CreateAuditResponse>(ENDPOINTS.POST_AUDIT, payload)
    if (response.status !== 201) {
      toast.error('Failed to create audit')
      throw new Error('error creating audit')
    }
    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Failed to create audit')
    throw new Error('cannot create audit')
  }
}

export const updateAuditStatus = async (
  packageID: number,
  templateStatusID: number
): Promise<void> => {
  try {
    const response = await axiosInstance.patch(
      ENDPOINTS.PATCH_AUDIT_STATUS,
      { packageID, templateStatusID }
    )
    if (response.status !== 200 && response.status !== 204) {
      toast.error('Failed to update audit status')
      throw new Error('error updating audit status')
    }
  } catch (error) {
    console.error(error)
    toast.error('Failed to update audit status')
    throw new Error('cannot update audit status')
  }
}

export const deleteAuditPackage = async (packageId: number): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`${ENDPOINTS.DELETE_AUDIT}/${packageId}`)
    if (response.status !== 200 && response.status !== 204) {
      toast.error('Failed to delete audit')
      throw new Error('error deleting audit')
    }
  } catch (error) {
    console.error(error)
    toast.error('Failed to delete audit')
    throw new Error('cannot delete audit')
  }
}
