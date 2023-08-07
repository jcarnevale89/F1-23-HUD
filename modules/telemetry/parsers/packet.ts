import { Parser } from 'binary-parser'

export class Packet extends Parser {
  fromBuffer<T>(buffer: Buffer) {
    return this.parse(buffer) as T
  }
}
