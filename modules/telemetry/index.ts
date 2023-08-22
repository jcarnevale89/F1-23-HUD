import { defineNuxtModule } from 'nuxt/kit'
import { PacketSize, carTelemetryPacketParser } from './parsers'
import { UDP, WebSocket } from './utils'
import useTelemetry from '../../composables/useTelemetry'

export default defineNuxtModule({
  meta: {
    name: 'F1Telemetry',
  },
  setup() {
    // Create UDP Server
    const udpServer = new UDP()

    // Initialize WebSocket Server
    new WebSocket()

    // Initialize Telemetry state
    const { setState } = useTelemetry()

    // Store the latest frame of data we got
    let latestFrame = 0

    // Helper function to set the state of the telemetry
    function setTelemetryState(frame: number, newState: Parameters<typeof setState>[0]) {
      // if the frame of the packet that we are trying to set is old then we can ignore it
      if (frame < latestFrame) return

      latestFrame = frame

      setState(newState)
    }

    // Add UDP message parser
    udpServer.onMessage((msg, rinfo) => {
      switch (rinfo.size) {
        case PacketSize.CarTelemetry: {
          const { m_header, m_suggestedGear, m_carTelemetryData } = carTelemetryPacketParser(msg)

          const ourCar = m_carTelemetryData[m_header.m_playerCarIndex]

          setTelemetryState(m_header.m_overallFrameIdentifier, {
            gear: ourCar.m_gear,
            engineRpm: ourCar.m_engineRPM,
            speed: ourCar.m_speed,
            suggestedGear: m_suggestedGear,
            revLights: ourCar.m_revLightsBitValue,
            brakeTemps: {
              rl: ourCar.m_brakesTemperature[0],
              rr: ourCar.m_brakesTemperature[1],
              fl: ourCar.m_brakesTemperature[2],
              fr: ourCar.m_brakesTemperature[3],
            },
          })
          break
        }

        case PacketSize.FinalClassification:
          // Use this to reset the state of the data
          console.log('race over')
          break

        // default:
        //   console.log('other packet')
        //   break
      }
    })
  },
})
