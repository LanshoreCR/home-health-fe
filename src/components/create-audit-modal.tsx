import { useState, useEffect, useMemo } from 'react'
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
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useLocationOptions } from '@/hooks/useLocationOptions'
import { createAudit } from '@shared/services/api/endpoints/audit-packages'

interface CreateAuditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAuditCreated?: () => void
}

function toISOStartOfDay (dateStr: string): string {
  if (!dateStr) return ''
  return `${dateStr}T00:00:00.000Z`
}

function todayISO (): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addMonthsISO (dateStr: string, months: number): string {
  if (dateStr === '') return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setMonth(date.getMonth() + months)
  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0')
  const nextDay = String(date.getDate()).padStart(2, '0')
  return `${nextYear}-${nextMonth}-${nextDay}`
}

export function CreateAuditModal ({ open, onOpenChange, onAuditCreated }: CreateAuditModalProps) {
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { options, loading: loadingLocations } = useLocationOptions(open)

  const auditableLocations = useMemo(
    () => options.filter((location) => location.edId !== null),
    [options]
  )

  const dateError = startDate !== '' && endDate !== '' && endDate < startDate ? 'End date must be on or after start date' : ''

  const isFormComplete =
    selectedLocationId !== '' &&
    startDate !== '' &&
    endDate !== '' &&
    dateError === ''

  const resetForm = () => {
    setSelectedLocationId('')
    setStartDate('')
    setEndDate('')
  }

  useEffect(() => {
    if (!open) {
      resetForm()
      return
    }
    setStartDate(addMonthsISO(todayISO(), -1))
    setEndDate(addMonthsISO(todayISO(), 1))
  }, [open])

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleCreate = async () => {
    if (!isFormComplete) return
    const selectedLocation = auditableLocations.find((location) => location.id === selectedLocationId)
    if (selectedLocation?.edId == null) return
    setSubmitting(true)
    try {
      await createAudit({
        edId: selectedLocation.edId,
        startDate: toISOStartOfDay(startDate),
        endDate: toISOStartOfDay(endDate)
      })
      onAuditCreated?.()
      onOpenChange(false)
      resetForm()
    } catch {
      // error already toasted in the service
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create New Audit</DialogTitle>
          <DialogDescription>
            Select the location and date range for this audit
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-2'>
          <div className='grid gap-2'>
            <Label htmlFor='audit-location'>Location</Label>
            <SearchableSelect
              id='audit-location'
              options={auditableLocations}
              value={selectedLocationId}
              onChange={setSelectedLocationId}
              disabled={loadingLocations}
              placeholder={loadingLocations ? 'Loading locations...' : 'Select location...'}
              searchPlaceholder='Search locations...'
              emptyMessage='No locations found.'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='start-date'>Start Date</Label>
              <DateInput
                id='start-date'
                value={startDate}
                onChange={setStartDate}
                className='h-9 text-sm'
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='end-date'>End Date</Label>
              <DateInput
                id='end-date'
                value={endDate}
                onChange={setEndDate}
                min={startDate || undefined}
                className='h-9 text-sm'
              />
            </div>
          </div>
          {dateError !== '' && (
            <p className='text-xs text-destructive'>{dateError}</p>
          )}
        </div>

        <DialogFooter className='gap-3'>
          <Button type='button' variant='outline' onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type='button' onClick={handleCreate} disabled={!isFormComplete || submitting}>
            {submitting ? 'Creating...' : 'Create Audit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
