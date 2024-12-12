import { toRelativeUrl } from '@okta/okta-auth-js'
import { useOktaAuth } from '@okta/okta-react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setToken } from '../redux/slices/auth'

export const useSession = () => {
  const { oktaAuth, authState } = useOktaAuth()
  const dispatch = useDispatch()

  useEffect(() => {
    if (authState != null && !authState.isAuthenticated) {
      const originalUri = toRelativeUrl(window.location.href, window.location.origin)
      oktaAuth.setOriginalUri(originalUri)
      oktaAuth.signInWithRedirect()
    }
  }, [oktaAuth, authState])

  useEffect(() => {
    if (authState != null && authState.isAuthenticated) {
      const token = authState.accessToken.accessToken
      dispatch(setToken(token))
    }
  }, [authState, dispatch])

  if (authState == null) {
    return {
      token: null,
      isAuthenticated: false
    }
  }

  return {
    token: authState.accessToken,
    isAuthenticated: authState.isAuthenticated
  }
}
