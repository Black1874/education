<template>
  <div class="home-page polished-shell">
    <!-- 顶部导航 -->
    <header class="header polished-panel">
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
        <div
          class="entrance-card learning-card"
          role="button"
          tabindex="0"
          aria-label="进入学习乐园"
          @click="goToLearning"
          @keydown.enter.prevent="goToLearning"
          @keydown.space.prevent="goToLearning"
        >
          <div class="card-icon">📚</div>
          <h3 class="card-title">学习乐园</h3>
          <p class="card-desc">认识动物、水果、颜色...</p>
          <div class="card-badge">8个主题</div>
        </div>

        <div
          class="entrance-card game-card"
          role="button"
          tabindex="0"
          aria-label="进入游戏世界"
          @click="goToGames"
          @keydown.enter.prevent="goToGames"
          @keydown.space.prevent="goToGames"
        >
          <div class="card-icon">🎮</div>
          <h3 class="card-title">游戏世界</h3>
          <p class="card-desc">记忆、拼图、找不同...</p>
          <div class="card-badge">6种游戏</div>
        </div>
      </div>

      <!-- 虚拟宠物 -->
      <div class="pet-section" v-if="showPet">
        <div class="pet-card polished-panel">
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

// 首页移动端/平板单屏兼容
.home-page {
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
  padding: 16px 24px;
  border: 4px solid rgba(255, 255, 255, 0.78);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 14px 36px rgba(255, 160, 190, 0.18);
  backdrop-filter: blur(10px);

  .logo {
    color: #4A5F7A;
    text-shadow: 0 3px 0 rgba(255, 255, 255, 0.9);
  }

  .star-count,
  .user-avatar {
    min-height: 56px;
    border-radius: 999px;
  }
}

.main-content {
  padding: 28px max(20px, env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
}

.welcome-section {
  margin-bottom: 26px;

  .welcome-text {
    font-size: clamp(34px, 5vw, 48px);
    line-height: 1.18;
  }

  .welcome-subtitle {
    font-size: clamp(20px, 3vw, 24px);
  }
}

.entrance-cards {
  gap: 24px;
  margin-bottom: 24px;
}

.entrance-card {
  min-height: 260px;
  padding: 36px 28px;
  border: 5px solid rgba(255, 255, 255, 0.82);
  border-radius: 38px;
  box-shadow: inset 0 -10px 0 rgba(255, 255, 255, 0.28), 0 18px 38px rgba(116, 139, 170, 0.16);
  outline: none;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    box-shadow: inset 0 -10px 0 rgba(255, 255, 255, 0.34), 0 0 0 6px rgba(255, 183, 77, 0.34), 0 22px 46px rgba(116, 139, 170, 0.2);
  }

  .card-icon {
    font-size: clamp(78px, 10vw, 112px);
    margin-bottom: 14px;
  }

  .card-title {
    font-size: clamp(30px, 4vw, 36px);
    margin-bottom: 8px;
  }

  .card-desc {
    margin-bottom: 14px;
  }
}

.pet-card {
  border: 4px solid rgba(255, 255, 255, 0.82);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 14px 30px rgba(116, 139, 170, 0.14);
}

@media (max-width: 1024px) {
  .header {
    padding: 12px 18px;
  }

  .main-content {
    max-width: 100%;
    padding-top: 22px;
  }

  .entrance-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  .entrance-card {
    min-height: 210px;
    padding: 28px 18px;

    .card-desc {
      display: none;
    }
  }

  .pet-card {
    max-width: 620px;
    margin: 0 auto;
    padding: 20px 24px;

    .pet-avatar {
      font-size: 58px;
    }
  }
}

