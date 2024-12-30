import { TableCell, TableRow, Skeleton } from '@mui/material'

export default function SkeletonTableRow() {
  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row" align="left">
        <Skeleton variant="text" width={70} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={70} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={70} />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" width={70} />
      </TableCell>
      <TableCell className='flex'>
        <div className='flex w-full gap-x-2 items-end'>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
        </div>
      </TableCell>
    </TableRow>
  )
}
