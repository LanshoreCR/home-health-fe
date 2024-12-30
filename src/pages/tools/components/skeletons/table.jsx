import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import SkeletonTableRow from './table-row'

export default function SkeletonTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Percent&nbsp;(%)</TableCell>
            <TableCell>Assigned</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array(5).fill().map((row, index) => <SkeletonTableRow key={index} />)}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
