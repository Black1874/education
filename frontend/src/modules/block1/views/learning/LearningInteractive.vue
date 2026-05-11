<template>
  <div class="learning-interactive-page">
    <!-- 顶部导航 -->
    <header class="header">
      <button class="btn-back" @click="goBack">
        <span>←</span>
        <span>返回</span>
      </button>
      <h1 class="page-title">{{ categoryInfo.name }}</h1>
      <div class="header-right">
        <div class="star-count">
          <span class="star-icon">⭐</span>
          <span class="count">{{ totalStars }}</span>
        </div>
      </div>
    </header>

    <!-- 模式选择（首次进入显示） -->
    <div class="mode-selection" v-if="!selectedMode">
      <h2 class="mode-title">选择学习方式</h2>
      <div class="mode-grid">
        <div
          v-for="mode in learningModes"
          :key="mode.id"
          class="mode-card"
          role="button"
          tabindex="0"
          :aria-label="`选择${mode.name}`"
          @click="selectMode(mode.id)"
          @keydown.enter.prevent="selectMode(mode.id)"
          @keydown.space.prevent="selectMode(mode.id)"
        >
          <div class="mode-icon">{{ mode.icon }}</div>
          <h3 class="mode-name">{{ mode.name }}</h3>
          <p class="mode-desc">{{ mode.description }}</p>
        </div>
      </div>
    </div>

    <!-- 互动学习区域 -->
    <main class="interactive-area" v-else>
      <!-- 自由探索模式 -->
      <div v-if="selectedMode === 'explore'" class="explore-mode">
        <div class="content-stage">
          <!-- 当前展示的内容 -->
          <div class="current-content" v-if="currentContent">
            <div class="content-image" @click="playContentSound">
              <img :src="currentContent.imageUrl" :alt="currentContent.name" />
              <div class="tap-hint">点击我！</div>
            </div>
            <h2 class="content-name">{{ currentContent.name }}</h2>
            <p class="content-desc">{{ currentContent.description }}</p>
          </div>

          <!-- 左右大箭头 -->
          <button class="nav-arrow left" @click="prevContent">
            <span>◀</span>
          </button>
          <button class="nav-arrow right" @click="nextContent">
            <span>▶</span>
          </button>
        </div>

        <!-- 底部导航条 -->
        <div class="content-nav">
          <div class="nav-dots">
            <span
              v-for="(item, index) in filteredContents"
              :key="item.id"
              class="dot"
              :class="{ active: index === currentIndex }"
              @click="goToContent(index)"
            ></span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button class="action-btn favorite" @click="toggleFavorite">
            {{ currentContent?.isFavorite ? '❤️ 已收藏' : '🤍 收藏' }}
          </button>
          <button class="action-btn play" @click="playContentSound">
            🔊 播放声音
          </button>
          <button
            class="action-btn autoplay"
            :class="{ active: isAutoPlay }"
            @click="toggleAutoPlay"
          >
            {{ isAutoPlay ? '⏸️ 暂停' : '▶️ 自动播放' }}
          </button>
        </div>
      </div>

      <!-- 配对游戏模式 -->
      <div v-else-if="selectedMode === 'matching'" class="matching-mode">
        <!-- 记忆阶段 - 展示所有卡片 -->
        <div v-if="matchingPhase === 'memorize'" class="memorize-phase">
          <h2 class="phase-title">第 {{ challengeRound }} 轮：记住它们的位置</h2>
          <div class="countdown">{{ memorizeCountdown }}秒</div>
          <div class="matching-grid preview">
            <div
              v-for="card in matchingCards"
              :key="card.id"
              class="matching-card preview-card"
            >
              <div class="card-back">
                <img :src="card.imageUrl" :alt="card.name" />
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏阶段 -->
        <div v-else class="game-phase">
          <div class="game-info">
            <div class="round">第 {{ challengeRound }} 轮</div>
            <div class="score">得分: {{ gameScore }}</div>
            <div class="timer">时间: {{ gameTime }}s</div>
          </div>

          <div class="matching-grid">
            <div
              v-for="card in matchingCards"
              :key="card.id"
              class="matching-card"
              :class="{ flipped: card.flipped, matched: card.matched }"
              @click="flipCard(card)"
            >
              <div class="card-front">❓</div>
              <div class="card-back">
                <img :src="card.imageUrl" :alt="card.name" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速识别模式 -->
      <div v-else-if="selectedMode === 'quick'" class="quick-mode">
        <div class="game-info">
          <div class="round">第 {{ challengeRound }} 轮</div>
          <div class="score">得分: {{ gameScore }}</div>
          <div class="combo">连击: {{ combo }}x</div>
          <div class="progress">题目: {{ questionCount }}/{{ maxQuestionCount }}</div>
        </div>

        <div class="question-area">
          <!-- 语音播放按钮 -->
          <button class="voice-question-btn" @click="playQuestionVoice">
            <span class="icon">🔊</span>
            <span class="text">请找出：{{ targetName }}</span>
          </button>

          <div class="options-grid">
            <div
              v-for="option in quickOptions"
              :key="option.id"
              class="option-card"
              :class="getOptionClass(option)"
              role="button"
              tabindex="0"
              :aria-label="`选择${option.name}`"
              @click="selectOption(option)"
              @keydown.enter.prevent="selectOption(option)"
              @keydown.space.prevent="selectOption(option)"
            >
              <img :src="option.imageUrl" :alt="option.name" />
              <div v-if="selectedOptionId === option.id" class="answer-badge">
                {{ option.id === targetContent?.id ? '真棒' : '再试试' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 听声辨物模式 -->
      <div v-else-if="selectedMode === 'sound'" class="sound-mode">
        <div class="game-info">
          <div class="round">第 {{ challengeRound }} 轮</div>
          <div class="score">得分: {{ gameScore }}</div>
          <div class="progress">题目: {{ questionCount }}/{{ maxQuestionCount }}</div>
        </div>

        <div class="sound-game">
          <button class="play-sound-btn" @click="playTargetSound">
            <span class="icon">🔊</span>
            <span class="text">播放声音</span>
          </button>

          <h2 class="question">
            {{
              categoryInfo.id === 'animal' ? '这是什么动物？' :
              categoryInfo.id === 'fruit' ? '这是什么水果？' :
              categoryInfo.id === 'vegetable' ? '这是什么蔬菜？' :
              categoryInfo.id === 'color' ? '这是什么颜色？' :
              categoryInfo.id === 'shape' ? '这是什么形状？' :
              categoryInfo.id === 'number' ? '这是数字几？' :
              categoryInfo.id === 'letter' ? '这是字母什么？' :
              categoryInfo.id === 'vehicle' ? '这是什么交通工具？' :
              '这是什么？'
            }}
          </h2>

          <div class="options-grid">
            <div
              v-for="option in quickOptions"
              :key="option.id"
              class="option-card"
              :class="getOptionClass(option)"
              role="button"
              tabindex="0"
              :aria-label="`选择${option.name}`"
              @click="selectOption(option)"
              @keydown.enter.prevent="selectOption(option)"
              @keydown.space.prevent="selectOption(option)"
            >
              <img :src="option.imageUrl" :alt="option.name" />
              <div v-if="selectedOptionId === option.id" class="answer-badge">
                {{ option.id === targetContent?.id ? '真棒' : '再试试' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="transitionMessage" class="level-transition">
        <div class="transition-card">
          <div class="transition-icon">{{ transitionIcon }}</div>
          <h2>{{ transitionMessage }}</h2>
          <p>{{ transitionSubMessage }}</p>
        </div>
      </div>

      <!-- 模式切换按钮 -->
      <button class="change-mode-btn" @click="changeMode">
        🔄 切换模式
      </button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storageManager } from '@/modules/common/utils/storage'
import { audioManager } from '@/modules/common/utils/audio'
import { toast } from '@/modules/common/utils/toast'
import { FRUITS_DATA } from '@/config/fruits'
import { VEGETABLES_DATA } from '@/config/vegetables'
import { COLORS_DATA } from '@/config/colors'
import { SHAPES_DATA } from '@/config/shapes'
import { NUMBERS_DATA } from '@/config/numbers'
import { LETTERS_DATA } from '@/config/letters'
import { VEHICLES_DATA } from '@/config/vehicles'

const router = useRouter()
const route = useRoute()

// 类别配置映射
const categoryConfig: Record<string, any> = {
  animal: {
    id: 'animal',
    name: '认识动物',
    emoji: '🐾'
  },
  fruit: {
    id: 'fruit',
    name: '认识水果',
    emoji: '🍎'
  },
  vegetable: {
    id: 'vegetable',
    name: '认识蔬菜',
    emoji: '🥕'
  },
  color: {
    id: 'color',
    name: '认识颜色',
    emoji: '🎨'
  },
  shape: {
    id: 'shape',
    name: '认识形状',
    emoji: '⭐'
  },
  number: {
    id: 'number',
    name: '认识数字',
    emoji: '🔢'
  },
  letter: {
    id: 'letter',
    name: '认识字母',
    emoji: '🔤'
  },
  vehicle: {
    id: 'vehicle',
    name: '认识交通工具',
    emoji: '🚗'
  }
}

// 类别信息
const categoryInfo = ref(categoryConfig.animal)

const totalStars = ref(0)

// 学习模式
const learningModes = ref([
  {
    id: 'explore',
    name: '自由探索',
    icon: '🔍',
    description: '自由浏览，点击互动'
  },
  {
    id: 'matching',
    name: '配对游戏',
    icon: '🎴',
    description: '翻牌配对，考验记忆'
  },
  {
    id: 'quick',
    name: '快速识别',
    icon: '⚡',
    description: '快速找出正确答案'
  },
  {
    id: 'sound',
    name: '听声辨物',
    icon: '👂',
    description: '听声音猜动物'
  }
])

const selectedMode = ref<string | null>(null)

// 动物数据
const animalContents = [
  // 家养动物
  { id: 1, name: '小猫', imageUrl: '/images/animals/cat.svg', soundUrl: '/sounds/animals/cat.mp3', description: '小猫喜欢喵喵叫，爱吃鱼', subCategory: 'domestic', isFavorite: false },
  { id: 2, name: '小狗', imageUrl: '/images/animals/dog.svg', soundUrl: '/sounds/animals/dog.mp3', description: '小狗是人类的好朋友', subCategory: 'domestic', isFavorite: false },
  { id: 3, name: '小鸡', imageUrl: '/images/animals/chicken.svg', soundUrl: '/sounds/animals/chicken.mp3', description: '小鸡叽叽叫', subCategory: 'domestic', isFavorite: false },
  { id: 4, name: '鸭子', imageUrl: '/images/animals/duck.svg', soundUrl: '/sounds/animals/duck.mp3', description: '鸭子嘎嘎叫', subCategory: 'domestic', isFavorite: false },
  { id: 5, name: '小猪', imageUrl: '/images/animals/pig.svg', soundUrl: '/sounds/animals/pig.mp3', description: '小猪胖乎乎', subCategory: 'domestic', isFavorite: false },
  { id: 6, name: '兔子', imageUrl: '/images/animals/rabbit.svg', soundUrl: '/sounds/animals/rabbit.mp3', description: '兔子爱吃胡萝卜', subCategory: 'domestic', isFavorite: false },
  { id: 7, name: '小羊', imageUrl: '/images/animals/sheep.svg', soundUrl: '/sounds/animals/sheep.mp3', description: '小羊咩咩叫', subCategory: 'domestic', isFavorite: false },
  { id: 8, name: '奶牛', imageUrl: '/images/animals/cow.svg', soundUrl: '/sounds/animals/cow.mp3', description: '奶牛产牛奶', subCategory: 'domestic', isFavorite: false },
  { id: 9, name: '小马', imageUrl: '/images/animals/horse.svg', soundUrl: '/sounds/animals/horse.mp3', description: '小马跑得快', subCategory: 'domestic', isFavorite: false },
  { id: 10, name: '鹅', imageUrl: '/images/animals/goose.svg', soundUrl: '/sounds/animals/goose.mp3', description: '鹅会游泳', subCategory: 'domestic', isFavorite: false },
  { id: 11, name: '仓鼠', imageUrl: '/images/animals/hamster.svg', soundUrl: '/sounds/animals/hamster.mp3', description: '仓鼠很可爱', subCategory: 'domestic', isFavorite: false },
  { id: 12, name: '金鱼', imageUrl: '/images/animals/goldfish.svg', soundUrl: '/sounds/animals/goldfish.mp3', description: '金鱼在水里游', subCategory: 'domestic', isFavorite: false },

  // 野生动物
  { id: 13, name: '熊猫', imageUrl: '/images/animals/panda.svg', soundUrl: '/sounds/animals/panda.mp3', description: '熊猫是中国的国宝', subCategory: 'wild', isFavorite: false },
  { id: 14, name: '狮子', imageUrl: '/images/animals/lion.svg', soundUrl: '/sounds/animals/lion.mp3', description: '狮子是森林之王', subCategory: 'wild', isFavorite: false },
  { id: 15, name: '老虎', imageUrl: '/images/animals/tiger.svg', soundUrl: '/sounds/animals/tiger.mp3', description: '老虎很威武', subCategory: 'wild', isFavorite: false },
  { id: 16, name: '大象', imageUrl: '/images/animals/elephant.svg', soundUrl: '/sounds/animals/elephant.mp3', description: '大象有长鼻子', subCategory: 'wild', isFavorite: false },
  { id: 17, name: '长颈鹿', imageUrl: '/images/animals/giraffe.svg', soundUrl: '/sounds/animals/giraffe.mp3', description: '长颈鹿脖子很长', subCategory: 'wild', isFavorite: false },
  { id: 18, name: '猴子', imageUrl: '/images/animals/monkey.svg', soundUrl: '/sounds/animals/monkey.mp3', description: '猴子喜欢吃香蕉', subCategory: 'wild', isFavorite: false },
  { id: 19, name: '袋鼠', imageUrl: '/images/animals/kangaroo.svg', soundUrl: '/sounds/animals/kangaroo.mp3', description: '袋鼠会跳', subCategory: 'wild', isFavorite: false },
  { id: 20, name: '斑马', imageUrl: '/images/animals/zebra.svg', soundUrl: '/sounds/animals/zebra.mp3', description: '斑马有黑白条纹', subCategory: 'wild', isFavorite: false },
  { id: 21, name: '河马', imageUrl: '/images/animals/hippo.svg', soundUrl: '/sounds/animals/hippo.mp3', description: '河马喜欢水', subCategory: 'wild', isFavorite: false },
  { id: 22, name: '犀牛', imageUrl: '/images/animals/rhino.svg', soundUrl: '/sounds/animals/rhino.mp3', description: '犀牛有角', subCategory: 'wild', isFavorite: false },
  { id: 23, name: '狐狸', imageUrl: '/images/animals/fox.svg', soundUrl: '/sounds/animals/fox.mp3', description: '狐狸很聪明', subCategory: 'wild', isFavorite: false },
  { id: 24, name: '狼', imageUrl: '/images/animals/wolf.svg', soundUrl: '/sounds/animals/wolf.mp3', description: '狼会嚎叫', subCategory: 'wild', isFavorite: false },
  { id: 25, name: '熊', imageUrl: '/images/animals/bear.svg', soundUrl: '/sounds/animals/bear.mp3', description: '熊很强壮', subCategory: 'wild', isFavorite: false },
  { id: 26, name: '鹿', imageUrl: '/images/animals/deer.svg', soundUrl: '/sounds/animals/deer.mp3', description: '鹿有美丽的角', subCategory: 'wild', isFavorite: false },
  { id: 27, name: '松鼠', imageUrl: '/images/animals/squirrel.svg', soundUrl: '/sounds/animals/squirrel.mp3', description: '松鼠爱吃坚果', subCategory: 'wild', isFavorite: false },

  // 鸟类
  { id: 28, name: '麻雀', imageUrl: '/images/animals/sparrow.svg', soundUrl: '/sounds/animals/sparrow.mp3', description: '麻雀很常见', subCategory: 'bird', isFavorite: false },
  { id: 29, name: '鹦鹉', imageUrl: '/images/animals/parrot.svg', soundUrl: '/sounds/animals/parrot.mp3', description: '鹦鹉会说话', subCategory: 'bird', isFavorite: false },
  { id: 30, name: '老鹰', imageUrl: '/images/animals/eagle.svg', soundUrl: '/sounds/animals/eagle.mp3', description: '老鹰飞得高', subCategory: 'bird', isFavorite: false },
  { id: 31, name: '鸽子', imageUrl: '/images/animals/pigeon.svg', soundUrl: '/sounds/animals/pigeon.mp3', description: '鸽子是和平的象征', subCategory: 'bird', isFavorite: false },
  { id: 32, name: '孔雀', imageUrl: '/images/animals/peacock.svg', soundUrl: '/sounds/animals/peacock.mp3', description: '孔雀会开屏', subCategory: 'bird', isFavorite: false },
  { id: 33, name: '企鹅', imageUrl: '/images/animals/penguin.svg', soundUrl: '/sounds/animals/penguin.mp3', description: '企鹅住在南极', subCategory: 'bird', isFavorite: false },
  { id: 34, name: '鸵鸟', imageUrl: '/images/animals/ostrich.svg', soundUrl: '/sounds/animals/ostrich.mp3', description: '鸵鸟跑得快', subCategory: 'bird', isFavorite: false },
  { id: 35, name: '猫头鹰', imageUrl: '/images/animals/owl.svg', soundUrl: '/sounds/animals/owl.mp3', description: '猫头鹰晚上活动', subCategory: 'bird', isFavorite: false },
  { id: 36, name: '天鹅', imageUrl: '/images/animals/swan.svg', soundUrl: '/sounds/animals/swan.mp3', description: '天鹅很优雅', subCategory: 'bird', isFavorite: false },

  // 海洋动物
  { id: 37, name: '海豚', imageUrl: '/images/animals/dolphin.svg', soundUrl: '/sounds/animals/dolphin.mp3', description: '海豚很聪明', subCategory: 'ocean', isFavorite: false },
  { id: 38, name: '鲸鱼', imageUrl: '/images/animals/whale.svg', soundUrl: '/sounds/animals/whale.mp3', description: '鲸鱼很大', subCategory: 'ocean', isFavorite: false },
  { id: 39, name: '螃蟹', imageUrl: '/images/animals/crab.svg', soundUrl: '/sounds/animals/crab.mp3', description: '螃蟹有钳子', subCategory: 'ocean', isFavorite: false },
  { id: 40, name: '海龟', imageUrl: '/images/animals/turtle.svg', soundUrl: '/sounds/animals/turtle.mp3', description: '海龟游得慢', subCategory: 'ocean', isFavorite: false },
  { id: 41, name: '章鱼', imageUrl: '/images/animals/octopus.svg', soundUrl: '/sounds/animals/octopus.mp3', description: '章鱼有八条腿', subCategory: 'ocean', isFavorite: false },
  { id: 42, name: '海星', imageUrl: '/images/animals/starfish.svg', soundUrl: '/sounds/animals/starfish.mp3', description: '海星像星星', subCategory: 'ocean', isFavorite: false },
  { id: 43, name: '鲨鱼', imageUrl: '/images/animals/shark.svg', soundUrl: '/sounds/animals/shark.mp3', description: '鲨鱼牙齿尖', subCategory: 'ocean', isFavorite: false },
  { id: 44, name: '水母', imageUrl: '/images/animals/jellyfish.svg', soundUrl: '/sounds/animals/jellyfish.mp3', description: '水母会发光', subCategory: 'ocean', isFavorite: false },

  // 昆虫
  { id: 45, name: '蝴蝶', imageUrl: '/images/animals/butterfly.svg', soundUrl: '/sounds/animals/butterfly.mp3', description: '蝴蝶很漂亮', subCategory: 'insect', isFavorite: false },
  { id: 46, name: '蜜蜂', imageUrl: '/images/animals/bee.svg', soundUrl: '/sounds/animals/bee.mp3', description: '蜜蜂采蜂蜜', subCategory: 'insect', isFavorite: false },
  { id: 47, name: '蚂蚁', imageUrl: '/images/animals/ant.svg', soundUrl: '/sounds/animals/ant.mp3', description: '蚂蚁很勤劳', subCategory: 'insect', isFavorite: false },
  { id: 48, name: '瓢虫', imageUrl: '/images/animals/ladybug.svg', soundUrl: '/sounds/animals/ladybug.mp3', description: '瓢虫有斑点', subCategory: 'insect', isFavorite: false },
  { id: 49, name: '蜻蜓', imageUrl: '/images/animals/dragonfly.svg', soundUrl: '/sounds/animals/dragonfly.mp3', description: '蜻蜓会飞', subCategory: 'insect', isFavorite: false },
  { id: 50, name: '蜗牛', imageUrl: '/images/animals/snail.svg', soundUrl: '/sounds/animals/snail.mp3', description: '蜗牛爬得慢', subCategory: 'insect', isFavorite: false }
]

// 水果数据（转换格式以匹配界面需求）
const fruitContents = FRUITS_DATA.map(fruit => ({
  id: fruit.id,
  name: fruit.name,
  imageUrl: fruit.imageUrl,
  soundUrl: '', // 水果暂时没有音频
  description: fruit.description,
  subCategory: fruit.subCategory,
  isFavorite: false
}))

// 蔬菜数据（转换格式以匹配界面需求）
const vegetableContents = VEGETABLES_DATA.map(vegetable => ({
  id: vegetable.id,
  name: vegetable.name,
  imageUrl: vegetable.imageUrl,
  soundUrl: '', // 蔬菜暂时没有音频
  description: vegetable.description,
  subCategory: vegetable.subCategory,
  isFavorite: false
}))

// 颜色数据
const colorContents = COLORS_DATA.map(color => ({
  id: color.id,
  name: color.name,
  imageUrl: color.imageUrl,
  soundUrl: '',
  description: color.description,
  subCategory: color.subCategory,
  isFavorite: false
}))

// 形状数据
const shapeContents = SHAPES_DATA.map(shape => ({
  id: shape.id,
  name: shape.name,
  imageUrl: shape.imageUrl,
  soundUrl: '',
  description: shape.description,
  subCategory: shape.subCategory,
  isFavorite: false
}))

// 数字数据
const numberContents = NUMBERS_DATA.map(number => ({
  id: number.id,
  name: number.name,
  imageUrl: number.imageUrl,
  soundUrl: '',
  description: number.description,
  subCategory: number.subCategory,
  isFavorite: false
}))

// 字母数据
const letterContents = LETTERS_DATA.map(letter => ({
  id: letter.id,
  name: letter.name,
  imageUrl: letter.imageUrl,
  soundUrl: '',
  description: letter.description,
  subCategory: letter.subCategory,
  isFavorite: false
}))

// 交通工具数据
const vehicleContents = VEHICLES_DATA.map(vehicle => ({
  id: vehicle.id,
  name: vehicle.name,
  imageUrl: vehicle.imageUrl,
  soundUrl: '',
  description: vehicle.description,
  subCategory: vehicle.subCategory,
  isFavorite: false
}))

// 学习内容数据（根据类别动态切换）
const contents = ref<any[]>([])

// 初始化收藏状态
const initFavorites = () => {
  contents.value.forEach(item => {
    item.isFavorite = storageManager.isFavorite(item.id)
  })
}

// 自由探索模式
const currentIndex = ref(0)
const currentContent = computed(() => filteredContents.value[currentIndex.value])
const filteredContents = computed(() => contents.value)
const isAutoPlay = ref(false)
let autoPlayTimer: any = null

// 游戏数据
const gameScore = ref(0)
const gameTime = ref(0)
const combo = ref(0)
const matchingCards = ref<any[]>([])
const matchingPhase = ref<'memorize' | 'game'>('memorize')
const memorizeCountdown = ref(10)
const quickOptions = ref<any[]>([])
const targetName = ref('')
const targetContent = ref<any>(null)
const questionCount = ref(0)
const maxQuestionCount = 5
const isAnswerLocked = ref(false)
const selectedOptionId = ref<number | null>(null)
const challengeRound = ref(1)
const transitionMessage = ref('')
const transitionSubMessage = ref('')
const transitionIcon = ref('🎉')
let gameTimer: any = null
let memorizeTimer: any = null
let delayedActionTimer: any = null
let flippedCards: any[] = []

onMounted(() => {
  loadUserData()
  initFavorites()
})

onUnmounted(() => {
  cleanupTimers()
})

const cleanupTimers = () => {
  if (gameTimer) {
    clearInterval(gameTimer)
    gameTimer = null
  }
  if (memorizeTimer) {
    clearInterval(memorizeTimer)
    memorizeTimer = null
  }
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
  if (delayedActionTimer) {
    clearTimeout(delayedActionTimer)
    delayedActionTimer = null
  }
  isAutoPlay.value = false
}

const clearTransition = () => {
  transitionMessage.value = ''
  transitionSubMessage.value = ''
  transitionIcon.value = '🎉'
}

const showTransition = (message: string, subMessage: string, icon = '🎉') => {
  transitionMessage.value = message
  transitionSubMessage.value = subMessage
  transitionIcon.value = icon
}

const resetLearningState = () => {
  cleanupTimers()
  currentIndex.value = 0
  gameScore.value = 0
  gameTime.value = 0
  combo.value = 0
  matchingCards.value = []
  matchingPhase.value = 'memorize'
  memorizeCountdown.value = 10
  quickOptions.value = []
  targetName.value = ''
  targetContent.value = null
  questionCount.value = 0
  isAnswerLocked.value = false
  selectedOptionId.value = null
  challengeRound.value = 1
  clearTransition()
  flippedCards = []
}

// 监听路由变化，切换数据源
watch(() => route.params.category, (newCategory) => {
  const category = newCategory as string
  if (category && categoryConfig[category]) {
    categoryInfo.value = categoryConfig[category]
    // 根据类别加载对应数据
    if (category === 'fruit') {
      contents.value = [...fruitContents]
    } else if (category === 'vegetable') {
      contents.value = [...vegetableContents]
    } else if (category === 'color') {
      contents.value = [...colorContents]
    } else if (category === 'shape') {
      contents.value = [...shapeContents]
    } else if (category === 'number') {
      contents.value = [...numberContents]
    } else if (category === 'letter') {
      contents.value = [...letterContents]
    } else if (category === 'vehicle') {
      contents.value = [...vehicleContents]
    } else {
      contents.value = [...animalContents]
    }
    // 重置模式选择
    resetLearningState()
    selectedMode.value = null
    initFavorites()
  }
}, { immediate: true })

const loadUserData = () => {
  const data = storageManager.getUserData()
  totalStars.value = data.totalStars
}

const goBack = () => {
  audioManager.playClick()
  stopAutoPlay()
  router.back()
}

const selectMode = (modeId: string) => {
  audioManager.playClick()
  cleanupTimers()
  clearTransition()
  selectedMode.value = modeId

  // 初始化对应模式
  if (modeId === 'matching') {
    initMatchingGame()
  } else if (modeId === 'quick') {
    initQuickGame()
  } else if (modeId === 'sound') {
    initQuickGame()
  } else if (modeId === 'explore') {
    // 自动播放当前内容的声音
    delayedActionTimer = setTimeout(() => {
      playContentSound()
    }, 500)
  }
}

const changeMode = () => {
  audioManager.playClick()
  resetLearningState()
  selectedMode.value = null
}

// 自由探索模式
const prevContent = () => {
  audioManager.playClick()
  stopAutoPlay()
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = filteredContents.value.length - 1
  }
  playContentSound()
}

const nextContent = () => {
  audioManager.playClick()
  if (currentIndex.value < filteredContents.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
  playContentSound()
}

const goToContent = (index: number) => {
  audioManager.playClick()
  stopAutoPlay()
  currentIndex.value = index
  playContentSound()
}

const toggleAutoPlay = () => {
  audioManager.playClick()
  isAutoPlay.value = !isAutoPlay.value

  if (isAutoPlay.value) {
    startAutoPlay()
    toast.info('▶️ 自动播放已开启')
  } else {
    stopAutoPlay()
    toast.info('⏸️ 自动播放已关闭')
  }
}

const startAutoPlay = () => {
  stopAutoPlay()
  autoPlayTimer = setInterval(() => {
    nextContent()
  }, 5000) // 每5秒切换
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
  isAutoPlay.value = false
}

const playContentSound = () => {
  if (currentContent.value) {
    audioManager.playSuccess()
    // 使用语音合成播放名称
    speakText(currentContent.value.name)
    if (storageManager.markContentLearned(currentContent.value.id)) {
      storageManager.addStars(5, `learn_${currentContent.value.id}`)
      toast.success('⭐ 第一次学会啦！+5⭐')
      loadUserData()
    }
  }
}

const toggleFavorite = () => {
  if (currentContent.value) {
    audioManager.playClick()

    if (currentContent.value.isFavorite) {
      storageManager.removeFavorite(currentContent.value.id)
      currentContent.value.isFavorite = false
      toast.info('已取消收藏')
    } else {
      storageManager.addFavorite(currentContent.value.id)
      currentContent.value.isFavorite = true
      storageManager.addStars(2, `favorite_${currentContent.value.id}`)
      audioManager.playSuccess()
      toast.success('❤️ 收藏成功！+2⭐')
      loadUserData()
    }
  }
}

// 配对游戏
const initMatchingGame = () => {
  cleanupTimers()
  clearTransition()
  gameScore.value = 0
  gameTime.value = 0
  combo.value = 0
  matchingPhase.value = 'memorize'
  memorizeCountdown.value = 10
  flippedCards = []

  // 随机选择4对卡片
  const shuffled = [...contents.value].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, 4)
  const cards: any[] = []

  selected.forEach((item) => {
    cards.push({
      id: `${item.id}-1`,
      pairId: item.id,
      imageUrl: item.imageUrl,
      name: item.name,
      flipped: false,
      matched: false
    })
    cards.push({
      id: `${item.id}-2`,
      pairId: item.id,
      imageUrl: item.imageUrl,
      name: item.name,
      flipped: false,
      matched: false
    })
  })

  // 打乱卡片位置
  matchingCards.value = cards.sort(() => Math.random() - 0.5)

  // 倒计时
  memorizeTimer = setInterval(() => {
    memorizeCountdown.value--
    if (memorizeCountdown.value <= 0) {
      clearInterval(memorizeTimer)
      startMatchingGame()
    }
  }, 1000)

  // 播放语音提示
  setTimeout(() => {
    speakText('记住它们的位置')
  }, 500)
}

const startMatchingGame = () => {
  clearTransition()
  if (gameTimer) clearInterval(gameTimer)
  matchingPhase.value = 'game'

  // 开始计时
  gameTimer = setInterval(() => {
    gameTime.value++
  }, 1000)

  // 播放语音提示
  speakText('开始配对吧')
}

const flipCard = (card: any) => {
  if (card.flipped || card.matched || flippedCards.length >= 2) return

  audioManager.playClick()
  card.flipped = true
  flippedCards.push(card)

  // 播放名称
  speakText(card.name)

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 1000)
  }
}

