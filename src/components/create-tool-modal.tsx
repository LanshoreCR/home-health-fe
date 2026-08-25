import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLocationOptions } from '@/hooks/useLocationOptions'
import type { ToolMetadata } from '@/shared/types'

interface CreateToolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isSubmitting?: boolean
  onSubmit?: (data: ToolMetadata) => void
}

export function CreateToolModal ({
  open,
  onOpenChange,
  isSubmitting = false,
  onSubmit
}: CreateToolModalProps) {
  const { options: locations, loading: locationsLoading } = useLocationOptions(open)
  const [locationId, setLocationId] = useState('')
  const [optionalOpen, setOptionalOpen] = useState(false)
  const [auditDate, setAuditDate] = useState('')
  const [payor, setPayor] = useState('')
  const [disciplines, setDisciplines] = useState('')
  const [patientNumber, setPatientNumber] = useState('')
  const [socDate, setSocDate] = useState('')
  const [activeOrDischarge, setActiveOrDischarge] = useState<string>('')
  const [reviewDates, setReviewDates] = useState('')
  const [servicesBilled, setServicesBilled] = useState<string>('')

  const selectedLocation = locations.find((l) => l.id === locationId)
  const isFormComplete = locationId !== ''

  const resetForm = () => {
    setLocationId('')
    setOptionalOpen(false)
    setAuditDate('')
    setPayor('')
    setDisciplines('')
    setPatientNumber('')
    setSocDate('')
    setActiveOrDischarge('')
    setReviewDates('')
    setServicesBilled('')
  }

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleCreate = () => {
    const data: ToolMetadata = {
      locationId,
      locationName: selectedLocation?.name ?? '',
      ...(auditDate && { auditDate }),
      ...(payor && { payor }),
      ...(disciplines && { disciplines }),
      ...(patientNumber && { patientNumber }),
      ...(socDate && { socDate }),
      ...(activeOrDischarge === 'active' || activeOrDischarge === 'discharge'
        ? { activeOrDischarge: activeOrDischarge as 'active' | 'discharge' }
        : {}),
      ...(reviewDates && { reviewDates }),
      ...(servicesBilled === 'yes' || servicesBilled === 'no'
        ? { servicesBilledForReviewDates: servicesBilled as 'yes' | 'no' }
        : {})
    }
    onSubmit?.(data)
    // Parent closes modal and resets on success
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[85dvh] grid-rows-[auto_auto_minmax(0,1fr)_auto]'>
        <DialogHeader>
          <DialogTitle>Create Tool</DialogTitle>
          <DialogDescription>
            Select location (required). Optionally add details below.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-2 pt-2'>
          <Label htmlFor='location'>Location</Label>
          <SearchableSelect
            id='location'
            options={locations}
            value={locationId}
            onChange={setLocationId}
            disabled={locationsLoading}
            placeholder={locationsLoading ? 'Loading locations...' : 'Select location...'}
            searchPlaceholder='Search locations...'
            emptyMessage='No locations found.'
          />
        </div>

        <div className='overflow-y-auto -mx-1 px-1'>
          <Collapsible open={optionalOpen} onOpenChange={setOptionalOpen}>
            <CollapsibleTrigger asChild>
              <button
                type='button'
                className='flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors'
              >
                <ChevronDown
                  className={cn('size-4 transition-transform', optionalOpen && 'rotate-180')}
                />
                Additional details
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border'>
                <div className='grid gap-2'>
                  <Label htmlFor='audit-date'>Audit Date</Label>
                  <DateInput
                    id='audit-date'
                    value={auditDate}
                    onChange={setAuditDate}
                    className='h-9 text-sm'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='payor'>Payor</Label>
                  <Input
                    id='payor'
                    type='text'
                    value={payor}
                    onChange={(e) => setPayor(e.target.value)}
                    placeholder='Free text'
                    className='h-9 text-sm'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='disciplines'>Disciplines</Label>
                  <Input
                    id='disciplines'
                    type='text'
                    value={disciplines}
                    onChange={(e) => setDisciplines(e.target.value)}
                    placeholder='Free text'
                    className='h-9 text-sm'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='patient-number'>Patient Number</Label>
                  <Input
                    id='patient-number'
                    type='text'
                    value={patientNumber}
                    onChange={(e) => setPatientNumber(e.target.value)}
                    placeholder='Free text'
                    className='h-9 text-sm'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='soc-date'>SOC Date</Label>
                  <DateInput
                    id='soc-date'
                    value={socDate}
                    onChange={setSocDate}
                    className='h-9 text-sm'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='active-discharge'>A=Active / D=Discharge</Label>
                  <Select value={activeOrDischarge || undefined} onValueChange={setActiveOrDischarge}>
                    <SelectTrigger id='active-discharge' className='w-full h-9 text-sm bg-background'>
                      <SelectValue placeholder='Select...' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='discharge'>Discharge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='review-dates'>Review Dates</Label>
                  <DateInput
                    id='review-dates'
                    value={reviewDates}
                    onChange={setReviewDates}
                    className='h-9 text-sm'
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='services-billed'>Services Billed for Review Dates (Y or N)</Label>
                  <Select value={servicesBilled || undefined} onValueChange={setServicesBilled}>
                    <SelectTrigger id='services-billed' className='w-full h-9 text-sm bg-background'>
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
        </div>

        <DialogFooter className='gap-3'>
          <Button type='button' variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button type='button' onClick={handleCreate} disabled={!isFormComplete || isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Tool'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
