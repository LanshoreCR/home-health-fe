import { useState, useMemo } from 'react'
import { AppHeader } from '@/components/app-header'
import { AuditCard } from '@/components/audit-card'
import { audits, auditorMap, quarterMap, defaultFilters } from '@/mocks'

export default function AuditsPage () {
  const [filters, setFilters] = useState(defaultFilters)

  const hasActiveFilters =
    filters.search !== '' ||
    filters.location !== 'all' ||
    filters.quarter !== 'all' ||
    filters.status !== 'all' ||
    filters.auditor !== 'all'

  const filteredAudits = useMemo(() => {
    return audits.filter((audit) => {
      if (
        filters.search &&
        !audit.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !audit.location.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }
      if (filters.status !== 'all' && audit.status !== filters.status) {
        return false
      }
      if (filters.quarter !== 'all' && audit.quarter !== quarterMap[filters.quarter]) {
        return false
      }
      if (filters.auditor !== 'all' && audit.auditor !== auditorMap[filters.auditor]) {
        return false
      }
      return true
    })
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
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
      />
      <main className='mx-auto max-w-5xl px-4 sm:px-6 py-6'>
        <div className='flex flex-col gap-3'>
          {filteredAudits.map((audit) => (
            <AuditCard key={audit.id} {...audit} />
          ))}

          {filteredAudits.length === 0 && (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
              <p className='text-sm text-muted-foreground'>
                No audits match your filters.
              </p>
              <button
                onClick={handleClearFilters}
                className='mt-2 text-sm text-primary hover:underline'
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
