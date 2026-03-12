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
