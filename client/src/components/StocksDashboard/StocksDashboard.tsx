'use client'
import React, { useEffect, useState } from 'react'
import StockData from '@/types/StockData'
import StockCard from '../StockCard/StockCard'
import { useStockDataFromWS } from '@/hooks/useStockDataFromWS'

const StockDashboard: React.FC = () => {
  const stockData = useStockDataFromWS()
  return (
    <div className='grid grid-cols-2 gap-8 max-w-4xl'>
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
        {Object.entries(stockData)
          .slice(0, 3)
          .map(([symbol, stockHistory]) => (
            <StockCard
              key={symbol}
              symbol={symbol}
              stockHistory={stockHistory}
            />
          ))}
      </div>
    </div>
  )
}

export default StockDashboard
