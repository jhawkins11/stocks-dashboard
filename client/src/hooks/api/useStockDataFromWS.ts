import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import StockData from '@/types/StockData'
import StockDataMap from '@/types/StockDataMap'

interface SocketMessage {
  type: 'initial' | 'update'
  data: StockData[] | StockData[][]
}

const formatStockData = (stockData: StockData[]): StockData[] => {
  return stockData.map((stockItem) => ({
    ...stockItem,
    timestamp: new Date(stockItem.timestamp).toLocaleTimeString(),
    price: Number(stockItem.price.toFixed(2)),
  }))
}

export const useStockDataFromWS = (): StockDataMap => {
  const [stockData, setStockData] = useState<StockDataMap>({})
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Ensure this effect runs only once.
    if (socketRef.current) return

    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL as string)
    const socket = socketRef.current

    socket.onopen = () => {
      console.log('WebSocket connection opened')
    }

    socket.onclose = () => {
      console.log('WebSocket connection closed')
      socketRef.current = null
    }

    socket.onerror = (event) => {
      console.error('WebSocket error:', event)
      socketRef.current = null
    }

    socket.onmessage = (event: MessageEvent) => {
      const message: SocketMessage = JSON.parse(event.data)

      if (message.type === 'initial') {
        const initialData = message.data as StockData[][]
        const formattedData = initialData.map(formatStockData).flat()
        const initialStockDataMap: StockDataMap = {}
        formattedData.forEach((stockItem) => {
          if (initialStockDataMap[stockItem.symbol]) {
            initialStockDataMap[stockItem.symbol].push(stockItem)
          } else {
            initialStockDataMap[stockItem.symbol] = [stockItem]
          }
        })
        flushSync(() => {
          setStockData(initialStockDataMap)
        })
      } else if (message.type === 'update') {
        const updates = message.data as StockData[]
        flushSync(() => {
          setStockData((currentStockData) => {
            const updatedStockDataMap = { ...currentStockData }
            updates.forEach((stockItem) => {
              const formattedStockItem = {
                ...stockItem,
                timestamp: new Date(stockItem.timestamp).toLocaleTimeString(),
                price: Number(stockItem.price.toFixed(2)),
              }
              if (updatedStockDataMap[stockItem.symbol]) {
                updatedStockDataMap[stockItem.symbol].push(formattedStockItem)
                if (updatedStockDataMap[stockItem.symbol].length > 5) {
                  updatedStockDataMap[stockItem.symbol].shift()
                }
              } else {
                updatedStockDataMap[stockItem.symbol] = [formattedStockItem]
              }
            })
            return updatedStockDataMap
          })
        })
      }
    }

    // Cleanup function to close the socket when the component unmounts.
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
      socketRef.current = null
    }
  }, [])

  return stockData
}
