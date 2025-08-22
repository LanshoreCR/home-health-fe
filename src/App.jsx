import AppRouter from './AppRouter'
import OktaProvider from './shared/components/providers/okta-provider'
import Navbar from './shared/components/navbar'
import { Route, Routes } from 'react-router-dom'
import { LoginCallback } from '@okta/okta-react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import QualityAuditThemeProvider from './shared/components/providers/theme-provider'
import { Toaster } from 'sonner'
import { Grid2 } from '@mui/material'

function App() {

  return (
    <OktaProvider>
      <QualityAuditThemeProvider>
        <Grid2 container flexDirection={'column'} alignItems={'center'} height={'100%'}>
          <Navbar />
          <Grid2
            className='max-w-7xl px-5 w-full'
            mt={3}
            flex={1}
            minHeight={0}  >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Routes>
                <Route path='/login/callback' element={<LoginCallback />} />
                <Route path='/*' exact element={<AppRouter />} />
              </Routes>
            </LocalizationProvider>
          </Grid2>
        </Grid2>
        <Toaster position="top-center" richColors />
      </QualityAuditThemeProvider>
    </OktaProvider>
  )
}

export default App
