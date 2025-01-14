import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
// import { useSession } from './shared/hooks/useSession'
import apiMaster from './shared/services/api/api-master'
import { setUser } from './shared/redux/slices/user'
import { getUserInfo } from './shared/services/api/endpoints/user-info'
import BannersPage from './pages/banners/page'
import CreateBannerPage from './pages/banners/create-banner/page'
import BannerToolsPage from './pages/tools/page'
import CreateToolPage from './pages/tools/create-tool/page'
import QuestionsPage from './pages/questions/page'
import AttachmentsPage from './pages/attachments/page'

const RootPage = () => {
  const dispatch = useDispatch()
  // const { token } = useSession()
  const token = 'eyJraWQiOiJhOVQ0dHJhNE56OWZTOElvaTJTSG96bTVrRXNfd2JGajdmVkRmclgxM2dNIiwidHlwIjoiYXBwbGljYXRpb25cL29rdGEtaW50ZXJuYWwtYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULk5qaUc3SVpad2luV1FvVlpiWEdTbUYyb0I2Q000eXg3RHZYa1pHcG1uY1Uub2FyMXFvaHQ0NXJxTmVNcUcweDciLCJpc3MiOiJodHRwczovL3Jlc2NhcmUub2t0YS5jb20iLCJhdWQiOiJodHRwczovL3Jlc2NhcmUub2t0YS5jb20iLCJzdWIiOiIwNzczNDcwQHJlc2NhcmUuY29tIiwiaWF0IjoxNzM2ODAxMzgxLCJleHAiOjE3MzY4MDQ5ODEsImNpZCI6IjBvYXZwc3lrNGczOXZUR242MHg3IiwidWlkIjoiMDB1MTV3YmNhZXJscG82VXIweDgiLCJzY3AiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYXV0aF90aW1lIjoxNzM2ODAxMzgwfQ.TDUNNduyz6ELboqxhgUgAH1T_NIgqTC4JL51DI6uj15OnIh7A3eJRC4Bh84D5Q6GhRBIXDENZO8Qw4LXXaW9lvk-PeX4mlsnP6kJuQlImvx3KWu3qABFyKJ3_NK_--kUR2yNDSmaGiouJx8RABTh5B12LG4kGmCDaqRlo9Wcfguyxy-ljLS4snTRJkQlCj0WrYHfxkRCHO3Avl8BDdf5jBKsjoQ6FW20gPYxfzCNfCNNVBLkzu6MFTwpcr_LVMG0nBc2Po-mlCblc-oFhKsflYsewpEqSQVnIpTJkPC5BFxI4G2rRlkUcvulDTyE7zlpvv9kPvxnMTJZLnm7_7FwIA'

  useEffect(() => {
    if (token != null) {
      // apiMaster.setToken(token.accessToken)
      apiMaster.setToken(token)

      getUserInfo().then(value => {
        dispatch(setUser(value))
      })
    }
  }, [dispatch, token])

  return (
    <Routes>
      <Route path='/' exact={true} element={<BannersPage />} />
      <Route path='/:id' element={<CreateBannerPage />} />
      <Route path='/:id/tools' element={<BannerToolsPage />} />
      <Route path='/:id/tools/:idTool' element={<CreateToolPage />} />
      <Route path='/:id/tools/:idTool/questions' element={<QuestionsPage />} />
      <Route path='/:id/attachments' element={<AttachmentsPage />} />

    </Routes>
  )
}

export default RootPage