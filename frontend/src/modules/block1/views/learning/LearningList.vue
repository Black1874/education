<template>
  <div class="learning-list-page polished-shell">
    <!-- 顶部导航 -->
    <header class="header polished-panel">
      <button class="btn-back" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <h1 class="page-title">学习乐园</h1>
      <div class="star-count">
        <span class="star-icon">⭐</span>
        <span class="count">{{ totalStars }}</span>
      </div>
    </header>

    <!-- 学习类别网格 -->
    <main class="main-content">
      <div class="category-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          :style="{ background: category.color }"
          role="button"
          tabindex="0"
          :aria-label="`进入${category.name}`"
          @click="goToCategory(category.id)"
          @keydown.enter.prevent="goToCategory(category.id)"
          @keydown.space.prevent="goToCategory(category.id)"
        >
          <div class="card-icon">{{ category.emoji }}</div>
          <h3 class="card-title">{{ category.name }}</h3>
          <p class="card-desc">{{ category.description }}</p>
          <div class="card-count">{{ category.count }}个内容</div>
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

// 学习类别数据
const categories = ref([
  {
    id: 'animal',
    name: '认识动物',
    emoji: '🐾',
    description: '和可爱的小动物们做朋友',
    color: 'linear-gradient(135deg, #FFE4E1 0%, #FFB6C1 100%)',
    count: 50
  },
  {
    id: 'fruit',
    name: '认识水果',
    emoji: '🍎',
    description: '认识美味的水果',
    color: 'linear-gradient(135deg, #FFF5E6 0%, #FFD700 100%)',
    count: 40
  },
  {
    id: 'vegetable',
    name: '认识蔬菜',
    emoji: '🥕',
    description: '认识健康的蔬菜',
    color: 'linear-gradient(135deg, #E8F5E9 0%, #90EE90 100%)',
    count: 40
  },
  {
    id: 'color',
    name: '认识颜色',
    emoji: '🎨',
    description: '探索缤纷的色彩世界',
    color: 'linear-gradient(135deg, #FCE4EC 0%, #FF69B4 100%)',
    count: 12
  },
  {
    id: 'shape',
    name: '认识形状',
    emoji: '⭐',
    description: '发现有趣的形状',
    color: 'linear-gradient(135deg, #E3F2FD 0%, #87CEEB 100%)',
    count: 10
  },
  {
    id: 'number',
    name: '认识数字',
    emoji: '🔢',
    description: '学习数字0到20',
    color: 'linear-gradient(135deg, #FFF3E0 0%, #FFA500 100%)',
    count: 21
  },
  {
    id: 'letter',
    name: '认识字母',
    emoji: '🔤',
    description: '学习26个英文字母',
    color: 'linear-gradient(135deg, #F3E5F5 0%, #9370DB 100%)',
    count: 26
  },
  {
    id: 'vehicle',
    name: '认识交通工具',
    emoji: '🚗',
    description: '认识各种交通工具',
    color: 'linear-gradient(135deg, #E0F2F1 0%, #20B2AA 100%)',
    count: 20
  }
])

const goBack = () => {
  audioManager.playClick()
  router.back()
}

const goToCategory = (categoryId: string) => {
  audioManager.playClick()
  router.push(`/learning/${categoryId}`)
}
</script>

<style scoped lang="scss">
.learning-list-page {
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
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);

    .star-icon {
      font-size: 28px;
    }
  }
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.category-card {
  background: white;
  border-radius: 24px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.3);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

    &::before {
      opacity: 1;
    }

    .card-icon {
      transform: scale(1.2) rotate(10deg);
    }
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }

  .card-icon {
    font-size: 80px;
    margin-bottom: 16px;
    transition: transform 0.3s;
    display: inline-block;
  }

  .card-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 12px;
    color: #2C3E50;
  }

  .card-desc {
    font-size: 16px;
    color: #5D6D7E;
    margin-bottom: 16px;
    line-height: 1.6;
  }

  .card-count {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    font-size: 14px;
    font-weight: bold;
    color: #2C3E50;
  }
}

// 2岁宝宝友好视觉优化：柔和背景、大卡片、清晰点击反馈
.learning-list-page {
  position: relative;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 10% 12%, rgba(255, 214, 228, 0.92) 0 100px, transparent 102px),
    radial-gradient(circle at 90% 22%, rgba(194, 232, 255, 0.86) 0 120px, transparent 122px),
    radial-gradient(circle at 22% 92%, rgba(218, 245, 199, 0.82) 0 130px, transparent 132px),
    linear-gradient(135deg, #FFF8E7 0%, #FFEAF3 45%, #EAF7FF 100%);
}

.header {
  margin: 18px 24px 0;
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
    padding: 14px 26px;
    background: linear-gradient(135deg, #FFFFFF, #F3FBFF);
    color: #4B6175;
    box-shadow: inset 0 -4px 0 rgba(93, 173, 226, 0.12), 0 8px 18px rgba(93, 173, 226, 0.14);
  }

  .page-title {
    color: #4A5F7A;
    font-size: 42px;
    text-shadow: 0 3px 0 rgba(255, 255, 255, 0.9);
  }

  .star-count {
    box-shadow: inset 0 -5px 0 rgba(255, 140, 0, 0.2), 0 10px 22px rgba(255, 190, 60, 0.28);
  }
}

.main-content {
  padding-top: 48px;
}

.category-grid {
  gap: 36px;
}

