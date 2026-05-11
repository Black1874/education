<template>
  <div id="app">
    <RouterView />
    <SoundToggle />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SoundToggle from '@/modules/common/components/SoundToggle.vue'
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
