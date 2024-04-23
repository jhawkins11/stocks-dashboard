import { useEffect, useState } from 'react'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import { useError } from '@/lib/ErrorContext'

// error alert component
const ErrorAlert = () => {
  const [open, setOpen] = useState(false)
  const { error } = useError()
  // set to open when error changes for 5 seconds
  useEffect(() => {
    if (error) setOpen(true)
    const timer = setTimeout(() => {
      setOpen(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [error])

  if (!open) return null
  return (
    <Alert className='bg-red-100 border border-red-400 text-red-700 fixed bottom-2 left-1/2 transform -translate-x-1/2 w-96'>
      <AlertTitle className='font-semibold'>Error</AlertTitle>
      <AlertDescription>{error?.message}</AlertDescription>
    </Alert>
  )
}

export { ErrorAlert }