const checkMatch = () => {
  const [card1, card2] = flippedCards

  if (card1.pairId === card2.pairId) {
    // 配对成功
    card1.matched = true
    card2.matched = true
    gameScore.value += 10
    audioManager.playSuccess()
    toast.success('✅ 配对成功！+10分')
  } else {
    // 配对失败
    card1.flipped = false
    card2.flipped = false
    audioManager.playError()
    toast.error('❌ 再试试')
  }

  flippedCards = []

  // 检查是否全部完成
  if (matchingCards.value.every(c => c.matched)) {
    clearInterval(gameTimer)
    gameTimer = null
    const bonus = Math.max(0, 60 - gameTime.value) * 2
    gameScore.value += bonus
    storageManager.addStars(gameScore.value, 'matching_game')
    audioManager.playSuccess()
    speakText('完成了，准备下一轮')
    toast.success(`🎉 完成！得分：${gameScore.value}，+${gameScore.value}⭐`)
    loadUserData()
    showTransition('配对完成！', '马上进入下一轮记忆挑战', '🎴')
    challengeRound.value++
    delayedActionTimer = setTimeout(() => {
      initMatchingGame()
    }, 2200)
  }
}

// 快速识别游戏
const initQuickGame = () => {
  cleanupTimers()
  clearTransition()
  gameScore.value = 0
  combo.value = 0
  questionCount.value = 0
  isAnswerLocked.value = false
  generateQuestion()
}

