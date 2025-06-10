import { useEffect, useState } from 'react'
import { useWebSocket } from './useWebSocket'
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
  const wsocket = useWebSocket()

  useEffect(() => {
    if (!wsocket) return

    const handleMessage = (event: MessageEvent) => {
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
        setStockData(initialStockDataMap)
      } else if (message.type === 'update') {
        const updates = message.data as StockData[]
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
              // Keep only the last 5 data points
              if (updatedStockDataMap[stockItem.symbol].length > 5) {
                updatedStockDataMap[stockItem.symbol].shift()
              }
            } else {
              updatedStockDataMap[stockItem.symbol] = [formattedStockItem]
            }
          })
          return updatedStockDataMap
        })
      }
    }

    wsocket.addEventListener('message', handleMessage)

    return () => {
      wsocket.removeEventListener('message', handleMessage)
    }
  }, [wsocket])

  return stockData
}
