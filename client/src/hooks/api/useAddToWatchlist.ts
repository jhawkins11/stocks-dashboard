import { useMutation, useQueryClient } from 'react-query'

const addToWatchlist = async (data: { symbol: string; token: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/watchlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to add to watchlist')
  }
}

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient()
  return useMutation(addToWatchlist, {
    onSuccess: () => {
      queryClient.invalidateQueries('watchlist')
    },
  })
}
