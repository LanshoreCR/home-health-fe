import { useState, useMemo, useEffect } from 'react'
import { AppHeader } from '@/components/app-header'
import { AuditCard, AuditCardSkeletonList } from '@/components/audit-card'
import { getAudits } from '@shared/services/api/endpoints/audit-packages'
import { PACKAGE_STATUS_MAP } from '@shared/utils/status-config'
import type { Audit } from '@shared/types'

const defaultFilters = {
  search: '',
  status: 'all'
}

export default function AuditsPage (): JSX.Element {
  const [audits, setAudits] = useState<Audit[]>([])
  const [filters, setFilters] = useState(defaultFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAudits = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAudits()
      setAudits(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audits')
    } finally {
      setLoading(false)
    }
  }

  /** Refetch list without full-page loading (e.g. after approve/reject). */
  const refreshAudits = async (): Promise<void> => {
    try {
      const data = await getAudits()
      setAudits(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audits')
    }
  }

  useEffect(() => {
    fetchAudits().catch(() => {})
  }, [])

  const hasActiveFilters = filters.search !== '' || filters.status !== 'all'

  const filteredAudits = useMemo(() => {
    return audits.filter((audit) => {
      if (
        filters.search !== '' &&
        !audit.packageName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !audit.edNumber.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }
      if (filters.status !== 'all') {
        const statusLabel = PACKAGE_STATUS_MAP[audit.packageStatus]?.label
          ?.toLowerCase()
          .replace(/\s+/g, '-')
        if (statusLabel !== filters.status) return false
      }
      return true
    })
  }, [audits, filters])

  const handleFilterChange = (key: string, value: string): void => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = (): void => {
    setFilters(defaultFilters)
  }

  return (
    <div className='min-h-screen bg-background'>
      <AppHeader
        auditCount={filteredAudits.length}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        onAuditCreated={() => {
          fetchAudits().catch(() => {})
        }}
      />
      <main className='mx-auto max-w-5xl px-4 sm:px-6 py-6'>
        <div className='flex flex-col gap-3'>
          {loading && <AuditCardSkeletonList />}

          {!loading && error !== null && (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
              <p className='text-sm text-destructive'>
                {error}
              </p>
              <button
                onClick={() => {
                  fetchAudits().catch(() => {})
                }}
                className='mt-3 text-sm text-primary hover:underline'
              >
                Try again
              </button>
            </div>
          )}

          {!loading && error === null && filteredAudits.map((audit) => (
            <AuditCard
              key={audit.packageID}
              {...audit}
              onStatusUpdated={refreshAudits}
            />
          ))}

          {!loading && error === null && filteredAudits.length === 0 && (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
              <p className='text-sm text-muted-foreground'>
                No audits match your filters.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className='mt-2 text-sm text-primary hover:underline'
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
