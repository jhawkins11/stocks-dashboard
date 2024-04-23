import { useState, useEffect } from 'react'

const useToken = () => {
  const [token, setToken] = useState('')

  useEffect(() => {
    // Check if a token already exists in localStorage
    const storedToken = localStorage.getItem('token')

    if (storedToken) {
      setToken(storedToken)
    } else {
      // Generate a new unique token
      const newToken = generateUniqueToken()
      localStorage.setItem('token', newToken)
      setToken(newToken)
    }
  }, [])

  const generateUniqueToken = () => {
    // Generate a unique token using a combination of timestamp and random number
    const timestamp = Date.now().toString(36)
    const randomNum = Math.random().toString(36).substring(2, 7)
    return `${timestamp}-${randomNum}`
  }

  return token
}

export default useToken
