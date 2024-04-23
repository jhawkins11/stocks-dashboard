import { useState, useEffect } from 'react'

export const useWebSocket = (): WebSocket | null => {
  const [wsocket, setWsocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080')
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
