export type AnswerValue = 'yes' | 'no' | 'na' | null

export type QuestionFilter = 'complete' | 'incomplete' | 'flagged' | 'notes' | null

export interface QuestionData {
  id: string
  templateAnswerId: number
  text: string
  answer: AnswerValue
  note: string
  flagged: boolean
}
