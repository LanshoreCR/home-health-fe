import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'
import type { MaintenanceQuestion, MaintenanceQuestionInput, QuestionHistoryEntry, TemplateVersion } from '@shared/types'

const templateUrl = (templateId: number): string => `${ENDPOINTS.MAINTENANCE_BASE}/templates/${templateId}`
const draftUrl = (templateId: number): string => `${templateUrl(templateId)}/draft`

// The API answers business-rule failures (400/404/409) with a readable message; show it instead of a generic one.
const failWith = (fallback: string) => (error: unknown): never => {
  console.error(error)
  const apiMessage = isAxiosError(error) && typeof error.response?.data === 'string' ? error.response.data : ''
  toast.error(apiMessage !== '' ? apiMessage : fallback)
  throw error
}

export const getTemplateVersions = async (templateId: number): Promise<TemplateVersion[]> =>
  await axiosInstance.get<TemplateVersion[]>(`${templateUrl(templateId)}/versions`)
    .then((response) => response.data)
    .catch(failWith('Failed to load versions'))

export const getMaintenanceQuestions = async (templateId: number): Promise<MaintenanceQuestion[]> =>
  await axiosInstance.get<MaintenanceQuestion[]>(`${templateUrl(templateId)}/questions`)
    .then((response) => response.data)
    .catch(failWith('Failed to load questions'))

export const createDraft = async (templateId: number): Promise<void> => {
  await axiosInstance.post(draftUrl(templateId)).catch(failWith('Failed to start a draft'))
}

export const discardDraft = async (templateId: number): Promise<void> => {
  await axiosInstance.delete(draftUrl(templateId)).catch(failWith('Failed to discard the draft'))
}

export const publishDraft = async (templateId: number): Promise<{ versionNumber: number }> =>
  await axiosInstance.post<{ versionNumber: number }>(`${draftUrl(templateId)}/publish`)
    .then((response) => response.data)
    .catch(failWith('Failed to publish the draft'))

export const createQuestion = async (templateId: number, input: MaintenanceQuestionInput): Promise<void> => {
  await axiosInstance.post(`${draftUrl(templateId)}/questions`, input).catch(failWith('Failed to add the question'))
}

export const updateQuestion = async (templateId: number, questionId: number, input: MaintenanceQuestionInput): Promise<void> => {
  await axiosInstance.put(`${draftUrl(templateId)}/questions/${questionId}`, input).catch(failWith('Failed to save the question'))
}

export const setQuestionActive = async (templateId: number, questionId: number, isActive: boolean): Promise<void> => {
  await axiosInstance.put(`${draftUrl(templateId)}/questions/${questionId}/active`, { isActive })
    .catch(failWith(isActive ? 'Failed to activate the question' : 'Failed to deactivate the question'))
}

export const reorderQuestions = async (templateId: number, questionIDs: number[]): Promise<void> => {
  await axiosInstance.put(`${draftUrl(templateId)}/order`, { questionIDs }).catch(failWith('Failed to save the new order'))
}

export const getQuestionHistory = async (questionId: number): Promise<QuestionHistoryEntry[]> =>
  await axiosInstance.get<QuestionHistoryEntry[]>(`${ENDPOINTS.MAINTENANCE_BASE}/questions/${questionId}/history`)
    .then((response) => response.data)
    .catch(failWith('Failed to load the question history'))
