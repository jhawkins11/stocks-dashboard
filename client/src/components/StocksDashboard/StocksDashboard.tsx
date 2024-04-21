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
    <div className='flex justify-center'>
      <div className='max-w-4xl w-full'>
        <h1 className='text-4xl font-bold mb-4 text-center'>Stock Dashboard</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Object.entries(stockData).map(([symbol, stockHistory]) => (
            <Card key={symbol} className='p-4 mx-auto w-80'>
              <CardHeader>
                <h2 className='text-xl font-bold'>{symbol}</h2>
              </CardHeader>
              <CardContent>
                <h3 className='text-2xl font-bold'>
                  {stockHistory.slice(-1)[0]?.price.toFixed(2) || '-'}
                </h3>
                <p className='text-sm mt-2'>
                  {stockHistory.slice(-1)[0]?.timestamp || '-'}
                </p>
                <div className='mt-4'>
                  <LineChart width={300} height={150} data={stockHistory}>
                    <XAxis dataKey='timestamp' />
                    <YAxis type='number' domain={['auto', 'auto']} />
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip />
                    <Legend />
                    <Line type='monotone' dataKey='price' stroke='#8884d8' />
                  </LineChart>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StockDashboard
