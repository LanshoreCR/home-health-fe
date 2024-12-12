import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { useSession } from './shared/hooks/useSession'
import apiMaster from './shared/services/api/api-master'
import { setUser } from './shared/redux/slices/user'
import { getUserInfo } from './shared/services/api/endpoints/user-info'

const RootPage = () => {
  const dispatch = useDispatch()
  const { token } = useSession()

  useEffect(() => {
    if (token != null) {
      apiMaster.setToken(token.accessToken)
      getUserInfo().then(value => {
        dispatch(setUser(value))
      })
    }
  }, [dispatch, token])

  return (
    <Routes>
      <Route path='/' exact={true} element={<span>banners</span>} />
    </Routes>
  )
}

export default RootPage