export type AuditStatus = 'pending' | 'in-progress' | 'completed' | 'rejected'

export interface Audit {
  id: string
  title: string
  location: string
  quarter: string
  auditor: string
  status: AuditStatus
  attachments: number
  toolsComplete: number
  toolsTotal: number
}

/** Context object for the audit form (title, location, status, auditId). */
export interface AuditFormContext {
  auditId: string
  title: string
  location: string
  status: string
}
