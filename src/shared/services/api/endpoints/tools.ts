import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'
import { toast } from 'sonner'
import type {
  ToolInfo,
  ToolByIdResponse,
  ToolFormQuestionResponse,
  ToolMetadata,
  QuestionData
} from '@shared/types'
import type { AnswerValue } from '@shared/types'

/** Raw shape from GET /api/Audits/{packageId}/tools */
interface AuditPackageToolRaw {
  templateName: string
  templateID: number
  templateStatus?: string
  templateScore?: string
  assignedAuditor?: string
  packageTemplateID: number
  auditPlaceLocation?: string
  locationName?: string
  allQuestionsAnswered: boolean | null
}

export const getToolsByAuditPackageId = async (packageId: string): Promise<ToolInfo[]> => {
  try {
    const url = `${ENDPOINTS.GET_AUDITS_PACKAGES}/${packageId}/tools`
    const response = await axiosInstance.get<AuditPackageToolRaw[]>(url)
    if (response.status !== 200) {
      toast.error('Failed to fetch tools')
      throw new Error('error getting tools from the database')
    }
    const data = response.data ?? []
    return data.map((tool) => ({
      id: String(tool.packageTemplateID),
      name: tool.templateName ?? '',
      completed: tool.allQuestionsAnswered === true ? 1 : 0,
      total: 1,
      locationName: tool.locationName,
      assignedAuditor: tool.assignedAuditor,
      templateScore: tool.templateScore,
      templateStatus: tool.templateStatus
    }))
  } catch (error) {
    console.error(error)
    toast.error('Failed to fetch tools')
    throw new Error('cannot get audit tools')
  }
}

export const getTools = async ({ packageId }: { packageId: string }) => {
  try {
    const params = {
      PackageID: packageId
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_TOOLS_BY_PACKAGE_ID, { params })
    if (response.status !== 200) return new Error('error getting audits from the database')
    const data = response.data as Array<Record<string, unknown>>
    const tools = data.map((tool) => ({
      templateName: tool.templateName,
      templateId: tool.templateID,
      templateStatus: tool.templateStatus,
      templateScore: tool.templateScore,
      assignedAuditor: tool.assignedAuditor,
      memberId: tool.memberID,
      packageTemplateId: tool.packageTemplateID,
      auditPlaceLocation: tool.auditPlaceLocation,
      locationName: tool.locationName,
      auditTeamId: tool.auditTeamID,
      customerName: tool.customerName,
      auditDate: tool.auditDate,
      startOfCareDate: tool.startOfCareDate,
      allQuestionsAnswered: tool.allQuestionsAnswered
    }))
    return tools
  } catch (error) {
    console.error(error)
    return new Error('cannot get audit tools')
  }
}

interface CreateToolItem {
  templateId: string
  assignedAuditor: string
  locationNumber: string
  customerName: string
}

export const createTools = async ({ tools, packageId, userId }: { tools: CreateToolItem[], packageId: string, userId: string }) => {
  try {
    const toolsBody = tools.map((tool) => ({
      TemplateID: tool.templateId,
      AssignedAuditor: tool.assignedAuditor,
      LocationNumber: tool.locationNumber,
      CustomerName: tool.customerName
    }))
    const body = {
      PackageID: packageId,
      CreatedBy: userId,
      tools: toolsBody
    }

    const response = await axiosInstance.post(ENDPOINTS.CREATE_TOOLS, body, {})
    if (response.status !== 200) return new Error('error getting audits from the database')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    throw new Error('cannot get audit tools')
  }
}

export const updateToolStatus = async ({ packageTemplateId, templateStatusId }: { packageTemplateId: string, templateStatusId: number }) => {
  try {
    const body = {
      TemplateStatusID: templateStatusId,
      PackageTemplateID: packageTemplateId
    }

    const response = await axiosInstance.post(ENDPOINTS.UPDATE_TOOL_STATUS, body, {})
    if (response.status !== 200) return new Error('error updating tool status')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot update tool status')
  }
}

export const deleteTool = async ({ packageTemplateId }: { packageTemplateId: string }) => {
  try {
    const endpoint = `${ENDPOINTS.DELETE_TOOL}/${packageTemplateId}`
    const response = await axiosInstance.delete(endpoint)
    if (response.status !== 200) return new Error('error deleting tool from database')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot delete tool')
  }
}

/** Payload for POST /api/Audits/tools. Required: packageID, templateID, assignedAuditor, locationNumber. Rest optional. */
export interface CreateAuditToolPayload {
  packageID: number
  templateID: number
  assignedAuditor: string
  locationNumber: string
  patientNumber?: string
  auditDate?: string
  activeOrDischarged?: string
  disciplines?: string
  payor?: string
  reviewDate?: string
  servicesBilled?: string
  socDate?: string
}

