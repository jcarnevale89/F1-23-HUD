import { F1PacketParser, BasePacket } from './packet'
import useTelemetry from '../../../composables/useTelemetry'

interface CarTelemetryPacket extends BasePacket {
  m_buttonStatus: number
  m_carTelemetryData: CarTelemetryData[]
  m_mfdPanelIndex: number
  m_mfdPanelIndexSecondaryPlayer: number
  m_suggestedGear: number
}

interface CarTelemetryData {
  m_speed: number
  m_throttle: number
  m_steer: number
  m_brake: number
  m_clutch: number
  m_gear: number
  m_engineRPM: number
  m_drs: number
  m_revLightsPercent: number
  m_revLightsBitValue: number
  m_brakesTemperature: [number, number, number, number]
  m_tyresSurfaceTemperature: [number, number, number, number]
  m_tyresInnerTemperature: [number, number, number, number]
  m_engineTemperature: number
  m_tyresPressure: [number, number, number, number]
  m_surfaceType: [number, number, number, number]
}

const parser = new F1PacketParser()
  .array('m_carTelemetryData', {
    length: 22,
    type: new F1PacketParser(false)
      .uint16le('m_speed')
      .floatle('m_throttle')
      .floatle('m_steer')
      .floatle('m_brake')
      .uint8('m_clutch')
      .int8('m_gear')
      .uint16le('m_engineRPM')
      .uint8('m_drs')
      .uint8('m_revLightsPercent')
      .uint16le('m_revLightsBitValue')
      .array('m_brakesTemperature', {
        length: 4,
        type: 'uint16le',
      })
      .array('m_tyresSurfaceTemperature', {
        length: 4,
        type: 'uint8',
      })
      .array('m_tyresInnerTemperature', {
        length: 4,
        type: 'uint8',
      })
      .uint16le('m_engineTemperature')
      .array('m_tyresPressure', {
        length: 4,
        type: 'floatle',
      })
      .array('m_surfaceType', {
        length: 4,
        type: 'uint8',
      }),
  })
  .uint8('m_mfdPanelIndex')
  .uint8('m_mfdPanelIndexSecondaryPlayer')
  .int8('m_suggestedGear')

const { setState } = useTelemetry()

export function carTelemetryPacketHandler(buffer: Buffer) {
  const { m_header, m_suggestedGear, m_carTelemetryData } = parser.parse(buffer) as CarTelemetryPacket

  const ourCar = m_carTelemetryData[m_header.m_playerCarIndex]

  setState({
    frameCounter: m_header.m_overallFrameIdentifier,
    gear: ourCar.m_gear,
    engineRpm: ourCar.m_engineRPM,
    speed: ourCar.m_speed,
    suggestedGear: m_suggestedGear,
  })
}
