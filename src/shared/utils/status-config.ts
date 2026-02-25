import type { AuditStatus } from '@shared/types/audit'

export const STATUS_CONFIG: Record<AuditStatus, { label: string, className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-primary/10 text-primary border-primary/30'
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-50 text-red-700 border-red-200'
  }
}

/** Display status strings (e.g. from API) to Tailwind class */
export const DISPLAY_STATUS_CLASS: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-primary/10 text-primary border-primary/30',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200'
}

export function getStatusBadgeClass (status: string): string {
  return STATUS_CONFIG[status as AuditStatus]?.className ?? DISPLAY_STATUS_CLASS[status] ?? ''
}
