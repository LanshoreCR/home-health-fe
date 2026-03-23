import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'

export interface UpdateFormPayload {
  answers: number | null
  comments: string | null
  flag: number | null
}

export interface UpdateFormResponse {
  templateAnswerId: number
  rowsAffected: number
}

export const updateFormAnswer = async (
  templateAnswerId: number,
  payload: UpdateFormPayload
): Promise<UpdateFormResponse> => {
  const url = `${ENDPOINTS.FORM_BASE}/${templateAnswerId}`
  const response = await axiosInstance.post<UpdateFormResponse>(url, payload)
  return response.data
}
