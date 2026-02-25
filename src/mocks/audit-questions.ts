import type { QuestionData, SectionData, ToolInfo } from '@shared/types'

export interface ToolDef {
  name: string
  sections: SectionData[]
}

export interface AuditDef {
  title: string
  location: string
  status: string
  tools: Record<string, ToolDef>
}

export function makeQ (id: string, text: string): QuestionData {
  return { id, text, answer: null, note: '', flagged: false }
}

export const auditDatabase: Record<string, AuditDef> = {
  1: {
    title: 'ED: RCHC WA South King County Quality Q1 2026 - 409',
    location: 'Consolidated Homecare Services',
    status: 'Pending',
    tools: {
      'admin-review': {
        name: 'Administrative Review',
        sections: [
          { title: 'Admission Consent', questions: [makeQ('ar-1-1', 'At the SOC, there is an Admission Consent signed and dated by the patient or their representative that includes all disciplines ordered in the referral.'), makeQ('ar-1-2', 'If patient unable to sign and representative not available, evidence of consent performed through a 3-way call followed by mail/email signed consent.')] },
          { title: 'Financial Charges', questions: [makeQ('ar-2-1', 'At the SOC, there is evidence the patient or their representative was informed about the charges for services and the amount, if any, they may have to pay.')] },
          { title: 'Advance Directives', questions: [makeQ('ar-3-1', 'The POC includes information related to any advanced directives.')] },
          { title: 'Emergency Care Plan', questions: [makeQ('ar-4-1', "Patient Emergency Care Plan completed, dated, signed & attached - includes contact information for the patient, the patient's representative (if any), and the patient's primary caregiver."), makeQ('ar-4-2', 'If emergency plan activated there is evidence in chart of patient triaging.')] },
          { title: 'Face-to-Face (F2F)', questions: [makeQ('ar-5-1', 'Where required by the payer, there is evidence of a qualifying F2F encounter with a physician or allowed practitioner that occurred within 90 days prior to the SOC or within 30 days after the SOC.')] },
          { title: 'Master Admission Packet', questions: [makeQ('ar-6-1', 'Introductory information is provided to the client and/or their family/guardian to include: contact information for key staff, hours of operation, after hours information and contact number for state hotlines.'), makeQ('ar-6-2', 'Patient rights and responsibilities are provided and a signed copy is in the patient record.'), makeQ('ar-6-3', 'HIPAA notice of privacy practices provided and acknowledged by the patient or representative.')] },
          { title: 'Plan of Care', questions: [makeQ('ar-7-1', 'The plan of care contains all pertinent diagnoses, including mental health diagnoses, medications, and treatment orders.'), makeQ('ar-7-2', 'The plan of care includes measurable goals and expected outcomes with specific timeframes.'), makeQ('ar-7-3', "There is evidence that the plan of care is reviewed and updated at each recertification period or when there is a significant change in the patient's condition."), makeQ('ar-7-4', 'Physician orders are obtained for all services, treatments, and changes in the plan of care.'), makeQ('ar-7-5', "The plan of care reflects coordination between all disciplines involved in the patient's care.")] }
        ]
      },
      'key-indicators': {
        name: 'Key Indicators',
        sections: [
          { title: 'Clinical Documentation', questions: [makeQ('ki-1-1', 'Visit notes document skilled services provided and are consistent with the plan of care.'), makeQ('ki-1-2', 'Documentation supports medical necessity for services ordered and provided.'), makeQ('ki-1-3', 'Vital signs are documented as required per discipline and condition.')] },
          { title: 'Infection Control', questions: [makeQ('ki-2-1', 'There is evidence of proper infection control practices documented including hand hygiene and use of personal protective equipment.'), makeQ('ki-2-2', 'Documentation reflects patient/caregiver education on infection prevention measures.')] },
          { title: 'Patient Safety', questions: [makeQ('ki-3-1', 'Fall risk assessment is completed at admission and updated as needed.'), makeQ('ki-3-2', 'Medication reconciliation is documented at each visit with evidence of patient education.'), makeQ('ki-3-3', 'There is evidence of proper sharps and bio-hazard waste disposal education.')] }
        ]
      },
      'clinical-review': {
        name: 'Clinical Review',
        sections: [
          { title: 'Assessment Accuracy', questions: [makeQ('cr-1-1', "OASIS assessment is completed timely and accurately reflects the patient's clinical status."), makeQ('cr-1-2', 'Clinical assessment findings are consistent with documented diagnoses and treatment plan.'), makeQ('cr-1-3', 'Functional limitations are accurately assessed and documented.')] },
          { title: 'Care Coordination', questions: [makeQ('cr-2-1', 'There is evidence of communication with the physician regarding changes in patient condition.'), makeQ('cr-2-2', 'Coordination between disciplines is documented with consistent goals.'), makeQ('cr-2-3', 'Discharge planning begins at admission with patient/caregiver involvement.')] }
        ]
      }
    }
  }
}

/** Fallback when toolId is not in auditDatabase (e.g. for demo or missing tool). */
export function generateFallbackTool (toolId: string): ToolDef {
  const name = toolId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return {
    name,
    sections: [
      { title: 'General Compliance', questions: [makeQ(`${toolId}-1`, 'All required documentation is present and properly completed.'), makeQ(`${toolId}-2`, 'Documentation is signed and dated by the appropriate personnel.'), makeQ(`${toolId}-3`, 'Records are maintained in accordance with regulatory requirements.')] },
      { title: 'Quality Standards', questions: [makeQ(`${toolId}-4`, 'Services provided meet the established quality benchmarks.'), makeQ(`${toolId}-5`, 'There is evidence of continuous quality improvement activities.')] }
    ]
  }
}

export const toolListMap: Record<string, ToolInfo[]> = {
  1: [
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
  ],
  2: [
    { id: 'admin-review', name: 'Administrative Review', completed: 9, total: 15 },
    { id: 'clinical-review', name: 'Clinical Review', completed: 3, total: 12 },
    { id: 'key-indicators', name: 'Key Indicators', completed: 0, total: 10 },
    { id: 'financial-charges', name: 'Financial Charges', completed: 5, total: 8 },
    { id: 'advance-directives', name: 'Advance Directives', completed: 5, total: 5 },
    { id: 'emergency-plan', name: 'Emergency Care Plan', completed: 7, total: 7 },
    { id: 'f2f', name: 'Face-to-Face (F2F)', completed: 4, total: 4 },
    { id: 'poc-review', name: 'Plan of Care Review', completed: 0, total: 13 }
  ],
  3: [
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
  ],
  4: [
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
  ],
  5: [
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
