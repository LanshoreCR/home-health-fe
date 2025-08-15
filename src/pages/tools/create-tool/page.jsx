import { useEffect, useState } from 'react'
import { createTools } from '../../../shared/services/api/endpoints/tools'
import { DatePicker } from '@mui/x-date-pickers'
import { FormControl, InputLabel, MenuItem, Select, TextField, Grid2, Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, IconButton, Checkbox, FormHelperText } from '@mui/material'
import { getLocations } from '../../../shared/services/api/endpoints/location'
import { getToolTemplates } from '../../../shared/services/api/endpoints/tool-template'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'
import CreateToolSkeleton from './components/skeleton'
import { Add, Delete } from '@mui/icons-material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAssignedTeamMembers } from '../../../shared/services/api/endpoints/manage-team'


export default function CreateToolPage() {
  const { id, idTool, auditTeamId } = useParams()
  const navigate = useNavigate()

  const [expandedAccordion, setExpandedAccordion] = useState('')
  const [locations, setLocations] = useState([])
  const [toolsByLocation, setToolsByLocation] = useState({})
  const [auditors, setAuditors] = useState([])
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false)
  const [prevAddToolForm, setPrevAddToolForm] = useState({
    locationNumber: '', tools: []
  })
  const [groupedTools, setGroupedTools] = useState({})


  const [isLoading, setIsLoading] = useState(true)

  const currentUser = useSelector((state) => state.user)

  const { handleSubmit, watch, reset, setValue, } = useForm({
    defaultValues: {
      tools: []
    }
  })


  const watchFields = watch('tools')


  const getGroupedData = (toolList) => {
    const groupedData = toolList.reduce((acc, item) => {
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

    const { locationNumber, tools } = prevAddToolForm;

    let index = 0
    tools.forEach(tool => {
      for (let counter = 0; counter < parseInt(tool.quantity); counter++) {
        setValue(`tools.${index}.locationNumber`, locationNumber)
        setValue(`tools.${index}.templateId`, tool.id)
        setValue(`tools.${index}.realIndex`, index)
        setValue(`tools.${index}.customerName`, '')
        setValue(`tools.${index}.assignedAuditor`, '')
        setValue(`tools.${index}.startOfCareDate`, new Date(Date.now()),)

        index++;
      }
    })

    const groupedData = getGroupedData(watchFields)

    setGroupedTools(groupedData)
    setExpandedAccordion(Object.keys(groupedData)[0])
    toast.info('Please fill in all fields in the tools.')
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

  const loadToolTemplates = (id) => {
    toast.promise(
      getToolTemplates({ locationId: id }).then(data => {

        if (data instanceof Error) {
          toast.error('Error getting tool template by location id')
        } else {
          setToolsByLocation(prev => ({ ...prev, [id]: data }))
        }
      }),
      {
        loading: 'Loading Tools!',
        success: 'Tools loaded!',
        error: 'Error loading tools!'
      }
    )
  }

  const onSubmit = async () => {

    toast.promise(
      createTools({
        tools: watchFields.filter(tool => tool.locationNumber !== ''),
        packageId: id,
        userId: currentUser.employeeId
      }).then((response) => {

        reset()
        setTimeout(() => {
          navigate(`/${id}/tools`)
        }, 1000)
      }),
      {
        loading: 'Creating tools',
        success: 'Tools created successfully!',
        error: 'Error while creating new tools'
      }
    )

  }


  useEffect(() => {
    getAssignedTeamMembers({ auditTeamId })
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
    toast.promise(
      getLocations({ packageId: id })
        .then((data) => {
          if (data instanceof Error) {
            throw new Error('Error getting locations by audit id')
          }
          setLocations(data)
          if (data.length > 0)
            setPrevAddToolForm(prev => ({ ...prev, locationNumber: data[0]?.id }))

        })
        .catch(() => {
          toast.error('Error getting locations by audit id')
        })
        .finally(() => setIsLoading(false))
      ,
      {
        loading: 'Loading Locations!',
        success: 'Locations loaded!',
        error: 'Error loading locations!'
      }

    )
  }, [id])

  useEffect(() => {
    setIsLoading(true)
    if (locations.length > 0)
      loadToolTemplates(locations[0].id)
    setIsLoading(false)
  }, [locations])

  if (isLoading) {
    return <CreateToolSkeleton />
  }

  return (
    <div className='w-full max-w-5xl mx-auto '>
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
                  if (!toolsByLocation[target.value]) {
                    loadToolTemplates(target.value)
                  }
                  setPrevAddToolForm(prev => ({ ...prev, locationNumber: target.value }))
                }}
                value={prevAddToolForm.locationNumber}
              >
                {locations.map((option) => <MenuItem key={option.id} value={option.id}>{option.id} - {option.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl sx={{ width: 350 }} >
              <InputLabel id={`tool-label`}>Tool</InputLabel>
              <Select
                labelId={`tool-label`}
                label="Tool"
                multiple
                onChange={({ target }) => {
                  const form = prevAddToolForm.tools;
                  if (isSelectAllChecked) {
                    setIsSelectAllChecked(false)
                    setPrevAddToolForm(prev => ({ ...prev, tools: [] }))
                    return;
                  }
                  if (target.value.includes('all')) {

                    setIsSelectAllChecked(true)
                    setPrevAddToolForm(prev => ({
                      ...prev,
                      tools: toolsByLocation[prevAddToolForm.locationNumber]?.map(item => ({

                        id: item.templateId,
                        quantity: 1
                      }))
                    }))
                  } else {
                    setIsSelectAllChecked(false)

                    setPrevAddToolForm(prev => ({
                      ...prev,
                      tools: target.value.map((value) => {
                        const exists = form.find(item => item.id === value)
                        if (exists) return exists
                        return {
                          id: value,
                          quantity: 1
                        }
                      })
                    }))
                  }
                }}
                renderValue={(value) => {
                  return value.map((v) => toolsByLocation[prevAddToolForm.locationNumber]?.find(option => option.templateId === v).templateDesc).join(', ')
                }}
                value={prevAddToolForm.tools.map(v => v.id)}
              >
                <MenuItem key={'all'} value={'all'} sx={{ gap: 2 }}>
                  <Checkbox checked={isSelectAllChecked} />
                  Select all
                </MenuItem>
                {toolsByLocation[prevAddToolForm.locationNumber]?.map((option) => (
                  <MenuItem key={option.templateId} value={option.templateId}>
                    <Grid2 container spacing={2} alignItems={'center'} width={'100%'}>

                      <Checkbox checked={prevAddToolForm.tools.some(v => v.id === option.templateId)} disabled={true} />

                      {option.templateDesc}
                      <TextField
                        sx={{ width: 75, ml: 'auto' }}
                        type='number'
                        label='Quantity'
                        onClick={(event) => event.stopPropagation()}
                        value={prevAddToolForm.tools.find(v => v.id === option.templateId)?.quantity ?? 0}
                        onChange={(event) => {
                          event.stopPropagation()
                          const { target } = event;
                          if (target.value > 10) return
                          const form = prevAddToolForm.tools;
                          const updatedTool = {
                            id: option.templateId,
                            quantity: target.value
                          }
                          setPrevAddToolForm(prev => ({
                            ...prev,
                            tools: form.map(v => v.id === option.templateId ? updatedTool : v)
                          }))
                        }} />
                    </Grid2>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box >
              <Button variant="outlined" onClick={handleAddTool} type='button' startIcon={<Add />}>Add tool(s)</Button>
            </Box>

          </Grid2>

        </form>
      </Grid2 >
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
                <Accordion key={key} onChange={handleAccordionChange(key)} expanded={key === expandedAccordion} >
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
                          <Grid2 container key={field.realIndex} direction={'row'} rowSpacing={2} alignItems={'center'} justifyContent={'space-between'} mt={2}>
                            <FormControl >
                              <TextField
                                label='Client name'
                                value={field.customerName}
                                error={!field.customerName}
                                sx={{minWidth: 300}}
                                helperText={!field.customerName ? 'Required field' : ''}
                                onChange={({ target }) => {
                                  setValue(`tools.${field.realIndex}.customerName`, target.value)
                                }} />
                            </FormControl>
                            <FormControl error={!field.assignedAuditor}>
                              <InputLabel id={`auditor-label`}>Auditor</InputLabel>
                              <Select
                                labelId={`auditor-label`}
                                label="Auditor"
                                onChange={({ target }) => {
                                  setValue(`tools.${field.realIndex}.assignedAuditor`, target.value)
                                }}
                                value={field.assignedAuditor}
                                sx={{ minWidth: 300 }}
                              >
                                {auditors.map((option) => (
                                  <MenuItem key={option.employeeId} value={option.employeeId}>{option.name}</MenuItem>
                                ))}
                              </Select>
                              {!field.assignedAuditor && (
                                <FormHelperText>Required field</FormHelperText>
                              )}
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
            <Button variant='contained' disabled={
              watchFields.length === 0 ||
              watchFields.some(tool =>
                tool.customerName === "" || tool.assignedAuditor === "" || tool.locationNumber === ""
              )
            } type='submit'>Create</Button>
          </Grid2>
        </Grid2>
      </form>

    </div >
  )
}
