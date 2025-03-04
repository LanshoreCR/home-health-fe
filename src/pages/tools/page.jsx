import { useState, useEffect } from 'react'
import { getAudit } from '../../shared/services/api/endpoints/audit'
import { getLocations } from '../../shared/services/api/endpoints/location'
import { getTools } from '../../shared/services/api/endpoints/tools'
import { getToolTemplates } from '../../shared/services/api/endpoints/tool-template'
import { toast } from 'sonner'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import LoadingToolsPage from './loading'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import ToolsTable from './components/table'

export default function BannerToolsPage() {
  const { id } = useParams()

  const location = useLocation()
  const navigate = useNavigate()

  const [currentAudit, setCurrentAudit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tools, setTools] = useState([])
  const [locationOptions, setLocationOptions] = useState([])
  const [currentLocation, setCurrentLocation] = useState('')
  const [toolTemplateOptions, setToolTemplateOptions] = useState([])
  const [currentToolTemplate, setCurrentToolTemplate] = useState('')

  const refreshTools = async () => {
    setLoading(true)
    const response = await getTools({ packageId: id })
    if (response instanceof Error) {
      toast.error('error getting audit tools')
      return
    }
    setTools(response)
    setLoading(false)
  }

  useEffect(() => {
    getAudit({ id })
      .then((data) => {
        if (data == null) {
          throw new Error('cannot getting audit tools')
        }
        setCurrentAudit(data)
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
    getLocations({ packageId: id })
      .then((data) => {
        if (data instanceof Error) {
          throw new Error('cannot get locations from audit')
        }
        setLocationOptions(data)
      })
      .catch(() => {
        toast.error('error getting locations from audit')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (currentLocation === '') return
    getToolTemplates({ locationId: currentLocation })
      .then((data) => {
        if (data instanceof Error) {
          throw new Error('cannot get tool template by location id')
        }
        setToolTemplateOptions(data)
      })
      .catch(() => {
        toast.error('error getting tool templates by location id')
      })
  }, [currentLocation])

  if (loading) {
    return (
      <LoadingToolsPage />
    )
  }

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

  const handleGoToCreateToolsPage = () => {
    const url = `/${id}/${currentAudit.auditTeamId}/tools/new`
    navigate(url)
  }

  const handleOnChangeLocation = (event) => {
    setCurrentLocation(event.target.value)
    setCurrentToolTemplate('')
  }

  if (currentAudit == null) {
    return (
      <div className='flex justify-center items-center w-full flex-col gap-y-5'>
        <span>Audit not found</span>
        <Button variant="contained" onClick={handleGoToCreateToolsPage}>Create tools</Button>
      </div>
    )
  }

  return (
    <>
      <h3 className='text-lg font-bold mb-8'>{currentAudit.packageName}</h3>
      <div className='flex items-center w-full justify-between mb-10'>
        <div className='flex gap-x-3 flex-1'>
          <FormControl className='max-w-60 w-full' size='small'>
            <InputLabel id="demo-simple-select-label">Filter by location</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Filter by location"
              defaultValue={''}
              value={currentLocation}
              onChange={handleOnChangeLocation}
            >
              <MenuItem value={''}>All</MenuItem>
              {locationOptions.map((option) => (
                <MenuItem value={option.id} key={option.id}>{option.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className='max-w-72 w-full' size='small'>
            <InputLabel id="demo-simple-select-label">Filter by template</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Filter by template"
              disabled={currentLocation === ''}
              value={currentToolTemplate}
              onChange={(event) => setCurrentToolTemplate(event.target.value)}
            >
              <MenuItem value={''}>All</MenuItem>
              {toolTemplateOptions.map((option) => (
                <MenuItem value={option.templateId} key={option.templateId}>{option.templateDesc}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FilterAltIcon className='mt-1 ml-3 text-gray-600' />
        </div>
        <Button variant="contained" onClick={handleGoToCreateToolsPage}>Create tools</Button>
      </div>
      <section className='mb-16'>
        {filteredTools != null
          ? (
            <ToolsTable
              refreshTools={refreshTools}
              tools={filteredTools}
            />
          )
          : (
            <div className='flex justify-center items-center w-full flex-col gap-y-5'>
              <span className='font-bold'>No tools to show.</span>
              <Button variant="contained" onClick={handleGoToCreateToolsPage}>Create tools</Button>
            </div>
          )}
      </section>
    </>
  )
}
