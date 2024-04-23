import { useQuery } from 'react-query'

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

const useGetWatchlist = (token: string) => {
  return useQuery<Watchlist[], Error>(
    'watchlist',
    () => fetchWatchlist(token),
    {
      refetchInterval: 5000,
      enabled: !!token,
    }
  )
}

export default useGetWatchlist
