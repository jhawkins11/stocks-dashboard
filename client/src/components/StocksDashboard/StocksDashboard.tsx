'use client'
import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import UpSvg from '/public/up.svg'
import DownSvg from '/public/down.svg'

interface StockData {
  symbol: string
  price: number
  timestamp: string
}

const StockDashboard: React.FC = () => {
  const [stockData, setStockData] = useState<{ [symbol: string]: StockData[] }>(
    {}
  )
  const [wsocket, setWsocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080')
    socket.onopen = () => {
      console.log('WebSocket connection opened')
      setWsocket(socket)
    }
    socket.onmessage = (event) => {
      const data: StockData[] = JSON.parse(event.data)
      const updatedStockData = { ...stockData }
      data.forEach((stockItem) => {
        updatedStockData[stockItem.symbol] = [
          ...(updatedStockData[stockItem.symbol] || []),
          stockItem,
        ]
      })
      setStockData(updatedStockData)
    }
    socket.onclose = () => {
      console.log('WebSocket connection closed')
      setWsocket(null)
    }
    return () => {
      if (wsocket) {
        wsocket.close()
      }
    }
  }, [stockData])

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
            <Card key={symbol} className='p-4'>
              <CardHeader className='grid grid-cols-2 items-center justify-between'>
                <h3 className='text-sm font-light inline'>{symbol}</h3>
                <h4
                  className={cn(
                    'text-sm inline text-right',
                    // if stock price goes up then text-primary else red text
                    stockHistory.slice(-1)[0]?.price >
                      stockHistory.slice(-2)[0]?.price
                      ? 'text-primary'
                      : 'text-destructive'
                  )}
                >
                  {/* up or down arrow based on stock price */}
                  {stockHistory.slice(-1)[0]?.price <
                  stockHistory.slice(-2)[0]?.price ? (
                    <img
                      src={DownSvg.src}
                      alt='down'
                      className='w-3 h-3 inline mr-1'
                    />
                  ) : (
                    <img
                      src={UpSvg.src}
                      alt='up'
                      className='w-3 h-3 inline mr-1'
                    />
                  )}
                  {stockHistory.slice(-1)[0]?.price.toFixed(2) || '-'}
                </h4>
              </CardHeader>
              <CardContent>
                <div className='mt-4'>
                  <LineChart
                    width={180}
                    height={120}
                    // only show last 10 data points
                    data={stockHistory.slice(-10)}
                  >
                    <XAxis dataKey='timestamp' format={'HH:mm:ss'} />
                    <YAxis type='number' domain={['auto', 'auto']} />
                    <Line
                      type='monotone'
                      dataKey='price'
                      dot={false}
                      stroke='hsl(var(--primary))'
                    />
                  </LineChart>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}

export default StockDashboard
