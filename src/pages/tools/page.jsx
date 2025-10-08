import { useState, useEffect } from 'react'
import { getAudit } from '../../shared/services/api/endpoints/audit'
import { getLocations } from '../../shared/services/api/endpoints/location'
import { getTools, updateToolStatus } from '../../shared/services/api/endpoints/tools'
import { getToolTemplates } from '../../shared/services/api/endpoints/tool-template'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import LoadingToolsPage from './loading'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import ToolsTable from './components/table'
import { STATUS } from '../banners/components/card'

export default function BannerToolsPage() {
  const { id } = useParams()

  const navigate = useNavigate()

  const [currentAudit, setCurrentAudit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tools, setTools] = useState([])
  const [locationOptions, setLocationOptions] = useState([])
  const [currentLocation, setCurrentLocation] = useState('')
  const [toolTemplateOptions, setToolTemplateOptions] = useState([])
  const [currentToolTemplate, setCurrentToolTemplate] = useState('')
  const [selectedTools, setSelectedTools] = useState([])
  const [currentStatus, setCurrentStatus] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

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

  const addToSelectedTools = (tool) => {
    setSelectedTools(prev => [...prev, tool])
  }

  const removeFromSelectedTools = (tool) => {
    setSelectedTools(prev => prev.filter(selectedTool => selectedTool.packageTemplateId !== tool.packageTemplateId))
  }

  const handleSelectAll = () => {
    const selectableTools = filteredTools.filter(tool => 
      tool.allQuestionsAnswered === 1 && 
      (tool.templateStatus === 'Pending' || tool.templateStatus === 'Under Review')
    )
    if (selectedTools.length === selectableTools.length) {
      // If all selectable tools are selected, deselect all
      setSelectedTools([])
    } else {
      // Select all selectable tools
      setSelectedTools(selectableTools)
    }
  }

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value
    setCurrentStatus(newStatus)
    setIsUpdatingStatus(true)
    
    try {
      // Create promises for all selected tools with proper status transitions
      const updatePromises = selectedTools.map(tool => {
        // Get current status from tool
        const currentToolStatus = tool.templateStatus
        
        // Determine new status based on current status and user selection
        let newTemplateStatusId
        
        if (newStatus === 'Approve') {
          // If current status is Pending and user selects Approve → Under Review (4)
          // If current status is Under Review and user selects Approve → Ready to Review (5)
          if (currentToolStatus === 'Pending') {
            newTemplateStatusId = 4 // Under Review
          } else if (currentToolStatus === 'Under Review') {
            newTemplateStatusId = 5 // Ready to Review
          } else {
            // For other statuses, set to Approved (2)
            newTemplateStatusId = 2 // Approved
          }
        } else if (newStatus === 'Reject') {
          // If user selects Reject → Rejected (3)
          newTemplateStatusId = 3 // Rejected
        }
        
        return updateToolStatus({
          packageTemplateId: tool.packageTemplateId,
          templateStatusId: newTemplateStatusId
        })
      })
      
      // Execute all updates in parallel
      await Promise.all(updatePromises)
      
      // Count transitions for better feedback
      const pendingToUnderReview = selectedTools.filter(tool => tool.templateStatus === 'Pending').length
      const underReviewToReady = selectedTools.filter(tool => tool.templateStatus === 'Under Review').length
      
      let successMessage = `Successfully updated ${selectedTools.length} tool(s)`
      if (newStatus === 'Approve') {
        if (pendingToUnderReview > 0) successMessage += ` - ${pendingToUnderReview} moved to Under Review`
        if (underReviewToReady > 0) successMessage += ` - ${underReviewToReady} moved to Ready to Review`
      } else {
        successMessage += ` to ${newStatus}`
      }
      
      toast.success(successMessage)
      
      // Refresh tools to get updated data
      await refreshTools()
      
      // Clear selection
      setSelectedTools([])
      setCurrentStatus('')
      
    } catch (error) {
      console.error('Error updating tool status:', error)
      toast.error('Error updating tool status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (currentAudit == null) {
    return (
      <></>
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
        <div className='flex gap-x-4 items-center'>
          <FormControl className='max-w-80 w-full' size='small'>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              label="Status"
              disabled={selectedTools.length === 0 || isUpdatingStatus}
              value={currentStatus}
              onChange={handleStatusChange}
            >
              <MenuItem value="Approve">Approve</MenuItem>
              <MenuItem value="Reject">Reject</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleGoToCreateToolsPage} disabled={currentAudit.packageStatus === STATUS.COMPLETED}>Create tools</Button>
        </div>
      </div>
      <section className='mb-16'>
        {filteredTools != null
          ? (
            <ToolsTable
              refreshTools={refreshTools}
              tools={filteredTools}
              currentAudit={currentAudit}
              selectedTools={selectedTools}
              addToSelectedTools={addToSelectedTools}
              removeFromSelectedTools={removeFromSelectedTools}
              handleSelectAll={handleSelectAll}
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
