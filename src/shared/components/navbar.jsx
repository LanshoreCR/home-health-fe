import React from 'react'
import { Link, useLocation, useNavigate, } from 'react-router-dom'
import { useOktaAuth } from '@okta/okta-react'
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
import BackButton from './back-button'
import useRole from '../hooks/useRole'
const Navbar = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const { oktaAuth } = useOktaAuth()
    const { isAdmin } = useRole()

    const handleLogout = async () => {
        await oktaAuth.signOut()
    }

    const goToMaintenance = () => {
        navigate('/maintenance')
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {location.pathname !== '/' && (
                        <BackButton />
                    )}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to='/'>
                            Quality Audit
                        </Link>
                    </Typography>
                    <div className='flex gap-x-5'>
                        {isAdmin && (
                           <Button variant='text' color='inherit' onClick={goToMaintenance}>Maintenance</Button>
                        )}
                        <Button variant='text' color='inherit' onClick={handleLogout}>Logout</Button>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar