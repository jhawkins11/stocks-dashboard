'use client'
import React from 'react'
import StockCard from '../StockCard/StockCard'
import StocksTable from '../StocksTable/StocksTable'
import { useStockDataFromWS } from '@/hooks/api/useStockDataFromWS'
import { Skeleton } from '../ui/skeleton'
import { Switch } from '../ui/switch'
import useToken from '@/hooks/useToken'
import useGetWatchlist from '@/hooks/api/useGetWatchlist'
import StockDataMap from '@/types/StockDataMap'
import { useSyncWithLocalStorage } from '@/hooks/useSyncWithLocalStorage'
import { ErrorAlert } from '../ErrorAlert'

const StockDashboard: React.FC = () => {
  const [shouldFilterStocks, setShouldFilterStocks] = useSyncWithLocalStorage(
    'shouldFilterStocks',
    false
  )
  const allStockData = useStockDataFromWS()
  const token = useToken()
  const { data: watchlist, isLoading: isWatchlistLoading } =
    useGetWatchlist(token)

  // Filter stock data based on watchlist if shouldFilterStocks is true
  const stockData: StockDataMap = React.useMemo(() => {
    if (
      isWatchlistLoading ||
      !shouldFilterStocks ||
      !watchlist ||
      watchlist.length === 0
    ) {
      return allStockData
    }
    return Object.fromEntries(
      Object.entries(allStockData).filter(([symbol]) =>
        watchlist.some((w) => w.stock_symbol === symbol)
      )
    )
  }, [allStockData, shouldFilterStocks, watchlist, isWatchlistLoading])

  return (
    <div className='grid grid-cols-2 gap-8 max-w-4xl mb-8'>
      <h1 className='text-sm font-light uppercase text-primary'>
        Live Stock Data
      </h1>
      <h2 className='text-sm font-light uppercase text-foreground text-right'>
        {new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </h2>
      <div className='grid grid-cols-3 gap-8 col-span-2'>
        {Object.entries(stockData).length
          ? Object.entries(stockData)
              .slice(0, 6)
              .map(([symbol, stockHistory]) => (
                <StockCard
                  key={symbol}
                  symbol={symbol}
                  stockHistory={stockHistory}
                />
              ))
          : Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className='h-60 w-60' />
            ))}
      </div>
      <div className='grid grid-cols-1 col-span-2'>
        <StocksTable stockData={stockData} />
      </div>
      <div className='grid col-span-2 justify-end items-end justify-items-end grid-flow-col gap-4'>
        <span className='text-sm font-light text-foreground uppercase'>
          Watchlist
        </span>
        <Switch
          color='primary'
          checked={shouldFilterStocks}
          onCheckedChange={setShouldFilterStocks}
        ></Switch>
      </div>
      <ErrorAlert />
    </div>
  )
}

export default StockDashboard