export const createAuditTool = async (payload: CreateAuditToolPayload): Promise<{ returnValue: number }> => {
  try {
    const optional = (v: string | undefined): string | null =>
      v === undefined || v === '' ? null : v

    const optionalDateOrNow = (v: string | undefined): string =>
      v === undefined || v === '' ? new Date().toISOString() : v

    const body = {
      packageID: payload.packageID,
      templateID: payload.templateID,
      assignedAuditor: payload.assignedAuditor,
      locationNumber: payload.locationNumber,
      patientNumber: optional(payload.patientNumber),
      auditDate: optionalDateOrNow(payload.auditDate),
      activeOrDischarged: optional(payload.activeOrDischarged),
      disciplines: optional(payload.disciplines),
      payor: optional(payload.payor),
      reviewDate: optionalDateOrNow(payload.reviewDate),
      servicesBilled: optional(payload.servicesBilled),
      socDate: optionalDateOrNow(payload.socDate)
    }
    const response = await axiosInstance.post(ENDPOINTS.POST_AUDIT_TOOL, body)
    if (response.status !== 200 && response.status !== 201) {
      toast.error('Failed to create tool')
      throw new Error('error creating audit tool')
    }
    const data =
      typeof response.data === 'string'
        ? (JSON.parse(response.data) as { returnValue: number })
        : (response.data as { returnValue: number })
    if (data?.returnValue !== 0) {
      toast.error('Failed to create tool')
      throw new Error(`create audit tool failed: returnValue=${String(data?.returnValue)}`)
    }
    return data
  } catch (error) {
    console.error(error)
    if (error instanceof Error && error.message.startsWith('create audit tool failed')) throw error
    toast.error('Failed to create tool')
    throw new Error('cannot create audit tool')
  }
}

/** GET /api/Tools/{id} - tool information by id */
export const getToolById = async (id: string): Promise<ToolByIdResponse> => {
  const url = `${ENDPOINTS.GET_TOOLS_BASE}/${id}`
  const response = await axiosInstance.get<ToolByIdResponse>(url)
  if (response.status !== 200) {
    toast.error('Failed to fetch tool')
    throw new Error('error getting tool by id')
  }
  return response.data
}

/** GET /api/Tools/{id}/form - all form questions for the tool */
export const getToolForm = async (id: string): Promise<ToolFormQuestionResponse[]> => {
  const url = `${ENDPOINTS.GET_TOOLS_BASE}/${id}/form`
  const response = await axiosInstance.get<ToolFormQuestionResponse[] | ToolFormQuestionResponse>(url)
  if (response.status !== 200) {
    toast.error('Failed to fetch form questions')
    throw new Error('error getting tool form')
  }
  const data = response.data
  if (Array.isArray(data)) return data
  if (data != null && typeof data === 'object' && 'templateQuestionID' in data) {
    return [data as ToolFormQuestionResponse]
  }
  return []
}

/** Map tool-by-id response to ToolMetadata (non-nullish only) */
export function mapToolByIdToToolMetadata (tool: ToolByIdResponse): ToolMetadata {
  const metadata: ToolMetadata = {
    locationId: tool.locationNumber ?? '',
    locationName: tool.locationName ?? ''
  }
  if (tool.auditDate != null && tool.auditDate !== '') metadata.auditDate = tool.auditDate
  if (tool.payor != null && tool.payor !== '') metadata.payor = tool.payor
  if (tool.disciplines != null && tool.disciplines !== '') metadata.disciplines = tool.disciplines
  if (tool.patientNumber != null && tool.patientNumber !== '') metadata.patientNumber = tool.patientNumber
  if (tool.socDate != null && tool.socDate !== '') metadata.socDate = tool.socDate
  if (tool.reviewDate != null && tool.reviewDate !== '') metadata.reviewDates = tool.reviewDate
  if (tool.activeOrDischarged != null && tool.activeOrDischarged !== '') {
    const v = tool.activeOrDischarged.toUpperCase()
    if (v === 'A') metadata.activeOrDischarge = 'active'
    else if (v === 'D') metadata.activeOrDischarge = 'discharge'
  }
  if (tool.servicesBilled != null && tool.servicesBilled !== '') {
    const v = tool.servicesBilled.toUpperCase()
    if (v === 'Y') metadata.servicesBilledForReviewDates = 'yes'
    else if (v === 'N') metadata.servicesBilledForReviewDates = 'no'
  }
  return metadata
}

/** Map form question API response to AnswerValue when possible */
function mapAnswerToValue (answers: unknown): AnswerValue {
  if (answers == null) return null
  if (typeof answers === 'number') {
    if (answers === 1) return 'yes'
    if (answers === 0) return 'no'
    if (answers === 2) return 'na'
    return null
  }
  const s = typeof answers === 'string' ? answers.toLowerCase() : String(answers).toLowerCase()
  if (s === 'yes' || s === 'y' || s === '1') return 'yes'
  if (s === 'no' || s === 'n' || s === '0') return 'no'
  if (s === 'na' || s === 'n/a' || s === '2') return 'na'
  return null
}

/** Map form questions API response to a flat QuestionData[] sorted by questionSort */
export function mapFormQuestions (questions: ToolFormQuestionResponse[]): QuestionData[] {
  return [...questions]
    .sort((a, b) => (a.questionSort ?? 0) - (b.questionSort ?? 0))
    .map((q) => ({
      id: String(q.templateQuestionID),
      templateAnswerId: q.templateAnswerID ?? 0,
      text: q.questionText ?? '',
      answer: mapAnswerToValue(q.answers),
      note: q.comments ?? '',
      flagged: q.flag === true || q.flag === 1 || (q.flag as unknown) === '1'
    }))
}
