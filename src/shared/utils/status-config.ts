import type { AuditStatus } from '@shared/types/audit'

/** Template / package status IDs from the API (avoid magic numbers). */
export const TEMPLATE_STATUS = {
  PENDING: 1,
  UNDER_REVIEW: 2,
  APPROVED: 3,
  REJECTED: 4
} as const

/** Tool templateStatus string (from API) required before approving/rejecting an audit. */
export const TOOL_STATUS_UNDER_REVIEW = 'Under Review'

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

export const PACKAGE_STATUS_MAP: Record<number, { label: string, className: string }> = {
  [TEMPLATE_STATUS.PENDING]: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  [TEMPLATE_STATUS.UNDER_REVIEW]: { label: 'Under Review', className: 'bg-primary/10 text-primary border-primary/30' },
  [TEMPLATE_STATUS.APPROVED]: { label: 'Approved', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  [TEMPLATE_STATUS.REJECTED]: { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-200' }
}

/** Display status strings (e.g. from API) to Tailwind class */
export const DISPLAY_STATUS_CLASS: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-primary/10 text-primary border-primary/30',
  'Under Review': 'bg-primary/10 text-primary border-primary/30',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200'
}

const TOOL_TEMPLATE_STATUS_FALLBACK =
  'border-border text-muted-foreground bg-muted/40'

export function getStatusBadgeClass (status: string): string {
  return STATUS_CONFIG[status as AuditStatus]?.className ?? DISPLAY_STATUS_CLASS[status] ?? ''
}

/** Badge classes for tool template status strings from the API (outline Badge + custom colors). */
export function getToolTemplateStatusBadgeClass (status: string): string {
  const mapped = getStatusBadgeClass(status)
  if (mapped !== '') return mapped
  return TOOL_TEMPLATE_STATUS_FALLBACK
}
