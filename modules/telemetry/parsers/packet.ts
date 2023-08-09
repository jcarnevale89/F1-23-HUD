import { Parser } from 'binary-parser'

export interface BasePacket {
  m_header: PacketHeader
}

interface PacketHeader {
  m_packetFormat: number
  m_gameYear: number
  m_gameMajorVersion: number
  m_gameMinorVersion: number
  m_packetVersion: number
  m_packetId: number
  m_sessionUID: number
  m_sessionTime: number
  m_frameIdentifier: number
  m_overallFrameIdentifier: number
  m_playerCarIndex: number
  m_secondaryPlayerCarIndex: number
}

export class F1PacketParser extends Parser {
  constructor(addPacketHeader = true) {
    super()

    if (addPacketHeader) {
      // Add header values to the default packet
      this.nest('m_header', {
        type: new Parser()
          .uint16('m_packetFormat')
          .uint8('m_gameYear')
          .uint8('m_gameMajorVersion')
          .uint8('m_gameMinorVersion')
          .uint8('m_packetVersion')
          .uint8('m_packetId')
          .uint64le('m_sessionUID', {
            formatter() {
              // 64 bit numbers are BigInts and those can't be serialized without adding a helper to the struct
              // So, as of right now we really don't care about this value so we can just set it to 0
              return 0
            },
          })
          .floatle('m_sessionTime')
          .uint32le('m_frameIdentifier')
          .uint32le('m_overallFrameIdentifier')
          .uint8('m_playerCarIndex')
          .uint8('m_secondaryPlayerCarIndex'),
      })
    }
  }
}
