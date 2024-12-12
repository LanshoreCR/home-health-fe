import { FormControl, InputAdornment, OutlinedInput } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export default function SearchAudit() {
  return (
    <FormControl variant="outlined" label='Search by name' size='small'>
      <OutlinedInput
        id="outlined-adornment-weight"
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        placeholder='Search by name'
      />
    </FormControl>
  )
}
