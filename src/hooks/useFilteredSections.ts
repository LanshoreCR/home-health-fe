import { useMemo } from 'react'
import type { SectionData, QuestionFilter } from '@/shared/types'

export interface SectionWithNumber extends SectionData {
  startNumber: number
}

export function useFilteredSections (
  sections: SectionData[],
  searchQuery: string,
  activeFilter: QuestionFilter
): { filteredSections: SectionData[], sectionsWithNumbers: SectionWithNumber[] } {
  const filteredSections = useMemo(() => {
    return sections
      .map((section) => {
        let qs = section.questions
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          qs = qs.filter((item) => item.text.toLowerCase().includes(q))
        }
        if (activeFilter === 'complete') {
          qs = qs.filter((item) => item.answer !== null)
        } else if (activeFilter === 'incomplete') {
          qs = qs.filter((item) => item.answer === null)
        } else if (activeFilter === 'flagged') {
          qs = qs.filter((item) => item.flagged)
        } else if (activeFilter === 'notes') {
          qs = qs.filter((item) => item.note.length > 0)
        }
        return { ...section, questions: qs }
      })
      .filter((section) => section.questions.length > 0)
  }, [sections, searchQuery, activeFilter])

  const sectionsWithNumbers = useMemo(() => {
    let counter = 0
    return filteredSections.map((section) => {
      const startNumber = counter + 1
      counter += section.questions.length
      return { ...section, startNumber }
    })
  }, [filteredSections])

  return { filteredSections, sectionsWithNumbers }
}
