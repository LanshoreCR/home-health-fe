import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DateInput } from '@/components/ui/date-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import type { ToolMetadata } from '@/shared/types'

interface ToolMetadataPanelProps {
  metadata: ToolMetadata
  onMetadataChange: (data: ToolMetadata) => void
}

function formatDateDisplay (value: string | undefined) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return value
  return `${m}/${d}/${y.slice(-2)}`
}

export function ToolMetadataPanel ({ metadata, onMetadataChange }: ToolMetadataPanelProps) {
  const [open, setOpen] = useState(false)

  const update = (updates: Partial<ToolMetadata>) => {
    onMetadataChange({ ...metadata, ...updates })
  }

  const summaryParts = [
    metadata.locationName && `Location: ${metadata.locationName}`,
    metadata.auditDate && `Audit Date: ${formatDateDisplay(metadata.auditDate)}`,
    metadata.payor && `Payor: ${metadata.payor}`,
    metadata.patientNumber && `Patient #: ${metadata.patientNumber}`
  ].filter(Boolean)
  const summary = summaryParts.length > 0 ? summaryParts.join(' | ') : 'Tool details (expand to edit)'

  return (
    <Collapsible open={open} onOpenChange={setOpen} className='mb-5'>
      <CollapsibleTrigger asChild>
        <button
          type='button'
          className='flex items-center w-full gap-2 py-2.5 px-3 rounded-lg border border-border bg-card text-left text-sm hover:bg-secondary/50 transition-colors'
        >
          <ChevronDown
            className={cn('size-4 text-muted-foreground transition-transform shrink-0', open && 'rotate-180')}
          />
          <span className='text-xs font-semibold text-primary uppercase'>Tool details</span>
          <span className='ml-2 truncate text-muted-foreground font-normal normal-case'>
            {summary}
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='mt-3 p-4 rounded-lg border border-border bg-card grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='grid gap-2 sm:col-span-2'>
            <Label htmlFor='md-location'>Location</Label>
            <Input
              id='md-location'
              type='text'
              value={metadata.locationName}
              onChange={(e) => update({ locationName: e.target.value })}
              className='h-9 text-sm'
              placeholder='Location name'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='md-audit-date'>Audit Date</Label>
            <DateInput
              id='md-audit-date'
              value={metadata.auditDate ?? ''}
              onChange={(v) => update({ auditDate: v || undefined })}
              className='h-9 text-sm'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='md-payor'>Payor</Label>
            <Input
              id='md-payor'
              type='text'
              value={metadata.payor ?? ''}
              onChange={(e) => update({ payor: e.target.value || undefined })}
              placeholder='Free text'
              className='h-9 text-sm'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='md-disciplines'>Disciplines</Label>
            <Input
              id='md-disciplines'
              type='text'
              value={metadata.disciplines ?? ''}
              onChange={(e) => update({ disciplines: e.target.value || undefined })}
              placeholder='Free text'
              className='h-9 text-sm'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='md-patient-number'>Patient Number</Label>
            <Input
              id='md-patient-number'
              type='text'
              value={metadata.patientNumber ?? ''}
              onChange={(e) => update({ patientNumber: e.target.value || undefined })}
              placeholder='Free text'
              className='h-9 text-sm'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='md-soc-date'>SOC Date</Label>
            <DateInput
              id='md-soc-date'
              value={metadata.socDate ?? ''}
              onChange={(v) => update({ socDate: v || undefined })}
              className='h-9 text-sm'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='md-active-discharge'>A=Active / D=Discharge</Label>
            <Select
              value={metadata.activeOrDischarge ?? ''}
              onValueChange={(v) => update({ activeOrDischarge: (v === 'active' || v === 'discharge') ? v : undefined })}
            >
              <SelectTrigger id='md-active-discharge' className='h-9 text-sm bg-background'>
                <SelectValue placeholder='Select...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='discharge'>Discharge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='md-review-dates'>Review Dates</Label>
            <DateInput
              id='md-review-dates'
              value={metadata.reviewDates ?? ''}
              onChange={(v) => update({ reviewDates: v || undefined })}
              className='h-9 text-sm'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='md-services-billed'>Services Billed for Review Dates (Y or N)</Label>
            <Select
              value={metadata.servicesBilledForReviewDates ?? ''}
              onValueChange={(v) => update({ servicesBilledForReviewDates: (v === 'yes' || v === 'no') ? v : undefined })}
            >
              <SelectTrigger id='md-services-billed' className='h-9 text-sm bg-background'>
                <SelectValue placeholder='Select...' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='yes'>Yes</SelectItem>
                <SelectItem value='no'>No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
