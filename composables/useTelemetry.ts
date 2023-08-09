import { ref } from 'vue'

const state = ref(getInitialState())
// console.log(process.server)

interface State {
  frameCounter: number
  gear: number
  speed: number
  suggestedGear: number
  engineRpm: number
}

export default function () {
  function setState(data: Partial<State> & Pick<State, 'frameCounter'>) {
    // If the state is old then we don't want to set it
    if (data.frameCounter < state.value.frameCounter) return
    // Update state with the data that was passed
    state.value = { ...state.value, ...data }
    console.log(state.value)
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

function getInitialState(): State {
  return {
    frameCounter: 0,
    gear: 0,
    speed: 0,
    suggestedGear: 0,
    engineRpm: 0,
  }
}
