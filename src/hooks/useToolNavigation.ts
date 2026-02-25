import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ToolInfo } from '@/shared/types'

export function useToolNavigation (
  allTools: ToolInfo[],
  toolId: string,
  auditId: string
) {
  const navigate = useNavigate()

  const currentToolIndex = useMemo(
    () => allTools.findIndex((t) => t.id === toolId),
    [allTools, toolId]
  )
  const currentTool = allTools[currentToolIndex] ?? null
  const prevTool = currentToolIndex > 0 ? allTools[currentToolIndex - 1] ?? null : null
  const nextTool = currentToolIndex < allTools.length - 1 && currentToolIndex >= 0
    ? allTools[currentToolIndex + 1] ?? null
    : null

  const navigateToTool = useCallback(
    (id: string) => {
      navigate(`/audit/${auditId}/tool/${id}`)
    },
    [navigate, auditId]
  )

  return {
    currentToolIndex,
    currentTool,
    prevTool,
    nextTool,
    navigateToTool
  }
}
