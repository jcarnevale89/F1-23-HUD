import { WebSocketServer, OPEN } from 'ws'
import useTelemetry from '../../../composables/useTelemetry'

export class WebSocket {
  wss: WebSocketServer

  constructor() {
    this.wss = new WebSocketServer({ port: 8081 })

    const { state } = useTelemetry()

    setInterval(() => {
      this.wss.clients.forEach((client) => {
        if (client.readyState !== OPEN) return
        client.send(JSON.stringify(state.value))
      })
    }, 1000 / 30)
  }
}