const generateQuestion = () => {
  clearTransition()
  isAnswerLocked.value = false
  selectedOptionId.value = null
  // 随机选择目标
  const target = contents.value[Math.floor(Math.random() * contents.value.length)]
  targetName.value = target.name
  targetContent.value = target

  // 生成选项（包含正确答案）
  const options = [target]
  const others = contents.value.filter(c => c.id !== target.id)

  while (options.length < 4 && others.length > 0) {
    const randomIndex = Math.floor(Math.random() * others.length)
    options.push(others.splice(randomIndex, 1)[0])
  }

  quickOptions.value = options.sort(() => Math.random() - 0.5)

  // 自动播放问题语音或目标声音
  delayedActionTimer = setTimeout(() => {
    if (selectedMode.value === 'sound') {
      playTargetSound()
    } else {
      playQuestionVoice()
    }
  }, 500)
}

const playQuestionVoice = () => {
  audioManager.playClick()
  speakText(`请找出${targetName.value}`)
}

const getOptionClass = (option: any) => ({
  selected: selectedOptionId.value === option.id,
  correct: selectedOptionId.value === option.id && option.id === targetContent.value?.id,
  wrong: selectedOptionId.value === option.id && option.id !== targetContent.value?.id,
  dimmed: isAnswerLocked.value && selectedOptionId.value !== option.id
})

