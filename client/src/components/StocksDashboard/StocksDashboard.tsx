'use client'
import React from 'react'
import StockCard from '../StockCard/StockCard'
import StocksTable from '../StocksTable/StocksTable'
import { useStockDataFromWS } from '@/hooks/api/useStockDataFromWS'
import { Skeleton } from '../ui/skeleton'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const StockDashboard: React.FC = () => {
  const stockData = useStockDataFromWS()
  return (
    <QueryClientProvider client={queryClient}>
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
      </div>
    </QueryClientProvider>
  )
}

export default StockDashboard
