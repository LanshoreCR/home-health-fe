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
  totalQuestions?: number
  totalAnswered?: number
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
    return data.map((tool) => {
      const hasValidTotalQuestions = Number.isFinite(tool.totalQuestions) && (tool.totalQuestions ?? 0) >= 0
      const hasValidTotalAnswered = Number.isFinite(tool.totalAnswered) && (tool.totalAnswered ?? 0) >= 0

      const total = hasValidTotalQuestions ? Number(tool.totalQuestions) : 1
      const completedFromLegacyFlag = tool.allQuestionsAnswered === true ? 1 : 0
      const rawCompleted = hasValidTotalAnswered ? Number(tool.totalAnswered) : completedFromLegacyFlag
      const completed = total > 0 ? Math.min(Math.max(rawCompleted, 0), total) : 0

      return {
        id: String(tool.packageTemplateID),
        name: tool.templateName ?? '',
        completed,
        total,
        locationName: tool.locationName,
        assignedAuditor: tool.assignedAuditor,
        templateScore: tool.templateScore,
        templateStatus: tool.templateStatus
      }
    })
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

export const deleteToolById = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`${ENDPOINTS.DELETE_TOOL_BY_ID}/${id}`)
    if (response.status !== 200 && response.status !== 204) {
      toast.error('Failed to delete tool')
      throw new Error('error deleting tool')
    }
    if (response.status === 204) return

    const raw = response.data
    if (raw == null || raw === '') return

    const data =
      typeof raw === 'string'
        ? (JSON.parse(raw) as { returnValue: number })
        : (raw as { returnValue: number })
    if (data?.returnValue !== 0) {
      toast.error('Failed to delete tool')
      throw new Error(`delete tool failed: returnValue=${String(data?.returnValue)}`)
    }
  } catch (error) {
    console.error(error)
    if (error instanceof Error && error.message.startsWith('delete tool failed')) throw error
    toast.error('Failed to delete tool')
    throw new Error('cannot delete tool')
  }
}

/** Payload for POST /api/Audits/tools. Required: packageID, templateID, locationNumber. Rest optional. */
export interface CreateAuditToolPayload {
  packageID: number
  templateID: number
  /** Omit to let the backend assign the tool to the logged-in user. */
  assignedAuditor?: string
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

export interface UpdateToolPayload {
  patientNumber?: string | null
  auditDate?: string | null
  activeOrDischarged?: string | null
  disciplines?: string | null
  payor?: string | null
  reviewDate?: string | null
  servicesBilled?: string | null
  socDate?: string | null
  generalComments?: string | null
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
      assignedAuditor: optional(payload.assignedAuditor),
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

/** Convert tool metadata into PUT /api/Tools/{id} payload (generalComments handled separately). */
export function mapToolMetadataToUpdatePayload (metadata: ToolMetadata): UpdateToolPayload {
  const toNullIfEmpty = (value: string | undefined): string | null => {
    if (value == null) return null
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
  }

  return {
    patientNumber: toNullIfEmpty(metadata.patientNumber),
    auditDate: toNullIfEmpty(metadata.auditDate),
    activeOrDischarged:
      metadata.activeOrDischarge === 'active'
        ? 'A'
        : metadata.activeOrDischarge === 'discharge'
          ? 'D'
          : null,
    disciplines: toNullIfEmpty(metadata.disciplines),
    payor: toNullIfEmpty(metadata.payor),
    reviewDate: toNullIfEmpty(metadata.reviewDates),
    servicesBilled:
      metadata.servicesBilledForReviewDates === 'yes'
        ? 'Y'
        : metadata.servicesBilledForReviewDates === 'no'
          ? 'N'
          : null,
    socDate: toNullIfEmpty(metadata.socDate),
    // This save path is only for metadata fields.
    generalComments: null
  }
}

/** Save metadata fields only. generalComments is intentionally set to null. */
export const updateToolMetadata = async (id: string, payload: UpdateToolPayload): Promise<void> => {
  const url = `${ENDPOINTS.GET_TOOLS_BASE}/${id}`
  const response = await axiosInstance.put(url, payload)
  if (response.status !== 200 && response.status !== 204) {
    toast.error('Failed to save tool details')
    throw new Error('error updating tool metadata')
  }
}

/** Real-time save for general comments; all other fields are sent as null. */
export const updateToolGeneralComments = async (id: string, generalComments: string): Promise<void> => {
  const payload: UpdateToolPayload = {
    patientNumber: null,
    auditDate: null,
    activeOrDischarged: null,
    disciplines: null,
    payor: null,
    reviewDate: null,
    servicesBilled: null,
    socDate: null,
    generalComments: generalComments.trim() === '' ? null : generalComments
  }
  const url = `${ENDPOINTS.GET_TOOLS_BASE}/${id}`
  const response = await axiosInstance.put(url, payload)
  if (response.status !== 200 && response.status !== 204) {
    toast.error('Failed to save general comments')
    throw new Error('error updating general comments')
  }
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
  const toDateOnly = (value: string): string => value.split('T')[0]

  const metadata: ToolMetadata = {
    locationId: tool.locationNumber ?? '',
    locationName: tool.locationName ?? ''
  }
  if (tool.auditDate != null && tool.auditDate !== '') metadata.auditDate = toDateOnly(tool.auditDate)
  if (tool.payor != null && tool.payor !== '') metadata.payor = tool.payor
  if (tool.disciplines != null && tool.disciplines !== '') metadata.disciplines = tool.disciplines
  if (tool.patientNumber != null && tool.patientNumber !== '') metadata.patientNumber = tool.patientNumber
  if (tool.socDate != null && tool.socDate !== '') metadata.socDate = toDateOnly(tool.socDate)
  if (tool.reviewDate != null && tool.reviewDate !== '') metadata.reviewDates = toDateOnly(tool.reviewDate)
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

/** Split "3. Question body" from API into display number + body text */
function parseQuestionTextFromApi (raw: string): { displayNumber?: number, text: string } {
  const trimmed = raw.trim()
  const dotIdx = trimmed.indexOf('. ')
  if (dotIdx <= 0) return { text: trimmed }
  const head = trimmed.slice(0, dotIdx).trim()
  const rest = trimmed.slice(dotIdx + 2).trim()
  const num = Number.parseInt(head, 10)
  if (!Number.isFinite(num) || String(num) !== head) {
    return { text: trimmed }
  }
  return { displayNumber: num, text: rest }
}

/** Map form questions API response to a flat QuestionData[] sorted by questionSort */
export function mapFormQuestions (questions: ToolFormQuestionResponse[]): QuestionData[] {
  return [...questions]
    .sort((a, b) => (a.questionSort ?? 0) - (b.questionSort ?? 0))
    .map((q) => {
      const parsed = parseQuestionTextFromApi(q.questionText ?? '')
      return {
        id: String(q.templateQuestionID),
        templateAnswerId: q.templateAnswerID ?? 0,
        text: parsed.text,
        ...(parsed.displayNumber !== undefined ? { displayNumber: parsed.displayNumber } : {}),
        answer: mapAnswerToValue(q.answers),
        note: q.comments ?? '',
        flagged: q.flag === true || q.flag === 1 || (q.flag as unknown) === '1'
      }
    })
}