const selectOption = (option: any) => {
  if (isAnswerLocked.value || !targetContent.value) return

  audioManager.playClick()
  isAnswerLocked.value = true
  selectedOptionId.value = option.id

  if (option.id === targetContent.value.id) {
    // 答对了
    combo.value++
    const points = 10 * combo.value
    gameScore.value += points
    audioManager.playSuccess()
    speakText('答对了')
    toast.success(`✅ 正确！+${points}分`)
    questionCount.value++

    if (questionCount.value >= maxQuestionCount) {
      const reward = Math.max(5, Math.floor(gameScore.value / 5))
      storageManager.addStars(reward, `${selectedMode.value}_learning_game`)
      toast.success(`🎉 挑战完成！+${reward}⭐`)
      loadUserData()
      showTransition('这一轮完成啦！', '准备进入下一轮挑战', '🌟')
      speakText('这一轮完成啦，准备下一轮')
      challengeRound.value++
      delayedActionTimer = setTimeout(() => {
        initQuickGame()
      }, 1800)
    } else {
      showTransition('答对啦！', `下一题马上开始（${questionCount.value}/${maxQuestionCount}）`, '✅')
      delayedActionTimer = setTimeout(() => {
        generateQuestion()
      }, 1500)
    }
  } else {
    // 答错了
    combo.value = 0
    audioManager.playError()
    speakText('再想想')
    toast.error('❌ 再想想')
    delayedActionTimer = setTimeout(() => {
      isAnswerLocked.value = false
      clearTransition()
    }, 800)
  }
}

