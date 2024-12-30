import { useEffect, useState } from 'react'
import { createTools, getTools } from '../../../shared/services/api/endpoints/tools'
import { DatePicker } from '@mui/x-date-pickers'
import { FormControl, InputLabel, MenuItem, Select, TextField, FormHelperText, IconButton, Checkbox } from '@mui/material'
import { getLocations } from '../../../shared/services/api/endpoints/location'
import { getToolTemplates } from '../../../shared/services/api/endpoints/tool-template'
import { toast } from 'sonner'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import useGoBack from '@shared/hooks/useGoBack'
import CreateToolSkeleton from './components/skeleton'

const schema = yup.object().shape({
  tools: yup.array().of(
    yup.object().shape({
      location: yup.string().required('Location is required'),
      tool: yup.array().min(1, 'At least one tool is required').required('Tool is required'),
      date: yup.date().required('Date is required')
    })
  )
})

const getAvailableToolsPerLocation = (tools, location, toolTemplate) => {
  if (location == null) return []
  const locationTemplateTools = toolTemplate[location.id]
  if (locationTemplateTools == null) return []

  const toolsByLocation = tools.filter(tool => tool.auditPlaceLocation === location.id)

  const availableLocationTools = locationTemplateTools.filter(tool => !toolsByLocation.map(tool => tool.templateId).includes(tool.templateId))
  return availableLocationTools
}

const getAvailableTools = (locations, tools, toolTemplate) => {
  const availableToolsPerLocation = {}
  for (const location of locations) {
    availableToolsPerLocation[location.id] = getAvailableToolsPerLocation(tools, location, toolTemplate)
  }
  return availableToolsPerLocation
}

const getLocationsWithAvailableTools = (locations, availableTools) => {
  const locationsWithAvailableTools = locations.filter(location => availableTools[location.id] ? availableTools[location.id].length > 0 : false)
  return locationsWithAvailableTools
}

