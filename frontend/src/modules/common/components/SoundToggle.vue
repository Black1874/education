<template>
  <button class="sound-toggle" @click="toggleSound" :class="{ muted: isMuted }">
    <span class="icon">{{ isMuted ? '🔇' : '🔊' }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { audioManager } from '@/modules/common/utils/audio'

const isMuted = ref(false)

onMounted(() => {
  isMuted.value = audioManager.getMuted()
})

const toggleSound = () => {
  audioManager.toggleMute()
  isMuted.value = audioManager.getMuted()
}
</script>

<style scoped lang="scss">
.sound-toggle {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5DADE2, #85C1E9);
  border: none;
  box-shadow: 0 4px 16px rgba(93, 173, 226, 0.4);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 1000;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(93, 173, 226, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  &.muted {
    background: linear-gradient(135deg, #95A5A6, #BDC3C7);
    box-shadow: 0 4px 16px rgba(149, 165, 166, 0.4);
  }

  .icon {
    font-size: 32px;
    display: block;
  }
}

@media (max-width: 768px) {
  .sound-toggle {
    width: 56px;
    height: 56px;
    bottom: calc(18px + env(safe-area-inset-bottom));
    right: max(18px, env(safe-area-inset-right));

    .icon {
      font-size: 28px;
    }
  }
}

@media (orientation: landscape) and (max-height: 520px) {
  .sound-toggle {
    width: 48px;
    height: 48px;
    bottom: calc(12px + env(safe-area-inset-bottom));

    .icon {
      font-size: 24px;
    }
  }
}

@media (max-width: 480px) and (max-height: 780px) {
  .sound-toggle {
    width: 44px;
    height: 44px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    left: max(12px, env(safe-area-inset-left));
    right: auto;

    .icon {
      font-size: 22px;
    }
  }
}
</style>
