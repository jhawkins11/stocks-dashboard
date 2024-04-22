import StockData from '@/types/StockData'
import StockDataMap from '@/types/StockDataMap'
import { useEffect, useState } from 'react'
import { useWebSocket } from './useWebSocket'

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
  const [stockData, setStockData] = useState<StockDataMap | {}>({})
  const wsocket = useWebSocket()

  useEffect(() => {
    if (!wsocket) return

    const handleMessage = (event: MessageEvent) => {
      const message: SocketMessage = JSON.parse(event.data)
      // If the message is of type 'initial', it means we are receiving the initial stock data w/ history
      if (message.type === 'initial') {
        let initialStockData: StockData[][] = message.data as StockData[][]
        // Format the initial stock data
        initialStockData = initialStockData.map(formatStockData)
        const initialStockDataMap: StockDataMap = {}
        // Convert the array of stock data to a map of stock data updates by symbol
        initialStockData.forEach((stockDataArray) => {
          stockDataArray.forEach((stockItem) => {
            if (initialStockDataMap[stockItem.symbol])
              initialStockDataMap[stockItem.symbol].push(stockItem)
            else initialStockDataMap[stockItem.symbol] = [stockItem]
          })
        })
        setStockData(initialStockDataMap)
        // If the message is of type 'update', it means we are receiving the updated stock data
      } else if (message.type === 'update') {
        let updatedStockData: StockData[] = message.data as StockData[]
        // Format the updated stock data
        updatedStockData = formatStockData(updatedStockData)
        const updatedStockDataMap = { ...stockData }
        // Update the stock data map with the new stock data
        updatedStockData.forEach((stockItem) => {
          updatedStockDataMap[stockItem.symbol] = [
            ...(updatedStockDataMap[stockItem.symbol] || []),
            stockItem,
          ]
        })
        setStockData(updatedStockDataMap)
      }
    }

    wsocket.addEventListener('message', handleMessage)

    return () => {
      wsocket.removeEventListener('message', handleMessage)
    }
  }, [wsocket, stockData])

  return stockData
}
