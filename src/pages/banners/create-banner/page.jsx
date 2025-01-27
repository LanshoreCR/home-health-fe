import { useEffect, useRef, useState } from 'react'
import { createAudit } from '../../../shared/services/api/endpoints/audit'
import { getLocationHierarchy } from '../../../shared/services/api/endpoints/location-hierarchy'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import RangeDatePicker from './components/range-picker'
import Select from '@mui/material/Select'

const CONTROLLERS = {
  BUSINESS: 0,
  REGIONS: 1,
  REGION_DIRECTOR: 2,
  EXECUTIVE_DIRECTOR: 3,
  LOCATIONS: 4
}

const DEFAULT_PARAMS = {
  BusinessLineID: '0',
  RegionID: '0',
  RegionalDirectorID: '0',
  ExecutiveDirectorID: '0',
  Controller: CONTROLLERS.BUSINESS
}

const validationSchema = yup.object().shape({
  business: yup.string().required('Business Line is required'),
  region: yup.string().required('Region is required'),
  regionalDirector: yup.string().required('Regional Director is required'),
  executiveDirector: yup.string().required('Executive Director is required')
})

export default function CreateBannerPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const currentUser = useSelector(state => state.user)
  const userId = currentUser.employeeId

  const { control, handleSubmit, setValue, formState: { errors, isValid }, reset, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      business: '',
      region: '',
      regionalDirector: '',
      executiveDirector: '',
      locations: []
    }
  })

  const params = useRef(DEFAULT_PARAMS)
  const [business, setBusiness] = useState([])
  const [regions, setRegions] = useState(null)
  const [regionDirector, setRegionDirector] = useState(null)
  const [executiveDirector, setExecutiveDirector] = useState(null)
  const [locations, setLocations] = useState(null)
  const [dateRange, setDateRange] = useState([null, null])

  useEffect(() => {
    getLocationHierarchy().then((data) => setBusiness(data))
  }, [])

  const handleOnSubmit = async (data) => {
    if (dateRange[0] == null && dateRange[1] == null) {
      toast.error('select a valid date range')
      return
    }
    const currentExecutiveDirector = locations.find((item) => item.edId != null)
    const locationNumbers = getValues('locations')
    const audit = {
      ...currentExecutiveDirector,
      dateRange,
      locationId: locationNumbers[0],
      locationNumbers: locationNumbers.join(','),
    }

    const response = await createAudit({ audit, userId })
    if (response instanceof Error) {
      toast.error('error while creating new audit')
      return
    }
    toast.success('Audit created successfully!')
    reset()
    setTimeout(() => {
      navigate('/')
    }, 1000)
  }

  const ifNullReturnEmpty = (param) => {
    return param == null ? '0' : param
  }

  const buildParams = (params, value, controller) => {
    if (controller === CONTROLLERS.BUSINESS) {
      return { ...DEFAULT_PARAMS, BusinessLineID: value, Controller: CONTROLLERS.REGIONS }
    }
    if (controller === CONTROLLERS.REGIONS) {
      return { ...DEFAULT_PARAMS, BusinessLineID: params.BusinessLineID, RegionID: value, Controller: CONTROLLERS.REGION_DIRECTOR }
    }
    if (controller === CONTROLLERS.REGION_DIRECTOR) {
      return { ...DEFAULT_PARAMS, BusinessLineID: params.BusinessLineID, RegionID: params.RegionID, RegionalDirectorID: value, Controller: CONTROLLERS.EXECUTIVE_DIRECTOR }
    }
    if (controller === CONTROLLERS.EXECUTIVE_DIRECTOR) {
      return { ...DEFAULT_PARAMS, BusinessLineID: params.BusinessLineID, RegionID: params.RegionID, RegionalDirectorID: params.RegionalDirectorID, ExecutiveDirectorID: value, Controller: CONTROLLERS.LOCATIONS }
    }
  }

  const resetSelects = (currentController) => {
    if (currentController === CONTROLLERS.BUSINESS) {
      setRegions(null)
      setRegionDirector(null)
      setExecutiveDirector(null)
      setLocations(null)
    }
    if (currentController === CONTROLLERS.REGIONS) {
      setRegionDirector(null)
      setExecutiveDirector(null)
      setLocations(null)
    }
    if (currentController === CONTROLLERS.REGION_DIRECTOR) {
      setExecutiveDirector(null)
      setLocations(null)
    }
    if (currentController === CONTROLLERS.EXECUTIVE_DIRECTOR) {
      setLocations(null)
    }
  }

  const handleOnChangeBusiness = async (value) => {
    resetSelects(CONTROLLERS.BUSINESS)
    const newParams = buildParams(params.current, value, CONTROLLERS.BUSINESS)
    params.current = newParams
    const data = await getLocationHierarchy(params.current)
    setRegions(data)
    setValue('region', '')
    setValue('regionalDirector', '')
    setValue('executiveDirector', '')
  }

  const handleOnChangeRegion = async (value) => {
    resetSelects(CONTROLLERS.REGIONS)
    const newParams = buildParams(params.current, value, CONTROLLERS.REGIONS)
    params.current = newParams
    const data = await getLocationHierarchy(params.current)
    setRegionDirector(data)
    setValue('regionalDirector', '')
    setValue('executiveDirector', '')
  }

  const handleOnChangeRegionalDirector = async (value) => {
    resetSelects(CONTROLLERS.REGION_DIRECTOR)
    const newParams = buildParams(params.current, value, CONTROLLERS.REGION_DIRECTOR)
    params.current = newParams
    const data = await getLocationHierarchy(params.current)
    setExecutiveDirector(data)
    setValue('executiveDirector', '')
  }

  const handleOnChangeExecutiveDirector = async (value) => {
    resetSelects(CONTROLLERS.EXECUTIVE_DIRECTOR)
    const newParams = buildParams(params.current, value, CONTROLLERS.EXECUTIVE_DIRECTOR)
    params.current = newParams
    const data = await getLocationHierarchy(params.current)
    setLocations(data)
  }

  const handleSelectDate = (dateRange) => {
    setDateRange(dateRange)
  }

  return (
    <div className='w-full max-w-3xl mx-auto'>
      {id === 'new'
        ? (
          <h2 className='font-bold text-3xl text-blue-500 mb-5 text-center'>Create Audit</h2>
        )
        : (
          <h2 className='font-bold text-3xl text-blue-500 mb-5 text-center'>Edit Audit</h2>
        )}
      <form className='flex flex-col w-full items-center max-w-lg mx-auto mb-10' onSubmit={handleSubmit(handleOnSubmit)}>
        <div className='mb-6 w-full'>
          <FormControl className='w-full' required>
            <RangeDatePicker onSelect={handleSelectDate} />
          </FormControl>
        </div>
        <div className='mb-6 w-full'>
          <FormControl fullWidth required error={!!errors.business}>
            <InputLabel id="business-line-label">Business Line</InputLabel>
            <Controller
              name="business"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="business-line-label"
                  id="business-line"
                  label="Business Line"
                  onChange={(e) => {
                    field.onChange(e)
                    handleOnChangeBusiness(e.target.value)
                  }}
                >
                  {business.map((b) => (
                    <MenuItem key={b.businessLineId} value={b.businessLineId}>{b.businessLine}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.business && <p>{errors.business.message}</p>}
          </FormControl>
        </div>
        <div className='mb-6 w-full'>
          <FormControl fullWidth required error={!!errors.region}>
            <InputLabel id="region-label">Region</InputLabel>
            <Controller
              name="region"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="region-label"
                  id="region"
                  label="Region"
                  disabled={!regions}
                  onChange={(e) => {
                    field.onChange(e)
                    handleOnChangeRegion(e.target.value)
                  }}
                >
                  {regions && regions.map((region) => (
                    <MenuItem key={region.regionId} value={ifNullReturnEmpty(region.regionId)}>{region.regionName}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.region && <p>{errors.region.message}</p>}
          </FormControl>
        </div>
        <div className='mb-6 w-full'>
          <FormControl fullWidth required error={!!errors.regionalDirector}>
            <InputLabel id="regional-director-label">Regional Director</InputLabel>
            <Controller
              name="regionalDirector"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="regional-director-label"
                  id="regional-director"
                  label="Regional Director"
                  disabled={!regionDirector}
                  onChange={(e) => {
                    field.onChange(e)
                    handleOnChangeRegionalDirector(e.target.value)
                  }}
                >
                  {regionDirector && regionDirector.map((rd) => (
                    <MenuItem key={rd.rdIda} value={ifNullReturnEmpty(rd.rdIda)}>{rd.rdName}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.regionalDirector && <p>{errors.regionalDirector.message}</p>}
          </FormControl>
        </div>
        <div className='mb-6 w-full'>
          <FormControl fullWidth required error={!!errors.executiveDirector}>
            <InputLabel id="executive-director-label">Executive Director</InputLabel>
            <Controller
              name="executiveDirector"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="executive-director-label"
                  id="executive-director"
                  label="Executive Director"
                  disabled={!executiveDirector}
                  onChange={(e) => {
                    field.onChange(e)
                    handleOnChangeExecutiveDirector(e.target.value)
                  }}
                >
                  {executiveDirector && executiveDirector.map((ed) => (
                    <MenuItem key={ed.edId} value={ifNullReturnEmpty(ed.edId)}>{ed.edName}</MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.executiveDirector && <p>{errors.executiveDirector.message}</p>}
          </FormControl>
        </div>
        <div className='mb-6 w-full'>
          <FormControl fullWidth required error={!!errors.locations}>
            <InputLabel id="locations-label">Locations</InputLabel>
            <Controller
              name="locations"
              control={control}
              render={({ field }) => {
                const { onChange, value } = field
                return (
                  <Select
                    {...field}
                    multiple
                    labelId="locations-label"
                    id="locations"
                    label="Locations"
                    disabled={!executiveDirector}
                    onChange={(e) => {
                      field.onChange(e)
                    }}
                  >
                    {locations?.map((location) => {
                      return (
                        <MenuItem key={location.locationId} value={ifNullReturnEmpty(location.locationId)}>{location.locationName}</MenuItem>
                      )
                    })}
                  </Select>
                 
                )
              }}
            />
            {errors.locations && <p>{errors.locations.message}</p>}
          </FormControl>
        </div>
        <div className='w-full flex justify-between'>
          <Link to='/'>
            <Button variant="text">Cancel</Button>
          </Link>
          <Button variant="contained" type='submit' disabled={!isValid}>Create Audit</Button>
        </div>
      </form>
    </div>
  )
}
