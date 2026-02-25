export type AnswerValue = 'yes' | 'no' | 'na' | null

export type QuestionFilter = 'complete' | 'incomplete' | 'flagged' | 'notes' | null

export interface QuestionData {
  id: string
  text: string
  answer: AnswerValue
  note: string
  flagged: boolean
}

export interface SectionData {
  title: string
  questions: QuestionData[]
}
