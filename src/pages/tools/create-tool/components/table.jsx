import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ToolTableRow from './table-row'

export default function ToolTable({ tools, handleRemoveTool }) {
  if (tools.length === 0) {
    return (
      <div className='w-full flex flex-col'>
        <span className='font-bold text-center'>No tools to view</span>
      </div>
    )
  }
  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Tool</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tools.map((tool) => (
          <ToolTableRow item={tool} key={tool.id} handleRemoveTool={handleRemoveTool} />
        ))}
      </TableBody>
    </Table>
  )
}
