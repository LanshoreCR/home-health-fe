export type AuditStatus = 'pending' | 'in-progress' | 'completed' | 'rejected'

export interface Audit {
  packageID: number
  packageName: string
  packageStatus: number
  edNumber: string
  startDate: string
  endDate: string
  folderID: number | null
  packageScore: string
  regionalDirector?: { id: string; name: string }
  executiveDirector?: { id: string; name: string }
}

/** Context object for the audit form (title, location, status, auditId). */
export interface AuditFormContext {
  auditId: string
  title: string
  location: string
  status: string
}
