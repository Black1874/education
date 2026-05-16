<template>
  <div class="game-list-page polished-shell">
    <header class="header polished-panel">
      <button class="btn-back" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <h1 class="page-title">游戏世界</h1>
      <div class="star-count">
        <span class="star-icon">⭐</span>
        <span class="count">{{ totalStars }}</span>
      </div>
    </header>

    <main class="main-content">
      <div class="game-grid">
        <div
          v-for="game in games"
          :key="game.id"
          class="game-card"
          :style="{ background: game.color }"
          role="button"
          tabindex="0"
          :aria-label="`进入${game.name}`"
          @click="goToGame(game.id)"
          @keydown.enter.prevent="goToGame(game.id)"
          @keydown.space.prevent="goToGame(game.id)"
        >
          <div class="card-icon">{{ game.emoji }}</div>
          <h3 class="card-title">{{ game.name }}</h3>
          <p class="card-desc">{{ game.description }}</p>
          <div class="card-levels">{{ game.totalLevels }}关</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { audioManager } from '@/modules/common/utils/audio'
import { storageManager } from '@/modules/common/utils/storage'

const router = useRouter()
const totalStars = ref(0)

onMounted(() => {
  totalStars.value = storageManager.getUserData().totalStars
})

const games = ref([
  {
    id: 'classify',
    name: '分类游戏',
    emoji: '📦',
    description: '把物品分类整理',
    color: 'linear-gradient(135deg, #FFE4CC 0%, #FFA07A 100%)',
    totalLevels: 5
  },
  {
    id: 'puzzle',
    name: '拼图游戏',
    emoji: '🧩',
    description: '拼出完整的图案',
    color: 'linear-gradient(135deg, #E0F8F0 0%, #98D8C8 100%)',
    totalLevels: 10
  },
    {
      id: 'memory',
      name: '记忆游戏',
      emoji: '🧠',
      description: '考验你的记忆力',
      color: 'linear-gradient(135deg, #FFE4E1 0%, #FF6B9D 100%)',
      totalLevels: 15
    },
  {
    id: 'difference',
    name: '找不同',
    emoji: '🔍',
    description: '找出图片的不同',
    color: 'linear-gradient(135deg, #FFF9E6 0%, #F7DC6F 100%)',
    totalLevels: 15
  },
  {
    id: 'matching',
    name: '配对游戏',
    emoji: '💝',
    description: '找到相配的物品',
    color: 'linear-gradient(135deg, #F3E5F5 0%, #BB8FCE 100%)',
    totalLevels: 15
  },
  {
    id: 'quick',
    name: '快速反应',
    emoji: '⚡',
    description: '快速点击正确答案',
    color: 'linear-gradient(135deg, #E3F2FD 0%, #85C1E2 100%)',
    totalLevels: 15
  }
])

const goBack = () => {
  audioManager.playClick()
  router.back()
}

const goToGame = (gameId: string) => {
  audioManager.playClick()
  router.push(`/games/${gameId}`)
}
</script>

<style scoped lang="scss">
.game-list-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF9E6 0%, #E3F2FD 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .btn-back {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 20px;
    font-weight: bold;
    background: #F0F0F0;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #E0E0E0;
      transform: translateX(-4px);
    }
  }

  .page-title {
    font-size: 36px;
    font-weight: bold;
    color: #2C3E50;
    margin: 0;
  }

  .star-count {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    border-radius: 24px;
    font-size: 24px;
    font-weight: bold;
    color: white;
  }
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.game-card {
  background: white;
  border-radius: 32px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);

    .card-icon {
      transform: scale(1.2) rotate(10deg);
    }
  }

  .card-icon {
    font-size: 100px;
    margin-bottom: 24px;
    transition: transform 0.3s;
  }

  .card-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #2C3E50;
  }

  .card-desc {
    font-size: 18px;
    color: #5D6D7E;
    margin-bottom: 24px;
  }

  .card-levels {
    display: inline-block;
    padding: 8px 20px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #2C3E50;
  }
}

