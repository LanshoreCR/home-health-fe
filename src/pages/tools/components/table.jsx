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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
                disabled={selectableTools.length === 0}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell align='center'>Client</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Percent&nbsp;(%)</TableCell>
            <TableCell align="center">Location</TableCell>
            <TableCell align="center">Assigned</TableCell>
            <TableCell align="center">Actions</TableCell>
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
