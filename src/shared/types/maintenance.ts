export interface TemplateVersion {
  templateVersionID: number
  versionNumber: number
  publishedOn: string | null
  publishedByName: string | null
  createdOn: string
  createdByName: string | null
  isDraft: boolean
  isCurrent: boolean
  questionCount: number
}

export interface MaintenanceQuestion {
  questionID: number
  questionText: string
  questionSort: number | null
  categ: string | null
  gTag: string | null
  isActive: boolean
  lastVersionNumber: number | null
  isNew: boolean
  isEdited: boolean
  isRemoved: boolean
}

export interface MaintenanceQuestionInput {
  questionText: string
  categ: string | null
  gTag: string | null
}

export interface QuestionHistoryEntry {
  versionNumber: number
  publishedOn: string | null
  publishedByName: string | null
  isDraft: boolean
  isInVersion: boolean
  questionText: string | null
  questionSort: number | null
  categ: string | null
  gTag: string | null
  changes: string[]
}
