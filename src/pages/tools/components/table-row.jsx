import { useState } from 'react'
import { Menu, MenuItem, Checkbox } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import ManageAuditorModal from './manage-auditor-modal'
import useModal from '../../../shared/hooks/useModal'
import { STATUS } from '../../banners/components/card'
import DeleteToolModal from './delete-tool-modal'
import { deleteTool } from '../../../shared/services/api/endpoints/tools'

export default function ToolsTableRow({ tool, refreshTools, currentAudit, addToSelectedTools, removeFromSelectedTools, selectedTools }) {
  const { templateName, templateStatus, templateScore, assignedAuditor, memberId, packageTemplateId, locationName, auditTeamId, customerName, allQuestionsAnswered } = tool
  const location = useLocation()
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { isOpen: isDeleteToolOpen, openModal: openDeleteToolModal, closeModal: closeDeleteToolModal } = useModal()


  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleGoToQuestions = () => {
    const url = `${location.pathname}/${packageTemplateId}/questions`
    navigate(url)
  }

  const handleDeleteTool = async () => {
    try {
      await deleteTool({ packageTemplateId })
      await refreshTools()
    } catch (error) {
      throw new Error(error)
    }
  }

  const { isOpen: isManageAuditorOpen, openModal: openManageAuditorModal, closeModal: closeManageAuditorModal } = useModal()

  const auditor = {
    employeeId: memberId,
    name: assignedAuditor
  }

  const isSelected = selectedTools.some(selectedTool => selectedTool.packageTemplateId === packageTemplateId)
  const isSelectable = allQuestionsAnswered === 1 && (templateStatus === 'Pending' || templateStatus === 'Under Review')

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      addToSelectedTools(tool)
    } else {
      removeFromSelectedTools(tool)
    }
  }

  return (
    <>
      <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={handleCheckboxChange}
            disabled={!isSelectable}
          />
        </TableCell>
        <TableCell component="th" scope="row" align="left">{templateName}</TableCell>
        <TableCell align="center">{customerName}</TableCell>
        <TableCell align="center">{templateStatus}</TableCell>
        <TableCell align="center">{templateScore}</TableCell>
        <TableCell align="center">{locationName}</TableCell>
        <TableCell align="center">{assignedAuditor}</TableCell>
        <TableCell align="center">
          {
            currentAudit.packageStatus === STATUS.COMPLETED
              ? (
                <IconButton aria-label="questions" onClick={handleGoToQuestions}>
                  <VisibilityIcon />
                </IconButton>
              ) : (
                <>
                  <IconButton aria-label="questions" onClick={handleGoToQuestions}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={openDeleteToolModal}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton aria-label="more-options" onClick={handleOpenOptions}>
                    <MoreVertIcon />
                  </IconButton>
                </>
              )
          }
        </TableCell>
        <Menu
          id="tool-options"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}>
          <MenuItem onClick={() => {
            openManageAuditorModal()
            handleClose()
          }}>Manage Auditor</MenuItem>
        </Menu>
      </TableRow>
      <ManageAuditorModal
        auditTeamId={auditTeamId}
        refreshTools={refreshTools}
        initAuditor={auditor}
        packageTemplateId={packageTemplateId}
        open={isManageAuditorOpen}
        onClose={closeManageAuditorModal} />
      <DeleteToolModal
        open={isDeleteToolOpen}
        onClose={closeDeleteToolModal}
        onConfirm={handleDeleteTool}
      />
    </>
  )
}
