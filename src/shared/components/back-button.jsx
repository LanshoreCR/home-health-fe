import { IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useLocation, useNavigate } from 'react-router-dom'

const GO_TO = {
  DEFAULT: '/',
  TOOLS: '/tools',
  TOOLS_NEW: '/tools/new',
  CAPA: '/capa',
  NEW_AUDIT: '/new',
  MAINTENANCE: '/maintenance',
  ATTACHMENTS: '/attachments',
  CAMERA: '/camera'
}

export default function BackButton() {
  const location = useLocation()
  const navigate = useNavigate()

  const goBack = () => {
    const pathName = location.pathname
    if (pathName.includes(GO_TO.TOOLS_NEW)) {
      const pathValues = pathName.split('/');
      const url = `/${pathValues[1]}${GO_TO.TOOLS}`
      navigate(url)
      return
    }
    if (pathName.includes(GO_TO.CAMERA)) {
      const url = pathName.replace(GO_TO.CAMERA, GO_TO.ATTACHMENTS)
      navigate(url, { replace: true })
      return
    }
    navigate(GO_TO.DEFAULT, { replace: true })
  }
  return (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
      onClick={goBack}
    >
      <ArrowBackIcon />
    </IconButton>
  )
}
