import { useEffect, useState } from 'react'
import { createTools, getTools } from '../../../shared/services/api/endpoints/tools'
import { DatePicker } from '@mui/x-date-pickers'
import { FormControl, InputLabel, MenuItem, Select, TextField, Grid2, Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, IconButton } from '@mui/material'
import { getLocations } from '../../../shared/services/api/endpoints/location'
import { getToolTemplates } from '../../../shared/services/api/endpoints/tool-template'
import { toast } from 'sonner'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import CreateToolSkeleton from './components/skeleton'
import { Add, Delete } from '@mui/icons-material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getTeamAuditors } from '../../../shared/services/api/endpoints/manage-team'
// const schema = yup.object().shape({
//   tools: yup.array().of(
//     yup.object().shape({
//       location: yup.string().required('Location is required'),
//       tool: yup.array().min(1, 'At least one tool is required').required('Tool is required'),
//       date: yup.date().required('Date is required')
//     })
//   )
// })

const defaultToolValue = {
  locationNumber: '',
  templateId: '',
  customerName: '',
  assignedAuditor: '',
  startOfCareDate: new Date(Date.now()),
  realIndex: 0
}

export default function CreateToolPage() {
  const { id, idTool } = useParams()
  const navigate = useNavigate()

  const [expandedAccordion, setExpandedAccordion] = useState('')
  const [locations, setLocations] = useState([])
  const [toolsByLocation, setToolsByLocation] = useState({})
  const [tools, setTools] = useState([])
  const [auditors, setAuditors] = useState([])
  const [prevAddToolForm, setPrevAddToolForm] = useState({
    locationNumber: '', tool: ''
  })
  const [groupedTools, setGroupedTools] = useState({})


  const [isLoading, setIsLoading] = useState(true)

  const currentUser = useSelector((state) => state.user)

  const { control, handleSubmit, watch, reset, setValue, formState: { errors, } } = useForm({
    // resolver: yupResolver(schema),
    defaultValues: {
      tools: [defaultToolValue]
    }
  })


  const watchFields = watch('tools')


  const getGroupedData = (toolList) => {
    const groupedData = toolList.filter(tool => tool.locationNumber !== '').reduce((acc, item) => {
      const groupKey = `${item.locationNumber}-${item.templateId}`;
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    }, {});

    return groupedData
  }

  const handleAddTool = () => {
    const index = watchFields.length - 1
    setValue(`tools.${index}.locationNumber`, prevAddToolForm.locationNumber)
    setValue(`tools.${index}.templateId`, prevAddToolForm.tool)
    setValue(`tools.${index}.realIndex`, index)


    setValue(`tools.${index + 1}`, { ...defaultToolValue, realIndex: index + 1 })

    const groupedData = getGroupedData(watchFields)

    setGroupedTools(groupedData)
  }

  const handleRemoveTool = (index) => {

    const newTools = watchFields.filter(t => t.realIndex !== index);
    setValue('tools', newTools)

    const groupedData = getGroupedData(newTools)

    setGroupedTools(groupedData)
  }



  const handleAccordionChange =
    (panel) => (event, newExpanded) => {
      setExpandedAccordion(newExpanded ? panel : false);
    };

  const onSubmit = async () => {
    const response = await createTools({
      tools: watchFields.filter(tool => tool.locationNumber !== ''),
      packageId: id,
      userId: currentUser.employeeId
    })
    if (response instanceof Error) {
      toast.error('Error while creating new audit')
      return
    }
    toast.success('Audit created successfully!')
    reset()
    setTimeout(() => {
      navigate(`/${id}/tools`)
    }, 1000)
  }


  useEffect(() => {
    getTeamAuditors()
      .then((res) => {
        if (res instanceof Error) {
          throw new Error('error getting team auditors')
        }
        setAuditors(res)
      })
      .catch((err) => {
        toast.error(err)
      })
  }, [])



  useEffect(() => {
    setIsLoading(true)
    getLocations({ packageId: id })
      .then((data) => {
        if (data instanceof Error) {
          throw new Error('Error getting locations by audit id')
        }
        setLocations(data)
        setIsLoading(false)
      })
      .catch(() => {
        toast.error('Error getting locations by audit id')
      })
  }, [id])

  useEffect(() => {
    setIsLoading(true)
    getTools({ packageId: id })
      .then((data) => {
        if (data instanceof Error) {
          throw new Error('Error getting tools by audit id')
        }
        setTools(data)
        setIsLoading(false)
      })
      .catch(() => {
        toast.error('Error getting tools by audit id')
      })
  }, [id])

  useEffect(() => {
    setIsLoading(true)
    if (locations.length === 0) return
    const fetchToolTemplates = async () => {
      const updatedToolsByLocation = {}
      for (const location of locations) {
        const data = await getToolTemplates({ locationId: location.id })
        if (data instanceof Error) {
          toast.error('Error getting tool template by location id')
        } else {
          updatedToolsByLocation[location.id] = data
        }
      }
      setToolsByLocation(updatedToolsByLocation)
      setIsLoading(false)
    }
    fetchToolTemplates()
  }, [locations])



  if (isLoading) {
    return <CreateToolSkeleton />
  }

  return (
    <div className='w-full max-w-4xl mx-auto '>
      {idTool === 'new'
        ? <h2 className='font-bold text-3xl text-blue-500 mb-10 text-center'>Create Tools</h2>
        : <h2 className='font-bold text-3xl text-blue-500 mb-10 text-center'>Edit Tools</h2>
      }
      <Grid2 >

        <form className='flex flex-col w-full mb-10 mt-5' onSubmit={handleAddTool}>
          <Grid2 container spacing={2} flexDirection={'row'} p={2} alignItems='center'>
            <FormControl sx={{ minWidth: 350 }} >
              <InputLabel id={`location-label`}>Location</InputLabel>
              <Select
                labelId={`location-label`}
                label="Location"
                onChange={({ target }) => {
                  setPrevAddToolForm(prev => ({ ...prev, locationNumber: target.value }))
                }}
                value={prevAddToolForm.locationNumber}
              >
                {locations.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 350 }} >
              <InputLabel id={`tool-label`}>Tool</InputLabel>
              <Select
                labelId={`tool-label`}
                label="Tool"
                onChange={({ target }) => {
                  setPrevAddToolForm(prev => ({ ...prev, tool: target.value }))
                }}
                value={prevAddToolForm.tool}
              >
                {toolsByLocation[prevAddToolForm.locationNumber]?.map((option) => (
                  <MenuItem key={option.templateId} value={option.templateId}>{option.templateDesc}</MenuItem>
                ))}
              </Select>
            </FormControl>


            <Box >
              <Button variant="outlined" onClick={handleAddTool} type='button' startIcon={<Add />}>Add tool</Button>
            </Box>

          </Grid2>

        </form>
      </Grid2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container direction={'column'} paddingX={2} width={'100%'} sx={{
          overflowY: 'auto',
        }}>
          {
            Object.entries(groupedTools).map(([key, group]) => {
              const [locationNumber, templateId] = key.split("-");
              const location = locations.find(l => l.id === locationNumber)
              const tool = toolsByLocation[locationNumber].find(t => t.templateId.toString() === templateId)
              return (
                <Accordion key={key} onChange={handleAccordionChange(key)} expanded={key === expandedAccordion}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                    <Typography component="span" sx={{ width: '33%', flexShrink: 0 }}>
                      {location.name}
                    </Typography>
                    <Typography component="span" sx={{ color: 'text.secondary' }}>
                      {tool.templateDesc}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {
                        group.map((field, index) => (
                          <Grid2 container key={field.realIndex} direction={'row'} mt={1} justifyContent={'space-between'}>
                            <FormControl >
                              <TextField label='Client name' value={field.customerName} onChange={({ target }) => {
                                setValue(`tools.${field.realIndex}.customerName`, target.value)

                              }} />
                            </FormControl>
                            <FormControl  >
                              <InputLabel id={`auditor-label`}>Auditor</InputLabel>
                              <Select
                                labelId={`auditor-label`}
                                label="Auditor"
                                onChange={({ target }) => {
                                  setValue(`tools.${field.realIndex}.assignedAuditor`, target.value)

                                }}
                                value={field.assignedAuditor}
                                sx={{ minWidth: 200 }}
                              >
                                {auditors.map((option) => (
                                  <MenuItem key={option.employeeId} value={option.employeeId}>{option.name}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormControl>
                              <DatePicker
                                label="Start of Care Date"
                                renderInput={(props) => <TextField {...props} />}
                                value={field.startOfCareDate}
                                onChange={(date) => setValue(`tools.${field.realIndex}.startOfCareDate`, date)}
                              />
                            </FormControl>
                            <IconButton
                              color='primary'
                              onClick={() => {
                                handleRemoveTool(field.realIndex)
                              }} >
                              <Delete />
                            </IconButton>
                          </Grid2>
                        ))
                      }
                    </List>
                  </AccordionDetails>
                </Accordion>
              )
            })
          }
          <Grid2 container mt={5} mb={5} justifyContent={'flex-end'} spacing={2}>
            <Button variant='contained' color='inherit' onClick={() => navigate(-1)}>Cancel</Button>
            <Button variant='contained' disabled={watchFields[0].locationNumber === ''} type='submit'>Create</Button>
          </Grid2>
        </Grid2>
      </form>

    </div>
  )
}
