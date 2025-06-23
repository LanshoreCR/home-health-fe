import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { useSession } from './shared/hooks/useSession'
import apiMaster from './shared/services/api/api-master'
import { setUser } from './shared/redux/slices/user'
import { getUserInfo } from './shared/services/api/endpoints/user-info'
import BannersPage from './pages/banners/page'
import CreateBannerPage from './pages/banners/create-banner/page'
import BannerToolsPage from './pages/tools/page'
import CreateToolPage from './pages/tools/create-tool/page'
import QuestionsPage from './pages/questions/page'
import AttachmentsPage from './pages/attachments/page'
import MaintenancePage from './pages/maintenance/page'
import useRole from './shared/hooks/useRole'

const RootPage = () => {
  const dispatch = useDispatch()
  const { token } = useSession()
  const userState = useSelector(state=>state.user)
  // const token = 'eyJraWQiOiJhOVQ0dHJhNE56OWZTOElvaTJTSG96bTVrRXNfd2JGajdmVkRmclgxM2dNIiwidHlwIjoiYXBwbGljYXRpb25cL29rdGEtaW50ZXJuYWwtYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnBidHd6UGk5WmFPcmZ2endOT1JROVJ5SzNXNGVnX3dpZVFZQUVzV25vMzgub2FyMXFoeHdoekt5TEtNeWoweDciLCJpc3MiOiJodHRwczovL3Jlc2NhcmUub2t0YS5jb20iLCJhdWQiOiJodHRwczovL3Jlc2NhcmUub2t0YS5jb20iLCJzdWIiOiIwNzczNDcwQHJlc2NhcmUuY29tIiwiaWF0IjoxNzM2MzU1MzkxLCJleHAiOjE3MzYzNTg5OTEsImNpZCI6IjBvYXZwc3lrNGczOXZUR242MHg3IiwidWlkIjoiMDB1MTV3YmNhZXJscG82VXIweDgiLCJzY3AiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYXV0aF90aW1lIjoxNzM2MzU1MzkwfQ.IBYD4QjZ4ViWRKmd73rKx3auwclKvTdCdKKRxNO1Al-f8ZAgUKbn_MdhBbdMsdQTlZi65zp_q_UyEcA6D8U1jpW7SN4H-8QuKS2ccIhnS_QWwxnWfm00BboPb9GFPe2c4zu8GnRqTgA7uQJxLXBT8upQavDrL4d6oPAUg6PoANDmQdmM41jS9NsK8bAAPEZe-gb-2DFlQzKCMXrPEc9YZB6jMWuKy9sTlA6yJeT7UVCb5TYfGz6RAYPX2E9viaICypy20gaxuYYbIFv3HqcnXcQRyT0LbgNGPzHY2hBclB7elsNtadQ_XXFneUHG4IKtyXT9U_elytsiZNyW4-WjVA'
  const {  isAuditor } = useRole()

  useEffect(() => {
    if (token != null) {
      apiMaster.setToken(token.accessToken)
      // apiMaster.setToken(token)

      getUserInfo().then(value => {
        dispatch(setUser(value))
      })
    }
  }, [dispatch, token])

  if(userState.employeeId === '') return null
 
  return (
    <Routes>
      <Route path='/' exact={true} element={<BannersPage />} />
      {!isAuditor && <Route path='/maintenance' exact={true} element={<MaintenancePage />} />}
      <Route path='/:id' element={<CreateBannerPage />} />
      <Route path='/:id/tools' element={<BannerToolsPage />} />
      <Route path='/:id/:auditTeamId/tools/:idTool' element={<CreateToolPage />} />
      <Route path='/:id/tools/:idTool/questions' element={<QuestionsPage />} />
      <Route path='/:id/attachments' element={<AttachmentsPage />} />

    </Routes>
  )
}

export default RootPage