export default function CreateToolPage() {
  const { id, idTool } = useParams()
  const goBack = useGoBack()
  const navigate = useNavigate()

  const [locations, setLocations] = useState([])
  const [toolsByLocation, setToolsByLocation] = useState({})
  const [tools, setTools] = useState([])

  const [availableToolsPerLocation, setAvailableToolsPerLocation] = useState({})
  const [locationsWithAvailableTools, setLocationsWithAvailableTools] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  const currentUser = useSelector((state) => state.user)

  const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      tools: [{ location: '', tool: [], date: new Date(Date.now()) }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tools'
  })

  const onSubmit = async (data) => {
    const toolsToCreate = []
    for (const location of data.tools) {
      for (const tool of location.tool) {
        toolsToCreate.push({
          location: location.location,
          tool,
          date: location.date
        })
      }
    }
    const response = await createTools({ tools: toolsToCreate, packageId: id, userId: currentUser.employeeId })
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

  const handleOnAddTool = () => {
    append({ location: '', tool: [], date: new Date(Date.now()) })
  }

  const watchFields = watch('tools')

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

  useEffect(() => {
    const availableToolsPerLocation = getAvailableTools(locations, tools, toolsByLocation)
    setAvailableToolsPerLocation(availableToolsPerLocation)
    const locationsWithAvailableTools = getLocationsWithAvailableTools(locations, availableToolsPerLocation)
    setLocationsWithAvailableTools(locationsWithAvailableTools)
  }, [locations, toolsByLocation, tools])

  const handleLocationChange = (value, index) => {
    setValue(`tools.${index}.location`, value)
    setValue(`tools.${index}.tool`, [])

    const updatedSelectedLocations = watchFields.map(item => item.location).filter(loc => loc !== '')
    setSelectedLocations(updatedSelectedLocations)
  }

  const handleRowRemove = (index) => {
    // filter location where index is not included
    const locationToRemove = selectedLocations[index]
    const updatedSelectedLocations = watchFields.map(item => item.location).filter(loc => loc !== '' && loc !== locationToRemove)
    setSelectedLocations(updatedSelectedLocations)
    remove(index)
  }

  const filteredLocations = (index) => {
    return locationsWithAvailableTools.filter(loc => !selectedLocations.includes(loc.id) || watchFields[index]?.location === loc.id)
  }

  if (isLoading) {
    return <CreateToolSkeleton />
  }

  if (locationsWithAvailableTools.length === 0 && !isLoading) {
    return (
      <div className='w-full max-w-4xl mx-auto'>
        <h2 className='font-bold text-3xl text-blue-500 mb-10 text-center'>All tools are already created for all locations</h2>
        <div className='justify-center flex flex-col items-center gap-y-5'>
          <Button variant="contained" onClick={goBack}>Go back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-4xl mx-auto'>
      {idTool === 'new'
        ? <h2 className='font-bold text-3xl text-blue-500 mb-10 text-center'>Create Tools</h2>
        : <h2 className='font-bold text-3xl text-blue-500 mb-10 text-center'>Edit Tools</h2>
      }
      <form className='flex flex-col w-full mb-10 mt-5' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex w-full justify-end mb-6 items-center'>
          <Button variant="outlined" onClick={handleOnAddTool} type='button'>Add tool</Button>
        </div>
        <section>
          <ul className='flex flex-col w-full gap-y-3'>
            {fields.map((field, index) => (
              <div key={field.id} className='flex gap-x-2 w-full'>
                <FormControl sx={{ minWidth: 350 }} error={!!errors.tools?.[index]?.location}>
                  <InputLabel id={`location-label-${index}`}>Location</InputLabel>
                  <Controller
                    control={control}
                    name={`tools.${index}.location`}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId={`location-label-${index}`}
                        label="Location"
                        onChange={(e) => handleLocationChange(e.target.value, index)}
                        value={field.value}
                      >
                        {filteredLocations(index).map((option) => (
                          <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.tools?.[index]?.location?.message}</FormHelperText>
                </FormControl>
                <FormControl sx={{ minWidth: 230, maxWidth: 300 }} error={!!errors.tools?.[index]?.tool}>
                  <InputLabel id={`tool-label-${index}`}>Tool</InputLabel>
                  <Controller
                    control={control}
                    name={`tools.${index}.tool`}
                    render={({ field }) => {
                      const allSelected = (availableToolsPerLocation[watchFields[index]?.location] || [])
                        .map((option) => option.templateId)
                        .every((templateId) => field.value.includes(templateId))

                      const handleSelectAll = () => {
                        if (allSelected) {
                          field.onChange([])
                          return
                        }
                        field.onChange(
                          (availableToolsPerLocation[watchFields[index]?.location] || []).map((option) => option.templateId)
                        )
                      }

                      return (
                        <Select
                          {...field}
                          labelId={`tool-label-${index}`}
                          label="Tool"
                          multiple
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          renderValue={(selected) =>
                            selected
                              .map(
                                (toolId) =>
                                  availableToolsPerLocation[watchFields[index]?.location]?.find(
                                    (tool) => tool.templateId === toolId
                                  )?.templateDesc
                              )
                              .join(', ')
                          }
                        >
                          <MenuItem onClick={handleSelectAll}>
                            <Checkbox
                              checked={allSelected}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSelectAll()
                              }}
                            />
                            Select All
                          </MenuItem>
                          {(toolsByLocation[watchFields[index]?.location] || []).map((option) => {
                            const currentAvailableTools = availableToolsPerLocation[watchFields[index]?.location] || []
                            const isActive = currentAvailableTools.map((tool) => tool.templateId).includes(option.templateId)
                            if (!isActive) {
                              return (
                                <MenuItem key={option.templateId} disabled={true}>
                                  <Checkbox checked={true} disabled={true} />
                                  {option.templateDesc}
                                </MenuItem>
                              )
                            }
                            const isChecked = field.value.includes(option.templateId)
                            return (
                              <MenuItem key={option.templateId} value={option.templateId}>
                                <Checkbox checked={isChecked} />
                                {option.templateDesc}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      )
                    }}
                  />
                  <FormHelperText>{errors.tools?.[index]?.tool?.message}</FormHelperText>
                </FormControl>
                <FormControl error={!!errors.tools?.[index]?.date}>
                  <Controller
                    control={control}
                    name={`tools.${index}.date`}
                    render={({ field }) => (
                      <DatePicker
                        label="Date"
                        renderInput={(props) => <TextField {...props} />}
                        {...field}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                  <FormHelperText>{errors.tools?.[index]?.date?.message}</FormHelperText>
                </FormControl>
                <IconButton onClick={() => handleRowRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
          </ul>
        </section>
        <div className='w-full flex justify-between mt-8 mb-16'>
          <Button variant="text" onClick={goBack}>Cancel</Button>
          <Button variant="contained" type='submit'>Create Tools</Button>
        </div>
      </form>
    </div>
  )
}
