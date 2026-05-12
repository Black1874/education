<template>
  <div class="game-detail-page polished-shell">
    <header class="header polished-panel">
      <button class="btn-back" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <h1>{{ gameInfo.name }}</h1>
      <div class="level-chip">{{ gameInfo.totalLevels }}关</div>
    </header>

    <main class="game-stage polished-panel">
      <div class="game-emoji" aria-hidden="true">{{ gameInfo.emoji }}</div>
      <p class="eyebrow">即将开放</p>
      <h2>{{ gameInfo.name }}</h2>
      <p class="desc">{{ gameInfo.description }}。这里会做成适合2岁宝宝的大按钮互动小游戏。</p>

      <div class="preview-row" aria-hidden="true">
        <span v-for="item in previewItems" :key="item">{{ item }}</span>
      </div>

      <button class="primary-btn" @click="goBack">先去看看其它游戏</button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { audioManager } from '@/modules/common/utils/audio'

const router = useRouter()
const route = useRoute()
const gameId = computed(() => String(route.params.gameId || 'memory'))

const gameMap: Record<string, { name: string; emoji: string; description: string; totalLevels: number }> = {
  memory: { name: '记忆游戏', emoji: '🧠', description: '记住可爱的图片位置', totalLevels: 15 },
  classify: { name: '分类游戏', emoji: '📦', description: '把相同类型的物品放一起', totalLevels: 15 },
  puzzle: { name: '拼图游戏', emoji: '🧩', description: '拼出完整的可爱图案', totalLevels: 15 },
  difference: { name: '找不同', emoji: '🔍', description: '发现两张图的小变化', totalLevels: 15 },
  matching: { name: '配对游戏', emoji: '💝', description: '找到互相对应的朋友', totalLevels: 15 },
  quick: { name: '快速反应', emoji: '⚡', description: '听提示后点击正确答案', totalLevels: 15 }
}

const gameInfo = computed(() => gameMap[gameId.value] || gameMap.memory)
const previewItems = ['🌟', '🍎', '🐼', '🚗']

const goBack = () => {
  audioManager.playClick()
  router.back()
}
</script>

<style scoped lang="scss">
.game-detail-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: clamp(14px, 3vw, 24px);
  padding: clamp(12px, 3vw, 24px);
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 232, 145, 0.34), transparent 28%),
    radial-gradient(circle at 84% 18%, rgba(145, 215, 255, 0.28), transparent 28%),
    linear-gradient(135deg, #fff9e6 0%, #e9f8ff 100%);
}

.header {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: clamp(10px, 2.5vw, 16px) clamp(12px, 3vw, 24px);
  border-radius: 28px;

  h1 {
    margin: 0;
    color: #2c3e50;
    font-size: clamp(24px, 5vw, 36px);
    text-align: center;
  }
}

.btn-back,
.level-chip {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: 0;
  border-radius: 999px;
  font-size: clamp(15px, 3.4vw, 18px);
  font-weight: 900;
}

.btn-back {
  color: #5d6d7e;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-sm);
}

.level-chip {
  color: white;
  background: linear-gradient(135deg, #ffd35d, #ff9f43);
}

.game-stage {
  position: relative;
  z-index: 1;
  width: min(760px, 100%);
  align-self: center;
  justify-self: center;
  padding: clamp(22px, 5vw, 44px);
  border-radius: 38px;
  text-align: center;
}

.game-emoji {
  width: clamp(100px, 22vw, 156px);
  height: clamp(100px, 22vw, 156px);
  margin: 0 auto 12px;
  display: grid;
  place-items: center;
  border-radius: 38px;
  font-size: clamp(62px, 14vw, 98px);
  background: linear-gradient(135deg, #fff2bf, #dff3ff);
  box-shadow: var(--shadow-pop);
  animation: wiggle 2.6s ease-in-out infinite;
}

.eyebrow {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 999px;
  color: #5d7fa6;
  font-size: clamp(13px, 3vw, 16px);
  font-weight: 900;
  background: rgba(93, 173, 226, 0.12);
}

h2 {
  margin: 12px 0 8px;
  color: #2c3e50;
  font-size: clamp(28px, 7vw, 44px);
}

.desc {
  max-width: 480px;
  margin: 0 auto 18px;
  color: #5d6d7e;
  font-size: clamp(15px, 3.6vw, 18px);
  line-height: 1.7;
}

.preview-row {
  display: flex;
  justify-content: center;
  gap: clamp(8px, 2vw, 14px);
  margin-bottom: 22px;

  span {
    width: clamp(48px, 11vw, 70px);
    height: clamp(48px, 11vw, 70px);
    display: grid;
    place-items: center;
    border-radius: 20px;
    font-size: clamp(28px, 7vw, 42px);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: var(--shadow-sm);
  }
}

.primary-btn {
  min-width: min(290px, 100%);
  min-height: 62px;
  border: 0;
  border-radius: 999px;
  color: white;
  font-size: clamp(18px, 4.8vw, 24px);
  font-weight: 900;
  cursor: pointer;
  background: linear-gradient(135deg, #5dade2, #7dd6c8);
  box-shadow: 0 12px 0 rgba(66, 145, 167, 0.16), 0 18px 32px rgba(93, 173, 226, 0.26);

  &:active {
    transform: translateY(4px) scale(0.98);
    box-shadow: 0 6px 0 rgba(66, 145, 167, 0.16), 0 12px 22px rgba(93, 173, 226, 0.2);
  }
}

@media (max-width: 480px) {
  .header {
    grid-template-columns: auto 1fr;

    .level-chip {
      display: none;
    }
  }
}

@media (orientation: landscape) and (max-height: 520px) {
  .game-detail-page {
    gap: 10px;
  }

  .game-stage {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 22px;
    align-items: center;
    text-align: left;
    padding: 18px 24px;
  }

  .game-emoji {
    grid-row: span 5;
    margin-bottom: 0;
  }

  .preview-row {
    justify-content: flex-start;
    margin-bottom: 12px;
  }
}

@media (orientation: landscape) and (min-width: 900px) and (max-height: 820px) {
  .game-detail-page {
    gap: 12px;
    padding: 12px 18px;
  }

  .header {
    padding: 10px 18px;
  }

  .btn-back,
  .level-chip {
    min-height: 44px;
    padding: 6px 14px;
  }

  .game-stage {
    padding: 20px 28px;
  }

  .game-emoji {
    width: 104px;
    height: 104px;
    margin-bottom: 8px;
    border-radius: 30px;
    font-size: 66px;
  }

  h2 {
    margin: 8px 0 4px;
    font-size: 34px;
  }

  .desc {
    margin-bottom: 12px;
    line-height: 1.55;
  }

  .preview-row {
    margin-bottom: 14px;
  }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-2deg) translateY(0); }
  50% { transform: rotate(3deg) translateY(-8px); }
}
</style>
