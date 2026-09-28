import { useEffect, useState } from 'react'
import { getAuditors } from '@shared/services/api/endpoints/auditors'
import type { SearchableSelectOption } from '@/components/ui/searchable-select'

export function useAuditorOptions (enabled: boolean) {
  const [options, setOptions] = useState<SearchableSelectOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setOptions([])
      return
    }
    let cancelled = false
    setLoading(true)
    getAuditors()
      .then((auditors) => {
        if (cancelled) return
        setOptions(auditors.map((auditor) => ({ id: auditor.employeeId, name: auditor.name })))
      })
      .catch(() => {
        // error already toasted in the service
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  return { options, loading }
}