const playTargetSound = () => {
  audioManager.playSuccess()
  // 听声辨物模式：播放动物叫声或水果描述
  if (selectedMode.value === 'sound') {
    if (categoryInfo.value.id === 'animal') {
      // 动物叫声模拟
      const soundMap: any = {
        // 家养动物
        '小猫': '喵喵喵', '小狗': '汪汪汪', '小鸡': '叽叽叽', '鸭子': '嘎嘎嘎',
        '小猪': '哼哼哼', '兔子': '啾啾啾', '小羊': '咩咩咩', '奶牛': '哞哞哞',
        '小马': '咴咴咴', '鹅': '嘎嘎嘎', '仓鼠': '吱吱吱', '金鱼': '咕噜咕噜',
        // 野生动物
        '熊猫': '嗷嗷嗷', '狮子': '吼吼吼', '老虎': '嗷呜嗷呜', '大象': '嗷嗷嗷',
        '长颈鹿': '哞哞哞', '猴子': '吱吱吱', '袋鼠': '呜呜呜', '斑马': '咴咴咴',
        '河马': '哼哼哼', '犀牛': '哼哼哼', '狐狸': '嗷嗷嗷', '狼': '嗷呜嗷呜',
        '熊': '吼吼吼', '鹿': '呦呦呦', '松鼠': '吱吱吱',
        // 鸟类
        '麻雀': '叽叽喳喳', '鹦鹉': '你好你好', '老鹰': '啾啾啾', '鸽子': '咕咕咕',
        '孔雀': '啊啊啊', '企鹅': '嘎嘎嘎', '鸵鸟': '咕咕咕', '猫头鹰': '咕咕咕',
        '天鹅': '嘎嘎嘎',
        // 海洋动物
        '海豚': '吱吱吱', '鲸鱼': '呜呜呜', '螃蟹': '咔嚓咔嚓', '海龟': '呼呼呼',
        '章鱼': '咕噜咕噜', '海星': '咕噜咕噜', '鲨鱼': '呜呜呜', '水母': '咕噜咕噜',
        // 昆虫
        '蝴蝶': '扑扑扑', '蜜蜂': '嗡嗡嗡', '蚂蚁': '沙沙沙', '瓢虫': '嗡嗡嗡',
        '蜻蜓': '嗡嗡嗡', '蜗牛': '咕噜咕噜'
      }
      const sound = soundMap[targetName.value] || targetName.value
      speakText(sound)
    } else if (categoryInfo.value.id === 'fruit') {
      // 水果描述提示
      const fruit = FRUITS_DATA.find(f => f.name === targetName.value)
      if (fruit) {
        // 播放水果的特征描述
        const hints = [
          `它是${fruit.color}的`,
          `它的味道是${fruit.taste}的`,
          fruit.description
        ]
        speakText(hints[Math.floor(Math.random() * hints.length)])
      } else {
        speakText(targetName.value)
      }
    } else if (categoryInfo.value.id === 'vegetable') {
      // 蔬菜描述提示
      const vegetable = VEGETABLES_DATA.find(v => v.name === targetName.value)
      if (vegetable) {
        // 播放蔬菜的特征描述
        const hints = [
          `它是${vegetable.color}的`,
          `它是${vegetable.type}`,
          vegetable.description
        ]
        speakText(hints[Math.floor(Math.random() * hints.length)])
      } else {
        speakText(targetName.value)
      }
    } else if (categoryInfo.value.id === 'color') {
      // 颜色描述提示
      const color = COLORS_DATA.find(c => c.name === targetName.value)
      if (color) {
        const hints = [
          color.description,
          `${color.name}的英文是${color.nameEn}`
        ]
        speakText(hints[Math.floor(Math.random() * hints.length)])
      } else {
        speakText(targetName.value)
      }
    } else if (categoryInfo.value.id === 'shape') {
      // 形状描述提示
      const shape = SHAPES_DATA.find(s => s.name === targetName.value)
      if (shape) {
        const hints = [
          shape.description,
          shape.sides > 0 ? `${shape.name}有${shape.sides}条边` : shape.description
        ]
        speakText(hints[Math.floor(Math.random() * hints.length)])
      } else {
        speakText(targetName.value)
      }
    } else if (categoryInfo.value.id === 'number') {
      // 数字描述提示
      const number = NUMBERS_DATA.find(n => n.name === targetName.value)
      if (number) {
        const hints = [
          number.description,
          `${number.name}的英文是${number.nameEn}`,
          `${number.name}的中文是${number.nameCn}`
        ]
        speakText(hints[Math.floor(Math.random() * hints.length)])
      } else {
        speakText(targetName.value)
      }
    } else if (categoryInfo.value.id === 'letter') {
      // 字母描述提示
      const letter = LETTERS_DATA.find(l => l.name === targetName.value)
      if (letter) {
        const hints = [
          letter.description,
          `字母${letter.name}的发音是${letter.pronunciation}`
        ]
        speakText(hints[Math.floor(Math.random() * hints.length)])
      } else {
        speakText(targetName.value)
      }
    } else if (categoryInfo.value.id === 'vehicle') {
      // 交通工具描述提示
      const vehicle = VEHICLES_DATA.find(v => v.name === targetName.value)
      if (vehicle) {
        const hints = [
          vehicle.description,
          `${vehicle.name}是${vehicle.type}交通工具`
        ]
        speakText(hints[Math.floor(Math.random() * hints.length)])
      } else {
        speakText(targetName.value)
      }
    }
  } else {
    speakText(targetName.value)
  }
}

// 语音合成工具
const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    // 取消之前的语音
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9 // 稍慢一点
    utterance.pitch = 1.2 // 稍高一点，更适合儿童
    window.speechSynthesis.speak(utterance)
  }
}
</script>

<style scoped lang="scss">
.learning-interactive-page {
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

  .header-right {
    display: flex;
    gap: 16px;
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

// 模式选择
.mode-selection {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 40px;

  .mode-title {
    font-size: 40px;
    text-align: center;
    margin-bottom: 40px;
    color: #2C3E50;
  }

  .mode-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .mode-card {
    background: white;
    border-radius: 24px;
    padding: 40px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

      .mode-icon {
        transform: scale(1.2) rotate(10deg);
      }
    }

    .mode-icon {
      font-size: 80px;
      margin-bottom: 16px;
      transition: transform 0.3s;
    }

    .mode-name {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #2C3E50;
    }

    .mode-desc {
      font-size: 16px;
      color: #5D6D7E;
    }
  }
}

// 互动区域
.interactive-area {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  position: relative;
}

// 自由探索模式
.explore-mode {
  .content-stage {
    background: white;
    border-radius: 32px;
    padding: 60px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    margin-bottom: 32px;
    position: relative;

    .current-content {
      text-align: center;

      .content-image {
        width: 400px;
        height: 400px;
        margin: 0 auto 32px;
        cursor: pointer;
        position: relative;
        transition: transform 0.3s;

        &:hover {
          transform: scale(1.05);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .tap-hint {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 20px;
          color: #5DADE2;
          font-weight: bold;
          animation: bounce 1s infinite;
        }
      }

      .content-name {
        font-size: 48px;
        font-weight: bold;
        margin-bottom: 16px;
        color: #2C3E50;
      }

      .content-desc {
        font-size: 24px;
        color: #5D6D7E;
        line-height: 1.8;
      }
    }

    // 大箭头导航
    .nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #5DADE2, #85C1E9);
      border: none;
      font-size: 40px;
      color: white;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(93, 173, 226, 0.4);
      transition: all 0.3s;
      z-index: 10;

      &:hover {
        transform: translateY(-50%) scale(1.15);
        box-shadow: 0 6px 20px rgba(93, 173, 226, 0.5);
      }

      &:active {
        transform: translateY(-50%) scale(1.05);
      }

      &.left {
        left: 20px;
      }

      &.right {
        right: 20px;
      }

      @media (max-width: 768px) {
        width: 60px;
        height: 60px;
        font-size: 30px;

        &.left {
          left: 10px;
        }

        &.right {
          right: 10px;
        }
      }
    }
  }

  .content-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;

    .nav-dots {
      display: flex;
      gap: 12px;

      .dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #E0E0E0;
        cursor: pointer;
        transition: all 0.3s;

        &.active {
          background: #5DADE2;
          transform: scale(1.3);
        }

        &:hover {
          background: #5DADE2;
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;

    .action-btn {
      padding: 20px 40px;
      font-size: 24px;
      font-weight: bold;
      border: none;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      }

      &.favorite {
        background: linear-gradient(135deg, #F8B4D9, #FCE4EC);
      }

      &.play {
        background: linear-gradient(135deg, #5DADE2, #85C1E9);
        color: white;
      }

      &.autoplay {
        background: linear-gradient(135deg, #90EE90, #98D8C8);
        color: white;

        &.active {
          background: linear-gradient(135deg, #FFA500, #FFD700);
        }
      }
    }
  }
}

// 配对游戏模式
.matching-mode {
  // 记忆阶段
  .memorize-phase {
    text-align: center;

    .phase-title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 24px;
      color: #2C3E50;
    }

    .countdown {
      font-size: 80px;
      font-weight: bold;
      color: #5DADE2;
      margin-bottom: 40px;
      animation: pulse 1s infinite;
    }

    .matching-grid.preview {
      .preview-card {
        pointer-events: none;

        .card-back {
          transform: rotateY(0deg);
        }
      }
    }
  }

  // 游戏阶段
  .game-phase {
    .game-info {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin-bottom: 40px;
      font-size: 28px;
      font-weight: bold;
      color: #2C3E50;
    }
  }

  .matching-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    max-width: 800px;
    margin: 0 auto;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    .matching-card {
      aspect-ratio: 1;
      background: white;
      border-radius: 16px;
      cursor: pointer;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      &.flipped {
        transform: rotateY(180deg);
      }

      &.matched {
        opacity: 0.5;
        pointer-events: none;
      }

      .card-front,
      .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16px;
      }

      .card-front {
        background: linear-gradient(135deg, #5DADE2, #85C1E9);
        font-size: 64px;
      }

      .card-back {
        background: white;
        transform: rotateY(180deg);

        img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }
      }
    }
  }
}

// 快速识别模式
.quick-mode,
.sound-mode {
  .game-info {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 40px;
    font-size: 28px;
    font-weight: bold;
    color: #2C3E50;
  }

  .question-area,
  .sound-game {
    text-align: center;

    .voice-question-btn {
      width: 300px;
      height: 120px;
      border-radius: 24px;
      background: linear-gradient(135deg, #5DADE2, #85C1E9);
      border: none;
      cursor: pointer;
      margin: 0 auto 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      box-shadow: 0 8px 24px rgba(93, 173, 226, 0.4);
      transition: all 0.3s;
      animation: pulse 2s infinite;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 12px 32px rgba(93, 173, 226, 0.5);
      }

      .icon {
        font-size: 60px;
      }

      .text {
        font-size: 28px;
        font-weight: bold;
        color: white;
      }
    }

    .play-sound-btn {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(135deg, #5DADE2, #85C1E9);
      border: none;
      cursor: pointer;
      margin: 0 auto 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      box-shadow: 0 8px 24px rgba(93, 173, 226, 0.4);
      transition: all 0.3s;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 32px rgba(93, 173, 226, 0.5);
      }

      .icon {
        font-size: 80px;
      }

      .text {
        font-size: 24px;
        font-weight: bold;
        color: white;
      }
    }

    .question {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 40px;
      color: #2C3E50;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      max-width: 1000px;
      margin: 0 auto;

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .option-card {
        background: white;
        border-radius: 24px;
        padding: 24px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        &:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }

        img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: contain;
          margin-bottom: 12px;
        }

        .option-name {
          font-size: 20px;
          font-weight: bold;
          color: #2C3E50;
        }
      }
    }
  }
}

.level-transition {
  position: fixed;
  inset: 0;
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background: rgba(255, 249, 230, 0.6);
  backdrop-filter: blur(2px);

  .transition-card {
    min-width: 320px;
    max-width: 560px;
    padding: 36px 48px;
    text-align: center;
    background: white;
    border-radius: 32px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.16);
    animation: transitionPop 0.35s ease-out;

    .transition-icon {
      font-size: 72px;
      margin-bottom: 16px;
    }

    h2 {
      margin: 0 0 12px;
      font-size: 40px;
      color: #2C3E50;
    }

    p {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
      color: #5DADE2;
    }
  }
}

// 切换模式按钮
.change-mode-btn {
  position: fixed;
  bottom: 120px;
  right: 40px;
  padding: 16px 32px;
  font-size: 20px;
  font-weight: bold;
  background: linear-gradient(135deg, #F8B4D9, #FCE4EC);
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(248, 180, 217, 0.4);
  transition: all 0.3s;
  z-index: 999;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(248, 180, 217, 0.5);
  }
}

// 2岁宝宝友好视觉优化：更软、更大、更明确
.learning-interactive-page {
  position: relative;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 12% 14%, rgba(255, 214, 228, 0.9) 0 90px, transparent 92px),
    radial-gradient(circle at 88% 18%, rgba(194, 232, 255, 0.85) 0 110px, transparent 112px),
    radial-gradient(circle at 20% 88%, rgba(218, 245, 199, 0.8) 0 120px, transparent 122px),
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
    text-shadow: 0 3px 0 rgba(255, 255, 255, 0.9);
  }

  .star-count {
    box-shadow: inset 0 -5px 0 rgba(255, 140, 0, 0.2), 0 10px 22px rgba(255, 190, 60, 0.28);
  }
}

