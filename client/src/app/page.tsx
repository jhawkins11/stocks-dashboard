'use client'
import StockDashboard from '@/components/StocksDashboard/StocksDashboard'
import { ErrorProvider } from '@/lib/ErrorContext'
import { QueryClient, QueryClientProvider } from 'react-query'
const queryClient = new QueryClient()

export default function Home() {
  return (
    <ErrorProvider>
      <QueryClientProvider client={queryClient}>
        <main className='flex min-h-screen flex-col items-center justify-between p-24'>
          <StockDashboard />
        </main>
      </QueryClientProvider>
    </ErrorProvider>
  )
}
