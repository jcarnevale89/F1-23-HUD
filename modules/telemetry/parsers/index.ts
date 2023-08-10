export * from './carTelemetry'

export enum PacketSize {
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
