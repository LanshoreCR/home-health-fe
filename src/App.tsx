import AppRouter from './AppRouter'
import OktaProvider from '@shared/components/providers/okta-provider'
import { Route, Routes } from 'react-router-dom'
import { LoginCallback } from '@okta/okta-react'
import { Toaster } from 'sonner'

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true'

function App () {
  const content = (
    <div className='flex flex-col items-center min-h-screen'>
      <div className='w-full flex-1 min-h-0'>
        {SKIP_AUTH
          ? <AppRouter />
          : (
            <Routes>
              <Route path='/login/callback' element={<LoginCallback />} />
              <Route path='/*' element={<AppRouter />} />
            </Routes>
            )}
      </div>
      <Toaster position='top-center' richColors />
    </div>
  )

  return SKIP_AUTH ? content : <OktaProvider>{content}</OktaProvider>
}

export default App
