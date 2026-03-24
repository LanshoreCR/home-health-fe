export type ToolStatus = 'not-started' | 'in-progress' | 'complete'

export interface ToolInfo {
  id: string
  name: string
  completed: number
  total: number
  locationName?: string
  assignedAuditor?: string
  templateScore?: string
  templateStatus?: string
}

export interface ToolMetadata {
  locationId: string
  locationName: string
  auditDate?: string
  payor?: string
  disciplines?: string
  patientNumber?: string
  socDate?: string
  activeOrDischarge?: 'active' | 'discharge'
  reviewDates?: string
  servicesBilledForReviewDates?: 'yes' | 'no'
}

/** Response from GET /api/Tools/{id} */
export interface ToolByIdResponse {
  templateID: number
  templateDesc: string
  locationNumber: string
  locationName: string
  assignedAuditor: string
  auditorName: string
  generalComments: string | null
  patientNumber: string | null
  auditDate: string | null
  activeOrDischarged: string | null
  disciplines: string | null
  payor: string | null
  reviewDate: string | null
  servicesBilled: string | null
  socDate: string | null
}

/** One form question from GET /api/Tools/{id}/form */
export interface ToolFormQuestionResponse {
  templateQuestionID: number
  questionText: string
  gTag?: string
  questionSort: number
  categ: string | null
  answers: unknown
  comments: string | null
  templateAnswerID?: number | null
  flag: boolean | null
}
