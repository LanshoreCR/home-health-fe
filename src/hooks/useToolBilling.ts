import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import type { ToolBilling } from '@/shared/types'

export const emptyBilling: ToolBilling = { flag: false, comments: '' }

interface UseToolBillingResult {
  billing: ToolBilling
  toggleFlag: (flag: boolean) => void
  changeComments: (comments: string) => void
  isComplete: boolean
}

export function useToolBilling (initialBilling: ToolBilling, onSave: (billing: ToolBilling) => void): UseToolBillingResult {
  const [billing, setBilling] = useState(initialBilling)

  useEffect(() => {
    setBilling(initialBilling)
  }, [initialBilling])

  const debouncedSave = useDebouncedCallback(onSave, 600)

  useEffect(() => {
    return () => debouncedSave.cancel()
  }, [debouncedSave])

  // A pending comment save would re-send the old flag after the toggle, so it is dropped first.
  const toggleFlag = (flag: boolean): void => {
    debouncedSave.cancel()
    const next = { flag, comments: flag ? billing.comments : '' }
    setBilling(next)
    onSave(next)
  }

  const changeComments = (comments: string): void => {
    const next = { ...billing, comments }
    setBilling(next)
    debouncedSave(next)
  }

  const isComplete = !billing.flag || billing.comments.trim() !== ''

  return { billing, toggleFlag, changeComments, isComplete }
}
