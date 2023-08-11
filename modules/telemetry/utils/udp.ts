import { type RemoteInfo, Socket, createSocket } from 'node:dgram'

export class UDP {
  udpServer: Socket

  constructor() {
    this.udpServer = createSocket('udp4')

    this.udpServer.on('error', (err) => {
      console.error(`UDP Server Error:\n${err.stack}`)
      this.udpServer.close()
    })

    this.udpServer.on('listening', () => {
      const address = this.udpServer.address()

      console.log(`UDP server listening ${address.address}:${address.port}`)
    })

    this.udpServer.bind(20777)
  }

  onMessage(callback: (msg: Buffer, rinfo: RemoteInfo) => void) {
    this.udpServer.on('message', callback)
  }
}
