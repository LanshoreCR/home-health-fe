import React from 'react'
import RootPage from './Root'
// import { useSession } from './shared/hooks/useSession'

const AppRouter = () => {
    // const { isAuthenticated } = useSession()

    // if (!isAuthenticated) {
    //     return (<>Loading...</>)
    // }
    return (
        <RootPage />
    )
}

export default AppRouter