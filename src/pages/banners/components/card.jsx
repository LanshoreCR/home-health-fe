import { useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import DateRangeIcon from '@mui/icons-material/DateRange'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PercentIcon from '@mui/icons-material/Percent'
import PersonIcon from '@mui/icons-material/Person'
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined'
import { Link, useNavigate } from 'react-router-dom'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { Divider, FormControl, Grid2, InputLabel, Select, Typography } from '@mui/material'
import { changeAuditStatus, deleteAudit } from '../../../shared/services/api/endpoints/audit'
import { toast } from 'sonner'
import useModal from '../../../shared/hooks/useModal'
import ManageTeamModal from './manage-team-modal'
import SendNotificationModal from './send-notifications-modal'
import { getReportUrl } from '../../../shared/utils/powerbi-report'

const CAPA_FLAG = {
  ACTIVE: 1,
  INACTIVE: 0
}

const STATUS = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  COMPLETED: 'Approved'
}

const STATUS_COLORS = {
  'Pending': 'yellow',
  'Under Review': 'purple',
  'Approved': 'green',
  'Ready to Review': 'blue',
  'Rejected': 'red'
}
const STATUS_LABEL_COLORS = {
  'Pending': 'orange',
  'Under Review': 'white',
  'Approved': 'white',
  'Ready to Review': 'white',
  'Rejected': 'white'
}

export default function BannerCard({ audit, refreshAudits }) {
  const {
    packageName, packageStatus, packageStartDate, quarter,
    packageScore, teamLead, teamLeadId, packageId, auditTeamId,
    capaFlag, sectionDesc, businessLineName, isTeam, createdOn
  } = audit


  const auditTeamLead = {
    employeeId: teamLeadId,
    name: teamLead
  }

  const { isOpen: isManageTeamOpen, openModal: openManageTeamModal, closeModal: closeManageTeamModal } = useModal()
  const { isOpen: isSendNotificationsOpen, openModal: openSendNotificationsModal, closeModal: closeSendNotificationsModal } = useModal()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const navigate = useNavigate()

  const handleOpenOptions = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const goToAttachments = () => {
    const url = `/${packageId}/attachments`
    navigate(url, { replace: true })
  }

  const handleChangeStatus = async (event) => {
    const newStatus = event.target.value
    const score = packageScore.replace('%', '')
    const response = await changeAuditStatus({ id: packageId, status: parseInt(newStatus), score })
    if (response instanceof Error) {
      toast.error('error while changing audit status')
      return
    }
    toast.success('audit status changed successfully')
    refreshAudits()
  }

  const handleDeleteAudit = async () => {
    const response = await deleteAudit({ packageId })
    if (response instanceof Error) {
      toast.error('error while deleting audit')
      return
    }
    toast.success('audit deleted successfully')
    refreshAudits()
  }

  const handleOpenReport = () => {
    const url = getReportUrl(packageId)
    window.open(url, '_blank')
    handleClose()
  }

  return (
    <Card className='p-4 hover:bg-blue-50'>
      <header className='flex w-full justify-between '>
        <div className='flex gap-x-3 items-center'>
          <h3 className='text-lg font-bold'>{packageName}</h3>
          {/* <Chip label={packageStatus} /> */}
        </div>
        <div className='flex gap-x-3 items-center justify-end'>
          <FormControl size='small' className='w-40'>
            <InputLabel id="demo-simple-select-label">Change Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Change Status"
              onChange={handleChangeStatus}
              disabled={packageStatus !== STATUS.UNDER_REVIEW}
            >
              <MenuItem value={''}></MenuItem>
              <MenuItem value={'4'}>Approve</MenuItem>
              <MenuItem value={'1'}>Reject</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={goToAttachments}>
            <AttachFileIcon />
          </IconButton>
          <IconButton aria-label="more-options" onClick={handleOpenOptions}>
            <MoreVertIcon />
          </IconButton>
        </div>
      </header>
      <Grid2 container mt={1} direction='column' spacing={2}>
         
          <Grid2 container direction='row' spacing={1} mt={1} alignItems='center'>
            <Typography>
              {sectionDesc}
            </Typography>
            <Divider orientation='vertical' flexItem />
            <Typography>
              {businessLineName}
            </Typography>
            <Divider orientation='vertical' flexItem />
            <Typography>
              {isTeam}
            </Typography>
            <Divider orientation='vertical' flexItem />
            <Typography>
              {createdOn.split('T')[0]}
            </Typography>
            <Divider orientation='vertical' flexItem />
            <Chip label={packageStatus}
              sx={{
                backgroundColor: STATUS_COLORS[packageStatus],
                fontWeight: 'bold',
                color: STATUS_LABEL_COLORS[packageStatus],
              }}
              size='small'
            />

          </Grid2>
          {/* <Divider flexItem /> */}

        </Grid2>
      <footer className='w-full mt-3 flex justify-between items-center'>
        <article className='gap-x-3 flex'>
          <div className='flex items-center'>
            <DateRangeIcon className='text-primary/80' />
            <span>{packageStartDate.split('T')[0]}</span>
          </div>
          <div className='flex items-center'>
            <PieChartOutlineOutlinedIcon className='text-primary/80' />
            <span>{quarter}</span>
          </div>
          <div className='flex items-center'>
            <PercentIcon className='text-primary/80' />
            <span>{packageScore}</span>
          </div>
          <div className='flex items-center'>
            <PersonIcon className='text-primary/80' />
            <span>{teamLead}</span>
          </div>
        </article>
        <footer className='flex gap-x-3 items-center justify-end'>
          {/* {capaFlag === CAPA_FLAG.ACTIVE && (
            <Link to={`/${packageId}/capa`}>
              <Button variant="text">View CAPA</Button>
            </Link>
          )} */}
          <Link to={`/${packageId}/tools/new`}>
            <Button variant="text">Create Tools</Button>
          </Link>
          <Link to={`/${packageId}/tools`}>
            <Button variant="text">View Tools</Button>
          </Link>
        </footer>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}>
          <MenuItem onClick={handleOpenReport}>Check report</MenuItem>
          {
            packageStatus !== STATUS.COMPLETED && (
              <>
                <MenuItem onClick={() => {
                  openSendNotificationsModal()
                  handleClose()
                }}>Send Notifications</MenuItem>
                <MenuItem onClick={() => {
                  openManageTeamModal()
                  handleClose()
                }}>Manage team</MenuItem>
              </>
            )
          }
          <MenuItem onClick={() => {
            handleDeleteAudit()
            handleClose()
          }}>Delete</MenuItem>
        </Menu>
      </footer>
      <ManageTeamModal
        refreshAudits={refreshAudits}
        auditTeamLead={auditTeamLead}
        auditTeamId={auditTeamId}
        isOpen={isManageTeamOpen}
        onClose={closeManageTeamModal}
      />
      <SendNotificationModal
        isOpen={isSendNotificationsOpen}
        onClose={closeSendNotificationsModal}
        packageId={packageId}
      />
    </Card>
  )
}
