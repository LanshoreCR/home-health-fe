import { useEffect, useState } from 'react'
import { Button, FormControl, Grid2, IconButton, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { deleteTool, getMaintenanceBusinessLines, getMaintenanceTools, getTemplateQuestions, publishToolTemplate, updateAllQuestions } from '../../shared/services/api/endpoints/maintenance'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import AddToolModal from './components/add-tool-modal'
import MaintenanceHeader from './components/header'
import MaintenancePageSkeleton from './components/skeleton/page'
import MaintenanceQuestionCard from './components/question-card'
import MenuIcon from '@mui/icons-material/Menu'
import SidebarMaintenanceRow from './components/sidebar-maintenance-row'
import PublishModal from './components/publish-modal'

const groupByTool = (tools) => {
  const groupedByTemplateId = {}

  tools.forEach(tool => {
    const key = tool.templateId
    if (!groupedByTemplateId[key]) {
      groupedByTemplateId[key] = {
        templateId: tool.templateId,
        name: tool.templateDesc,
        releaseDate: tool.releaseDate,
        subsections: []
      }
    }
    groupedByTemplateId[key].subsections.push(tool)
  })
  return Object.values(groupedByTemplateId)
}

const getSections = (tools) => {
  const sections = []
  for (const tool of tools) {
    const category = tool.category
    if (!sections.includes(category)) {
      sections.push(category)
    }
  }
  return sections
}

export default function MaintenancePage() {
  const [openSidebar, setOpenSidebar] = useState(true)
  const [businessLines, setBusinessLines] = useState([])
  const [states, setStates] = useState([]);
  const [selectedBusinessLine, setSelectedBusinessLine] = useState('')
  const [selectedState, setSelectedState] = useState({ state: '' })
  const [maintenanceTools, setMaintenanceTools] = useState([])
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [currentTemplateId, setCurrentTemplateId] = useState()
  const [questions, setQuestions] = useState([])
  const [sections, setSections] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const user = useSelector((state) => state.user)
  const userId = user.employeeId

  const handleChangeTool = (newTemplateId) => {
    const newCurrentTool = maintenanceTools.find((tool) => tool.templateId === newTemplateId)
    if (newCurrentTool) {
      setCurrentTemplateId(newCurrentTool.templateId)
    }
  }

  const handleOpenSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  const handleDragEnd = async (result) => {
    const { destination, source } = result
    if (!destination) {
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const mutableQuestions = Array.from(questions)
    const [removed] = mutableQuestions.splice(source.index, 1)
    mutableQuestions.splice(destination.index, 0, removed)

    const updatedQuestions = mutableQuestions.map((question, index) => {
      return {
        ...question,
        questionSort: index + 1
      }
    })

    const response = await updateAllQuestions({ questions: updatedQuestions, userId })
    if (response instanceof Error) {
      toast.error('Error while updating maintenance question')
      return
    }
    toast.success('Maintenance question updated successfully')
    reRenderQuestions()
  }

  const handlePublish = async (releaseDate) => {
    const response = await publishToolTemplate({ releaseDate, templateId: currentTemplateId })
    if (response instanceof Error) {
      toast.error('Error while publishing tool template')
      return
    }
    toast.success('Tool template published successfully')
    reRenderTools()
  }

  const handleRemoveTool = async (templateId) => {
    const response = await deleteTool({ name: currentTemplate.name, templateId, userId })
    if (response instanceof Error) {
      toast.error('Error while deleting tool')
      return
    }
    toast.success('Tool deleted successfully')
    reRenderTools()
  }

  const reRenderQuestions = async () => {
    if (currentTemplateId == null) return
    const response = await getTemplateQuestions({ templateId: parseInt(currentTemplateId) })
    if (response instanceof Error) {
      toast.error(response.message)
      return
    }
    const sections = getSections(response)
    setSections(sections)
    setQuestions(response)
  }

  const reRenderTools = async () => {
    const response = await getMaintenanceTools(selectedState?.templateTypeId, selectedState?.state ?? '')
    if (response instanceof Error) {
      toast.error(response.message)
      return
    }
    const groupedByTools = groupByTool(response)
    setMaintenanceTools(groupedByTools)
    setCurrentTemplate(groupedByTools[0])
    setCurrentTemplateId(groupedByTools[0].templateId)

    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getMaintenanceBusinessLines()
      .then((data) => {
        if (data instanceof Error) {
          throw data
        }
        const respBusinessLines = [...new Set(data.map(item => item.businessLine))]
        const firstBL = respBusinessLines[0]
        setBusinessLines(respBusinessLines)
        setSelectedBusinessLine(firstBL)
        setStates(data)

        const firstState = data.find(item => item.businessLine === firstBL)
        setSelectedState({ ...firstState, state: firstState.state ? firstState.state : '' })
      })
      .catch((error) => {
        toast.error('error getting maintenance bussiness lines')
      })
  }, [])


  useEffect(() => {
    setIsLoading(true)
    if (selectedBusinessLine !== '' && selectedState.templateTypeId)
      getMaintenanceTools(selectedState?.templateTypeId, selectedState?.state ?? '')
        .then((data) => {
          if (data instanceof Error) {
            throw data
          }
          const groupedByTools = groupByTool(data)
          setMaintenanceTools(groupedByTools)
          setCurrentTemplate(groupedByTools[0])
          setCurrentTemplateId(groupedByTools[0].templateId)
        })
        .catch(() => {
          toast.error('error getting maintenance tools')
        })
        .finally(() => {
          setIsLoading(false)
        })
  }, [selectedBusinessLine, selectedState])

  useEffect(() => {
    if (currentTemplateId == null) return
    setIsLoading(true)
    getTemplateQuestions({ templateId: parseInt(currentTemplateId) })
      .then((data) => {
        if (data instanceof Error) {
          throw data
        }
        setQuestions(data)
        const newSections = getSections(data)
        setSections(newSections)
      })
      .catch(() => {
        toast.error('error getting template questions')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [currentTemplateId])

  useEffect(() => {
    const currentTool = maintenanceTools.find((tool) => tool.templateId === currentTemplateId)
    if (currentTool == null) return
    setCurrentTemplate(currentTool)
  }, [currentTemplateId, maintenanceTools])

  if (isLoading) {
    return (
      <MaintenancePageSkeleton />
    )
  }

  return (
    <div className='w-full mx-auto overflow-hidden'>
      <header className='flex w-full justify-between items-center mb-2'>
        <div className='flex items-center gap-x-3'>
          <IconButton onClick={handleOpenSidebar}>
            <MenuIcon />
          </IconButton>
          <h2 className='font-semibold text-xl text-primary'>Maintenance</h2>
        </div>
        <AddToolModal reRender={reRenderTools} selectedState={selectedState} />
      </header>
      <div className='flex w-full justify-between gap-x-5 flex-col sm:flex-row'>
        {openSidebar &&
          <div className='flex min-w-80 max-w-80 overflow-y-auto'>
            <Paper className='w-full p-3 h-full'>
              <header className='flex items-center w-full justify-between mb-3 '>
                <h3 className='font-semibold text-lg'>Tools</h3>
                <Grid2 container flexGrow={1} justifyContent={'flex-end'} spacing={2}>
                  <FormControl sx={{ flexGrow: 1, ml: 2 }}>
                    <InputLabel id="business-line-label">Business Line</InputLabel>
                    <Select
                      size='small'
                      label="Business line"
                      labelId='business-line-label'
                      value={selectedBusinessLine}
                      onChange={({ target }) => {
                        setSelectedBusinessLine(target.value)
                        if (target.value === '08012') {
                          setSelectedState({ state: '' })
                        } else {
                          const newState = states.find(state => state.businessLine === target.value)
                          setSelectedState(newState)
                        }
                      }}
                    >
                      {
                        businessLines.map(bl => (
                          <MenuItem value={bl} key={bl}>
                            {
                              bl
                            }
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                  {
                    selectedBusinessLine !== '08012' && (
                      <FormControl>
                        <InputLabel id="state-label">State</InputLabel>
                        <Select
                          label="State"
                          size='small'
                          labelId='state-label'
                          value={selectedState.state}
                          onChange={({ target }) => {
                            const newState = states.find(state => state.state === target.value && state.businessLine === selectedBusinessLine)
                            setSelectedState(newState)
                          }}
                        >
                          {
                            states.filter(state => state.businessLine === selectedBusinessLine).map(state => (
                              <MenuItem value={state.state} key={state.state}>
                                {
                                  state.state
                                }
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    )
                  }

                </Grid2>
              </header>
              <ul className='flex flex-col gap-y-2 overflow-auto'>
                {maintenanceTools.map((tool) => (
                  <SidebarMaintenanceRow
                    key={tool.templateId}
                    item={tool}
                    isActive={tool.templateId === currentTemplateId}
                    sections={sections}
                    onChange={() => handleChangeTool(tool.templateId)}
                    handleRemoveTool={() => handleRemoveTool(tool.templateId)}
                    reRenderTools={reRenderTools} />
                ))}
              </ul>
            </Paper>
          </div>
        }
        <div className='flex items-center w-full justify-between flex-col relative'>
          <section className='flex flex-col w-full gap-y-5'>
            {currentTemplate != null &&
              <MaintenanceHeader
                templateName={currentTemplate.name}
                templateId={currentTemplateId}
                sections={sections}
                questions={questions}
                releaseDate={currentTemplate.releaseDate}
                reRenderTools={reRenderTools}
                reRenderQuestions={reRenderQuestions}
              />
            }
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className={`w-full flex flex-col gap-y-5 overflow-y-auto no-scrollbar
              ${openSidebar ? 'xl:h-[calc(100vh-380px)] md:h-[calc(100vh-350px)]' : 'xl:h-[calc(100vh-380px)] md:h-[calc(100vh-350px)]'}
              mb-2`}>
                <Droppable droppableId="maintenance-questions">
                  {(provided) => (
                    <ul
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {questions.map((tool, index) => (
                        <Draggable key={tool.questionId} draggableId={String(tool.questionId)} index={index}>
                          {(provided) => (
                            <MaintenanceQuestionCard
                              key={tool.questionId}
                              provided={provided}
                              tool={tool}
                              sections={sections}
                              reRenderQuestions={reRenderQuestions} />
                          )}
                        </Draggable>
                      ))}
                    </ul>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
            <footer className={`flex items-center justify-between w-full ${openSidebar ? 'pb-10' : 'pb-5'}`}>
              <Button variant="text">Cancel</Button>
              <PublishModal handlePublish={handlePublish} />
            </footer>
          </section>
        </div>
      </div>
    </div>
  )
}