// 游戏列表单屏兼容：与学习乐园保持一致的大触控卡片
.game-list-page {
  position: relative;
  overflow-x: hidden;
  min-height: 100dvh;
  background:
    radial-gradient(circle at 12% 14%, rgba(255, 214, 228, 0.9) 0 90px, transparent 92px),
    radial-gradient(circle at 88% 18%, rgba(194, 232, 255, 0.85) 0 110px, transparent 112px),
    linear-gradient(135deg, #FFF8E7 0%, #FFEAF3 45%, #EAF7FF 100%);
}

.header {
  margin: max(12px, env(safe-area-inset-top)) max(14px, env(safe-area-inset-right)) 0 max(14px, env(safe-area-inset-left));
  padding: 18px 28px;
  border: 4px solid rgba(255, 255, 255, 0.78);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 14px 36px rgba(255, 160, 190, 0.18);
  backdrop-filter: blur(10px);

  .btn-back,
  .star-count {
    min-height: 64px;
    border-radius: 999px;
  }

  .btn-back {
    background: linear-gradient(135deg, #FFFFFF, #F3FBFF);
    color: #4B6175;
    box-shadow: inset 0 -4px 0 rgba(93, 173, 226, 0.12), 0 8px 18px rgba(93, 173, 226, 0.14);
  }

  .page-title {
    color: #4A5F7A;
    text-shadow: 0 3px 0 rgba(255, 255, 255, 0.9);
  }

  .star-count {
    box-shadow: inset 0 -5px 0 rgba(255, 140, 0, 0.2), 0 10px 22px rgba(255, 190, 60, 0.28);
  }
}

.main-content {
  max-width: 1400px;
  padding: 42px max(20px, env(safe-area-inset-right)) calc(40px + env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
}

.game-grid {
  gap: 24px;
}

.game-card {
  min-height: 260px;
  padding: 40px 28px 32px;
  border: 5px solid rgba(255, 255, 255, 0.82);
  border-radius: 38px;
  box-shadow: inset 0 -10px 0 rgba(255, 255, 255, 0.28), 0 18px 38px rgba(116, 139, 170, 0.16);
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    box-shadow: inset 0 -10px 0 rgba(255, 255, 255, 0.34), 0 0 0 6px rgba(255, 183, 77, 0.34), 0 22px 46px rgba(116, 139, 170, 0.2);
  }

  .card-icon {
    font-size: 82px;
    margin-bottom: 14px;
    filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.08));
  }

  .card-title {
    color: #4A5F7A;
    font-size: 30px;
    margin-bottom: 8px;
  }

  .card-desc {
    color: #6F8299;
    margin-bottom: 14px;
  }

  .card-levels {
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    color: #4A5F7A;
  }
}

@media (min-width: 481px) and (max-width: 1024px) {
  .header {
    padding: 12px 18px;
  }

  .main-content {
    max-width: 100%;
    padding-top: 24px;
  }

  .game-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .game-card {
    min-height: 190px;
    padding: 28px 12px 20px;

    .card-icon {
      font-size: 58px;
      margin-bottom: 8px;
    }

    .card-title {
      font-size: 22px;
      margin-bottom: 6px;
    }

    .card-desc {
      display: none;
    }
  }
}

@media (max-width: 480px) {
  .header {
    flex-wrap: nowrap;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 26px;

    .btn-back,
    .star-count {
      min-height: 46px;
      padding: 8px 12px;
      font-size: 16px;
      flex-shrink: 0;
    }

    .page-title {
      flex: 1;
      overflow: hidden;
      font-size: 26px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .main-content {
    padding: 18px 12px calc(16px + env(safe-area-inset-bottom));
  }

  .game-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .game-card {
    min-height: 128px;
    padding: 14px 8px 10px;
    border-radius: 26px;
    line-height: 1.15;

    .card-icon {
      font-size: 40px;
      line-height: 1;
      margin-bottom: 5px;
    }

    .card-title {
      margin-bottom: 4px;
      font-size: 17px;
      line-height: 1.12;
    }

    .card-desc {
      display: none;
    }

    .card-levels {
      padding: 3px 8px;
      font-size: 11px;
      line-height: 1.1;
    }
  }
}

@media (max-width: 380px) and (max-height: 700px) {
  .header {
    margin-top: 8px;

    .page-title {
      font-size: 22px;
    }
  }

  .main-content {
    padding-top: 14px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }

  .game-card {
    min-height: 106px;
    padding-top: 10px;

    .card-icon {
      font-size: 32px;
    }

    .card-title {
      font-size: 15px;
    }
  }
}

@media (orientation: landscape) and (min-width: 900px) and (max-height: 820px) {
  .header {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .main-content {
    padding-top: 24px;
  }

  .game-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .game-card {
    min-height: 210px;
    padding: 28px 18px 22px;

    .card-icon {
      font-size: 66px;
      margin-bottom: 8px;
    }

    .card-title {
      font-size: 24px;
    }
  }
}

@media (orientation: landscape) and (max-height: 430px) {
  .game-list-page {
    height: 100dvh;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .header {
    flex-shrink: 0;
    margin: max(4px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) 0 max(8px, env(safe-area-inset-left));
    padding: 5px 8px;
    border-width: 2px;
    border-radius: 18px;
    gap: 6px;

    .btn-back,
    .star-count {
      min-height: 30px;
      padding: 4px 9px;
      border-radius: 14px;
      font-size: 12px;
    }

    .page-title {
      flex: 1;
      min-width: 0;
      font-size: clamp(18px, 3.4vw, 23px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .main-content {
    flex: 1;
    width: 100%;
    max-width: none;
    min-height: 0;
    padding: 8px calc(max(10px, env(safe-area-inset-right)) + 42px) calc(8px + env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
    overflow: hidden;
  }

  .game-grid {
    height: 100%;
    min-height: 0;
    gap: 8px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: minmax(0, 1fr);
  }

  .game-card {
    min-height: 0;
    padding: 10px 8px;
    border-width: 2px;
    border-radius: 20px;

    .card-icon {
      margin-bottom: 3px;
      font-size: clamp(30px, 7vw, 46px);
      line-height: 1;
    }

    .card-title {
      margin-bottom: 3px;
      font-size: clamp(14px, 2.8vw, 18px);
      line-height: 1.1;
    }

    .card-desc {
      display: none;
    }

    .card-levels {
      padding: 3px 8px;
      font-size: 10px;
      line-height: 1;
    }
  }
}

@media (orientation: landscape) and (max-height: 380px) {
  .game-card {
    padding: 8px 7px;

    .card-icon {
      font-size: clamp(26px, 6vw, 38px);
    }
  }
}
</style>
