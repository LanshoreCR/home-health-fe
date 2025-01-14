import { useEffect, useState } from 'react'
import { getLocations } from '../../../shared/services/api/endpoints/location'
import { toast } from 'sonner'
import { getToolTemplates } from '../../../shared/services/api/endpoints/tool-template'

export default function useFilterLocationTemplate({ id }) {
  const [locationOptions, setLocationOptions] = useState([])
  const [currentLocation, setCurrentLocation] = useState('')
  const [toolTemplateOptions, setToolTemplateOptions] = useState([])
  const [currentToolTemplate, setCurrentToolTemplate] = useState('')

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleOnChangeLocation = (event) => {
    setCurrentLocation(event.target.value)
    setCurrentToolTemplate('')
  }

  const handleOnChangeToolTemplate = (event) => {
    setCurrentToolTemplate(event.target.value)
  }

  useEffect(() => {
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

  return {
    locationOptions,
    toolTemplateOptions,
    currentLocation,
    currentToolTemplate,
    open,
    handleOpen,
    handleClose,
    handleOnChangeLocation,
    handleOnChangeToolTemplate
  }
}
