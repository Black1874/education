// 通用类型定义

// 学习类别类型
export type LearningCategory = 'animal' | 'fruit' | 'vegetable' | 'color' | 'shape' | 'number' | 'letter' | 'vehicle'

// 游戏类型
export type GameType = 'memory' | 'classify' | 'puzzle' | 'difference' | 'matching' | 'quick'

// 难度等级
export type Difficulty = 'easy' | 'medium' | 'hard'

// 学习内容接口
export interface LearningContent {
  id: number
  category: LearningCategory
  subCategory?: string
  name: string
  nameEn?: string
  imageUrl: string
  soundUrl?: string
  description?: string
  extraData?: any
  sortOrder: number
}

// 游戏关卡接口
export interface GameLevel {
  level: number
  difficulty: Difficulty
  displayTime?: number
  targetCount?: number
  optionCount?: number
  timeLimit: number
  stars: {
    three: { time: number; errors: number }
    two: { time: number; errors: number }
    one: { time: number; errors: number }
  }
}

// 用户进度接口
export interface UserProgress {
  gameId: string
  levels: {
    [levelNumber: number]: {
      unlocked: boolean
      completed: boolean
      stars: number
      bestTime: number
      attempts: number
    }
  }
}

// 用户信息接口
export interface User {
  id: number
  username: string
  nickname: string
  avatarUrl?: string
  ageGroup: '0-3' | '3-6' | '6-12'
  totalStars: number
  availableStars: number
}

// 成就接口
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  type: 'learning' | 'game' | 'habit' | 'special'
  condition: {
    type: string
    category?: string
    value?: number
  }
  rewardStars: number
  earned?: boolean
  earnedAt?: string
}

// 星星交易记录接口
export interface StarTransaction {
  id: number
  type: 'earn' | 'spend'
  amount: number
  source: string
  description: string
  createdAt: string
}

// API响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 游戏结果接口
export interface GameResult {
  gameId: string
  level: number
  score: number
  stars: number
  timeSpent: number
  errors: number
  passed: boolean
}
