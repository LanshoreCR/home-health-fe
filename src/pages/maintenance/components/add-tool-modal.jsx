import { useState } from 'react'
import { Button, Card, FormControl, FormHelperText, Modal, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { addTool } from '../../../shared/services/api/endpoints/maintenance'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

const schema = yup.object().shape({
  name: yup.string().required('Tool Name is required')
})

export default function AddToolModal({ reRender, selectedState }) {
  const { templateTypeId, state } = selectedState
  const [open, setOpen] = useState(false)

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
    const response = await addTool({
      name, userId, templateTypeId, state
    })
    if (response instanceof Error) {
      toast.error(response.message)
      return
    }
    toast.success('New Tool created successfully')
    setOpen(false)
    reRender()
  }

  return (
    <div>
      <Button variant="contained" type='button' onClick={handleOpen}>Add Tool</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-2xl p-6 pb-10 min-h-60'>
          <form className='flex w-full flex-col gap-y-6' onSubmit={handleSubmit(onSubmit)}>
            <header className='flex items-center justify-center w-full'>
              <h5 className='font-bold text-md'>New Tool</h5>
            </header>
            <section className='flex flex-col gap-y-8'>
              <FormControl className='w-full' size='small' error={!!errors.name}>
                <TextField
                  size='small'
                  id="tool-name"
                  variant="outlined"
                  placeholder='Tool Name'
                  aria-readonly={true}
                  {...register('name')}
                />
                {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
              </FormControl>
            </section>
            <footer className='flex items-center justify-center'>
              <Button variant="contained" type='submit'>Create</Button>
            </footer>
          </form>
        </Card>
      </Modal>
    </div>
  )
}
