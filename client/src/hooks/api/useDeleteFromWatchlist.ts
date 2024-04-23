import { useMutation, useQueryClient } from 'react-query'

const deleteFromWatchlist = async (data: { symbol: string; token: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/watchlist`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to delete from watchlist')
  }
}

export const useDeleteFromWatchlist = () => {
  const queryClient = useQueryClient()
  return useMutation(deleteFromWatchlist, {
    onSuccess: () => {
      queryClient.invalidateQueries('watchlist')
    },
  })
}
