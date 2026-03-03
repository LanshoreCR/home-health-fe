export type ToolStatus = 'not-started' | 'in-progress' | 'complete'

export interface ToolInfo {
  id: string
  name: string
  completed: number
  total: number
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
