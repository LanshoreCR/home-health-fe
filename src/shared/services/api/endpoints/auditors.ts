import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'
import { toast } from 'sonner'

export interface Auditor {
  employeeId: string
  name: string
  email: string | null
}

export const getAuditors = async (): Promise<Auditor[]> => {
  try {
    const response = await axiosInstance.get<Auditor[]>(ENDPOINTS.GET_AUDITORS)
    if (response.status !== 200) {
      toast.error('Failed to fetch auditors')
      throw new Error('error getting auditors')
    }
    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Failed to fetch auditors')
    throw new Error('cannot get auditors')
  }
}
