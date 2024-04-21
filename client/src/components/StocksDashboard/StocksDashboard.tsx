'use client'
import React, { useEffect, useState } from 'react'

interface StockData {
  symbol: string
  price: number
  timestamp: string
}

const StockDashboard: React.FC = () => {
  const [stockData, setStockData] = useState<StockData[] | null>(null)
  const [wsocket, setWsocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080')

    socket.onopen = () => {
      console.log('WebSocket connection opened')
      setWsocket(socket)
    }

    socket.onmessage = (event) => {
      const data: StockData[] = JSON.parse(event.data)
      setStockData(data)
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
  }, [])

  return (
    <div>
      <h1 className='text-2xl font-bold'>Stock Dashboard</h1>
      <div className='grid grid-cols-5 gap-4 mt-4'>
        {stockData?.map((stock) => (
          <div
            key={stock.symbol}
            className='p-4 rounded-md flex flex-col items-center border border-gray-200'
          >
            <h2 className='text-lg font-bold'>{stock.symbol}</h2>
            <p className='text-xl font-bold mt-2'>{stock.price.toFixed(2)}</p>
            <p className='text-sm mt-2'>{stock.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StockDashboard