@media (max-width: 480px) {
  .header {
    flex-wrap: nowrap;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 26px;

    .logo {
      max-width: 180px;
      overflow: hidden;
      font-size: 22px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .header-right {
      gap: 8px;
      flex-shrink: 0;
    }

    .star-count {
      min-height: 46px;
      padding: 8px 12px;
      font-size: 16px;

      .star-icon {
        font-size: 20px;
      }
    }

    .user-avatar {
      width: 46px;
      height: 46px;
      font-size: 24px;
    }
  }

  .main-content {
    padding: 16px 12px calc(14px + env(safe-area-inset-bottom));
  }

  .welcome-section {
    margin-bottom: 14px;

    .welcome-text {
      font-size: 28px;
      margin-bottom: 4px;
    }

    .welcome-subtitle {
      font-size: 17px;
    }
  }

  .entrance-cards {
    gap: 12px;
    margin-bottom: 12px;
  }

  .entrance-card {
    min-height: 150px;
    padding: 18px 10px 14px;
    border-radius: 28px;

    .card-icon {
      font-size: 54px;
      margin-bottom: 6px;
    }

    .card-title {
      font-size: 22px;
      margin-bottom: 6px;
    }

    .card-badge {
      padding: 4px 10px;
      font-size: 12px;
    }
  }

  .pet-card {
    padding: 12px 14px;
    gap: 10px;

    .pet-avatar {
      font-size: 42px;
    }

    .pet-info h4 {
      font-size: 18px;
      margin-bottom: 4px;
    }

    .pet-info .pet-status {
      gap: 2px;
      font-size: 12px;
      line-height: 1.3;
    }

    .btn-feed {
      padding: 10px 14px;
      border-radius: 999px;
      font-size: 15px;
      white-space: nowrap;
    }
  }
}

@media (max-width: 380px) and (max-height: 700px) {
  .header .logo {
    max-width: 150px;
    font-size: 20px;
  }

  .welcome-section {
    display: none;
  }

  .entrance-card {
    min-height: 132px;

    .card-icon {
      font-size: 46px;
    }

    .card-title {
      font-size: 20px;
    }
  }

  .pet-card {
    padding: 10px 12px;
  }
}

@media (orientation: landscape) and (max-height: 520px) {
  .header {
    padding-top: 8px;
    padding-bottom: 8px;

    .logo {
      font-size: 24px;
    }
  }

  .main-content {
    padding-top: 14px;
  }

  .welcome-section {
    display: none;
  }

  .entrance-card {
    min-height: 150px;
    padding: 18px 12px;

    .card-icon {
      font-size: 52px;
    }
  }

  .pet-card {
    padding: 12px 18px;

    .pet-avatar {
      font-size: 42px;
    }
  }
}

@media (orientation: landscape) and (min-width: 900px) and (max-height: 820px) {
  .header {
    padding-top: 10px;
    padding-bottom: 10px;

    .logo {
      font-size: 26px;
    }

    .star-count,
    .user-avatar {
      min-height: 48px;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      font-size: 26px;
    }
  }

  .main-content {
    padding-top: 18px;
    padding-bottom: calc(14px + env(safe-area-inset-bottom));
  }

  .welcome-section {
    margin-bottom: 16px;

    .welcome-text {
      font-size: 34px;
      margin-bottom: 4px;
    }

    .welcome-subtitle {
      font-size: 18px;
    }
  }

  .entrance-cards {
    gap: 18px;
    margin-bottom: 16px;
  }

  .entrance-card {
    min-height: 190px;
    padding: 24px 18px;

    .card-icon {
      font-size: 70px;
      margin-bottom: 8px;
    }

    .card-title {
      font-size: 28px;
      margin-bottom: 6px;
    }

    .card-desc {
      display: none;
    }
  }

  .pet-card {
    max-width: 520px;
    padding: 14px 18px;

    .pet-avatar {
      font-size: 44px;
    }

    .pet-info h4 {
      font-size: 20px;
      margin-bottom: 4px;
    }

    .pet-info .pet-status {
      flex-direction: row;
      gap: 12px;
      font-size: 13px;
    }

    .btn-feed {
      padding: 10px 18px;
      border-radius: 999px;
      font-size: 16px;
    }
  }
}

@media (orientation: landscape) and (max-height: 430px) {
  .home-page {
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
    border-radius: 18px;

    .logo {
      max-width: 260px;
      font-size: clamp(18px, 3.6vw, 22px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .header-right {
      gap: 8px;
    }

    .star-count {
      min-height: 30px;
      padding: 4px 9px;
      border-radius: 14px;
      font-size: 12px;

      .star-icon {
        font-size: 14px;
      }
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      font-size: 18px;
    }
  }

  .main-content {
    flex: 1;
    width: 100%;
    max-width: none;
    min-height: 0;
    padding: 8px calc(max(10px, env(safe-area-inset-right)) + 42px) calc(8px + env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 8px;
    overflow: hidden;
  }

  .welcome-section {
    display: none;
  }

  .entrance-cards {
    min-height: 0;
    margin-bottom: 0;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .entrance-card {
    min-height: 0;
    padding: 14px 12px;
    border-radius: 24px;

    .card-icon {
      margin-bottom: 5px;
      font-size: clamp(42px, 10vw, 62px);
    }

    .card-title {
      margin-bottom: 4px;
      font-size: clamp(20px, 4vw, 26px);
    }

    .card-desc {
      display: none;
    }

    .card-badge {
      padding: 4px 12px;
      font-size: 12px;
    }
  }

  .pet-section {
    max-width: min(520px, 100%);
  }

  .pet-card {
    padding: 8px 12px;
    border-radius: 20px;
    gap: 10px;

    .pet-avatar {
      font-size: 32px;
    }

    .pet-info h4 {
      margin-bottom: 2px;
      font-size: 15px;
    }

    .pet-info .pet-status {
      flex-direction: row;
      gap: 8px;
      font-size: 11px;
    }

    .btn-feed {
      min-height: 30px;
      padding: 5px 12px;
      font-size: 12px;
    }
  }
}

@media (orientation: landscape) and (max-height: 380px) {
  .main-content {
    grid-template-rows: 1fr;
  }

  .pet-section {
    display: none;
  }
}
</style>
