import { ref } from 'vue'

const state = ref(getInitialState())
// console.log(process.server)

interface Telemetry {
  gear: number
  speed: number
  suggestedGear: number
  engineRpm: number
  revLights: [
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
  brakeTemps: {
    fl: number
    fr: number
    rr: number
    rl: number
  }
}

export default function () {
  function setState(data: Partial<Telemetry>) {
    state.value = { ...state.value, ...data }
  }

  function resetState() {
    state.value = getInitialState()
  }

  return {
    state,
    setState,
    resetState,
  }
}

function getInitialState(): Telemetry {
  return {
    gear: 0,
    speed: 0,
    suggestedGear: 0,
    engineRpm: 0,
    revLights: ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
    brakeTemps: {
      fl: 0,
      fr: 0,
      rr: 0,
      rl: 0,
    },
  }
}
