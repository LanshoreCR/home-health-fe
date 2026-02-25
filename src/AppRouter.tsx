import RootPage from './Root'
import { useSession } from '@shared/hooks/useSession'

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true'

const AppRouter = () => {
  const { isAuthenticated } = useSession()

  if (!SKIP_AUTH && !isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <p className='text-muted-foreground text-sm'>Loading...</p>
      </div>
    )
  }

  return <RootPage />
}

export default AppRouter
