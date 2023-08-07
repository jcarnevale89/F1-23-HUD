import { createSocket } from 'dgram'
import { defineNuxtModule } from 'nuxt/kit'
import WebSocket, { WebSocketServer } from 'ws'
import { PacketCarTelemetryParser } from './parsers'

enum PacketSize {
  Motion = 1349,
  Session = 644,
  LapData = 1131,
  Event = 45,
  Participants = 1306,
  CarSetups = 1107,
  CarTelemetry = 1352,
  CarStatus = 1239,
  FinalClassification = 1020,
  LobbyInfo = 1218,
  CarDamage = 953,
  SessionHistory = 1460,
  TyreSets = 231,
  MotionEx = 217,
}

export default defineNuxtModule({
  meta: {
    name: 'udpHandler',
  },
  setup() {
    const state = { gear: -1, engineRpm: 0, counter: 0 }

    const udpServer = createSocket('udp4')

    udpServer.on('error', (err) => {
      console.error(`server error:\n${err.stack}`)
      udpServer.close()
    })

    udpServer.on('listening', () => {
      const address = udpServer.address()
      console.log(`server listening ${address.address}:${address.port}`)
    })

    udpServer.on('message', (msg, rinfo) => {
      switch (rinfo.size) {
        case PacketSize.CarTelemetry:
          // eslint-disable-next-line no-case-declarations
          const { data } = new PacketCarTelemetryParser(msg)
          console.log(data)
          break
      }
    })

    udpServer.bind(20777)

    // sim udp
    setInterval(() => {
      state.engineRpm += 10
    }, 1000)

    const wss = new WebSocketServer({ port: 8081 })

    setInterval(() => {
      wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return

        client.send(JSON.stringify(state))
      })
    }, 100)
  },
})