.mode-selection {
  margin-top: 44px;

  .mode-title {
    color: #4A5F7A;
    font-size: 46px;
  }

  .mode-card {
    min-height: 240px;
    padding: 38px 28px;
    border: 5px solid rgba(255, 255, 255, 0.85);
    border-radius: 36px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 249, 253, 0.94));
    box-shadow: inset 0 -8px 0 rgba(255, 206, 224, 0.34), 0 16px 34px rgba(116, 139, 170, 0.14);

    &:nth-child(1) { background: linear-gradient(180deg, #FFFFFF, #FFF0B8); }
    &:nth-child(2) { background: linear-gradient(180deg, #FFFFFF, #E9F7FF); }
    &:nth-child(3) { background: linear-gradient(180deg, #FFFFFF, #EFFFF0); }
    &:nth-child(4) { background: linear-gradient(180deg, #FFFFFF, #F7EFFF); }

    &:hover,
    &:active {
      transform: translateY(-6px) scale(1.03);
      box-shadow: inset 0 -8px 0 rgba(255, 206, 224, 0.42), 0 20px 42px rgba(116, 139, 170, 0.18);
    }

    &:focus-visible {
      outline: none;
      box-shadow: inset 0 -8px 0 rgba(255, 206, 224, 0.42), 0 0 0 6px rgba(255, 183, 77, 0.34), 0 20px 42px rgba(116, 139, 170, 0.18);
    }

    .mode-icon {
      filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.08));
    }

    .mode-name {
      font-size: 32px;
      color: #4A5F7A;
    }

    .mode-desc {
      font-size: 20px;
      color: #7B8DA3;
    }
  }
}

.interactive-area {
  padding-top: 30px;
}

.explore-mode {
  .content-stage {
    border: 6px solid rgba(255, 255, 255, 0.82);
    border-radius: 44px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 251, 239, 0.94));
    box-shadow: inset 0 -10px 0 rgba(255, 226, 167, 0.35), 0 20px 48px rgba(255, 170, 180, 0.16);

    .current-content {
      .content-image {
        width: min(430px, 58vw);
        height: min(430px, 58vw);
        padding: 26px;
        border-radius: 44px;
        background: radial-gradient(circle, #FFFFFF 0%, #FFF8E7 72%);
        box-shadow: inset 0 -8px 0 rgba(255, 210, 150, 0.25), 0 14px 32px rgba(93, 173, 226, 0.12);
        animation: babyFloat 3.2s ease-in-out infinite;

        img {
          filter: drop-shadow(0 12px 16px rgba(76, 88, 110, 0.12));
        }

        .tap-hint {
          bottom: -54px;
          padding: 8px 18px;
          border-radius: 999px;
          background: #FFFFFF;
          color: #FF8DB3;
          box-shadow: 0 8px 18px rgba(255, 141, 179, 0.18);
        }
      }

      .content-name {
        margin-top: 20px;
        color: #4A5F7A;
        font-size: 56px;
      }

      .content-desc {
        display: inline-block;
        max-width: 760px;
        padding: 14px 26px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.72);
        color: #7B8DA3;
      }
    }

    .nav-arrow {
      width: 92px;
      height: 92px;
      background: linear-gradient(135deg, #8FD8FF, #B8E7FF);
      box-shadow: inset 0 -7px 0 rgba(69, 152, 206, 0.2), 0 12px 24px rgba(93, 173, 226, 0.24);
    }
  }

  .content-nav .nav-dots .dot {
    width: 20px;
    height: 20px;
    background: #FFD8E6;

    &.active {
      width: 44px;
      border-radius: 999px;
      background: #FF9FC2;
      transform: none;
    }
  }

  .action-buttons .action-btn {
    min-height: 72px;
    padding: 20px 34px;
    border-radius: 999px;
    box-shadow: inset 0 -6px 0 rgba(0, 0, 0, 0.08), 0 12px 24px rgba(116, 139, 170, 0.14);

    &:active {
      transform: translateY(3px) scale(0.98);
      box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.08), 0 6px 14px rgba(116, 139, 170, 0.12);
    }
  }
}

.matching-mode,
.quick-mode,
.sound-mode {
  .game-info {
    flex-wrap: wrap;
    gap: 16px;

    > div {
      padding: 12px 22px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.78);
      color: #4A5F7A;
      box-shadow: 0 8px 18px rgba(116, 139, 170, 0.1);
    }
  }
}

.matching-mode {
  .memorize-phase .phase-title,
  .memorize-phase .countdown {
    color: #4A5F7A;
  }

  .matching-grid .matching-card {
    border: 5px solid rgba(255, 255, 255, 0.88);
    border-radius: 28px;
    box-shadow: inset 0 -7px 0 rgba(93, 173, 226, 0.12), 0 12px 26px rgba(116, 139, 170, 0.14);

    .card-front {
      background: linear-gradient(135deg, #FFB6D2, #B8E7FF);
      font-size: 72px;
    }

    .card-back {
      background: #FFFFFF;
      padding: 14px;
    }

    &.matched {
      opacity: 0.78;
      filter: saturate(1.15);
    }
  }
}

.quick-mode,
.sound-mode {
  .question-area,
  .sound-game {
    .voice-question-btn,
    .play-sound-btn {
      border: 6px solid rgba(255, 255, 255, 0.78);
      background: linear-gradient(135deg, #8FD8FF, #B9EAFF);
      box-shadow: inset 0 -8px 0 rgba(69, 152, 206, 0.18), 0 16px 32px rgba(93, 173, 226, 0.22);
    }

    .question {
      color: #4A5F7A;
    }

    .options-grid {
      gap: 28px;

      .option-card {
        min-height: 210px;
        border: 5px solid rgba(255, 255, 255, 0.88);
        border-radius: 34px;
        background: linear-gradient(180deg, #FFFFFF, #FFF9EF);
        box-shadow: inset 0 -8px 0 rgba(255, 215, 170, 0.26), 0 14px 30px rgba(116, 139, 170, 0.14);
        position: relative;
        outline: none;
        -webkit-tap-highlight-color: transparent;

        &:hover,
        &:active {
          transform: translateY(-5px) scale(1.035);
        }

        &:focus-visible {
          box-shadow: inset 0 -8px 0 rgba(255, 215, 170, 0.26), 0 0 0 6px rgba(255, 183, 77, 0.34), 0 14px 30px rgba(116, 139, 170, 0.14);
        }

        &.selected {
          transform: translateY(-3px) scale(1.03);
        }

        &.correct {
          border-color: #8BE58E;
          background: linear-gradient(180deg, #FFFFFF, #EEFFE9);
          box-shadow: inset 0 -8px 0 rgba(87, 190, 96, 0.2), 0 16px 34px rgba(87, 190, 96, 0.2);
          animation: happyPop 0.45s ease-out;
        }

        &.wrong {
          border-color: #FFB0C7;
          background: linear-gradient(180deg, #FFFFFF, #FFF0F5);
          box-shadow: inset 0 -8px 0 rgba(255, 141, 179, 0.18), 0 16px 34px rgba(255, 141, 179, 0.18);
          animation: gentleShake 0.36s ease-in-out;
        }

        &.dimmed {
          opacity: 0.56;
          transform: scale(0.98);
        }

        img {
          filter: drop-shadow(0 10px 14px rgba(76, 88, 110, 0.12));
        }

        .answer-badge {
          position: absolute;
          left: 50%;
          bottom: 14px;
          transform: translateX(-50%);
          padding: 8px 18px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.9);
          color: #4A5F7A;
          font-size: 18px;
          font-weight: bold;
          box-shadow: 0 8px 16px rgba(116, 139, 170, 0.14);
          white-space: nowrap;
        }
      }
    }
  }
}

.level-transition {
  background: rgba(255, 246, 225, 0.72);

  .transition-card {
    border: 6px solid rgba(255, 255, 255, 0.9);
    background: linear-gradient(180deg, #FFFFFF, #FFF1F8);
    box-shadow: inset 0 -10px 0 rgba(255, 190, 220, 0.26), 0 24px 60px rgba(255, 141, 179, 0.22);
  }
}

.change-mode-btn {
  min-height: 62px;
  border: 4px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  color: #4A5F7A;
  box-shadow: inset 0 -6px 0 rgba(248, 120, 170, 0.12), 0 12px 24px rgba(248, 180, 217, 0.28);
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
      font-size: 32px;
    }
  }

  .mode-selection,
  .interactive-area {
    padding-left: 18px;
    padding-right: 18px;
  }

  .explore-mode .content-stage {
    padding: 36px 20px 44px;

    .nav-arrow {
      position: static;
      transform: none;
      margin: 22px 8px 0;

      &:hover,
      &:active {
        transform: scale(1.05);
      }
    }
  }

  .quick-mode .question-area .options-grid .option-card,
  .sound-mode .sound-game .options-grid .option-card {
    min-height: 160px;
  }
}

@media (max-width: 1024px) {
  .learning-interactive-page {
    min-height: 100dvh;
  }

  .header {
    margin: max(12px, env(safe-area-inset-top)) max(14px, env(safe-area-inset-right)) 0 max(14px, env(safe-area-inset-left));
  }

  .mode-selection {
    margin: 34px auto;

    .mode-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 22px;
    }
  }

  .interactive-area {
    max-width: 100%;
    padding: 28px max(18px, env(safe-area-inset-right)) calc(110px + env(safe-area-inset-bottom)) max(18px, env(safe-area-inset-left));
  }

  .matching-mode .matching-grid,
  .quick-mode .question-area .options-grid,
  .sound-mode .sound-game .options-grid {
    max-width: 720px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .matching-mode .matching-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .change-mode-btn {
    right: max(20px, env(safe-area-inset-right));
    bottom: calc(24px + env(safe-area-inset-bottom));
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
      font-size: 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .mode-selection {
    margin-top: 18px;
    margin-bottom: 0;

    .mode-title {
      font-size: 30px;
      margin-bottom: 14px;
    }

    .mode-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .mode-card {
      min-height: 128px;
      padding: 16px 12px;
      border-radius: 26px;

      .mode-icon {
        margin-bottom: 6px;
        font-size: 48px;
      }

      .mode-name {
        margin-bottom: 4px;
        font-size: 20px;
      }

      .mode-desc {
        font-size: 13px;
        line-height: 1.25;
      }
    }
  }

  .explore-mode {
    .content-stage {
      border-radius: 34px;

      .current-content {
        .content-image {
          width: min(310px, 78vw);
          height: min(310px, 78vw);
        }

        .content-name {
          font-size: 42px;
        }

        .content-desc {
          font-size: 20px;
          border-radius: 24px;
        }
      }
    }

    .action-buttons .action-btn {
      width: 100%;
      max-width: 340px;
    }
  }

  .matching-mode .matching-grid,
  .quick-mode .question-area .options-grid,
  .sound-mode .sound-game .options-grid {
    gap: 12px;
  }

  .quick-mode .question-area .voice-question-btn {
    width: min(320px, 86vw);
    height: 104px;

    .text {
      font-size: 22px;
    }
  }

  .sound-mode .sound-game .play-sound-btn {
    width: 170px;
    height: 170px;
  }

  .level-transition .transition-card {
    min-width: auto;
    width: calc(100vw - 40px);
    padding: 28px 22px;

    h2 {
      font-size: 32px;
    }

    p {
      font-size: 20px;
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

  .interactive-area {
    padding-top: 16px;
  }

  .explore-mode .content-stage {
    padding: 24px 100px 30px;

    .current-content .content-image {
      width: min(240px, 32vw);
      height: min(240px, 32vw);
      margin-bottom: 18px;
    }
  }

  .mode-selection {
    margin-top: 18px;

    .mode-card {
      min-height: 150px;
      padding: 20px;
    }
  }
}

// 单屏交互优化：尽量让每个玩法在手机/平板首屏内完成展示
@media (max-width: 1024px), (max-height: 820px) {
  .learning-interactive-page {
    min-height: 100dvh;
  }

  .header {
    min-height: 64px;
    margin-top: max(8px, env(safe-area-inset-top));
    padding: 10px 18px;
    border-radius: 24px;

    .btn-back,
    .star-count {
      min-height: 48px;
      padding: 8px 16px;
      font-size: 17px;
    }

    .page-title {
      font-size: clamp(26px, 4vw, 34px);
    }
  }

  .interactive-area {
    padding-top: 14px;
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
  }

  .mode-selection {
    margin: 18px auto;

    .mode-title {
      margin-bottom: 18px;
      font-size: clamp(30px, 5vw, 40px);
    }

    .mode-grid {
      gap: 16px;
    }

    .mode-card {
      min-height: clamp(138px, 19vh, 190px);
      padding: 20px 16px;

      .mode-icon {
        margin-bottom: 8px;
        font-size: clamp(52px, 8vw, 72px);
      }

      .mode-name {
        margin-bottom: 6px;
        font-size: clamp(24px, 4vw, 30px);
      }

      .mode-desc {
        font-size: clamp(16px, 2.6vw, 19px);
        line-height: 1.35;
      }
    }
  }

  .explore-mode {
    display: flex;
    flex-direction: column;

    .content-stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0;
      margin-bottom: 14px;
      padding: clamp(18px, 3vh, 34px) clamp(18px, 5vw, 70px);

      .current-content {
        .content-image {
          width: min(46dvh, 52vw, 360px);
          height: min(46dvh, 52vw, 360px);
          margin-bottom: 16px;
          padding: clamp(12px, 2vh, 22px);

          .tap-hint {
            bottom: -36px;
            font-size: 17px;
          }
        }

        .content-name {
          margin-top: 10px;
          margin-bottom: 8px;
          font-size: clamp(34px, 6vw, 48px);
          line-height: 1.15;
        }

        .content-desc {
          max-width: 680px;
          padding: 8px 18px;
          font-size: clamp(18px, 3vw, 22px);
          line-height: 1.35;
        }
      }

      .nav-arrow {
        width: clamp(58px, 8vw, 76px);
        height: clamp(58px, 8vw, 76px);
        font-size: clamp(28px, 5vw, 38px);
      }
    }

    .content-nav {
      margin-bottom: 12px;
    }

    .action-buttons {
      gap: 12px;

      .action-btn {
        min-height: 56px;
        padding: 12px 22px;
        font-size: clamp(18px, 3vw, 22px);
      }
    }
  }

  .matching-mode {
    .memorize-phase {
      .phase-title {
        margin-bottom: 10px;
        font-size: clamp(30px, 5vw, 42px);
        line-height: 1.2;
      }

      .countdown {
        margin-bottom: 14px;
        font-size: clamp(46px, 8vw, 70px);
        line-height: 1;
      }
    }

    .game-phase .game-info {
      margin-bottom: 16px;
    }

    .matching-grid {
      max-width: min(820px, 92vw);
      gap: clamp(10px, 2vw, 18px);
      grid-template-columns: repeat(4, minmax(0, 1fr));

      .matching-card {
        border-radius: 22px;

        .card-front {
          font-size: clamp(42px, 7vw, 64px);
        }
      }
    }
  }

  .quick-mode,
  .sound-mode {
    .game-info {
      margin-bottom: 16px;
      font-size: clamp(18px, 3vw, 24px);
    }

    .question-area,
    .sound-game {
      .voice-question-btn {
        width: min(420px, 86vw);
        height: clamp(82px, 13vh, 110px);
        margin-bottom: 18px;

        .icon {
          font-size: clamp(38px, 7vw, 56px);
        }

        .text {
          font-size: clamp(20px, 4vw, 26px);
        }
      }

      .play-sound-btn {
        width: clamp(104px, 18vh, 150px);
        height: clamp(104px, 18vh, 150px);
        margin-bottom: 10px;

        .icon {
          font-size: clamp(40px, 8vw, 62px);
        }

        .text {
          font-size: clamp(17px, 3vw, 22px);
        }
      }

      .question {
        margin-bottom: 16px;
        font-size: clamp(28px, 5vw, 42px);
        line-height: 1.2;
      }

      .options-grid {
        max-width: min(760px, 92vw);
        gap: clamp(10px, 2vw, 18px);

        .option-card {
          min-height: clamp(96px, 18vh, 160px);
          padding: clamp(8px, 1.5vw, 16px);
          border-radius: 24px;

          img {
            max-height: clamp(74px, 14vh, 126px);
          }
        }
      }
    }
  }
}

@media (max-width: 480px) and (max-height: 780px) {
  .header {
    margin-left: 10px;
    margin-right: 10px;

    .page-title {
      font-size: 22px;
    }
  }

  .interactive-area {
    padding-left: 12px;
    padding-right: 12px;
  }

  .explore-mode {
    .content-stage {
      padding-left: 12px;
      padding-right: 12px;

      .current-content .content-image {
        width: min(28dvh, 58vw, 210px);
        height: min(28dvh, 58vw, 210px);
      }
    }

    .action-buttons .action-btn {
      min-height: 50px;
      padding: 10px 18px;
    }
  }

  .quick-mode .question-area .options-grid .option-card,
  .sound-mode .sound-game .options-grid .option-card {
    min-height: clamp(82px, 16vh, 128px);
  }

  .quick-mode,
  .sound-mode {
    .game-info {
      margin-bottom: 8px;

      > div {
        padding: 6px 12px;
        font-size: 16px;
      }
    }

    .question-area,
    .sound-game {
      .voice-question-btn {
        height: 76px;
        margin-bottom: 10px;
      }

      .play-sound-btn {
        width: 96px;
        height: 96px;
        margin-bottom: 8px;
      }

      .question {
        margin-bottom: 10px;
        font-size: 24px;
      }

      .options-grid {
        gap: 8px;
      }
    }
  }

  .mode-selection {
    margin: 12px auto;
    margin-bottom: 0;

    .mode-title {
      font-size: 26px;
      margin-bottom: 10px;
    }

    .mode-card {
      min-height: 108px;
      padding: 12px 10px;

      .mode-icon {
        font-size: 38px;
      }

      .mode-name {
        font-size: 18px;
      }

      .mode-desc {
        font-size: 12px;
      }
    }
  }

  .matching-mode {
    .memorize-phase {
      .phase-title {
        font-size: 24px;
      }

      .countdown {
        margin-bottom: 8px;
        font-size: 42px;
      }
    }

    .game-phase .game-info {
      margin-bottom: 8px;
    }

    .matching-grid {
      gap: 8px;
      grid-template-columns: repeat(4, minmax(0, 1fr));

      .matching-card {
        border-width: 3px;
        border-radius: 14px;

        .card-front {
          font-size: 30px;
        }

        .card-back {
          padding: 6px;
        }
      }
    }
  }

  .change-mode-btn {
    right: max(12px, env(safe-area-inset-right));
    bottom: calc(14px + env(safe-area-inset-bottom));
    min-height: 48px;
    padding: 8px 16px;
    font-size: 17px;
  }
}

@media (max-width: 380px) and (max-height: 700px) {
  .explore-mode {
    .content-stage {
      margin-bottom: 6px;
      padding-top: 10px;
      padding-bottom: 10px;

      .current-content {
        .content-image {
          width: min(25dvh, 54vw, 185px);
          height: min(25dvh, 54vw, 185px);
          margin-bottom: 8px;

          .tap-hint {
            display: none;
          }
        }

        .content-name {
          margin-top: 4px;
          font-size: 30px;
        }

        .content-desc {
          padding: 6px 12px;
          font-size: 16px;
        }
      }
    }

    .content-nav {
      display: none;
    }
  }
}

@media (orientation: landscape) and (min-width: 900px) and (max-height: 820px) {
  .mode-selection {
    margin-bottom: 0;

    .mode-title {
      margin-bottom: 10px;
    }

    .mode-card {
      min-height: 132px;
      padding-top: 16px;
      padding-bottom: 14px;
    }
  }
}

@keyframes babyFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes happyPop {
  0% {
    transform: scale(0.96);
  }
  60% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1.03);
  }
}

@keyframes gentleShake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  75% {
    transform: translateX(6px);
  }
}

@keyframes transitionPop {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}
</style>
