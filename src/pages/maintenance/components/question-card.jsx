import { useEffect, useState } from 'react'
import { Card, FormControl, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import { activateQuestion, deleteQuestion, updateMaintenanceQuestion } from '../../../shared/services/api/endpoints/maintenance'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'

const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
}

export default function MaintenanceQuestionCard({ tool, provided, sections, reRenderQuestions }) {
  const { questionSort, questionStatus, questionId } = tool
  const [questionText, setQuestionText] = useState(tool.questionText)
  const [section, setSection] = useState(tool.category)
  const [isActive, setIsActive] = useState(questionStatus === STATUS.ACTIVE)

  const [debouncedQuestionText] = useDebounce(questionText, 500)

  const user = useSelector((state) => state.user)
  const userId = user.employeeId

  const handleChangeQuestionText = (event) => {
    setQuestionText(event.target.value)
  }


  const handleChangeSection = async (event) => {
    const newValue = event.target.value
    setSection(newValue)

    const updatedQuestion = {
      questionText: tool.questionText,
      questionSort: tool.questionSort,
      templateId: tool.templateId,
      category: newValue,
      questionId: tool.questionId,
      releaseDate: tool.releaseDate
    }

    const response = await updateMaintenanceQuestion({ question: updatedQuestion, userId })
    if (response instanceof Error) {
      toast.error('Error while updating maintenance question')
      return
    }
    toast.success('Maintenance question updated successfully')
    reRenderQuestions()
  }

  const handleChangeStatus = async (event) => {
    const newValue = event.target.checked
    if (newValue) { // activate question
      const response = await activateQuestion({ questionId, userId })
      if (response instanceof Error) {
        toast.error('Error while activating maintenance question')
        return
      }
      toast.success('Maintenance question activated successfully')
    } else { // desactivate question
      const response = await deleteQuestion({ questionId, userId })
      if (response instanceof Error) {
        toast.error('Error while deleting maintenance question')
        return
      }
      toast.success('Maintenance question deleted successfully')
    }
    setIsActive(newValue)
    reRenderQuestions()
  }

  useEffect(() => {
    if (debouncedQuestionText !== '' && debouncedQuestionText !== tool.questionText) {
      const handleUpdateQuestionText = async () => {
        const updatedQuestion = {
          questionText: debouncedQuestionText,
          questionSort: tool.questionSort,
          templateId: tool.templateId,
          category: tool.category,
          questionId: tool.questionId,
          releaseDate: tool.releaseDate
        }

        const response = await updateMaintenanceQuestion({ question: updatedQuestion, userId })
        if (response instanceof Error) {
          toast.error('Error while updating maintenance question')
          return
        }
        toast.success('Maintenance question updated successfully')
        reRenderQuestions()
      }
      handleUpdateQuestionText()
    }
  }, [debouncedQuestionText])

  return (
    <article className='w-full'
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}>
      <Card className="flex w-full flex-col p-4 gap-y-4">
        <section className='flex w-full justify-between gap-x-5'>
          <span>{questionSort}</span>
          <div className="w-full flex">

            <article className='flex flex-col gap-y-4 w-full'>
              <FormControl className='w-full'>
                <TextField
                  id={`question-${questionId}`}
                  variant="outlined"
                  value={questionText}
                  onChange={handleChangeQuestionText}
                  multiline={true}
                  minRows={2}
                  aria-readonly={true}
                  disabled={!isActive} />
              </FormControl>
              <section className='flex w-full gap-x-3 justify-center items-center'>

                <FormControl className='max-w-72 w-full' size='small'>
                  <InputLabel id={`subsection-select-label-${questionId}`}>Subsection</InputLabel>
                  <Select
                    value={section}
                    onChange={handleChangeSection}
                    disabled={!isActive}
                    labelId={`subsection-select-label-${questionId}`}
                    id={`subsection-select-${questionId}`}
                    label="Subsection">
                    {sections.map((section) => (
                      <MenuItem value={section} key={section}>{section}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </section>
            </article>
            <Switch checked={isActive} onChange={handleChangeStatus} />
          </div>
        </section>
      </Card>
    </article>
  )
}
