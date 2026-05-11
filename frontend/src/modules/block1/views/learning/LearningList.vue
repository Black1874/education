<template>
  <div class="learning-list-page">
    <!-- 顶部导航 -->
    <header class="header">
      <button class="btn-back" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <h1 class="page-title">学习乐园</h1>
      <div class="star-count">
        <span class="star-icon">⭐</span>
        <span class="count">120</span>
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
          @click="goToCategory(category.id)"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { audioManager } from '@/modules/common/utils/audio'

const router = useRouter()

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
</style>
