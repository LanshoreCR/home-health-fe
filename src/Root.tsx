import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSession } from '@shared/hooks/useSession'
import { setToken } from '@shared/services/api/api-master'
import { useAppDispatch, useAppSelector } from '@shared/redux/hooks'
import { setUser } from '@shared/redux/slices/user'
import { getUserInfo } from '@shared/services/api/endpoints/user-info'
import AuditsPage from '@/pages/audits/page'
import AuditToolsPage from '@/pages/audit-tools/page'
import AuditQuestionsPage from '@/pages/audit-questions/page'
import type { UserState } from '@shared/types/user'

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true'

const RootPage = () => {
  const dispatch = useAppDispatch()
  const { token } = useSession()
  const userState = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!SKIP_AUTH && token != null && token.accessToken != null) {
      setToken(token.accessToken)
      void getUserInfo().then((value: UserState) => {
        dispatch(setUser(value))
      })
    }
  }, [SKIP_AUTH, dispatch, token])

  if (!SKIP_AUTH && userState.employeeId === '') return null

  return (
    <Routes>
      <Route path='/' element={<AuditsPage />} />
      <Route path='/audit/:id' element={<AuditToolsPage />} />
      <Route path='/audit/:id/tool/:toolId' element={<AuditQuestionsPage />} />
    </Routes>
  )
}

export default RootPage
