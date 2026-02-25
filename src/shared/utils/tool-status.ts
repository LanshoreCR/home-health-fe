import type { ToolStatus } from '@shared/types/tool'

export function getToolStatus (completed: number, total: number): ToolStatus {
  if (completed === total && total > 0) return 'complete'
  if (completed > 0) return 'in-progress'
  return 'not-started'
}
