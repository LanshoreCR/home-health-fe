import { useMemo } from 'react'
import type { QuestionData, QuestionFilter } from '@/shared/types'

export function useFilteredQuestions (
  questions: QuestionData[],
  searchQuery: string,
  activeFilter: QuestionFilter
): QuestionData[] {
  return useMemo(() => {
    let result = questions

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((item) => item.text.toLowerCase().includes(q))
    }

    if (activeFilter === 'complete') {
      result = result.filter((item) => item.answer !== null)
    } else if (activeFilter === 'incomplete') {
      result = result.filter((item) => item.answer === null)
    } else if (activeFilter === 'flagged') {
      result = result.filter((item) => item.flagged)
    } else if (activeFilter === 'notes') {
      result = result.filter((item) => item.note.length > 0)
    }

    return result
  }, [questions, searchQuery, activeFilter])
}
