import { toRelativeUrl } from '@okta/okta-auth-js'
import { useOktaAuth } from '@okta/okta-react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setToken } from '../redux/slices/auth'

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true'

export const useSession = () => {
  const oktaContext = SKIP_AUTH ? null : useOktaAuth()
  const oktaAuth = oktaContext?.oktaAuth ?? null
  const authState = oktaContext?.authState ?? null
  const dispatch = useDispatch()

  useEffect(() => {
    if (!SKIP_AUTH && authState != null && !authState.isAuthenticated && oktaAuth != null) {
      const originalUri = toRelativeUrl(window.location.href, window.location.origin)
      oktaAuth.setOriginalUri(originalUri)
      oktaAuth.signInWithRedirect()
    }
  }, [oktaAuth, authState])

  useEffect(() => {
    if (authState != null && authState.isAuthenticated && authState.accessToken != null) {
      const token = authState.accessToken.accessToken
      if (token != null) {
        dispatch(setToken(token))
      }
    }
  }, [authState, dispatch])

  if (SKIP_AUTH) {
    return {
      token: null,
      isAuthenticated: true
    }
  }

  if (authState == null) {
    return {
      token: null,
      isAuthenticated: false
    }
  }

  return {
    token: authState.accessToken ?? null,
    isAuthenticated: authState.isAuthenticated
  }
}
