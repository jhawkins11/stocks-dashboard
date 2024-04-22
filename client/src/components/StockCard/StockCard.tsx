import React from 'react'
import { LineChart, Line, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import UpSvg from '/public/up.svg'
import DownSvg from '/public/down.svg'
import StockData from '@/types/StockData'
import { Skeleton } from '@/components/ui/skeleton'

const StockCard = ({
  symbol,
  stockHistory,
}: {
  symbol: string
  stockHistory: StockData[]
}) => {
  const price = stockHistory.slice(-1)[0]?.price.toFixed(2) || '-'
  const previousPrice = stockHistory.slice(-2)[0]?.price || '-'
  const priceHasIncreased = price > previousPrice
  if (!stockHistory.length) return <Skeleton className='h-60 w-60' />
  return (
    <Card key={symbol} className='p-4'>
      <CardHeader className='grid grid-cols-2 items-center justify-between'>
        <h3 className='text-sm font-light inline'>{symbol}</h3>
        <h4
          className={cn(
            'text-sm inline text-right',
            // if stock price goes up then green else red text
            priceHasIncreased ? 'text-primary' : 'text-destructive'
          )}
        >
          {/* up or down arrow based on stock price */}
          {!priceHasIncreased ? (
            <img src={DownSvg.src} alt='down' className='w-3 h-3 inline mr-1' />
          ) : (
            <img src={UpSvg.src} alt='up' className='w-3 h-3 inline mr-1' />
          )}
          {price}
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
  )
}

export default StockCard
