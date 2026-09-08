import { useEffect, useState } from 'react'
import { getLocationHierarchy } from '@shared/services/api/endpoints/location-hierarchy'
import type { LocationHierarchyItem } from '@shared/services/api/endpoints/location-hierarchy'

export interface LocationOption {
  id: string
  name: string
  edId: string | null
}

function toLocationOptions (hierarchy: LocationHierarchyItem[]): LocationOption[] {
  const seen = new Set<string>()
  const locations: LocationOption[] = []
  for (const row of hierarchy) {
    if (row.location == null) continue
    if (seen.has(row.location.id)) continue
    seen.add(row.location.id)
    locations.push({
      id: row.location.id,
      name: row.location.name,
      edId: row.executiveDirector?.id ?? null
    })
  }
  return locations.sort((a, b) => a.name.localeCompare(b.name))
}

export function useLocationOptions (enabled: boolean) {
  const [options, setOptions] = useState<LocationOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setOptions([])
      return
    }
    let cancelled = false
    setLoading(true)
    getLocationHierarchy()
      .then((hierarchy) => {
        if (cancelled) return
        setOptions(toLocationOptions(hierarchy))
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
