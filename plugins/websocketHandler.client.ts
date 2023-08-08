export default defineNuxtPlugin((nuxtApp) => {
  // console.log(window.location)
  const socket = new WebSocket('ws://192.168.10.242:8081')

  const { state } = useTelemetry()

  socket.onmessage = (event) => {
    //@ts-ignore
    state.value = JSON.parse(event.data)
    // console.log(state.value)
  }
})
