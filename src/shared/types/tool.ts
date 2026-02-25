export type ToolStatus = 'not-started' | 'in-progress' | 'complete'

export interface ToolInfo {
  id: string
  name: string
  completed: number
  total: number
}
