import { useState } from 'react'
import { DateRangeIcon } from '@mui/x-date-pickers'
import { format } from '@formkit/tempo'
import { IconButton, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import { toast } from 'sonner'
import { updateTool } from '../../../shared/services/api/endpoints/maintenance'
import { useSelector } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import AddQuestionModal from './add-question-modal'

const today = new Date()
const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
}

export default function MaintenanceHeader({ templateName, templateId, reRenderTools, releaseDate, sections, questions, reRenderQuestions }) {
  const [editable, setEditable] = useState(false)
  const [toolName, setToolName] = useState(templateName)
  const releaseDateValue = releaseDate || today

  const questionCount = questions.filter((question) => question.questionStatus === STATUS.ACTIVE).length

  const user = useSelector((state) => state.user)
  const userId = user.employeeId

  const handleEdit = () => {
    setEditable(true)
  }

  const handleChangeToolName = (event) => {
    setToolName(event.target.value)
  }

  const handleSave = async () => {
    const response = await updateTool({ name: toolName, templateId, userId })
    if (response instanceof Error) {
      toast.error(response.message)
      return
    }
    toast.success('Tool template updated successfully')
    setEditable(false)
    reRenderTools()
  }

  return (
    <header className='w-full shadow px-4 flex gap-y-5 py-3 justify-between items-center'>
      <section className='flex flex-col gap-y-2 w-full'>
        <div className='flex items-center gap-x-4 w-full max-w-md'>
          <TextField
            variant='outlined'
            fullWidth
            required
            id="outlined-multiline-static"
            placeholder="Tool Name"
            disabled={!editable}
            value={toolName}
            onChange={handleChangeToolName}
          />
          {editable
            ? (
              <Button variant="contained" size='small' onClick={handleSave}>Save Changes</Button>
            )
            : (
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            )
          }
        </div>
        <footer className='flex gap-x-2 w-full'>
          <div className='flex items-center'>
            <DateRangeIcon className='text-primary/90' fontSize='small' />
            <span className='text-sm'>{format(releaseDateValue, 'short')}</span>
          </div>
          <div className='flex items-center'>
            <QuestionAnswerIcon className='text-primary/90' fontSize='small' />
            <span className='text-sm'>{questionCount}</span>
          </div>
        </footer>
      </section>
      <section className='flex gap-x-4 w-full justify-end'>
        <AddQuestionModal
          sections={sections}
          questions={questions}
          templateId={templateId}
          reRenderQuestions={reRenderQuestions} />
      </section>
    </header>
  )
}
