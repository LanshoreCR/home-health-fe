import type { AuditStatus } from '@shared/types'

export const audits = [
  { id: '1', title: 'ED: RCHC WA South King County Quality Q1 2026 - 409', location: 'Consolidated Homecare Services', quarter: 'Q1 2026', auditor: 'Rojas Guzman, Jose R', status: 'pending' as AuditStatus, attachments: 0, toolsComplete: 0, toolsTotal: 12 },
  { id: '2', title: 'Administrative Review - WA North Region Q1 2026 - 412', location: 'Pacific Health Partners', quarter: 'Q1 2026', auditor: 'Chen, Michelle L', status: 'in-progress' as AuditStatus, attachments: 3, toolsComplete: 4, toolsTotal: 8 },
  { id: '3', title: 'Clinical Review - CA North Region Q4 2025 - 398', location: 'Golden State Home Health', quarter: 'Q4 2025', auditor: 'Williams, Sarah K', status: 'completed' as AuditStatus, attachments: 5, toolsComplete: 15, toolsTotal: 15 },
  { id: '4', title: 'Financial Compliance - TX Central Q1 2026 - 415', location: 'Lone Star Care Services', quarter: 'Q1 2026', auditor: 'Martinez, Carlos D', status: 'in-progress' as AuditStatus, attachments: 1, toolsComplete: 7, toolsTotal: 20 },
  { id: '5', title: 'Quality Assurance - WA South King County Q1 2026 - 420', location: 'Consolidated Homecare Services', quarter: 'Q1 2026', auditor: 'Nguyen, Thi P', status: 'rejected' as AuditStatus, attachments: 2, toolsComplete: 22, toolsTotal: 25 }
]

export const auditorMap: Record<string, string> = {
  rojas: 'Rojas Guzman, Jose R',
  chen: 'Chen, Michelle L',
  williams: 'Williams, Sarah K',
  martinez: 'Martinez, Carlos D',
  nguyen: 'Nguyen, Thi P'
}

export const quarterMap: Record<string, string> = {
  'q1-2026': 'Q1 2026',
  'q4-2025': 'Q4 2025'
}

export const defaultFilters = {
  search: '',
  location: 'all',
  quarter: 'all',
  status: 'all',
  auditor: 'all'
}
