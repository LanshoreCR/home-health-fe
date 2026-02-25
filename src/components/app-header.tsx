import { ClipboardCheck, Plus, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface AppHeaderProps {
  auditCount: number
  filters: {
    search: string
    location: string
    quarter: string
    status: string
    auditor: string
  }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function AppHeader ({
  auditCount,
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters
}: AppHeaderProps) {
  return (
    <header className='border-b border-border bg-card'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6'>
        {/* Top row: brand + new audit */}
        <div className='flex items-center justify-between h-14'>
          <div className='flex items-center gap-2.5'>
            <div className='flex items-center justify-center size-7 rounded-md bg-primary'>
              <ClipboardCheck className='size-3.5 text-primary-foreground' />
            </div>
            <span className='font-semibold text-sm text-card-foreground tracking-tight'>
              Home Health
            </span>
          </div>
          <Button size='sm' className='h-8 text-xs'>
            <Plus className='size-3.5 mr-1.5' />
            New Audit
          </Button>
        </div>

        {/* Filter row */}
        <div className='flex flex-wrap items-center gap-2.5 pb-3'>
          <div className='relative flex-1 min-w-[180px] max-w-[240px]'>
            <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground' />
            <Input
              placeholder='Search...'
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className='pl-8 h-8 text-xs bg-background'
            />
          </div>

          <Select
            value={filters.location}
            onValueChange={(v) => onFilterChange('location', v)}
          >
            <SelectTrigger className='w-[140px] h-8 text-xs bg-background'>
              <SelectValue placeholder='Location' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Locations</SelectItem>
              <SelectItem value='wa-south'>WA South King County</SelectItem>
              <SelectItem value='ca-north'>CA North Region</SelectItem>
              <SelectItem value='tx-central'>TX Central</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.quarter}
            onValueChange={(v) => onFilterChange('quarter', v)}
          >
            <SelectTrigger className='w-[110px] h-8 text-xs bg-background'>
              <SelectValue placeholder='Quarter' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Quarters</SelectItem>
              <SelectItem value='q1-2026'>Q1 2026</SelectItem>
              <SelectItem value='q4-2025'>Q4 2025</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(v) => onFilterChange('status', v)}
          >
            <SelectTrigger className='w-[120px] h-8 text-xs bg-background'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              <SelectItem value='pending'>Pending</SelectItem>
              <SelectItem value='in-progress'>In Progress</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
              <SelectItem value='rejected'>Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.auditor}
            onValueChange={(v) => onFilterChange('auditor', v)}
          >
            <SelectTrigger className='w-[140px] h-8 text-xs bg-background'>
              <SelectValue placeholder='Auditor' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Auditors</SelectItem>
              <SelectItem value='rojas'>Rojas Guzman, Jose R</SelectItem>
              <SelectItem value='chen'>Chen, Michelle L</SelectItem>
              <SelectItem value='williams'>Williams, Sarah K</SelectItem>
              <SelectItem value='martinez'>Martinez, Carlos D</SelectItem>
              <SelectItem value='nguyen'>Nguyen, Thi P</SelectItem>
            </SelectContent>
          </Select>

          <div className='flex items-center gap-2 ml-auto'>
            {hasActiveFilters && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onClearFilters}
                className='h-8 text-xs text-muted-foreground hover:text-card-foreground px-2'
              >
                <X className='size-3 mr-1' />
                Clear
              </Button>
            )}
            <span className='text-xs text-muted-foreground tabular-nums whitespace-nowrap'>
              {auditCount} {auditCount === 1 ? 'audit' : 'audits'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
