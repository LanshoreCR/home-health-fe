import { useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FilterModal from './components/filter-modal'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import Paper from '@mui/material/Paper'
import SidebarToolRow from './components/sidebar-tool-row'
import useGoBack from '@shared/hooks/useGoBack'
import LoadingQuestionPage from './loading'
import { useNavigate, useParams } from 'react-router-dom'
import { getTools } from '../../shared/services/api/endpoints/tools'
import { toast } from 'sonner'
import { getQuestions, saveCustomerNameOrAuditDate, saveGeneralComment, submitAnswers } from '../../shared/services/api/endpoints/questions'
import { Grid2, TextField, Typography } from '@mui/material'
import { useDebounce } from 'use-debounce'
import SubSection from './components/sub-section'
import useFilterLocationTemplate from './hooks/useFilterLocationTemplate'
import { useDispatch, useSelector } from 'react-redux'
import { respondQuestion, storeQuestions } from '../../shared/redux/slices/questions'
import { getAudit } from '../../shared/services/api/endpoints/audit'
import { BANNER_STATUS } from '../../shared/utils/status'
import { DatePicker } from '@mui/x-date-pickers'

function groupAndSortQuestions(questions) {
  const groupedBySubSection = {}

  questions.forEach(item => {
    const key = item.subSection
    if (!groupedBySubSection[key]) {
      groupedBySubSection[key] = []
    }
    groupedBySubSection[key].push(item)
  })

  return Object.entries(groupedBySubSection)
}

function getCurrentToolSubsections(questions) {
  const currentToolSubsections = []

  questions.forEach(question => {
    if (!currentToolSubsections.includes(question.subSection)) {
      currentToolSubsections.push(question.subSection)
    }
  })

  return currentToolSubsections
}

export default function QuestionsPage() {
  const navigate = useNavigate()
  const { id, idTool } = useParams()
  const goBack = useGoBack()

  const user = useSelector((state) => state.user)

  const [currentAudit, setCurrentAudit] = useState(null)
  const [currentIdTool, setCurrentIdTool] = useState(parseInt(idTool))
  const [tools, setTools] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [openSidebar, setOpenSidebar] = useState(true)

  const isApproved = currentAudit?.packageStatus === BANNER_STATUS.COMPLETED

  const currentTool = tools.find((tool) => tool.packageTemplateId === currentIdTool) ?? null

  const [generalComments, setGeneralComments] = useState('')
  const [toolForm, setToolForm] = useState({
    customerName: '',
    auditDate: null
  })
  const [generalCommentsDebounced] = useDebounce(generalComments, 1000)
  const [toolFormDebounced] = useDebounce(toolForm, 1000);

  const [standard, setStandard] = useState('')

  const dispatch = useDispatch()

  const storedQuestions = useSelector((state) => state.questions)
  const completedQuestions = storedQuestions.filter((question) => question.answered)
  const incompletedQuestions = storedQuestions.filter((question) => !question.answered)
  const missingComments = storedQuestions.filter(question => !question.comments)
  const flaggedQuestions = storedQuestions.filter(question => question.flag === 1)
  const totalQuestions = storedQuestions.length

  const [lastCompletedIndex, setLastCompletedIndex] = useState(-1);
  const [lastIncompletedIndex, setLastIncompletedIndex] = useState(-1)
  const [lastMissingIndex, setLastMissingIndex] = useState(-1)
  const [lastFlaggedIndex, setLastFlaggedIndex] = useState(-1)


  const currentToolSubsections = getCurrentToolSubsections(questions)

  const subSectionsRefs = useRef([])

  const questionRefs = useRef([])

  const {
    open,
    locationOptions,
    toolTemplateOptions,
    currentLocation,
    currentToolTemplate,
    handleOpen,
    handleClose,
    handleOnChangeLocation,
    handleOnChangeToolTemplate
  } = useFilterLocationTemplate({ id })

  useEffect(() => {
    setLoading(true)
    getAudit({ id })
      .then((data) => {
        if (data == null) {
          throw new Error('cannot getting audit')
        }
        setCurrentAudit(data)
      })
      .catch(() => {
        toast.error('error getting audit')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    setLoading(true)
    getTools({ packageId: id })
      .then((data) => {
        if (data instanceof Error) {
          throw new Error('cannot getting audit tools')
        }
        setTools(data)
      })
      .catch(() => {
        toast.error('error getting audit tools')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    setLoading(true)
    getQuestions({ packageTemplateId: currentIdTool })
      .then((data) => {
        const sortedQuestions = data.sort((a, b) => a.standard - b.standard)
        if (data instanceof Error) {
          throw new Error('cannot getting audit tools')
        }
        if (data.length > 0) {
          const generalComment = data[0].generalComments || ''
          setGeneralComments(generalComment)
        }
        setQuestions(sortedQuestions)

        dispatch(storeQuestions(sortedQuestions))
      })
      .catch(() => {
        toast.error('error getting questions')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentIdTool, dispatch])

  useEffect(() => {
    if (currentTool) {
      setToolForm({
        auditDate: currentTool.auditDate ? new Date(currentTool.auditDate) : null,
        customerName: currentTool.customerName
      })
    }
  }, [currentTool])


  const goToToolsPage = () => {
    goBack()
  }

  const goToEditTools = () => {
    const url = `/${id}/tools/${currentIdTool}`
    navigate(url)
  }

  const handleOpenSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const handleChangeTool = (packageTemplateId) => {
    setCurrentIdTool(packageTemplateId)
  }

  const handleChangeGeneralComments = (event) => {
    const newGeneralComment = event.target.value
    setGeneralComments(newGeneralComment)
  }

  const handleChangeStandard = (event) => {
    const newStandard = event.target.value
    setStandard(newStandard)
    const ref = questionRefs.current[newStandard]
    ref.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMoveToCompleteQuestion = (index) => {
    const question = completedQuestions[index] ?? completedQuestions[0]

    const ref = questionRefs.current[question.standard]
    setStandard(question.standard)
    ref.scrollIntoView({ behavior: 'smooth' })

  }

  const handleMoveToIncompleteQuestion = (index) => {
    const question = incompletedQuestions[index] ?? incompletedQuestions[0]
    const ref = questionRefs.current[question.standard]
    setStandard(question.standard)
    ref.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMoveToMissingQuestion = (index) => {
    const question = missingComments[index] ?? missingComments[0]
    const ref = questionRefs.current[question.standard]
    setStandard(question.standard)
    ref.scrollIntoView({ behavior: 'smooth' })
  }

  const handleMoveToFlaggedQuestion = (index) => {
    const question = flaggedQuestions[index] ?? flaggedQuestions[0]
    const ref = questionRefs.current[question.standard]
    setStandard(question.standard)
    ref.scrollIntoView({ behavior: 'smooth' })
  }


  useEffect(() => {
    const handleSaveGeneralComments = async () => {
      try {
        const response = await saveGeneralComment({ generalComment: generalCommentsDebounced, packageId: currentIdTool })
        if (response instanceof Error) {
          throw new Error('error while saving comment')
        }
      } catch (error) {
        toast.error('error saving comment. Please try it again')
      }
    }
    handleSaveGeneralComments()
  }, [generalCommentsDebounced, currentIdTool])

  useEffect(() => {
    const handleSaveCustomerNameOrAuditDate = async () => {
      try {
        const response = await saveCustomerNameOrAuditDate({
          customerName: toolFormDebounced.customerName,
          auditDate: toolFormDebounced.auditDate ? toolFormDebounced.auditDate.toISOString().slice(0, 19) : null,
          packageId: currentIdTool
        })
        if (response instanceof Error) {
          throw new Error('error while saving comment')
        }
      } catch (error) {
        toast.error('error saving customer name or audit date. Please try it again')

      }

    }
    handleSaveCustomerNameOrAuditDate()
  }, [toolFormDebounced])


  const filteredTools = tools.filter((tool) => {
    if (currentLocation !== '' && currentToolTemplate !== '') {
      return tool.auditPlaceLocation === currentLocation && tool.templateId === currentToolTemplate
    }
    if (currentLocation !== '') {
      return tool.auditPlaceLocation === currentLocation
    }
    if (currentToolTemplate !== '') {
      return tool.templateId === currentToolTemplate
    }
    return true
  })



  const questionsBySubSection = groupAndSortQuestions(questions)
  const handleSubmitAnswers = async () => {
    const unAnsweredQuestions = storedQuestions.filter((question) => !question.answered)
    if (unAnsweredQuestions.length > 0 && currentTool?.templateName !== 'Key Indicators') {
      toast.error('Please answer all questions before submitting')
      return
    }

    const body = {
      packageTemplateId: currentIdTool,
      createdBy: user.employeeId
    }
    try {
      const response = await submitAnswers(body)
      if (response instanceof Error) {
        throw new Error('error while submitting answers')
      }
      toast.success('Answers submitted successfully')
      setTimeout(() => {
        navigate(`/${id}/tools`)
      }, 1500)
    } catch (error) {
      toast.error('error while submitting answers. Please try it again')
    }
  }

  const handleSetSubSectionAnswers = async (subSection, newAnswer) => {
    const newQuestions = questions.map((question) => {
      if (question.subSection === subSection) {
        question.answers = newAnswer
        dispatch(respondQuestion({ templateQuestionId: question.templateQuestionId, answer: newAnswer, comments: question.comments }))
      }
      return question
    })
    dispatch(storeQuestions(newQuestions))
  }

  if (storedQuestions.length === 0 && questions.length === 0 && !loading) {
    return null
  }


  if (loading) {
    return (
      <LoadingQuestionPage />
    )
  }


  return (
    <Grid2
      container
      width={'100%'}
      direction={'column'}
      height={'100%'}
      sx={{ overflowX: 'hidden' }} >
      <Grid2 container width={'100%'} alignItems={'center'} mb={2}>
        <IconButton onClick={handleOpenSidebar}>
          <MenuIcon />
        </IconButton>
        {currentTool != null && (
          <Grid2 container justifyContent={'space-between'} flexGrow={1} alignItems={'center'} >
            <h2 className='font-semibold text-xl text-primary flex'>{currentTool.templateName}</h2>
            <TextField
              size='small'
              variant='outlined'
              required
              id="standard"
              placeholder={`${currentTool.templateId}.1`}
              value={standard}
              onChange={handleChangeStandard}
            />
          </Grid2>
        )}
      </Grid2>
      <Grid2
        container
        direction="row"
        flex={1}
        minHeight={0}
        width="100%"
        gap={2}
      >
        {openSidebar &&
          <div className='flex min-w-80 max-w-80 overflow-y-auto '>
            <Paper
              className="w-full p-3"
              sx={{
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
              }}
              elevation={0}
            >
              <header className='flex items-center justify-between mb-3'>
                <h3 className='font-semibold text-lg'>Tools</h3>
                <FilterModal
                  open={open}
                  handleClose={handleClose}
                  handleOpen={handleOpen}
                  currentLocation={currentLocation}
                  currentToolTemplate={currentToolTemplate}
                  handleOnChangeLocation={handleOnChangeLocation}
                  handleOnChangeToolTemplate={handleOnChangeToolTemplate}
                  locationOptions={locationOptions}
                  toolTemplateOptions={toolTemplateOptions} />
              </header>
              <ul className='flex flex-col gap-y-2 overflow-auto'>
                {filteredTools.map((tool) => (
                  <div key={tool.packageTemplateId}>
                    <SidebarToolRow
                      item={tool}
                      isActive={tool.packageTemplateId === currentIdTool}
                      onChange={() => handleChangeTool(tool.packageTemplateId)}
                      subSections={currentToolSubsections}
                      refs={subSectionsRefs} />

                  </div>
                ))}
                {
                  currentTool?.templateName !== 'Key Indicators' && (
                    <Grid2 container spacing={1} direction={'column'} flexGrow={1} borderRadius={2} bgcolor={'#f5f4f2'} padding={2} paddingRight={0}>
                      <Grid2 container justifyContent={'space-between'} alignItems={'center'} flexGrow={1} paddingRight={5}>
                        <Typography>All questions</Typography>
                        <Typography fontWeight={'bold'} color='blue'>{totalQuestions}</Typography>
                      </Grid2>
                      <Divider flexItem />
                      <Grid2 container flexDirection={'row'} alignItems={'center'} flexGrow={1} >
                        <Typography flexGrow={1}>Complete questions</Typography>
                        <Grid2 container alignItems={'center'} spacing={completedQuestions.length === 0 ? 0.5 : 0} flexGrow={1} justifyContent={'flex-end'} ml={'auto'}>
                          <IconButton onClick={() => {
                            let index = lastCompletedIndex - 1
                            if (lastCompletedIndex <= 0)
                              index = completedQuestions.length - 1
                            setLastCompletedIndex(index)
                            handleMoveToCompleteQuestion(index)
                          }} disabled={completedQuestions.length === 0}>
                            <ArrowLeftIcon />
                          </IconButton>
                          <Typography color='green' fontWeight={'bold'}>{completedQuestions.length}</Typography>
                          <IconButton onClick={() => {
                            let index = 0
                            if (lastCompletedIndex < completedQuestions.length) {
                              index = lastCompletedIndex + 1
                            }
                            setLastCompletedIndex(index)
                            handleMoveToCompleteQuestion(index)
                          }} disabled={completedQuestions.length === 0}>
                            <ArrowRightIcon />
                          </IconButton>
                        </Grid2>
                      </Grid2>
                      <Grid2 container flexDirection={'row'} alignItems={'center'} flexGrow={1} >
                        <Typography>Incomplete questions</Typography>
                        <Grid2 container alignItems={'center'} spacing={incompletedQuestions.length === 0 ? 0.5 : 0} flexGrow={1} justifyContent={'flex-end'} ml={'auto'}>
                          <IconButton onClick={() => {
                            let index = lastIncompletedIndex - 1
                            if (lastIncompletedIndex <= 0)
                              index = incompletedQuestions.length - 1
                            setLastIncompletedIndex(index)
                            handleMoveToIncompleteQuestion(index)
                          }} disabled={incompletedQuestions.length === 0}>
                            <ArrowLeftIcon />
                          </IconButton>
                          <Typography color='red' fontWeight={'bold'}>{incompletedQuestions.length}</Typography>
                          <IconButton onClick={() => {
                            let index = 0
                            if (lastIncompletedIndex < incompletedQuestions.length) {
                              index = lastIncompletedIndex + 1
                            }
                            setLastIncompletedIndex(index)
                            handleMoveToIncompleteQuestion(index)
                          }} disabled={incompletedQuestions.length === 0}>
                            <ArrowRightIcon />
                          </IconButton>
                        </Grid2>
                      </Grid2>
                      <Grid2 container flexDirection={'row'} alignItems={'center'} flexGrow={1} >
                        <Typography>Missing comments</Typography>
                        <Grid2 container alignItems={'center'} spacing={missingComments.length === 0 ? 0.5 : 0} flexGrow={1} justifyContent={'flex-end'} ml={'auto'}>
                          <IconButton onClick={() => {
                            let index = lastMissingIndex - 1
                            if (lastMissingIndex <= 0)
                              index = missingComments.length - 1
                            setLastMissingIndex(index)
                            handleMoveToMissingQuestion(index)
                          }} disabled={missingComments.length === 0}>
                            <ArrowLeftIcon />
                          </IconButton>
                          <Typography color='orange' fontWeight={'bold'}>{missingComments.length}</Typography>
                          <IconButton onClick={() => {
                            let index = 0
                            if (lastMissingIndex < missingComments.length) {
                              index = lastMissingIndex + 1
                            }
                            setLastMissingIndex(index)
                            handleMoveToMissingQuestion(index)
                          }} disabled={missingComments.length === 0}>
                            <ArrowRightIcon />
                          </IconButton>
                        </Grid2>
                      </Grid2>
                      <Grid2 container flexDirection={'row'} alignItems={'center'} flexGrow={1} >
                        <Typography>Flagged questions</Typography>
                        <Grid2 container alignItems={'center'} spacing={flaggedQuestions.length === 0 ? 0.5 : 0} flexGrow={1} justifyContent={'flex-end'} ml={'auto'}>
                          <IconButton onClick={() => {
                            let index = lastFlaggedIndex - 1
                            if (lastFlaggedIndex <= 0)
                              index = flaggedQuestions.length - 1
                            setLastFlaggedIndex(index)
                            handleMoveToFlaggedQuestion(index)
                          }} disabled={flaggedQuestions.length === 0}>
                            <ArrowLeftIcon />
                          </IconButton>
                          <Typography color='gray' fontWeight={'bold'}>{flaggedQuestions.length}</Typography>
                          <IconButton onClick={() => {
                            let index = 0
                            if (lastFlaggedIndex < flaggedQuestions.length) {
                              index = lastFlaggedIndex + 1
                            }
                            setLastFlaggedIndex(index)
                            handleMoveToFlaggedQuestion(index)
                          }} disabled={flaggedQuestions.length === 0}>
                            <ArrowRightIcon />
                          </IconButton>
                        </Grid2>

                      </Grid2>
                    </Grid2>
                  )
                }
              </ul>
              <div className='my-5'>
                <Divider />
              </div>
            </Paper>
          </div>
        }

        <Grid2 container flex={1} direction="column" minHeight={0}>
          {currentTool != null && (
            <Grid2
              container
              direction="column"
              spacing={3}
              alignItems="center"
              mt={2}
              width="100%"
            >
              <Grid2 container alignItems="center" width="100%">
                <TextField
                  variant="outlined"
                  required
                  sx={{ flexGrow: 1 }}
                  id="standard"
                  label="Client Name"
                  value={toolForm.customerName}
                  onChange={({ target }) =>
                    setToolForm((prev) => ({ ...prev, customerName: target.value }))
                  }
                />
                <DatePicker
                  label="Audit Date"
                  value={toolForm.auditDate}
                  onChange={(date) => {
                    setToolForm((prev) => ({ ...prev, auditDate: date }))
                  }}
                />
              </Grid2>

              <TextField
                variant="standard"
                required
                fullWidth
                multiline
                maxRows={3}
                id="outlined-multiline-static"
                placeholder="General Comments"
                value={generalComments}
                onChange={handleChangeGeneralComments}
                disabled={isApproved}
              />
            </Grid2>
          )}

          <Grid2
            container
            sx={{
              height: 'calc(100vh - 300px)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {
              ...[

                ...questionsBySubSection.map((subSection, index) => (
                  <div key={index}>
                    <div ref={(el) => (subSectionsRefs.current[subSection[0]] = el)}></div>
                    <SubSection
                      key={index}
                      subSection={subSection[0]}
                      questions={subSection[1]}
                      currentTool={currentTool}
                      handleSetSubSectionAnswers={handleSetSubSectionAnswers}
                      refs={questionRefs}
                      isApproved={isApproved} />
                  </div>
                )),
                <Grid2
                  key="footer-buttons"
                  container
                  justifyContent="space-between"
                  p={1}
                  mt={2}
                  sx={{ width: '100%' }}
                >
                  <Button variant="text" onClick={goToToolsPage}>Cancel</Button>
                  <Button variant="contained" type='button' onClick={handleSubmitAnswers} disabled={isApproved}>Submit</Button>
                </Grid2>,
              ]
            }


          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2 >
  )
}
