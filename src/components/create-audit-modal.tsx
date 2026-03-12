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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { getLocationHierarchy } from '@shared/services/api/endpoints/location-hierarchy'
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

export function CreateAuditModal ({ open, onOpenChange, onAuditCreated }: CreateAuditModalProps) {
  const [selectedRd, setSelectedRd] = useState('')
  const [selectedEd, setSelectedEd] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [hierarchyAll, setHierarchyAll] = useState<Awaited<ReturnType<typeof getLocationHierarchy>>>([])
  const [hierarchyByRd, setHierarchyByRd] = useState<Awaited<ReturnType<typeof getLocationHierarchy>>>([])
  const [loadingHierarchy, setLoadingHierarchy] = useState(false)
  const [loadingEd, setLoadingEd] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const regionalDirectors = useMemo(() => {
    const seen = new Set<string>()
    return hierarchyAll
      .filter((item) => item.regionalDirector != null)
      .filter((item) => {
        const id = item.regionalDirector!.id
        if (seen.has(id)) return false
        seen.add(id)
        return true
      })
      .map((item) => ({ id: item.regionalDirector!.id, name: item.regionalDirector!.name }))
  }, [hierarchyAll])

  const executiveDirectors = useMemo(() => {
    const seen = new Set<string>()
    return hierarchyByRd
      .filter((item) => item.executiveDirector != null)
      .map((item) => ({ id: item.executiveDirector!.id, name: item.executiveDirector!.name }))
      .filter((ed) => {
        if (seen.has(ed.id)) return false
        seen.add(ed.id)
        return true
      })
  }, [hierarchyByRd])

  const isFormComplete =
    selectedRd !== '' &&
    selectedEd !== '' &&
    startDate !== '' &&
    endDate !== ''

  const resetForm = () => {
    setSelectedRd('')
    setSelectedEd('')
    setStartDate('')
    setEndDate('')
    setHierarchyByRd([])
  }

  useEffect(() => {
    if (!open) {
      resetForm()
      return
    }
    const fetchHierarchy = async () => {
      setLoadingHierarchy(true)
      try {
        const data = await getLocationHierarchy()
        setHierarchyAll(data)
      } catch {
        // error already toasted in the service
      } finally {
        setLoadingHierarchy(false)
      }
    }
    void fetchHierarchy()
  }, [open])

  useEffect(() => {
    if (!open || !selectedRd) {
      setHierarchyByRd([])
      return
    }
    setSelectedEd('')
    const fetchByRd = async () => {
      setLoadingEd(true)
      try {
        const data = await getLocationHierarchy({ rdId: selectedRd })
        setHierarchyByRd(data)
      } catch {
        // error already toasted in the service
      } finally {
        setLoadingEd(false)
      }
    }
    void fetchByRd()
  }, [open, selectedRd])

  const handleRdChange = (value: string) => {
    setSelectedRd(value)
    setSelectedEd('')
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleCreate = async () => {
    if (!isFormComplete) return
    setSubmitting(true)
    try {
      await createAudit({
        edId: selectedEd,
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
            Select audit location details
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-2'>
          <div className='grid gap-2'>
            <Label htmlFor='region-director'>Regional Director</Label>
            <Select
              value={selectedRd || undefined}
              onValueChange={handleRdChange}
              disabled={loadingHierarchy}
            >
              <SelectTrigger id='region-director' className='w-full h-9 text-sm bg-background'>
                <SelectValue placeholder={loadingHierarchy ? 'Loading...' : 'Select Regional Director...'} />
              </SelectTrigger>
              <SelectContent>
                {regionalDirectors.map((rd) => (
                  <SelectItem key={rd.id} value={rd.id}>
                    {rd.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='executive-director'>Executive Director</Label>
            <Select
              value={selectedEd || undefined}
              onValueChange={setSelectedEd}
              disabled={!selectedRd || loadingEd}
            >
              <SelectTrigger id='executive-director' className='w-full h-9 text-sm bg-background'>
                <SelectValue placeholder={loadingEd ? 'Loading...' : 'Select Executive Director...'} />
              </SelectTrigger>
              <SelectContent>
                {executiveDirectors.map((ed) => (
                  <SelectItem key={ed.id} value={ed.id}>
                    {ed.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
