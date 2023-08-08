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

// TODO: Add an abstraction for the UDP Server and the Websocket Server

export default defineNuxtModule({
  meta: {
    name: 'udpHandler',
  },
  setup() {
    // keep frame count so we can determin message health
    let frameCount = 0

    let state: any = { gear: 0, engineRpm: 0, counter: 0 }

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
          // console.log(data.m_carTelemetryData.forEach)
          // console.log('new', data.m_header.m_overallFrameIdentifier)
          if (data.m_header.m_overallFrameIdentifier < state.m_header?.m_overallFrameIdentifier) {
            console.log('new', data.m_header.m_overallFrameIdentifier)
            console.log('old', state.m_header.m_overallFrameIdentifier)
          } else {
            state = data
          }
          break

        case PacketSize.FinalClassification:
          // Use this to reset the state of the data
          console.log('race over')
          break

        default:
          console.log('other packet')
          break
      }
    })

    udpServer.bind(20777)

    const wss = new WebSocketServer({ port: 8081 })

    setInterval(() => {
      wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return

        client.send(JSON.stringify(state))
      })
    }, 1000 / 30)
  },
})
