import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import ToolsTableRow from './table-row'

export default function ToolsTable({ tools, addToSelectedTools, removeFromSelectedTools, selectedTools, refreshTools, currentAudit, handleSelectAll }) {
  const selectableTools = tools.filter(tool => 
    tool.allQuestionsAnswered === 1 && 
    (tool.templateStatus === 'Pending' || tool.templateStatus === 'Under Review')
  )
  const isAllSelected = selectableTools.length > 0 && selectedTools.length === selectableTools.length
  const isIndeterminate = selectedTools.length > 0 && selectedTools.length < selectableTools.length

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        maxHeight: '70vh',
        '& .MuiTableHead-root': {
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: 'background.paper'
        }
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" sx={{ width: '48px' }}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
                disabled={selectableTools.length === 0}
              />
            </TableCell>
            <TableCell sx={{ minWidth: '200px' }}>Name</TableCell>
            <TableCell align='center' sx={{ minWidth: '120px' }}>Client</TableCell>
            <TableCell align="center" sx={{ minWidth: '100px' }}>Status</TableCell>
            <TableCell align="center" sx={{ minWidth: '80px' }}>Percent&nbsp;(%)</TableCell>
            <TableCell align="center" sx={{ minWidth: '150px' }}>Location</TableCell>
            <TableCell align="center" sx={{ minWidth: '120px' }}>Assigned</TableCell>
            <TableCell align="center" sx={{ width: '120px', whiteSpace: 'nowrap' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tools.map((tool, index) =>
            <ToolsTableRow
              key={index}
              tool={tool}
              addToSelectedTools={addToSelectedTools}
              removeFromSelectedTools={removeFromSelectedTools}
              selectedTools={selectedTools}
              refreshTools={refreshTools} 
              currentAudit={currentAudit}/>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
