<template lang="pug">
pre {{ state }}
div(class='fixed inset-0')
  div(class='flex justify-center items-center w-full h-full')
    p {{ state.gear }}
</template>

<script setup lang="ts">
const { state } = useTelemetry()
</script>

<style>
p {
  font-size: 4rem;
}
</style>
