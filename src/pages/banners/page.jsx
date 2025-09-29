import { useState, useEffect } from 'react'
import { getAudits } from '../../shared/services/api/endpoints/audit'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import BannerCard from './components/card'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import LoadingBannersPage from './loading'
import MenuItem from '@mui/material/MenuItem'
import SearchIcon from '@mui/icons-material/Search'
import Select from '@mui/material/Select'
import { useDebounce } from 'use-debounce'
import { Grid2, InputAdornment, OutlinedInput } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

const filterAudits = (audits, filters) => {
  const { currentAuditor, currentQuarter, currentLocation, searchByName } = filters

  const filterByAuditor = (audit) => {
    return currentAuditor ? audit.teamLeadId === currentAuditor : true
  }

  const filterByQuarter = (audit) => {
    return currentQuarter ? audit.quarter === currentQuarter : true
  }

  const filterByLocation = (audit) => {
    return currentLocation ? audit.edNumber === currentLocation : true
  }

  const filterByName = (audit) => {
    return searchByName ? audit.packageName.toLowerCase().includes(searchByName.toLowerCase()) : true
  }

  return audits.filter(audit => {
    return filterByAuditor(audit) && filterByQuarter(audit) && filterByLocation(audit) && filterByName(audit)
  })
}

const QUARTER_OPTIONS = [
  'Q1',
  'Q2',
  'Q3',
  'Q4'
]

const getAuditorOptions = (audits = []) => {
  const auditors = audits.map((audit) => ({
    id: audit.teamLeadId,
    name: audit.teamLead
  })).filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.id === item.id && t.name === item.name
    ))
  )
  return auditors
}

const getLocationOptions = (audits = []) => {
  const locations = audits.map((audit) => ({
    id: audit.edNumber,
    name: audit.edName
  })).filter((item, index, self) =>
    index === self.findIndex((t) => (
      t.id === item.id && t.name === item.name
    ))
  )
  return locations
}

export default function BannersPage() {
  const currentUser = useSelector(state => state.user)
  const userId = currentUser.employeeId

  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)

  const auditors = getAuditorOptions(audits)
  const locations = getLocationOptions(audits)

  const [currentAuditor, setCurrentAuditor] = useState('')
  const [currentQuarter, setCurrentQuarter] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const [searchByName, setSearchByName] = useState('')
  const [searchByNameDebounced] = useDebounce(searchByName, 500)

  const handleChangeAuditor = (event) => {
    const newCurrentAuditorId = event.target.value
    setCurrentAuditor(newCurrentAuditorId)
  }

  const handleChangeQuarter = (event) => {
    const newCurrentQuarter = event.target.value
    setCurrentQuarter(newCurrentQuarter)
  }

  const handleChangeLocation = (event) => {
    const newCurrentLocation = event.target.value
    setCurrentLocation(newCurrentLocation)
  }

  const handleChangeSearchByName = (event) => {
    const newSearchName = event.target.value
    setSearchByName(newSearchName)
  }

  const filteredAudits = filterAudits(audits, {
    currentAuditor,
    currentQuarter,
    currentLocation,
    searchByName: searchByNameDebounced
  })

  const resetFilters = () => {
    setCurrentAuditor('')
    setCurrentQuarter('')
    setCurrentLocation('')
    setSearchByName('')
  }

  const resetSearchName = () => {
    setSearchByName('')
  }

  const refreshAudits = async () => {
    setLoading(true)
    const response = await getAudits({ userId, isAdmin: currentUser.role.includes("Admin") })
    if (response instanceof Error) {
      toast.error('error getting audits')
      return
    }
    setAudits(response)
    setLoading(false)
  }

  useEffect(() => {
    if (userId === '') return
    setLoading(true)

    const fetchAudits = async () => {
      const response = await getAudits({ userId, isAdmin: currentUser.role.includes("Admin") })
      if (response instanceof Error) {
        toast.error('error getting audits')
        return
      }
      setAudits(response)
      setLoading(false)
    }
    fetchAudits()
  }, [userId, currentUser.role])

  if (loading) {
    return (
      <LoadingBannersPage />
    )
  }
  return (
    <div>
      <Grid2 container spacing={2} width={'100%'} alignItems={'center'}>
        <FormControl variant="outlined" className='max-w-44 w-full' label='Search by name' size='small'>
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={(searchByName !== ''
              ? (
                <InputAdornment position="end" onClick={resetSearchName} className='cursor-pointer'>
                  <ClearIcon />
                </InputAdornment>
              )
              : (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ))}
            placeholder='Search by name'
            value={searchByName}
            onChange={handleChangeSearchByName}
          />
        </FormControl>
        <FormControl className='max-w-44 w-full' size='small'>
          <InputLabel id="demo-simple-select-label">Filter by Location</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Filter by Location"
            value={currentLocation}
            onChange={handleChangeLocation}>

            <MenuItem value={''}>All</MenuItem>
            {locations.map((location) => (
              <MenuItem value={location.id} key={location.id}>{location.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className='max-w-44 w-full' size='small'>
          <InputLabel id="demo-simple-select-label">Filter by Quarter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Filter by Quarter"
            value={currentQuarter}
            onChange={handleChangeQuarter}
          >
            <MenuItem value={''}>All</MenuItem>
            {QUARTER_OPTIONS.map((quarter) => (
              <MenuItem value={quarter} key={quarter}>{quarter}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className='max-w-44 w-full' size='small'>
          <InputLabel id="demo-simple-select-label">Filter by Auditor</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Filter by Auditor"
            value={currentAuditor}
            onChange={handleChangeAuditor}
          >
            <MenuItem value={''}>All</MenuItem>
            {auditors.map((auditor) => (
              <MenuItem value={auditor.id} key={auditor.id}>{auditor.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Link to={'/new'} style={{ marginLeft: 'auto' }}>
          <Button variant="contained">New Audit</Button>
        </Link>
      </Grid2>

      {
        filteredAudits.length > 0
          ? (
            <ul className='flex flex-col gap-y-5 mb-16 mt-5'>
              {filteredAudits.map((audit) => <BannerCard key={audit.packageId} audit={audit} refreshAudits={refreshAudits} />)}
            </ul>
          )
          : (
            <div className='flex flex-col w-full justify-center items-center gap-y-3'>
              <span className='text-lg'>No matching audits at this time</span>
              <Button variant="outlined" onClick={resetFilters}>Reset filters</Button>
            </div>
          )
      }

    </div>
  )
}
