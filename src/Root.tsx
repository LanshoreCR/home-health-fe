import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSession } from '@shared/hooks/useSession'
import { setToken } from '@shared/services/api/api-master'
import { useAppDispatch, useAppSelector } from '@shared/redux/hooks'
import { setUser } from '@shared/redux/slices/user'
import { getUserInfo } from '@shared/services/api/endpoints/user-info'
import AuditsPage from '@/pages/audits/page'
import AuditToolsPage from '@/pages/audit-tools/page'
import AuditQuestionsPage from '@/pages/audit-questions/page'
import MaintenancePage from '@/pages/maintenance/page'
import useRole from '@shared/hooks/useRole'
import type { UserState } from '@shared/types/user'

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true'

// Local runs without Okta: the backend's dev identity uses the same employee id and role.
const DEV_USER = {
  employeeId: import.meta.env.VITE_DEV_EMPLOYEE_ID ?? 'local-dev',
  role: [import.meta.env.VITE_DEV_ROLE ?? 'Admin']
}

const RootPage = () => {
  const dispatch = useAppDispatch()
  const { token } = useSession()
  const userState = useAppSelector((state) => state.user)
  const { isAdmin } = useRole()

  useEffect(() => {
    if (SKIP_AUTH) dispatch(setUser(DEV_USER))
  }, [dispatch])

  useEffect(() => {
    if (!SKIP_AUTH && token != null && token.accessToken != null) {
      setToken(token.accessToken)
      void getUserInfo().then((value: UserState) => {
        dispatch(setUser(value))
      })
    }
  }, [SKIP_AUTH, dispatch, token])

  if (userState.employeeId === '') return null

  return (
    <Routes>
      <Route path='/' element={<AuditsPage />} />
      <Route path='/audit/:id' element={<AuditToolsPage />} />
      <Route path='/audit/:id/tool/:toolId' element={<AuditQuestionsPage />} />
      <Route path='/maintenance' element={isAdmin ? <MaintenancePage /> : <Navigate to='/' replace />} />
    </Routes>
  )
}

export default RootPage
