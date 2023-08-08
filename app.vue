<template>
  <div>
    <!-- <p>{{ state.gear }}</p>
    <p>{{ state.engineRpm }}</p> -->
    <pre>{{ state }}</pre>
  </div>
</template>

<script setup lang="ts">
const { state } = useTelemetry()
</script>

<style>
p {
  font-size: 4rem;
}
</style>
