import { useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FilterModal from './components/filter-modal'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Paper from '@mui/material/Paper'
import SidebarToolRow from './components/sidebar-tool-row'
import useGoBack from '@shared/hooks/useGoBack'
import LoadingQuestionPage from './loading'
import { useNavigate, useParams } from 'react-router-dom'
import { getTools } from '../../shared/services/api/endpoints/tools'
import { toast } from 'sonner'
import { getQuestions, saveGeneralComment, submitAnswers } from '../../shared/services/api/endpoints/questions'
import { TextField } from '@mui/material'
import { useDebounce } from 'use-debounce'
import SubSection from './components/sub-section'
import useFilterLocationTemplate from './hooks/useFilterLocationTemplate'
import { useDispatch, useSelector } from 'react-redux'
import { respondQuestion, storeQuestions } from '../../shared/redux/slices/questions'
import ProgressBar from './components/progress-bar'
import { getAudit } from '../../shared/services/api/endpoints/audit'
import { BANNER_STATUS } from '../../shared/utils/status'

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
  const [generalCommentsDebounced] = useDebounce(generalComments, 1000)

  const [standard, setStandard] = useState('')

  const dispatch = useDispatch()

  const storedQuestions = useSelector((state) => state.questions)

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
        if (data instanceof Error) {
          throw new Error('cannot getting audit tools')
        }
        if (data.length > 0) {
          const generalComment = data[0].generalComments || ''
          setGeneralComments(generalComment)
        }
        dispatch(storeQuestions(data))
        setQuestions(data)
      })
      .catch(() => {
        toast.error('error getting questions')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentIdTool, dispatch])

  const goToToolsPage = () => {
    goBack()
  }

  const goToCapa = () => {
    const url = `/${id}/tools/${currentIdTool}/capa`
    navigate(url)
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

  if (questions.length === 0 && !loading) {
    return (
      <div className='flex flex-col w-full justify-center items-center mt-10'>
        <span className='font-bold'>No questions to show.</span>
        <Button variant="contained" onClick={goToEditTools} disabled={isApproved}>Add tools</Button>
      </div>
    )
  }

  if (loading) {
    return (
      <LoadingQuestionPage />
    )
  }

  const questionsBySubSection = groupAndSortQuestions(questions)

  const handleSubmitAnswers = async () => {
    const unAnsweredQuestions = storedQuestions.filter((question) => !question.answered)
    if (unAnsweredQuestions.length > 0) {
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

  const completedQuestions = storedQuestions.filter((question) => question.answered).length
  const totalQuestions = storedQuestions.length

  return (
    <div className='w-full mx-auto overflow-hidden'>
      <header className='mb-2 flex flex-col'>
        <div className='flex items-center gap-x-3'>
          <IconButton onClick={handleOpenSidebar}>
            <MenuIcon />
          </IconButton>
          {currentTool != null && (
            <div className='flex justify-between w-full items-center'>
              <h2 className='font-semibold text-xl text-primary flex'>{currentTool.templateName}</h2>
              <div>
                <TextField
                  size='small'
                  variant='outlined'
                  required
                  fullWidth
                  id="standard"
                  placeholder={`${currentTool.templateId}.1`}
                  value={standard}
                  onChange={handleChangeStandard}
                />
              </div>
            </div>
          )}
        </div>
      </header>
      <div className='flex w-full justify-between gap-x-5'>
        {openSidebar &&
          <div className='flex min-w-80 max-w-80 overflow-y-auto bg-blue-300'>
            <Paper className='w-full p-3 h-full'>
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
              </ul>
              <div className='my-5'>
                <Divider />
              </div>
              {/* <article className='flex gap-x-1 w-full items-center hover:text-primary text-md hover:font-bold cursor-pointer' onClick={goToCapa}>
                <span className='text-lg'>CAPA</span>
                <div className='text-sm'>
                  <OpenInNewIcon fontSize='small' />
                </div>
              </article> */}
            </Paper>
          </div>
        }
        <div className='flex items-center w-full justify-between flex-col relative'>
          <section className='flex flex-col w-full gap-y-5'>
            {currentTool != null &&
              <header className='w-full shadow px-4 flex flex-col gap-y-5 py-3'>
                <div className=''>
                  <ProgressBar completed={completedQuestions} total={totalQuestions} refs={questionRefs} />
                </div>
                <div className='flex w-full justify-between gap-x-5'>
                  <TextField
                    variant='standard'
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
                </div>
              </header>
            }
            <div className={`w-full flex flex-col gap-y-5 overflow-y-auto 
              ${openSidebar ? 'h-screen' : 'xl:h-[calc(100vh-330px)] md:h-[calc(100vh-350px)]'}
               mb-2`}>
              {
                questionsBySubSection.map((subSection, index) => (
                  <>
                    <div ref={(el) => (subSectionsRefs.current[subSection[0]] = el)}></div>
                    <SubSection
                      key={index}
                      subSection={subSection[0]}
                      questions={subSection[1]}
                      currentTool={currentTool}
                      handleSetSubSectionAnswers={handleSetSubSectionAnswers}
                      refs={questionRefs}
                      isApproved={isApproved} />
                  </>
                ))
              }
            </div>
            <footer className={`flex items-center justify-between w-full ${openSidebar ? 'pb-10' : 'pb-5'}`}>
              <Button variant="text" onClick={goToToolsPage}>Cancel</Button>
              <Button variant="contained" type='button' onClick={handleSubmitAnswers} disabled={isApproved}>Submit</Button>
            </footer>
          </section>
        </div>
      </div>
    </div>
  )
}
