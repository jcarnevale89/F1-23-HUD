import { F1PacketParser, BasePacket } from './packet'

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
  m_revLightsBitValue: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
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
      .uint16le('m_revLightsBitValue', {
        formatter(val) {
          // Take the value and convert it binary, and pad the value with as many zeros needed to make it a length of 15
          const binaryVal = val.toString(2).padStart(15, '0')
          // Split the string into individual chars and reverse it so its easier to use in the FE
          return binaryVal.split('').reverse()
        },
      })
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

export function carTelemetryPacketParser(buffer: Buffer) {
  return parser.parse(buffer) as CarTelemetryPacket
}
