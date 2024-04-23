import React, { createContext, useState } from 'react'

interface ErrorContextValue {
  error: Error | null
  setError: (error: Error | null) => void
}

export const ErrorContext = createContext<ErrorContextValue | undefined>(
  undefined
)

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [error, setError] = useState<Error | null>(null)

  const handleError = (error: Error | null) => {
    setError(error)
  }

  return (
    <ErrorContext.Provider value={{ error, setError: handleError }}>
      {children}
    </ErrorContext.Provider>
  )
}

export const useError = () => {
  const context = React.useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useError must be used within a ErrorProvider')
  }
  return context
}

export default ErrorContext
