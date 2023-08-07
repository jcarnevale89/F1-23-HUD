import { ref } from 'vue'

const state = ref({ gear: -1, engineRpm: 0, counter: 0 });

export default function () {
  return {
    state,
  };
}
