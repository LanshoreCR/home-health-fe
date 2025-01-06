import AppRouter from './AppRouter'
// import OktaProvider from './shared/components/providers/okta-provider'
import Navbar from './shared/components/navbar'
import { Route, Routes } from 'react-router-dom'
import { LoginCallback } from '@okta/okta-react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import QualityAuditThemeProvider from './shared/components/providers/theme-provider'

function App() {

  // <OktaProvider>
  {/* </OktaProvider> */ }
  return (
    <QualityAuditThemeProvider>
      <div className='w-full h-full'>
        <header>
          <Navbar />
        </header>
        <main className='max-w-7xl px-5 mx-auto h-full '>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <section className='h-full w-full mt-5'>
              <Routes>
                <Route path='/login/callback' element={<LoginCallback />} />
                <Route path='/*' exact element={<AppRouter />} />
              </Routes>
            </section>
          </LocalizationProvider>
        </main>
      </div>
    </QualityAuditThemeProvider>
  )
}

export default App
