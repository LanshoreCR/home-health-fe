import { useEffect, useRef } from 'react'

const useGoBack = () => {
  const backLocationRef = useRef(null)

  useEffect(() => {
    // Save the current location when the component mounts
    backLocationRef.current = window.location.href
  }, [])

  const navigateBack = () => {
    window.history.back()
  }

  return navigateBack
}

export default useGoBack
