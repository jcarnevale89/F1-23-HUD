<template lang="pug">
div(class='w-full h-full')
  div(class='grid grid-cols-2 items-center w-full h-full text-gray-700 bg-teal-200')
    div(class='h-full p-10')
      div
        div(class='flex items-end gap-x-1 h-28')
          template(v-for='(light, index) in state.revLights' :key='index')
            //- div(class='flex-1 bg-current' :style='{ height: (n / revBinary.length) * 100 + "%" }')
            div(class='flex-1 bg-current w-full h-full' :class='{ "opacity-0": light === "0" }')

        //- TODO: Make into its own LED LIGHT component
        div(class='grid grid-flow-col auto-cols-auto gap-x-1')
          template(v-for='(light, index) in state.revLights' :key='index')
            div(class='flex justify-center')
              div(class='bg-current h-4 w-4 rounded-full' :class='[light === "0" ? "opacity-25" : "opacity-100"]')

        div(class='flex justify-center items-center p-4 gap-2')
          p(class='text-6xl') {{ state.engineRpm }}
          p(class='text-sm') RPM

      div(class='flex justify-center items-center gap-2')
        p(class='text-6xl') {{ state.speed }}
        p(class='text-sm') KPH

      pre {{ state.brakeTemps }}

    div(class='relative flex justify-center items-center w-full h-full')
      p(class='text-[23rem] leading-none') {{ state.gear }}
      p(v-if='state.suggestedGear' class='absolute') {{ state.suggestedGear }}
</template>

<script setup lang="ts">
const { state } = useTelemetry()
</script>
