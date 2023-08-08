import { Parser } from 'binary-parser'
import { Packet } from './packet'
import { PacketHeader, PacketHeaderParser } from './packetHeader'

export interface PacketCarTelemetry {
  m_header: PacketHeader
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

export class PacketCarTelemetryParser extends Packet {
  data: PacketCarTelemetry

  constructor(buffer: Buffer) {
    super()

    this.nest('m_header', {
      type: new PacketHeaderParser(),
    })
      .array('m_carTelemetryData', {
        length: 22,
        type: new Parser()
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
            type: new Parser().uint16le(''),
          })
          .array('m_tyresSurfaceTemperature', {
            length: 4,
            type: new Parser().uint8(''),
          })
          .array('m_tyresInnerTemperature', {
            length: 4,
            type: new Parser().uint8(''),
          })
          .uint16le('m_engineTemperature')
          .array('m_tyresPressure', {
            length: 4,
            type: new Parser().floatle(''),
          })
          .array('m_surfaceType', {
            length: 4,
            type: new Parser().uint8(''),
          }),
      })
      .uint8('m_mfdPanelIndex')
      .uint8('m_mfdPanelIndexSecondaryPlayer')
      .int8('m_suggestedGear')

    this.data = this.fromBuffer(buffer)
    // Only get the data from our car
    this.data.m_carTelemetryData = [this.data.m_carTelemetryData[this.data.m_header.m_playerCarIndex]]
  }
}
