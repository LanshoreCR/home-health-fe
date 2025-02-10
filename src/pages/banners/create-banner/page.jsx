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
import Select from '@mui/material/Select'
import { Grid2, Typography } from '@mui/material'
import { getTeamAuditors, manageTeamAuditors, reassignTeamLead } from '../../../shared/services/api/endpoints/manage-team'
import RangeDatePicker from './components/range-picker'

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
  executiveDirector: yup.string().required('Executive Director is required'),
  singleOrTeam: yup.string().required('Required')
})

export default function CreateBannerPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const currentUser = useSelector(state => state.user)
  const userId = currentUser.employeeId

  const { control, handleSubmit, setValue, formState: { errors, isValid }, reset, getValues, watch } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      business: '',
      region: '',
      regionalDirector: '',
      executiveDirector: '',
      locations: [],
      singleOrTeam: 'single',
      teamLeader: '',
      auditors: []
    }
  })

  const singleOrTeamValue = watch('singleOrTeam')

  const params = useRef(DEFAULT_PARAMS)
  const [business, setBusiness] = useState([])
  const [regions, setRegions] = useState(null)
  const [regionDirector, setRegionDirector] = useState(null)
  const [executiveDirector, setExecutiveDirector] = useState(null)
  const [locations, setLocations] = useState(null)
  const [auditors, setAuditors] = useState([])
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
      locationId: locationNumbers[0],
      dateRange,
    }
    const response = await createAudit({ audit, userId })
    if (response instanceof Error) {
      toast.error('error while creating new audit')
      return
    }

    //save team lead
    const teamLeadResponse = await reassignTeamLead({
      auditTeamId: response.auditTeamID,
      userId,
      auditorId: singleOrTeamValue === 'single' ? userId : data.teamLeader
    })
    if (teamLeadResponse instanceof Error) {
      toast.error('error while reassigning team lead')
      return
    }

    //save auditors
    let auditorsToSave = data.auditors.map(auditor => auditors.find(a => a.employeeId === auditor))
    if (singleOrTeamValue === 'single')
      auditorsToSave = [auditors.find(auditor => auditor.employeeId === userId)]
    const auditorsResponse = await manageTeamAuditors({
      auditTeamId: response.auditTeamID,
      auditors: auditorsToSave,
      userId
    })
    if (auditorsResponse instanceof Error) {
      toast.error('error while updating auditors')
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

  const handleSelectDate = (dateRange) => {
    setDateRange(dateRange)
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

  return (
    <div className='w-full max-w-4xl mx-auto'>
      {id === 'new'
        ? (
          <h2 className='font-bold text-3xl text-blue-500 mb-5 text-center'>Create Audit</h2>
        )
        : (
          <h2 className='font-bold text-3xl text-blue-500 mb-5 text-center'>Edit Audit</h2>
        )}
      <form className='' onSubmit={handleSubmit(handleOnSubmit)}>
        <Grid2 container flexGrow={1} justifyContent={'space-between'} p={2} spacing={2}>

          <Grid2 container direction={'column'} spacing={5} mt={1} sx={{ width: 340 }}>
            <FormControl required>
              <RangeDatePicker onSelect={handleSelectDate} />
            </FormControl>

            <Grid2 container direction={'column'} spacing={2} >
              <FormControl  >
                <InputLabel id={`team-label`}>Single or Team Audit</InputLabel>

                <Select

                  labelId="team-label"
                  id="team-line"
                  label="Single or Team Audit"
                  name="singleOrTeam"
                  value={getValues('singleOrTeam')}
                  onChange={({ target }) => {
                    setValue('singleOrTeam', target.value)
                  }}
                >
                  <MenuItem value={'single'}>Single person audit</MenuItem>
                  <MenuItem value={'team'}>Team audit</MenuItem>
                </Select>

              </FormControl>

              {
                singleOrTeamValue !== 'single' &&
                (
                  <>
                    <FormControl  >
                      <InputLabel id={`team-leader-label`}>Select Team Leader</InputLabel>
                      <Controller
                        name="teamLeader"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="team-leader-label"
                            id="team-leader-line"
                            label="Select Team Leader"
                            onChange={(e) => {
                              field.onChange(e)
                            }}
                          >
                            {
                              auditors.map((auditor) => (
                                <MenuItem key={auditor.employeeId} value={auditor.employeeId}>{auditor.name}</MenuItem>
                              ))
                            }
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormControl>
                      <InputLabel id={`auditors-label`}>Select Auditors</InputLabel>
                      <Controller
                        name="auditors"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            labelId="auditors-label"
                            id="auditors-line"
                            label="Select Auditors"
                            onChange={(e) => {
                              field.onChange(e)
                            }}
                            multiple
                            sx={{ width: 340 }}
                          >
                            {
                              auditors.map((auditor) => (
                                <MenuItem key={auditor.employeeId} value={auditor.employeeId}>{auditor.name}</MenuItem>
                              ))
                            }
                          </Select>
                        )}
                      />
                    </FormControl>
                  </>
                )
              }


            </Grid2>

          </Grid2>
          <Grid2 container spacing={2} direction={'column'} width={400}>

            <Typography>Locations</Typography>

            <Grid2 container >
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
            </Grid2>


          </Grid2>

        </Grid2>


        <div className='w-full flex justify-between mt-5'>
          <Link to='/'>
            <Button variant="text">Cancel</Button>
          </Link>
          <Button variant="contained" type='submit' disabled={!isValid}>Create Audit</Button>
        </div>
      </form>
    </div>
  )
}
