import { useMemo } from 'react'
import type { QuestionData } from '@/shared/types'

export function useAuditProgress (questions: QuestionData[]) {
  return useMemo(() => {
    const total = questions.length
    const completed = questions.filter((q) => q.answer !== null).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percent }
  }, [questions])
}
