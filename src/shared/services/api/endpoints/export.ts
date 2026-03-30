import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'
import { toast } from 'sonner'

export const exportAuditExcel = async (packageId: number): Promise<Blob> => {
  try {
    const response = await axiosInstance.get(
      `${ENDPOINTS.EXPORT_AUDIT_EXCEL}/${packageId}/excel`,
      { responseType: 'blob' }
    )
    if (response.status !== 200) {
      toast.error('Failed to export audit')
      throw new Error('Failed to export audit')
    }
    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Failed to export audit')
    throw error
  }
}
