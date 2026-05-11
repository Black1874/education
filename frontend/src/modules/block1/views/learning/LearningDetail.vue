<template>
  <div class="learning-detail-page">
    <!-- 顶部导航 -->
    <header class="header">
      <button class="btn-back" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <h1 class="page-title">{{ categoryInfo.name }}</h1>
      <div class="star-count">
        <span class="star-icon">⭐</span>
        <span class="count">120</span>
      </div>
    </header>

    <!-- 分类标签 -->
    <div class="sub-category-tabs" v-if="subCategories.length > 0">
      <button
        v-for="sub in subCategories"
        :key="sub.id"
        class="tab-btn"
        :class="{ active: currentSubCategory === sub.id }"
        @click="currentSubCategory = sub.id"
      >
        {{ sub.name }}
      </button>
    </div>

    <!-- 内容网格 -->
    <main class="main-content">
      <div class="content-grid">
        <div
          v-for="item in filteredContents"
          :key="item.id"
          class="content-card"
          @click="viewContent(item)"
        >
          <div class="card-image">
            <img :src="item.imageUrl" :alt="item.name" />
          </div>
          <div class="card-info">
            <h3 class="card-title">{{ item.name }}</h3>
            <button class="btn-favorite" :class="{ active: item.isFavorite }">
              {{ item.isFavorite ? '❤️' : '🤍' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 内容详情弹窗 -->
    <div class="modal-overlay" v-if="showModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="btn-close" @click="closeModal">✕</button>
        <div class="modal-image">
          <img :src="selectedContent?.imageUrl" :alt="selectedContent?.name" />
        </div>
        <h2 class="modal-title">{{ selectedContent?.name }}</h2>
        <p class="modal-desc" v-if="selectedContent?.description">
          {{ selectedContent.description }}
        </p>
        <div class="modal-actions">
          <button class="btn-play-sound" @click="playSound">
            🔊 播放声音
          </button>
          <button class="btn-favorite-modal" @click="toggleFavorite">
            {{ selectedContent?.isFavorite ? '❤️ 已收藏' : '🤍 收藏' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storageManager } from '@/modules/common/utils/storage'
import { audioManager } from '@/modules/common/utils/audio'
import { toast } from '@/modules/common/utils/toast'

const router = useRouter()
const route = useRoute()

// 类别信息
const categoryInfo = ref({
  id: 'animal',
  name: '认识动物',
  emoji: '🐾'
})

// 子分类
const subCategories = ref([
  { id: 'all', name: '全部' },
  { id: 'domestic', name: '家养动物' },
  { id: 'wild', name: '野生动物' },
  { id: 'bird', name: '鸟类' },
  { id: 'ocean', name: '海洋动物' },
  { id: 'insect', name: '昆虫' }
])

const currentSubCategory = ref('all')

// 学习内容数据（临时占位数据）
const contents = ref([
  {
    id: 1,
    name: '小猫',
    nameEn: 'Cat',
    imageUrl: '/images/animals/cat.svg',
    soundUrl: '/sounds/animals/cat.mp3',
    description: '小猫喜欢喵喵叫，爱吃鱼',
    subCategory: 'domestic',
    isFavorite: false
  },
  {
    id: 2,
    name: '小狗',
    nameEn: 'Dog',
    imageUrl: '/images/animals/dog.svg',
    soundUrl: '/sounds/animals/dog.mp3',
    description: '小狗是人类的好朋友',
    subCategory: 'domestic',
    isFavorite: false
  },
  {
    id: 3,
    name: '熊猫',
    nameEn: 'Panda',
    imageUrl: '/images/animals/panda.svg',
    soundUrl: '/sounds/animals/panda.mp3',
    description: '熊猫是中国的国宝',
    subCategory: 'wild',
    isFavorite: true
  },
  // 更多占位数据...
  ...Array.from({ length: 9 }, (_, i) => ({
    id: i + 4,
    name: `动物${i + 4}`,
    nameEn: `Animal${i + 4}`,
    imageUrl: '/images/animals/cat.svg',
    soundUrl: '/sounds/animals/cat.mp3',
    description: '这是一个可爱的小动物',
    subCategory: ['domestic', 'wild', 'bird'][i % 3],
    isFavorite: false
  }))
])

// 初始化收藏状态
onMounted(() => {
  contents.value.forEach(item => {
    item.isFavorite = storageManager.isFavorite(item.id)
  })
})

// 过滤内容
const filteredContents = computed(() => {
  if (currentSubCategory.value === 'all') {
    return contents.value
  }
  return contents.value.filter(item => item.subCategory === currentSubCategory.value)
})

// 弹窗相关
const showModal = ref(false)
const selectedContent = ref<any>(null)

const goBack = () => {
  audioManager.playClick()
  router.back()
}

const viewContent = (item: any) => {
  audioManager.playClick()
  selectedContent.value = item
  showModal.value = true

  // 奖励星星（首次查看）
  storageManager.addStars(5, `view_${item.id}`)

  // 自动播放声音
  setTimeout(() => {
    playSound()
  }, 300)
}

const closeModal = () => {
  audioManager.playClick()
  showModal.value = false
  selectedContent.value = null
}

const playSound = () => {
  if (selectedContent.value) {
    audioManager.playSuccess()
    toast.info(`🔊 ${selectedContent.value.name}`)
  }
}

const toggleFavorite = () => {
  if (selectedContent.value) {
    audioManager.playClick()

    if (selectedContent.value.isFavorite) {
      storageManager.removeFavorite(selectedContent.value.id)
      selectedContent.value.isFavorite = false
      toast.info('已取消收藏')
    } else {
      storageManager.addFavorite(selectedContent.value.id)
      selectedContent.value.isFavorite = true
      storageManager.addStars(2, `favorite_${selectedContent.value.id}`)
      audioManager.playSuccess()
      toast.success('❤️ 收藏成功！+2⭐')
    }
  }
}
</script>

<style scoped lang="scss">
.learning-detail-page {
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
  }
}

.sub-category-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  background: white;
  border-bottom: 2px solid #F0F0F0;
  overflow-x: auto;

  .tab-btn {
    padding: 12px 32px;
    font-size: 18px;
    font-weight: bold;
    background: #F5F5F5;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;

    &:hover {
      background: #E0E0E0;
    }

    &.active {
      background: linear-gradient(135deg, #5DADE2, #85C1E9);
      color: white;
    }
  }
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
}

.content-grid {
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

.content-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-4px) scale(1.02);
  }

  .card-image {
    width: 100%;
    aspect-ratio: 1;
    background: #F5F5F5;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .card-info {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 24px;
      font-weight: bold;
      color: #2C3E50;
      margin: 0;
    }

    .btn-favorite {
      font-size: 28px;
      background: none;
      border: none;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.2);
      }

      &.active {
        animation: pulse 0.5s;
      }
    }
  }
}

// 弹窗样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.modal-content {
  background: white;
  border-radius: 32px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideInUp 0.3s;

  .btn-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    font-size: 28px;
    background: #F0F0F0;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #E0E0E0;
      transform: rotate(90deg);
    }
  }

  .modal-image {
    width: 100%;
    aspect-ratio: 1;
    background: #F5F5F5;
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 24px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .modal-title {
    font-size: 40px;
    font-weight: bold;
    color: #2C3E50;
    text-align: center;
    margin-bottom: 16px;
  }

  .modal-desc {
    font-size: 20px;
    color: #5D6D7E;
    text-align: center;
    line-height: 1.8;
    margin-bottom: 32px;
  }

  .modal-actions {
    display: flex;
    gap: 16px;

    button {
      flex: 1;
      padding: 20px;
      font-size: 20px;
      font-weight: bold;
      border: none;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
      }
    }

    .btn-play-sound {
      background: linear-gradient(135deg, #5DADE2, #85C1E9);
      color: white;
    }

    .btn-favorite-modal {
      background: linear-gradient(135deg, #F8B4D9, #FCE4EC);
      color: #2C3E50;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
</style>
