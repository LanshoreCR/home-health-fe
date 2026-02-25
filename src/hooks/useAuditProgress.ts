import { useMemo } from 'react'
import type { SectionData } from '@/shared/types'

export function useAuditProgress (sections: SectionData[]) {
  return useMemo(() => {
    const allQuestions = sections.flatMap((s) => s.questions)
    const total = allQuestions.length
    const completed = allQuestions.filter((q) => q.answer !== null).length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percent }
  }, [sections])
}
