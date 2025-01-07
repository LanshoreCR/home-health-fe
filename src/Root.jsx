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

const RootPage = () => {
  const dispatch = useDispatch()
  // const { token } = useSession()
  const token = 'eyJraWQiOiJhOVQ0dHJhNE56OWZTOElvaTJTSG96bTVrRXNfd2JGajdmVkRmclgxM2dNIiwidHlwIjoiYXBwbGljYXRpb25cL29rdGEtaW50ZXJuYWwtYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkFHOTl5NkRoR25fUVZZellScHI2TEo2X2l0QnIzaTdlVHBrZUxtX1dZLXcub2FyMXFnaGY3emxsM01pRGIweDciLCJpc3MiOiJodHRwczovL3Jlc2NhcmUub2t0YS5jb20iLCJhdWQiOiJodHRwczovL3Jlc2NhcmUub2t0YS5jb20iLCJzdWIiOiIwNzczNDcwQHJlc2NhcmUuY29tIiwiaWF0IjoxNzM2Mjc3MDczLCJleHAiOjE3MzYyODA2NzMsImNpZCI6IjBvYXZwc3lrNGczOXZUR242MHg3IiwidWlkIjoiMDB1MTV3YmNhZXJscG82VXIweDgiLCJzY3AiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYXV0aF90aW1lIjoxNzM2Mjc3MDcxfQ.VdUp60hAKVgP2YQGyL9aTQ5-5xJfnIo6avgHxTERZzMDAYm6fYWaBkfci9NkGOuYsVMGZ3F_69Qz55eagY0-O9vh2NJGIcdc69CHd7sIT4nlLiDyM0swAWxP4sYAXbkS7BnhOCtJhA2PywRQkjgTIvPSIDLVjPDWDMqCMkQU3o_1cSpmRJo4iCD7Hz5C2lrm65RyxmNpNmB_i56nM4TwV1xaLSVDWtpBWycVD-uUxZbb1H0jN34UyJIYU9bzA4-L1LcR9U7-Y36r0f1SCg5C4vO46MBYv42tgalyfiTc0esTBvQ7uTDbVChWc35WT6uBHMiODvfILrqtXNhYDOTJHw'

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
      <Route path='/:id/tools' element={<BannerToolsPage />} />
      <Route path='/:id' element={<CreateBannerPage />} />

    </Routes>
  )
}

export default RootPage