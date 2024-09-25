import { useError } from '@/lib/ErrorContext'
import { useQuery } from 'react-query'
import { useSyncWithLocalStorage } from '@/hooks/useSyncWithLocalStorage'

interface Watchlist {
  id: string
  stock_symbol: string
  token: string
}

const fetchWatchlist = async (token: string): Promise<Watchlist[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/watchlist?token=${token}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch watchlist')
  }
  return response.json()
}

const fetchWatchlistFromLocalStorage = (): Watchlist[] => {
  const storedWatchlist = localStorage.getItem('watchlist')
  return storedWatchlist ? JSON.parse(storedWatchlist) : []
}

const useGetWatchlist = (token: string) => {
  const { setError } = useError()

  const isProduction = process.env.NODE_ENV === 'production'

  return useQuery<Watchlist[], Error>(
    'watchlist',
    () => {
      if (isProduction) {
        return Promise.resolve(fetchWatchlistFromLocalStorage())
      }
      return fetchWatchlist(token)
    },
    {
      refetchInterval: isProduction ? false : 5000,
      enabled: !!token,
      onError: (error) => {
        setError(error)
      },
    }
  )
}

export default useGetWatchlist
