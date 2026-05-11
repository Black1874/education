<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-left">
        <h1 class="logo">🎈 儿童教育平台</h1>
      </div>
      <div class="header-right">
        <div class="star-count">
          <span class="star-icon">⭐</span>
          <span class="count">{{ totalStars }}</span>
        </div>
        <div class="user-avatar" @click="showUserMenu = !showUserMenu">
          <span>👦</span>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="welcome-section">
        <h2 class="welcome-text">你好，{{ nickname }}！</h2>
        <p class="welcome-subtitle">今天想学点什么呢？</p>
      </div>

      <!-- 两个大入口 -->
      <div class="entrance-cards">
        <div class="entrance-card learning-card" @click="goToLearning">
          <div class="card-icon">📚</div>
          <h3 class="card-title">学习乐园</h3>
          <p class="card-desc">认识动物、水果、颜色...</p>
          <div class="card-badge">8个主题</div>
        </div>

        <div class="entrance-card game-card" @click="goToGames">
          <div class="card-icon">🎮</div>
          <h3 class="card-title">游戏世界</h3>
          <p class="card-desc">记忆、拼图、找不同...</p>
          <div class="card-badge">6种游戏</div>
        </div>
      </div>

      <!-- 虚拟宠物 -->
      <div class="pet-section" v-if="showPet">
        <div class="pet-card">
          <div class="pet-avatar">🐼</div>
          <div class="pet-info">
            <h4>我的小熊猫</h4>
            <div class="pet-status">
              <span>饥饿度: {{ petHunger }}%</span>
              <span>快乐度: {{ petHappiness }}%</span>
            </div>
          </div>
          <button class="btn-feed" @click="feedPet">喂食</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storageManager } from '@/modules/common/utils/storage'
import { audioManager } from '@/modules/common/utils/audio'
import { toast } from '@/modules/common/utils/toast'

const router = useRouter()

// 用户数据（从本地存储加载）
const nickname = ref('小宝贝')
const totalStars = ref(0)
const availableStars = ref(0)
const showUserMenu = ref(false)

// 宠物数据（从本地存储加载）
const showPet = ref(true)
const petHunger = ref(100)
const petHappiness = ref(100)

// 初始化数据
onMounted(() => {
  loadUserData()
  // 宠物自然消耗
  storageManager.petDecay()
  loadUserData() // 重新加载更新后的数据
})

// 加载用户数据
const loadUserData = () => {
  const data = storageManager.getUserData()
  nickname.value = data.nickname
  totalStars.value = data.totalStars
  availableStars.value = data.availableStars
  petHunger.value = data.petHunger
  petHappiness.value = data.petHappiness
}

// 导航方法（带音效）
const goToLearning = () => {
  audioManager.playClick()
  router.push('/learning')
}

const goToGames = () => {
  audioManager.playClick()
  router.push('/games')
}

// 喂养宠物（带音效和本地存储）
const feedPet = () => {
  audioManager.playClick()

  if (storageManager.feedPet(10)) {
    audioManager.playSuccess()
    toast.success('🎉 小熊猫吃饱啦！')
    loadUserData() // 刷新数据
  } else {
    audioManager.playError()
    toast.warning('⭐ 星星不够啦，快去学习和玩游戏赚星星吧！')
  }
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF9E6 0%, #FFE4E1 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .logo {
    font-size: 32px;
    font-weight: bold;
    color: #5DADE2;
    margin: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
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
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);

    .star-icon {
      font-size: 28px;
    }
  }

  .user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #F8B4D9, #FCE4EC);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 60px;

  .welcome-text {
    font-size: 48px;
    font-weight: bold;
    color: #2C3E50;
    margin-bottom: 16px;
  }

  .welcome-subtitle {
    font-size: 24px;
    color: #5D6D7E;
  }
}

.entrance-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.entrance-card {
  background: white;
  border-radius: 32px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.5) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);

    &::before {
      opacity: 1;
    }

    .card-icon {
      transform: scale(1.2) rotate(10deg);
    }
  }

  &:active {
    transform: translateY(-4px);
  }

  .card-icon {
    font-size: 120px;
    margin-bottom: 24px;
    transition: transform 0.3s;
  }

  .card-title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #2C3E50;
  }

  .card-desc {
    font-size: 20px;
    color: #5D6D7E;
    margin-bottom: 24px;
  }

  .card-badge {
    display: inline-block;
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
  }

  &.learning-card {
    background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);

    .card-badge {
      background: #4CAF50;
    }
  }

  &.game-card {
    background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);

    .card-badge {
      background: #2196F3;
    }
  }
}

.pet-section {
  max-width: 600px;
  margin: 0 auto;
}

.pet-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  .pet-avatar {
    font-size: 80px;
    animation: bounce 2s infinite;
  }

  .pet-info {
    flex: 1;

    h4 {
      font-size: 24px;
      margin-bottom: 12px;
      color: #2C3E50;
    }

    .pet-status {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 16px;
      color: #5D6D7E;
    }
  }

  .btn-feed {
    padding: 16px 32px;
    font-size: 20px;
    font-weight: bold;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: white;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
