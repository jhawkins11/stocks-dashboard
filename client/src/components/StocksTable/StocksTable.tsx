import { cn } from '@/lib/utils'
import StockData from '@/types/StockData'
import StockDataMap from '@/types/StockDataMap'
import { Card } from '../ui/card'
import { TableHeader, TableRow, TableBody, Table } from '../ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import useToken from '@/hooks/useToken'
import { PlusCircle } from 'lucide-react'
import useGetWatchlist from '@/hooks/api/useGetWatchlist'
import { useAddToWatchlist } from '@/hooks/api/useAddToWatchlist'
import { useDeleteFromWatchlist } from '@/hooks/api/useDeleteFromWatchlist'

const StocksTable = ({ stockData }: { stockData: StockDataMap }) => {
  const token = useToken()
  const getPercentageChange = (stockHistory: StockData[]) => {
    const price = stockHistory.slice(-1)[0]?.price || 0
    const previousPrice = stockHistory.slice(-2)[0]?.price || 0
    return (((price - previousPrice) / previousPrice) * 100).toFixed(2)
  }
  const { data: watchlist } = useGetWatchlist(token)
  const { mutate: addToWatchlist } = useAddToWatchlist()
  const { mutate: deleteFromWatchlist } = useDeleteFromWatchlist()

  const handleAddToWatchlist = (symbol: string, token: string) => {
    addToWatchlist({ symbol, token })
  }
  const handleDeleteFromWatchlist = (symbol: string, token: string) => {
    deleteFromWatchlist({ symbol, token })
  }

  if (!Object.keys(stockData).length) return <Skeleton className='h-96' />
  return (
    <Card className='p-4'>
      <Table className='w-full text-sm text-foreground'>
        <TableHeader>
          <TableRow className='h-10 uppercase text-xs'>
            <th className='text-left font-medium'>Watch</th>
            <th className='text-left font-medium'>Symbol</th>
            <th className='text-center font-medium'>Price</th>
            <th className='text-center font-medium'>+/-</th>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(stockData).map(([symbol, stockHistory]) => (
            <TableRow
              key={symbol}
              className='hover:bg-muted/50 transition-colors font-light text-sm h-10'
            >
              <td className='text-left'>
                {watchlist?.find((w) => w.stock_symbol === symbol) ? (
                  <button
                    onClick={() => handleDeleteFromWatchlist(symbol, token)}
                  >
                    <PlusCircle className='text-primary' size={20} />
                  </button>
                ) : (
                  <button onClick={() => handleAddToWatchlist(symbol, token)}>
                    <PlusCircle className='text-foreground' size={20} />
                  </button>
                )}
              </td>
              <td>{symbol}</td>
              <td className='text-center'>
                {stockData[symbol].slice(-1)[0]?.price.toFixed(2) || '-'}
              </td>
              <td
                className={cn(
                  'text-center',
                  Number(getPercentageChange(stockHistory)) > 0
                    ? 'text-primary'
                    : 'text-destructive'
                )}
              >
                {Number(getPercentageChange(stockHistory)) > 0 ? '+' : ''}
                {getPercentageChange(stockHistory)}%
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export default StocksTable
