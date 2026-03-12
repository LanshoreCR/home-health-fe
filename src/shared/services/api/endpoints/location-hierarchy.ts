import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'
import { toast } from 'sonner'

export interface LocationHierarchyItem {
  region: { id: string, name: string }
  regionalDirector: { id: string, name: string } | null
  executiveDirector: { id: string, name: string } | null
  location: { id: string, name: string }
}

export const getLocationHierarchy = async (params?: { rdId?: string }): Promise<LocationHierarchyItem[]> => {
  try {
    const response = await axiosInstance.get<LocationHierarchyItem[]>(
      ENDPOINTS.GET_LOCATION_HIERARCHY,
      { params: params ?? {} }
    )
    if (response.status !== 200) {
      toast.error('Failed to fetch location hierarchy')
      throw new Error('error getting location hierarchy')
    }
    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Failed to fetch location hierarchy')
    throw new Error('cannot get location hierarchy')
  }
}
