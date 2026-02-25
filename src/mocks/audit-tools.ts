import type { ToolInfo } from '@shared/types'

export interface AuditToolsEntry {
  title: string
  status: string
  location: string
  tools: ToolInfo[]
}

export const auditToolsMap: Record<string, AuditToolsEntry> = {
  1: {
    title: 'ED: RCHC WA South King County Quality Q1 2026 - 409',
    status: 'Pending',
    location: 'Consolidated Homecare Services',
    tools: [
      { id: 'admin-review', name: 'Administrative Review', completed: 0, total: 15 },
      { id: 'key-indicators', name: 'Key Indicators', completed: 0, total: 10 },
      { id: 'clinical-review', name: 'Clinical Review', completed: 0, total: 12 },
      { id: 'financial-charges', name: 'Financial Charges', completed: 0, total: 8 },
      { id: 'advance-directives', name: 'Advance Directives', completed: 0, total: 5 },
      { id: 'emergency-plan', name: 'Emergency Care Plan', completed: 0, total: 7 },
      { id: 'f2f', name: 'Face-to-Face (F2F)', completed: 0, total: 4 },
      { id: 'infection-control', name: 'Infection Control', completed: 0, total: 9 },
      { id: 'medication-mgmt', name: 'Medication Management', completed: 0, total: 11 },
      { id: 'patient-rights', name: 'Patient Rights', completed: 0, total: 6 },
      { id: 'poc-review', name: 'Plan of Care Review', completed: 0, total: 13 },
      { id: 'discharge-planning', name: 'Discharge Planning', completed: 0, total: 8 }
    ]
  },
  2: {
    title: 'Administrative Review - WA North Region Q1 2026 - 412',
    status: 'In Progress',
    location: 'Pacific Health Partners',
    tools: [
      { id: 'admin-review', name: 'Administrative Review', completed: 9, total: 15 },
      { id: 'clinical-review', name: 'Clinical Review', completed: 3, total: 12 },
      { id: 'key-indicators', name: 'Key Indicators', completed: 0, total: 10 },
      { id: 'financial-charges', name: 'Financial Charges', completed: 5, total: 8 },
      { id: 'advance-directives', name: 'Advance Directives', completed: 5, total: 5 },
      { id: 'emergency-plan', name: 'Emergency Care Plan', completed: 7, total: 7 },
      { id: 'f2f', name: 'Face-to-Face (F2F)', completed: 4, total: 4 },
      { id: 'poc-review', name: 'Plan of Care Review', completed: 0, total: 13 }
    ]
  },
  3: {
    title: 'Clinical Review - CA North Region Q4 2025 - 398',
    status: 'Completed',
    location: 'Golden State Home Health',
    tools: [
      { id: 'admin-review', name: 'Administrative Review', completed: 15, total: 15 },
      { id: 'clinical-review', name: 'Clinical Review', completed: 12, total: 12 },
      { id: 'key-indicators', name: 'Key Indicators', completed: 10, total: 10 },
      { id: 'financial-charges', name: 'Financial Charges', completed: 8, total: 8 },
      { id: 'advance-directives', name: 'Advance Directives', completed: 5, total: 5 },
      { id: 'emergency-plan', name: 'Emergency Care Plan', completed: 7, total: 7 },
      { id: 'f2f', name: 'Face-to-Face (F2F)', completed: 4, total: 4 },
      { id: 'infection-control', name: 'Infection Control', completed: 9, total: 9 },
      { id: 'medication-mgmt', name: 'Medication Management', completed: 11, total: 11 },
      { id: 'patient-rights', name: 'Patient Rights', completed: 6, total: 6 },
      { id: 'poc-review', name: 'Plan of Care Review', completed: 13, total: 13 },
      { id: 'discharge-planning', name: 'Discharge Planning', completed: 8, total: 8 },
      { id: 'wound-care', name: 'Wound Care', completed: 6, total: 6 },
      { id: 'fall-risk', name: 'Fall Risk Assessment', completed: 4, total: 4 },
      { id: 'nutrition', name: 'Nutrition Assessment', completed: 3, total: 3 }
    ]
  },
  4: {
    title: 'Financial Compliance - TX Central Q1 2026 - 415',
    status: 'In Progress',
    location: 'Lone Star Care Services',
    tools: [
      { id: 'financial-charges', name: 'Financial Charges', completed: 5, total: 8 },
      { id: 'admin-review', name: 'Administrative Review', completed: 2, total: 15 },
      { id: 'billing-accuracy', name: 'Billing Accuracy', completed: 0, total: 10 },
      { id: 'insurance-verify', name: 'Insurance Verification', completed: 0, total: 7 },
      { id: 'coding-compliance', name: 'Coding Compliance', completed: 0, total: 14 },
      { id: 'reimbursement', name: 'Reimbursement Review', completed: 0, total: 9 },
      { id: 'patient-liability', name: 'Patient Liability', completed: 0, total: 6 },
      { id: 'authorization', name: 'Prior Authorization', completed: 0, total: 8 },
      { id: 'claims-review', name: 'Claims Review', completed: 0, total: 12 },
      { id: 'documentation-req', name: 'Documentation Requirements', completed: 0, total: 11 },
      { id: 'payment-posting', name: 'Payment Posting', completed: 0, total: 5 },
      { id: 'denial-mgmt', name: 'Denial Management', completed: 0, total: 8 },
      { id: 'contract-compliance', name: 'Contract Compliance', completed: 0, total: 7 },
      { id: 'refund-process', name: 'Refund Processing', completed: 0, total: 4 },
      { id: 'bad-debt', name: 'Bad Debt Review', completed: 0, total: 6 },
      { id: 'charity-care', name: 'Charity Care', completed: 0, total: 5 },
      { id: 'cost-report', name: 'Cost Report Items', completed: 0, total: 9 },
      { id: 'compliance-training', name: 'Compliance Training Records', completed: 0, total: 3 },
      { id: 'vendor-payments', name: 'Vendor Payment Audit', completed: 0, total: 7 },
      { id: 'payroll-accuracy', name: 'Payroll Accuracy', completed: 0, total: 6 }
    ]
  },
  5: {
    title: 'Quality Assurance - WA South King County Q1 2026 - 420',
    status: 'Rejected',
    location: 'Consolidated Homecare Services',
    tools: [
      { id: 'admin-review', name: 'Administrative Review', completed: 15, total: 15 },
      { id: 'key-indicators', name: 'Key Indicators', completed: 7, total: 10 },
      { id: 'clinical-review', name: 'Clinical Review', completed: 0, total: 12 },
      { id: 'quality-metrics', name: 'Quality Metrics', completed: 8, total: 8 },
      { id: 'satisfaction-survey', name: 'Patient Satisfaction Survey', completed: 3, total: 7 },
      { id: 'incident-review', name: 'Incident Review', completed: 0, total: 9 },
      { id: 'staff-competency', name: 'Staff Competency', completed: 0, total: 11 },
      { id: 'policy-compliance', name: 'Policy Compliance', completed: 0, total: 8 },
      { id: 'oasis-accuracy', name: 'OASIS Accuracy', completed: 12, total: 14 },
      { id: 'care-coordination', name: 'Care Coordination', completed: 0, total: 6 },
      { id: 'supervision-docs', name: 'Supervision Documentation', completed: 0, total: 5 },
      { id: 'outcome-measures', name: 'Outcome Measures', completed: 0, total: 10 },
      { id: 'process-improvement', name: 'Process Improvement', completed: 0, total: 7 },
      { id: 'risk-assessment', name: 'Risk Assessment', completed: 0, total: 8 },
      { id: 'emergency-prep', name: 'Emergency Preparedness', completed: 0, total: 6 },
      { id: 'infection-surveillance', name: 'Infection Surveillance', completed: 0, total: 9 },
      { id: 'patient-education', name: 'Patient Education', completed: 0, total: 5 },
      { id: 'communication-audit', name: 'Communication Audit', completed: 0, total: 4 },
      { id: 'safety-review', name: 'Safety Review', completed: 0, total: 7 },
      { id: 'equipment-audit', name: 'Equipment Audit', completed: 0, total: 3 },
      { id: 'record-keeping', name: 'Record Keeping', completed: 0, total: 6 },
      { id: 'hipaa-compliance', name: 'HIPAA Compliance', completed: 0, total: 8 },
      { id: 'grievance-process', name: 'Grievance Process Review', completed: 0, total: 4 },
      { id: 'continuity-of-care', name: 'Continuity of Care', completed: 0, total: 5 },
      { id: 'telehealth-audit', name: 'Telehealth Audit', completed: 0, total: 3 }
    ]
  }
}
