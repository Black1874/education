<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="[type]">
      <div class="toast-icon">{{ icon }}</div>
      <div class="toast-message">{{ message }}</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}>()

const visible = ref(false)
const icon = ref('')

const iconMap = {
  success: '✅',
  error: '💡',
  info: 'ℹ️',
  warning: '⚠️'
}

watch(() => props.message, (newMessage) => {
  if (newMessage) {
    visible.value = true
    icon.value = iconMap[props.type || 'info']

    setTimeout(() => {
      visible.value = false
    }, props.duration || 2000)
  }
}, { immediate: true })
</script>

<style scoped lang="scss">
.toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  min-width: 200px;
  max-width: 400px;

  &.success {
    border-left: 4px solid #52C41A;
  }

  &.error {
    border-left: 4px solid #FF7875;
  }

  &.info {
    border-left: 4px solid #1890FF;
  }

  &.warning {
    border-left: 4px solid #FAAD14;
  }

  .toast-icon {
    font-size: 24px;
  }

  .toast-message {
    font-size: 16px;
    font-weight: 500;
    color: #2C3E50;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
