import { DatePicker } from '@mui/x-date-pickers'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { TOOLS_V2 } from '../../../../shared/mocks/tools'

export default function ToolTableRow({ item, handleRemoveTool }) {
  const options = TOOLS_V2
  return (
    <TableRow key={item.id}>
      <TableCell>
        <FormControl required sx={{ minWidth: 300 }}>
          <InputLabel id="demo-simple-select-label">Tool</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Tool"
            className='min-w-32'>
            {
              options.map((option) => (
                <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </TableCell>
      <TableCell >
        <DatePicker sx={{ maxWidth: 200 }} />
      </TableCell>
      <TableCell>
        <IconButton type='button' onClick={() => handleRemoveTool(item.id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
