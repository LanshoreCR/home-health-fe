import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
// import { useSession } from './shared/hooks/useSession'
import apiMaster from './shared/services/api/api-master'
import { setUser } from './shared/redux/slices/user'
import { getUserInfo } from './shared/services/api/endpoints/user-info'
import BannersPage from './pages/banners/page'
import BannerToolsPage from './pages/tools/page'

const RootPage = () => {
  const dispatch = useDispatch()
  // const { token } = useSession()
  const token = 'eyJraWQiOiJhOVQ0dHJhNE56OWZTOElvaTJTSG96bTVrRXNfd2JGajdmVkRmclgxM2dNIiwidHlwIjoiYXBwbGljYXRpb25cL29rdGEtaW50ZXJuYWwtYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkk5TXhzaTM5c0JSOEtTYm1GRTRwMnpwYnF4djEzcVFULXE4Yk9uVV9GYUEub2FyMXFmNXA3N3RzYzB1c2MweDciLCJpc3MiOiJodHRwczovL3Jlc2NhcmUub2t0YS5jb20iLCJhdWQiOiJodHRwczovL3Jlc2NhcmUub2t0YS5jb20iLCJzdWIiOiIwNzczNDcwQHJlc2NhcmUuY29tIiwiaWF0IjoxNzM2MjAyNjY3LCJleHAiOjE3MzYyMDYyNjcsImNpZCI6IjBvYXZwc3lrNGczOXZUR242MHg3IiwidWlkIjoiMDB1MTV3YmNhZXJscG82VXIweDgiLCJzY3AiOlsib3BlbmlkIiwib2ZmbGluZV9hY2Nlc3MiXSwiYXV0aF90aW1lIjoxNzM2MjAyNjY1fQ.GRKJlF99HLNhaay4W3QUvruivSypjiCiJ07hmeyWUZaGwwfpgjhBmSRtJV1-qtHLlh4Cbnlo-YJjQYwWUKJLdTJ2usyUC62z6_kO6TuzwPJ0jaRYqbJ58XjW23ob7c_oUk1j51JgvYjr-2684V5XEj2bsRX224Spt0fGs8FCVR6GVT_dt__cpp5kX4XdF13mj3j5dw-2YNqaSl51MFoaWCqLVJ2jiz0AZVOnh4ya8CIJ6isGLS31bo9Aob1SoCrHU2_Pp6QDrF4spm_CgFDpifxYVn-3JjXdIkCp32k022gsZv_bXpqXzmArFRYGHlLODKiF6ZRj7Pk5q8NQKfqRfQ'

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

    </Routes>
  )
}

export default RootPage