import StockData from '@/types/StockData'
import StockDataMap from '@/types/StockDataMap'
import { useEffect, useState } from 'react'
import { useWebSocket } from './useWebSocket'

export const useStockDataFromWS = (): StockDataMap => {
  const [stockData, setStockData] = useState<StockDataMap | {}>({})
  const wsocket = useWebSocket()

  useEffect(() => {
    if (!wsocket) return

    const handleMessage = (event: MessageEvent) => {
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

    wsocket.addEventListener('message', handleMessage)

    return () => {
      wsocket.removeEventListener('message', handleMessage)
    }
  }, [wsocket, stockData])

  return stockData
}
