import React from 'react'
import { Link, useLocation, } from 'react-router-dom'
// import { useOktaAuth } from '@okta/okta-react'
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
import BackButton from './back-button'
const Navbar = () => {
    const location = useLocation()

    // const { oktaAuth } = useOktaAuth()

    const handleLogout = async () => {
        // await oktaAuth.signOut()
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
                        <Button variant='text' color='inherit' onClick={handleLogout}>Logout</Button>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar