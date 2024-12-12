import { Security } from '@okta/okta-react'
import { useNavigate } from 'react-router-dom'
import OktaAuth, { toRelativeUrl } from '@okta/okta-auth-js'

const clientId = import.meta.env.VITE_OKTA_CLIENT_ID || ''
const issuer = import.meta.env.VITE_OKTA_ISSUER || ''
const oktaCallback = import.meta.env.VITE_OKTA_CALLBACK
const redirectUri = `${window.location.origin}${oktaCallback}`
const oktaAuth = new OktaAuth({
    issuer: "https://rescare.oktapreview.com",
    // issuer: "https://rescare.okta.com",
    // clientId,
    clientId: '0oavpsyk4g39vTGn60x7',
    
    redirectUri,
    // redirectUri: "https://google.com",
    scopes: ['openid', 'profile', 'email'],
    state: "gdgdgbgjggfvjfhdbvfjghbvfjhb",
    codeChallenge: "Zv3YDZa8yBYp9ZrgRKKHTO0ILh6S1cDGvkwGUiOpJ34",
    
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