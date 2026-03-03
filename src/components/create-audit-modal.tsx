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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface CreateAuditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MOCK_EXECUTIVE_DIRECTORS = [
  { id: 'ed1', name: 'Jane Smith' },
  { id: 'ed2', name: 'John Doe' },
  { id: 'ed3', name: 'Maria Garcia' }
]

const MOCK_RD_BY_ED: Record<string, { id: string, name: string }[]> = {
  ed1: [
    { id: 'rd1', name: 'Region West' },
    { id: 'rd2', name: 'Region East' }
  ],
  ed2: [
    { id: 'rd3', name: 'Region North' },
    { id: 'rd4', name: 'Region South' }
  ],
  ed3: [
    { id: 'rd5', name: 'Region Central' }
  ]
}

const MOCK_ALL_RDS = Object.entries(MOCK_RD_BY_ED).flatMap(([edId, rds]) =>
  rds.map((rd) => ({ ...rd, edId }))
)
const RD_TO_ED: Record<string, string> = Object.fromEntries(
  MOCK_ALL_RDS.map((rd) => [rd.id, rd.edId])
)

export function CreateAuditModal ({ open, onOpenChange }: CreateAuditModalProps) {
  const [selectedEd, setSelectedEd] = useState('')
  const [selectedRd, setSelectedRd] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const executiveDirectorsForRd = selectedRd
    ? MOCK_EXECUTIVE_DIRECTORS.filter((ed) => ed.id === RD_TO_ED[selectedRd])
    : []

  const isFormComplete =
    selectedEd !== '' &&
    selectedRd !== '' &&
    startDate !== '' &&
    endDate !== ''

  const resetForm = () => {
    setSelectedEd('')
    setSelectedRd('')
    setStartDate('')
    setEndDate('')
  }

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  const handleRdChange = (value: string) => {
    setSelectedRd(value)
    setSelectedEd(RD_TO_ED[value] ?? '')
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  const handleCreate = () => {
    onOpenChange(false)
    resetForm()
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
            <Label htmlFor='region-director'>Region Director</Label>
            <Select value={selectedRd || undefined} onValueChange={handleRdChange}>
              <SelectTrigger id='region-director' className='w-full h-9 text-sm bg-background'>
                <SelectValue placeholder='Select Region Director...' />
              </SelectTrigger>
              <SelectContent>
                {MOCK_ALL_RDS.map((rd) => (
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
              disabled={!selectedRd}
            >
              <SelectTrigger id='executive-director' className='w-full h-9 text-sm bg-background'>
                <SelectValue placeholder='Select Executive Director...' />
              </SelectTrigger>
              <SelectContent>
                {executiveDirectorsForRd.map((ed) => (
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
          <Button type='button' variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button type='button' onClick={handleCreate} disabled={!isFormComplete}>
            Create Audit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
