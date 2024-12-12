import { useEffect, useState } from 'react'
import {
  Button, Card, Checkbox, FormControl, IconButton, InputLabel,
  ListItemText, MenuItem, Modal, OutlinedInput, Select
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { getAssignedTeamMembers, getTeamAuditors, manageTeamAuditors, reassignTeamLead } from '../../../shared/services/api/endpoints/manage-team'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

export default function ManageTeamModal({ auditTeamLead, auditTeamId, isOpen, onClose, refreshAudits }) {
  const [teamLead, setTeamLead] = useState(auditTeamLead.name)
  const [availableAuditors, setAvailableAuditors] = useState([])
  const [selectedAuditors, setSelectedAuditors] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const user = useSelector((state) => state.user)
  const userId = user.employeeId

  const handleChangeSelectedAuditors = (event) => {
    const value = event.target.value
    setSelectedAuditors(
      value
    )
  }

  const handleChangeTeamLead = (event) => {
    const value = event.target.value
    setTeamLead(value)
  }

  const onSubmit = async () => {
    setIsLoading(true)
    if (teamLead !== auditTeamLead.name) {
      const selectedTeamLead = availableAuditors.find((auditor) => auditor.name === teamLead)
      const response = await reassignTeamLead({
        auditTeamId,
        userId,
        auditorId: selectedTeamLead.employeeId
      })
      if (response instanceof Error) {
        toast.error('error while reassigning team lead')
        return
      }
      toast.success('team lead reassigned successfully')
    }

    // update auditors
    const auditorsToSave = availableAuditors.filter((auditor) => selectedAuditors.includes(auditor.name))
    const response = await manageTeamAuditors({
      auditTeamId,
      auditors: auditorsToSave,
      userId
    })
    if (response instanceof Error) {
      toast.error('error while updating auditors')
      return
    }
    toast.success('auditors updated successfully')
    setIsLoading(false)
    refreshAudits()
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    getTeamAuditors()
      .then((res) => {
        if (res instanceof Error) {
          throw new Error('error getting team auditors')
        }
        setAvailableAuditors(res)
      })
      .catch((err) => {
        toast.error(err)
      })
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    getAssignedTeamMembers({ auditTeamId })
      .then((res) => {
        if (res instanceof Error) {
          throw new Error('error getting assigned team members')
        }
        const selectedMembers = res.map((member) => member.name)
        setSelectedAuditors(selectedMembers)
      })
      .catch((err) => {
        toast.error(err)
      })
  }, [auditTeamId, isOpen])

  const handleCloseModal = () => {
    setSelectedAuditors([])
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-2xl p-6 pb-10 min-h-80'>
        <div className='flex w-full flex-col gap-y-6'>
          <header className='flex items-center justify-between'>
            <h5 className='font-bold text-md'>Manage Team</h5>
            <IconButton onClick={onClose}>
              <CloseIcon fontSize='small' />
            </IconButton>
          </header>
          <section className='flex flex-col gap-y-8 w-full'>
            <FormControl size='small'>
              <InputLabel id="team-lead-label">Team Lead</InputLabel>
              <Select
                disabled={isLoading}
                labelId="team-lead-label"
                id="team-lead"
                label="Team Lead"
                defaultValue={''}
                value={teamLead}
                onChange={handleChangeTeamLead}
              >
                {
                  availableAuditors.map((auditor) => (
                    <MenuItem value={auditor.name} key={auditor.employeeId}>{auditor.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <FormControl size='small'>
              <InputLabel id="auditors-label">Auditors</InputLabel>
              <Select
                disabled={isLoading}
                labelId="auditors-label"
                id="auditors"
                multiple
                label="Auditors"
                value={selectedAuditors}
                onChange={handleChangeSelectedAuditors}
                input={<OutlinedInput label="Auditors" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {availableAuditors.map((auditor) => (
                  <MenuItem key={auditor.employeeId} value={auditor.name}>
                    <Checkbox checked={selectedAuditors.includes(auditor.name)} />
                    <ListItemText primary={auditor.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant='contained' color='primary' onClick={onSubmit} disabled={isLoading}>Save</Button>
          </section>
        </div>
      </Card>
    </Modal>
  )
}
