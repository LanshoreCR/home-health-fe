import { useState } from 'react'
import {
  Autocomplete, Button, Card, Checkbox, createFilterOptions, FormControl,
  FormControlLabel,
  FormHelperText, Modal, TextField
} from '@mui/material'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { addQuestion } from '../../../shared/services/api/endpoints/maintenance'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

const schema = yup.object().shape({
  name: yup.string().required('Question name is required'),
  category: yup.string().required('Category is required'),
})

const filter = createFilterOptions()

export default function AddQuestionModal({ sections, questions, reRenderQuestions, templateId }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const user = useSelector(state => state.user)
  const userId = user.employeeId

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category: '',
      isKeyIndicator: false
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
    const questionSort = questions.length + 1
    const question = {
      ...data,
      questionSort,
      templateId
    }
    const response = await addQuestion({ question, userId })
    if (response instanceof Error) {
      toast.error(response.message)
      return
    }
    toast.success('Question created successfully')
    reset()
    setIsLoading(false)
    handleClose()
    reRenderQuestions()
  }

  return (
    <div>
      <Button variant="outlined" type='button' onClick={handleOpen}>Add Question</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white shadow-2xl p-6 pb-10 min-h-60'>
          <form className='flex w-full flex-col gap-y-6' onSubmit={handleSubmit(onSubmit)}>
            <header className='flex items-center justify-center w-full'>
              <h5 className='font-bold text-md'>New Question</h5>
            </header>
            <section className='flex flex-col gap-y-3'>
              <FormControl className='w-full' size='small' error={!!errors.name}>
                <TextField
                  error={!!errors.name}
                  label="Question Name"
                  size='small'
                  id="question-name"
                  variant="outlined"
                  placeholder='Write a question'
                  aria-readonly={true}
                  {...register('name')}
                />
                {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
              </FormControl>
              <FormControl error={!!errors.category}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      fullWidth
                      size='small'
                      value={value}
                      onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                          onChange(newValue)
                        } else if (newValue && newValue.inputValue) {
                          onChange(newValue.inputValue)
                        } else {
                          onChange(newValue)
                        }
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params)
                        const { inputValue } = params

                        const isExisting = options.some((option) => inputValue === option)
                        if (inputValue !== '' && !isExisting) {
                          filtered.push({ inputValue, title: inputValue })
                        }
                        return filtered
                      }}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      options={sections}
                      getOptionLabel={(option) => {
                        if (typeof option === 'string') return option
                        return option.inputValue || option.title
                      }}
                      renderOption={(props, option) => (
                        <li {...props} key={typeof option === 'string' ? option : option.title}>
                          {typeof option === 'string' ? option : option.title}
                        </li>
                      )}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          label="Category"
                          size="small"
                          fullWidth
                          {...params}
                          error={!!errors.category}
                          helperText={errors.category ? errors.category.message : ''}
                        />
                      )}
                    />
                  )}
                />
              </FormControl>
              <FormControlLabel
                label="Key Indicator"
                control={<Checkbox />}
                id="isKeyIndicator"
                {...register('isKeyIndicator')}
              />
            </section>
            <footer className='flex items-center justify-center'>
              <Button variant="contained" type='submit' disabled={isLoading}>Create</Button>
            </footer>
          </form>
        </Card>
      </Modal>
    </div>
  )
}
