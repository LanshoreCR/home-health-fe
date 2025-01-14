import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import QuestionCard from './question-card'
import { Button, FormControlLabel, FormLabel, Modal, Paper, Radio, RadioGroup } from '@mui/material'
import { useState } from 'react'
import { toast } from 'sonner'
import { saveAnswer } from '../../../shared/services/api/endpoints/questions'
import { useDispatch, useSelector } from 'react-redux'
import { respondQuestion } from '../../../shared/redux/slices/questions'

const AVAILABLE_OPTIONS = [
  {
    id: 1,
    label: 'Yes'
  },
  {
    id: 0,
    label: 'No'
  },
  {
    id: 2,
    label: 'N/A'
  }
]

export default function SubSection({ subSection, questions, sectionId, ref, refs, isApproved }) {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const storeQuestions = useSelector((state) => state.questions)

  const questionsBySubSection = storeQuestions.filter((question) => question.subSection === subSection)
  const completedCount = questionsBySubSection.filter((question) => question.answered).length
  const totalCount = questionsBySubSection.length

  const handleChangeModal = () => {
    setModalIsOpen(!modalIsOpen)
  }

  const handleChangeQuestionAnswer = async (event) => {
    const newValue = event.target.value
    setAnswer(newValue)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setLoading(true)
    const newAnswer = parseInt(answer)

    const questionsBySubSection = questions.filter((question) => question.subSection === subSection)

    const responses = await Promise.all(questionsBySubSection.map(async (question) => {
      if (newAnswer !== 0) {
        const response = await saveAnswer({
          answer: newAnswer,
          comment: question.comments,
          questionId: question.templateAnswerId,
          packageId: sectionId,
          customerName: '',
          flag: 0
        })
        dispatch(respondQuestion({ templateQuestionId: question.templateQuestionId, answer: newAnswer, comments: question.comments, answered: true }))
        return response
      }
      if (newAnswer === 0) {
        const response = await saveAnswer({
          answer: null,
          comment: '',
          questionId: question.templateAnswerId,
          packageId: sectionId,
          customerName: '',
          flag: 0
        })
        dispatch(respondQuestion({ templateQuestionId: question.templateQuestionId, answer: newAnswer, comments: '', answered: false }))
        return response
      }
    }))
    const failedResponses = responses.filter((response) => response instanceof Error)
    if (failedResponses.length > 0) {
      toast.error(`error while saving answers for subsection ${subSection}`)
      return
    }
    toast.success(`Successfully saved answers for subsection ${subSection}`)

    setLoading(false)
    setModalIsOpen(false)
    setAnswer('')
  }

  return (
    <article className='flex flex-col w-full gap-y-5'>
      <button onClick={handleChangeModal} disabled={isApproved}>
        <Divider ref={ref} >
          <div className='flex flex-col'>
            <Chip label={subSection} size="small" />
            <span className='text-xs text-gray-500'>{`${completedCount}/${totalCount}`}</span>
          </div>
        </Divider>
      </button>
      {
        questions.map((question) => (
          <>
            <div ref={(el) => (refs.current[question.templateQuestionId] = el)}></div>
            <div ref={(el) => (refs.current[question.standard] = el)}></div>
            <QuestionCard
              key={question.templateQuestionId}
              question={question}
              sectionId={sectionId}
              initAnswer={storeQuestions.find((q) => q.templateQuestionId === question.templateQuestionId)?.answers}
              isApproved={isApproved}
            />
          </>
        ))
      }
      <Modal
        open={modalIsOpen}
        onClose={handleChangeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:max-w-xl max-w-lg w-full p-6 pb-10'>
          <div className='flex justify-center items-center gap-y-4 w-full flex-col'>
            <h3 className='text-center font-bold'>{subSection}</h3>
            <form className='flex flex-col gap-y-2' onSubmit={handleSave}>
              <div className='flex justify-center items-center flex-col'>
                <FormLabel id="demo-radio-buttons-group-label">{'Mark all subsection\'s questions as'}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="1"
                  name="radio-buttons-group"
                  value={answer}
                  onChange={handleChangeQuestionAnswer}
                >
                  {
                    AVAILABLE_OPTIONS.map((option) => (
                      <FormControlLabel value={option.id} key={option.id} control={<Radio />} label={option.label} />
                    ))
                  }
                </RadioGroup>
              </div>
              <Button variant="contained" type='submit' disabled={loading}>Save Answers</Button>
            </form>
          </div>
        </Paper>
      </Modal>
    </article>
  )
}
