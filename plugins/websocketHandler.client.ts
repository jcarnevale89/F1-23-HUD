export default defineNuxtPlugin(() => {
  const socket = new WebSocket('ws://192.168.10.242:8081')

  const { setState } = useTelemetry()

  socket.onmessage = (event) => {
    setState(JSON.parse(event.data))
  }
})
