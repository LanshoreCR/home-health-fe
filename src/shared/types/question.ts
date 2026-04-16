export type AnswerValue = 'yes' | 'no' | 'na' | null

export type QuestionFilter = 'complete' | 'incomplete' | 'flagged' | 'notes' | null

export interface QuestionData {
  id: string
  templateAnswerId: number
  text: string
  /** When the API sends "3. Question text", parsed number for display */
  displayNumber?: number
  answer: AnswerValue
  note: string
  flagged: boolean
}
