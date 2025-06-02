import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormHelperText from '@mui/material/FormHelperText'
import { saveAnswer } from '../../../shared/services/api/endpoints/questions'
import { toast } from 'sonner'
import { useDebounce } from 'use-debounce'
import { useDispatch } from 'react-redux'
import { respondQuestion } from '../../../shared/redux/slices/questions'
import { Checkbox, Grid2, IconButton, Slider } from '@mui/material'
import FlagIcon from '@mui/icons-material/Flag'

const AVAILABLE_OPTIONS = [
  {
    id: '1',
    label: 'Yes'
  },
  {
    id: '0',
    label: 'No'
  },
  {
    id: '2',
    label: 'N/A'
  }
]

export default function QuestionCard({ question, sectionId, employeeId, initAnswer, initPercentage, isApproved, currentTool }) {
  const { questionText, templateAnswerId, templateQuestionId, comments, flag } = question

  const dispatch = useDispatch()

  const [answer, setAnswer] = useState(initAnswer)
  const [percentage, setPercentage] = useState(initPercentage);
  const [checkedNA, setCheckedNA] = useState(initAnswer === 2)
  const [comment, setComment] = useState(comments || '')
  const [commentError, setCommentError] = useState(false)
  const [commentDebounced] = useDebounce(comment, 500)
  const [flagged, setFlagged] = useState(flag === 1)

  const isKeyIndicator = currentTool?.templateName === 'Key Indicators'
  const questionName = `${questionText}`

  const handleChangePercentage = async (event) => {
    const newValue = event.target.value
    setPercentage(newValue)
    try {
      const response = await saveAnswer({
        answer, comment,
        questionId: templateAnswerId,
        packageId: sectionId,
        customerName: employeeId,
        percentage: newValue
      })

      if (response instanceof Error) {
        throw new Error('error while saving answer')
      }
      dispatch(respondQuestion({ templateQuestionId, answer, comments, percentage: newValue }))

    } catch (error) {
      toast.error('error saving answer. Please try it again')
    }

  }


  const handleChangeQuestionAnswer = async (event) => {
    let newValue = event.target.value
    const { checked } = event.target
    if (isKeyIndicator) {
      setCheckedNA(checked)
      if (checked) {
        newValue = '2'
        setPercentage(0)
      } else {
        newValue = null
      }
    }

    if (newValue === '1' || newValue === '2') {
      setCommentError(false)
    } else {
      setCommentError(true)
    }

    if (newValue === '0' && comment === '') {
      try {
        const response = await saveAnswer({
          answer: null,
          comment: '',
          questionId: templateAnswerId,
          packageId: sectionId,
          customerName: employeeId
        })
        if (response instanceof Error) {
          throw new Error('error while saving answer')
        }
        setAnswer(newValue)
        dispatch(respondQuestion({ templateQuestionId, answer: newValue, comments: '', answered: false }))

      } catch (error) {
        toast.error('error saving answer. Please try it again')
      }
      return
    }

    try {
      const percentageValue = !isKeyIndicator ? null : (checked ? 0 : percentage)
      const response = await saveAnswer({
        answer: newValue,
        comment,
        questionId: templateAnswerId,
        packageId: sectionId,
        customerName: employeeId,
        percentage: percentageValue
      })
      if (response instanceof Error) {
        throw new Error('error while saving answer')
      }
      setAnswer(newValue)
      dispatch(respondQuestion({ templateQuestionId, answer: newValue, comments }))
    } catch (error) {
      toast.error('error saving answer. Please try it again')
    }
  }

  const handleCommentChange = async (event) => {
    const newComment = event.target.value
    setComment(newComment)

    if ((answer === '0') && newComment.trim() === '') {
      setCommentError(true)
    } else {
      setCommentError(false)
    }
  }

  const handleChangeFlag = async () => {
    const newFlagState = !flagged
    const flagNumber = newFlagState ? 1 : 0
    try {
      const response = await saveAnswer(
        { answer, comment, questionId: templateAnswerId, packageId: sectionId, customerName: employeeId, flag: flagNumber }
      )
      if (response instanceof Error) {
        throw new Error('error while saving answer')
      }
      setFlagged(newFlagState)
      dispatch(respondQuestion({ templateQuestionId, answer, answered: answer ? true : false, comments, percentage, flag: flagNumber }))
    } catch (error) {
      toast.error('error saving answer. Please try it again')
    }
  }

  useEffect(() => {
    const saveCommentAnswer = async () => {
      try {
        const response = await saveAnswer({ answer, comment: commentDebounced, questionId: templateAnswerId, packageId: sectionId, customerName: employeeId })
        if (response instanceof Error) {
          throw new Error('error while saving comment')
        }
        dispatch(respondQuestion({ templateQuestionId, answer, comments: commentDebounced }))
      } catch (error) {
        toast.error('error saving comment. Please try it again')
      }
    }
    saveCommentAnswer()
  }, [commentDebounced])

  useEffect(() => {
    setAnswer(initAnswer)
  }, [initAnswer])

  useEffect(() => {
    if (answer === 0 && comment === '') {
      setCommentError(true)
      dispatch(respondQuestion({ templateQuestionId, answer, comments: '', answered: false }))
    } else {
      setCommentError(false)
    }
  }, [answer, comment, dispatch, templateQuestionId])

  return (
    <Card className="flex flex-col w-full p-5">
      <FormControl>
        <div className='flex flex-row justify-between items-center'>
          <FormLabel id="demo-radio-buttons-group-label">{questionName}</FormLabel>
          <div className='flex flex-row justify-end'>
            <IconButton aria-label="flag" color={flagged ? 'warning' : 'default'} onClick={handleChangeFlag} disabled={isApproved}>
              <FlagIcon />
            </IconButton>
          </div>
        </div>
        {
          isKeyIndicator && (
            <Grid2 container spacing={2} alignItems='center' direction='row' sx={{ marginTop: 5 }}>
              <Slider
                aria-label="Always visible"
                defaultValue={0}
                value={percentage}
                valueLabelDisplay="on"
                sx={{ width: 300, marginLeft: 3 }}
                valueLabelFormat={(value) => {
                  return `${value}%`
                }}
                onChange={handleChangePercentage}
                disabled={checkedNA}
              />
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="N/A"
                checked={checkedNA}
                onChange={handleChangeQuestionAnswer}
              />
            </Grid2>
          )
        }
        {
          !isKeyIndicator && (
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="1"
              name="radio-buttons-group"
              value={answer}
              onChange={handleChangeQuestionAnswer}
              disabled={isApproved}

            >
              {
                AVAILABLE_OPTIONS.map((option) => (
                  <FormControlLabel value={option.id} key={option.id} control={<Radio />} label={option.label} disabled={isApproved} />
                ))
              }
            </RadioGroup>
          )
        }
      </FormControl>
      <div className='mt-2 w-full'>
        <FormControl error={commentError} fullWidth>
          <TextField
            required={answer === '0'}
            fullWidth
            id="outlined-multiline-static"
            multiline
            rows={1}
            placeholder="Comment"
            value={comment}
            onChange={handleCommentChange}
            disabled={isApproved}
          />
          {commentError && (
            <FormHelperText>Comment is required when the answer is No</FormHelperText>
          )}
        </FormControl>
      </div>
    </Card>
  )
}
