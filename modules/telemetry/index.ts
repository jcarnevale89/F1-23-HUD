import { defineNuxtModule } from 'nuxt/kit'
import { carTelemetryPacketHandler } from './parsers'
import { UDP, WebSocket } from './utils'

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
    // Create UDP Server
    const udpServer = new UDP()

    // Initialize WebSocket Server
    new WebSocket()

    // Add UDP message parser
    udpServer.onMessage((msg, rinfo) => {
      switch (rinfo.size) {
        case PacketSize.CarTelemetry:
          return carTelemetryPacketHandler(msg)

        case PacketSize.FinalClassification:
          // Use this to reset the state of the data
          console.log('race over')
          break

        default:
          console.log('other packet')
          break
      }
    })
  },
})
