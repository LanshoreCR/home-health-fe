import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, FormControl, FormHelperText, Modal, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

const today = new Date()

const schema = yup.object().shape({
  date: yup.date().required('Date is required')
})

export default function PublishModal({ handlePublish }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date(Date.now())
    }
  })

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    await handlePublish(data.date)
    setIsLoading(false)
    handleClose()
  }

  return (
    <div>
      <Button variant="contained" type='button' onClick={handleOpen}>Publish</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="publish-title"
        aria-describedby="publish-description"
      >
        <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-2xl p-6 pb-10 min-h-60'>
          <form className='flex w-full flex-col gap-y-6' onSubmit={handleSubmit(onSubmit)}>
            <header className='flex items-center justify-center w-full'>
              <h5 className='font-bold text-md'>Publish Tool Template</h5>
            </header>
            <section className='flex flex-col gap-y-8'>
              <FormControl className='w-full' size='small' error={!!errors.date}>
                <Controller
                  control={control}
                  name={'date'}
                  render={({ field }) => (
                    <DatePicker
                      label="Date"
                      minDate={today}
                      defaultValue={today}
                      renderInput={(props) => <TextField {...props} />}
                      {...field}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
                {errors.date && <FormHelperText>{errors.date.message}</FormHelperText>}
              </FormControl>
            </section>
            <footer className='flex items-center justify-center'>
              <Button variant="contained" type='submit' disabled={isLoading}>Publish</Button>
            </footer>
          </form>
        </Card>
      </Modal>
    </div>
  )
}
