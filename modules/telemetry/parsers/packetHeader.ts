import { Packet } from "./packet";

export interface PacketHeader {
  m_packetFormat: number;
  m_gameMajorVersion: number;
  m_gameMinorVersion: number;
  m_packetVersion: number;
  m_packetId: number;
  m_sessionUID: number | String;
  m_sessionTime: number;
  m_frameIdentifier: number;
  m_playerCarIndex: number;
  m_secondaryPlayerCarIndex: number;
}

export class PacketHeaderParser extends Packet {
  constructor() {
    super();

    this.uint16le("m_packetFormat")
      .uint8("m_gameMajorVersion")
      .uint8("m_gameMinorVersion")
      .uint8("m_packetVersion")
      .uint8("m_packetId")
      .uint64le("m_sessionUID")
      .floatle("m_sessionTime")
      .uint32le("m_frameIdentifier")
      .uint8("m_playerCarIndex")
      .uint8("m_secondaryPlayerCarIndex");
  }
}
