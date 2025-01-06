import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { useOktaAuth } from '@okta/okta-react'
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import useGoBack from '../hooks/useGoBack'

const Navbar = () => {
    const goBack = useGoBack()
    const location = useLocation()
    const navigate = useNavigate()

    // const { oktaAuth } = useOktaAuth()

    const handleLogout = async () => {
        // await oktaAuth.signOut()
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {location.pathname !== '/' && (
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
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to='/'>
                            Quality Audit
                        </Link>
                    </Typography>
                    <div className='flex gap-x-5'>
                        <Button variant='text' color='inherit' onClick={handleLogout}>Logout</Button>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar