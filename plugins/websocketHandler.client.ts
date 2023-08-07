export default defineNuxtPlugin((nuxtApp) => {
  const socket = new WebSocket("ws://localhost:8081");

  const { state } = useTelemetry();

  socket.onmessage = (event) => {
    //@ts-ignore
    state.value = JSON.parse(event.data);
    console.log(state.value)
  };
});
