import { useState, useEffect } from 'react'

export const useWebSocket = (): WebSocket | null => {
  const [wsocket, setWsocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL as string)
    socket.onopen = () => {
      console.log('WebSocket connection opened')
      setWsocket(socket)
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

  return wsocket
}
