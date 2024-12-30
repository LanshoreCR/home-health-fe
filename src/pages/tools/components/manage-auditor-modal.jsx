import { Button, Card, FormControl, IconButton, InputLabel, MenuItem, Modal, Select } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'
import { getAssignedTeamMembers, reassignAuditor } from '../../../shared/services/api/endpoints/manage-team'
import { toast } from 'sonner'

export default function ManageAuditorModal({ open, onClose, initAuditor, packageTemplateId, refreshTools, auditTeamId }) {
  const [availableAuditors, setAvailableAuditors] = useState([])
  const [currentAuditor, setCurrentAuditor] = useState(initAuditor.name)
  const [isLoading, setIsLoading] = useState(false)

  const handleChangeAuditor = (event) => {
    const newCurrentAuditor = event.target.value
    setCurrentAuditor(newCurrentAuditor)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    if (currentAuditor === initAuditor.name) {
      setIsLoading(false)
      onClose()
      return
    }

    const auditorId = availableAuditors.find((auditor) => auditor.name === currentAuditor).employeeId
    const response = await reassignAuditor({
      auditorId,
      packageTemplateId
    })

    if (response instanceof Error) {
      toast.error('error while reassigning auditor')
      return
    }
    toast.success('auditor reassigned successfully')
    setIsLoading(false)
    onClose()
    refreshTools()
  }

  useEffect(() => {
    if (!open) return
    getAssignedTeamMembers({ auditTeamId })
      .then((res) => {
        if (res instanceof Error) {
          throw new Error('error getting team auditors')
        }
        setAvailableAuditors(res)
      })
      .catch((err) => {
        toast.error(err)
      })
  }, [open, auditTeamId])

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-2xl p-6 pb-10 min-h-80'>
        <div className='flex w-full flex-col gap-y-6'>
          <header className='flex items-center justify-between'>
            <h5 className='font-bold text-md'>Manage Auditor</h5>
            <IconButton onClick={onClose}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </header>
          <section className='flex flex-col gap-y-8 w-full'>
            <FormControl size='small'>
              <InputLabel id="auditor-label">Auditor</InputLabel>
              <Select
                disabled={isLoading}
                labelId="auditor-label"
                id="auditor"
                label="Auditor"
                defaultValue={''}
                value={currentAuditor}
                onChange={handleChangeAuditor}
              >
                {
                  availableAuditors.map((auditor) => (
                    <MenuItem value={auditor.name} key={auditor.employeeId}>{auditor.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <Button variant='contained' color='primary' onClick={handleSubmit} disabled={isLoading}>Save</Button>
          </section>
        </div>
      </Card>
    </Modal>
  )
}
