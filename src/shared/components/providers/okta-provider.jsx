import { Security } from '@okta/okta-react'
import { useNavigate } from 'react-router-dom'
import OktaAuth, { toRelativeUrl } from '@okta/okta-auth-js'

const clientId = import.meta.env.VITE_OKTA_CLIENT_ID || ''
const issuer = import.meta.env.VITE_OKTA_ISSUER || ''
const oktaCallback = import.meta.env.VITE_OKTA_CALLBACK
const redirectUri = `${window.location.origin}${oktaCallback}`
console.log("🚀 ~ redirectUri:", redirectUri)
const oktaAuth = new OktaAuth({
    issuer,
    clientId,
    redirectUri,
    scopes: ['openid', 'profile', 'email', 'offline_access'],
})

const OktaProvider = ({ children }) => {
    const navigate = useNavigate()

    const restoreOriginalUri = (_oktaAuth, originalUri) => {
        navigate(toRelativeUrl(originalUri || '/', window.location.origin))
    }

    return (
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
            {children}
        </Security>
    )
}

export default OktaProvider