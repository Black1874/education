<template>
  <div class="loading-overlay" v-if="show">
    <div class="loading-content">
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
      <p class="loading-text" v-if="text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  text?: string
}>()
</script>

<style scoped lang="scss">
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s;
}

.loading-content {
  text-align: center;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.spinner > div {
  width: 24px;
  height: 24px;
  background-color: #5DADE2;
  border-radius: 100%;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.loading-text {
  font-size: 18px;
  color: #5D6D7E;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
