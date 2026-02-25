import { Security } from '@okta/okta-react'
import { useNavigate } from 'react-router-dom'
import OktaAuth, { toRelativeUrl } from '@okta/okta-auth-js'

const clientId = import.meta.env.VITE_OKTA_CLIENT_ID ?? ''
const issuer = import.meta.env.VITE_OKTA_ISSUER ?? ''
const oktaCallback = import.meta.env.VITE_OKTA_CALLBACK ?? ''
const redirectUri = `${window.location.origin}${oktaCallback}`
const oktaAuth = new OktaAuth({
  issuer,
  clientId,
  redirectUri,
  scopes: ['openid', 'profile', 'email', 'offline_access']
})

interface OktaProviderProps {
  children: React.ReactNode
}

const OktaProvider = ({ children }: OktaProviderProps) => {
  const navigate = useNavigate()

  const restoreOriginalUri = (_oktaAuth: OktaAuth, originalUri: string | undefined) => {
    navigate(toRelativeUrl(originalUri ?? '/', window.location.origin))
  }

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      {children}
    </Security>
  )
}

export default OktaProvider
