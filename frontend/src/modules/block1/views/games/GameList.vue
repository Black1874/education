<template>
  <div class="game-list-page">
    <header class="header">
      <button class="btn-back" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <h1 class="page-title">游戏世界</h1>
      <div class="star-count">
        <span class="star-icon">⭐</span>
        <span class="count">120</span>
      </div>
    </header>

    <main class="main-content">
      <div class="game-grid">
        <div
          v-for="game in games"
          :key="game.id"
          class="game-card"
          :style="{ background: game.color }"
          @click="goToGame(game.id)"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { audioManager } from '@/modules/common/utils/audio'

const router = useRouter()

const games = ref([
  {
    id: 'memory',
    name: '记忆游戏',
    emoji: '🧠',
    description: '考验你的记忆力',
    color: 'linear-gradient(135deg, #FFE4E1 0%, #FF6B9D 100%)',
    totalLevels: 15
  },
  {
    id: 'classify',
    name: '分类游戏',
    emoji: '📦',
    description: '把物品分类整理',
    color: 'linear-gradient(135deg, #FFE4CC 0%, #FFA07A 100%)',
    totalLevels: 15
  },
  {
    id: 'puzzle',
    name: '拼图游戏',
    emoji: '🧩',
    description: '拼出完整的图案',
    color: 'linear-gradient(135deg, #E0F8F0 0%, #98D8C8 100%)',
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
</style>