.category-card {
  min-height: 260px;
  padding: 42px 28px;
  border: 5px solid rgba(255, 255, 255, 0.82);
  border-radius: 38px;
  box-shadow: inset 0 -10px 0 rgba(255, 255, 255, 0.28), 0 18px 38px rgba(116, 139, 170, 0.16);

  &::after {
    content: '点我开始';
    position: absolute;
    right: 20px;
    bottom: 18px;
    padding: 8px 16px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.78);
    color: #FF8DB3;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 6px 14px rgba(255, 141, 179, 0.14);
  }

  &:hover,
  &:active {
    transform: translateY(-6px) scale(1.025);
    box-shadow: inset 0 -10px 0 rgba(255, 255, 255, 0.34), 0 22px 46px rgba(116, 139, 170, 0.2);
  }

  &:active {
    transform: translateY(2px) scale(0.99);
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 -10px 0 rgba(255, 255, 255, 0.34), 0 0 0 6px rgba(255, 183, 77, 0.34), 0 22px 46px rgba(116, 139, 170, 0.2);
  }

  .card-icon {
    font-size: 92px;
    filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.08));
    animation: iconWiggle 4s ease-in-out infinite;
  }

  .card-title {
    color: #4A5F7A;
    font-size: 32px;
  }

  .card-desc {
    color: #6F8299;
    font-size: 19px;
  }

  .card-count {
    padding: 9px 18px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    color: #4A5F7A;
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .header {
    margin: 12px;
    padding: 14px;
    gap: 12px;
    flex-wrap: wrap;

    .page-title {
      order: 3;
      width: 100%;
      text-align: center;
      font-size: 34px;
    }
  }

  .main-content {
    padding: 32px 18px;
  }

  .category-card {
    min-height: 230px;
  }
}

@media (max-width: 1024px) {
  .learning-list-page {
    min-height: 100dvh;
  }

  .header {
    margin: max(12px, env(safe-area-inset-top)) max(14px, env(safe-area-inset-right)) 0 max(14px, env(safe-area-inset-left));
  }

  .main-content {
    max-width: 100%;
    padding: 42px max(20px, env(safe-area-inset-right)) calc(40px + env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
  }

  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .header {
    border-radius: 26px;
    flex-wrap: nowrap;
    gap: 8px;
    padding: 10px 12px;

    .btn-back,
    .star-count {
      min-height: 46px;
      padding: 8px 12px;
      font-size: 16px;
      flex-shrink: 0;
    }

    .page-title {
      order: initial;
      width: auto;
      flex: 1;
      font-size: 26px;
      white-space: nowrap;
    }
  }

  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .category-card {
    min-height: 96px;
    padding: 10px 8px 8px;
    border-radius: 26px;
    line-height: 1.15;

    &::after {
      display: none;
    }

    .card-icon {
      font-size: 34px;
      line-height: 1;
      margin-bottom: 4px;
    }

    .card-title {
      margin-bottom: 3px;
      font-size: 17px;
      line-height: 1.12;
    }

    .card-desc {
      display: none;
    }

    .card-count {
      padding: 3px 8px;
      font-size: 11px;
      line-height: 1.1;
    }
  }
}

@media (max-width: 480px) and (max-height: 780px) {
  .header {
    margin-top: 8px;

    .page-title {
      font-size: 28px;
    }
  }

  .main-content {
    padding-top: 18px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }

  .category-card {
    min-height: 88px;
    padding-top: 8px;

    .card-icon {
      font-size: 30px;
    }

    .card-title {
      font-size: 16px;
    }
  }
}

@media (min-width: 481px) and (max-width: 1024px) {
  .header {
    padding: 12px 18px;
  }

  .main-content {
    padding-top: 24px;
  }

  .category-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .category-card {
    min-height: 170px;
    padding: 24px 12px 18px;

    &::after {
      display: none;
    }

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

@media (orientation: landscape) and (max-height: 520px) {
  .header {
    padding-top: 10px;
    padding-bottom: 10px;

    .page-title {
      font-size: 28px;
    }
  }

  .main-content {
    padding-top: 24px;
  }

  .category-card {
    min-height: 170px;
    padding: 24px 18px;

    .card-icon {
      font-size: 62px;
      margin-bottom: 8px;
    }
  }
}

@keyframes iconWiggle {
  0%, 100% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(3deg) scale(1.04);
  }
}

@media (orientation: landscape) and (max-height: 430px) {
  .learning-list-page {
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
    padding: 8px max(10px, env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
    overflow: hidden;
  }

  .category-grid {
    height: 100%;
    min-height: 0;
    gap: 8px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-rows: minmax(0, 1fr);
  }

  .category-card {
    min-height: 0;
    padding: 9px 7px;
    border-width: 2px;
    border-radius: 20px;

    &::after {
      display: none;
    }

    .card-icon {
      margin-bottom: 3px;
      font-size: clamp(28px, 6vw, 42px);
      line-height: 1;
    }

    .card-title {
      margin-bottom: 3px;
      font-size: clamp(13px, 2.4vw, 17px);
      line-height: 1.1;
    }

    .card-desc {
      display: none;
    }

    .card-count {
      padding: 3px 7px;
      font-size: 10px;
      line-height: 1;
    }
  }
}

@media (orientation: landscape) and (max-height: 380px) {
  .category-card {
    padding: 7px 6px;

    .card-icon {
      font-size: clamp(24px, 5.2vw, 34px);
    }
  }
}
</style>
