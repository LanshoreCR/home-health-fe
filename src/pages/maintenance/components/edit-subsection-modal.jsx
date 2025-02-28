import { useState } from 'react'
import { Button, Card, FormControl, FormHelperText, IconButton, Modal, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateSubsection } from '../../../shared/services/api/endpoints/maintenance'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import EditIcon from '@mui/icons-material/Edit'

const schema = yup.object().shape({
  name: yup.string().required('New Subsection name is required')
})

export default function EditSubsectionModal({ templateId, oldName, reRenderTools }) {
  const [open, setOpen] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const user = useSelector((state) => state.user)
  const userId = user.employeeId

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async (data) => {
    const { name } = data
    setIsDisabled(true)
    const response = await updateSubsection({ templateId, userId, oldName, newName: name })
    if (response instanceof Error) {
      toast.error(response.message)
      return
    }
    toast.success('Subsection updated successfully')
    setIsDisabled(false)
    setOpen(false)
    reRenderTools()
  }

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <EditIcon fontSize='small' />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-2xl p-6 pb-10 min-h-60'>
          <form className='flex w-full flex-col gap-y-6' onSubmit={handleSubmit(onSubmit)}>
            <header className='flex items-center justify-center w-full'>
              <h5 className='font-bold text-md'>Edit Subsection</h5>
            </header>
            <section className='flex flex-col gap-y-8'>
              <FormControl className='w-full' size='small' error={!!errors.name}>
                <TextField
                  size='small'
                  id="subsection-name"
                  variant="outlined"
                  placeholder='Subsection Name'
                  aria-readonly={true}
                  {...register('name')}
                />
                {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
              </FormControl>
            </section>
            <footer className='flex items-center justify-center'>
              <Button variant="contained" type='submit' disabled={isDisabled}>Save Changes</Button>
            </footer>
          </form>
        </Card>
      </Modal>
    </div>
  )
}
