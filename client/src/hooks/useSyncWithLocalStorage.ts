import { useEffect, useState } from 'react'

// usage
// const [value, setValue] = useSyncWithLocalStorage('key', initialValue)
// example
// const [name, setName] = useSyncWithLocalStorage('name', 'John Doe')
export const useSyncWithLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(initialValue)
  const windowAvailable = typeof window !== 'undefined'
  //   get local storage value and set it to state when window is available
  useEffect(() => {
    if (windowAvailable) {
      const storedValue = window.localStorage.getItem(key)
      if (storedValue) {
        setValue(JSON.parse(storedValue))
      }
    }
  }, [key, windowAvailable])

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    if (windowAvailable) {
      window.localStorage.setItem(key, JSON.stringify(newValue))
    }
  }

  return [value, setStoredValue]
}
