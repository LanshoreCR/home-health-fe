import { Button, Card, LinearProgress, Modal, Paper } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'

export default function ProgressBar({ completed, total, refs }) {
  const currentValue = completed / total * 100
  const leftValue = total - completed

  const storedQuestions = useSelector((state) => state.questions)
  const missingQuestions = storedQuestions.filter((question) => !question.answered)

  const [modalIsOpen, setModalIsOpen] = useState(false)

  const handleChangeModal = () => {
    setModalIsOpen(!modalIsOpen)
  }

  const handleViewMissingQuestion = (questionId) => {
    const ref = refs.current[questionId]
    ref.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div className='flex justify-between w-full flex-col'>
      <span className='text-sm font-semibold text-primary mb-1'>{completed} questions completed</span>
      <div className='w-full flex justify-between items-center gap-x-5'>
        <div className='w-full h-1 bg-primary flex flex-col'>
          <LinearProgress variant="determinate" value={currentValue} />
        </div>
        {leftValue > 0 && (
          <span className='text-xs font-semibold text-primary w-12 text-right cursor-pointer' onClick={handleChangeModal}>{leftValue} left</span>
        )}
      </div>
      <Modal
        open={modalIsOpen}
        onClose={handleChangeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:max-w-xl max-w-lg w-full
        p-6 pb-10 max-h-[calc(100vh-330px)] md:max-h-[calc(100vh-200px)] overflow-y-auto'>
          <h3 className='text-center font-bold mb-4'>Missing Questions</h3>
          <ul className='flex flex-col gap-y-4'>
            {missingQuestions.map((question) => (
              <Card key={crypto.randomUUID()} className='flex justify-between items-center gap-x-3 p-2'>
                <span>{question.questionText}</span>
                <Button variant="outlined" size='small' onClick={() => handleViewMissingQuestion(question.templateQuestionId)}>View</Button>
              </Card>
            ))}
          </ul>
        </Paper>
      </Modal>
    </div>
  )
}
