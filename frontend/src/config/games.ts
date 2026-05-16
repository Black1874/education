// 游戏配置文件

// 学习类别定义
export const LEARNING_CATEGORIES = {
  ANIMAL: {
    id: 'animal',
    name: '认识动物',
    nameEn: 'Animals',
    icon: '/icons/animal.png',
    color: '#FFB6C1',
    description: '和可爱的小动物们做朋友'
  },
  FRUIT: {
    id: 'fruit',
    name: '认识水果',
    nameEn: 'Fruits',
    icon: '/icons/fruit.png',
    color: '#FFD700',
    description: '认识美味的水果'
  },
  VEGETABLE: {
    id: 'vegetable',
    name: '认识蔬菜',
    nameEn: 'Vegetables',
    icon: '/icons/vegetable.png',
    color: '#90EE90',
    description: '认识健康的蔬菜'
  },
  COLOR: {
    id: 'color',
    name: '认识颜色',
    nameEn: 'Colors',
    icon: '/icons/color.png',
    color: '#FF69B4',
    description: '探索缤纷的色彩世界'
  },
  SHAPE: {
    id: 'shape',
    name: '认识形状',
    nameEn: 'Shapes',
    icon: '/icons/shape.png',
    color: '#87CEEB',
    description: '发现有趣的形状'
  },
  NUMBER: {
    id: 'number',
    name: '认识数字',
    nameEn: 'Numbers',
    icon: '/icons/number.png',
    color: '#FFA500',
    description: '学习数字1到20'
  },
  LETTER: {
    id: 'letter',
    name: '认识字母',
    nameEn: 'Letters',
    icon: '/icons/letter.png',
    color: '#9370DB',
    description: '学习26个英文字母'
  },
  VEHICLE: {
    id: 'vehicle',
    name: '认识交通工具',
    nameEn: 'Vehicles',
    icon: '/icons/vehicle.png',
    color: '#20B2AA',
    description: '认识各种交通工具'
  }
}

// 游戏类型定义
export const GAME_TYPES = {
  MEMORY: {
    id: 'memory',
    name: '记忆游戏',
    nameEn: 'Memory Game',
    icon: '/icons/memory.png',
    color: '#FF6B9D',
    totalLevels: 15,
    description: '考验你的记忆力'
  },
  CLASSIFY: {
    id: 'classify',
    name: '分类游戏',
    nameEn: 'Classification',
    icon: '/icons/classify.png',
    color: '#FFA07A',
    totalLevels: 5,
    description: '把物品分类整理'
  },
  PUZZLE: {
    id: 'puzzle',
    name: '拼图游戏',
    nameEn: 'Puzzle',
    icon: '/icons/puzzle.png',
    color: '#98D8C8',
    totalLevels: 15,
    description: '拼出完整的图案'
  },
  DIFFERENCE: {
    id: 'difference',
    name: '找不同',
    nameEn: 'Spot Difference',
    icon: '/icons/difference.png',
    color: '#F7DC6F',
    totalLevels: 15,
    description: '找出图片的不同'
  },
  MATCHING: {
    id: 'matching',
    name: '配对游戏',
    nameEn: 'Matching',
    icon: '/icons/matching.png',
    color: '#BB8FCE',
    totalLevels: 15,
    description: '找到相配的物品'
  },
  QUICK: {
    id: 'quick',
    name: '快速反应',
    nameEn: 'Quick Response',
    icon: '/icons/quick.png',
    color: '#85C1E2',
    totalLevels: 15,
    description: '快速点击正确答案'
  }
}

// 记忆游戏关卡配置
export const MEMORY_GAME_LEVELS = [
  {
    level: 1,
    difficulty: 'easy',
    displayTime: 5,
    targetCount: 1,
    optionCount: 3,
    timeLimit: 30,
    stars: {
      three: { time: 10, errors: 0 },
      two: { time: 20, errors: 1 },
      one: { time: 30, errors: 2 }
    }
  },
  {
    level: 2,
    difficulty: 'easy',
    displayTime: 5,
    targetCount: 1,
    optionCount: 4,
    timeLimit: 30,
    stars: {
      three: { time: 10, errors: 0 },
      two: { time: 20, errors: 1 },
      one: { time: 30, errors: 2 }
    }
  },
  {
    level: 3,
    difficulty: 'easy',
    displayTime: 4,
    targetCount: 1,
    optionCount: 4,
    timeLimit: 25,
    stars: {
      three: { time: 8, errors: 0 },
      two: { time: 15, errors: 1 },
      one: { time: 25, errors: 2 }
    }
  },
  // ... 更多关卡配置
]

// 星星奖励规则
export const STAR_REWARDS = {
  learning: {
    view: 5,        // 查看学习内容 +5星
    favorite: 2     // 收藏内容 +2星
  },
  game: {
    oneStar: 10,    // 1星通关 +10星
    twoStars: 15,   // 2星通关 +15星
    threeStars: 20  // 3星通关 +20星
  }
}

// 成就定义
export const ACHIEVEMENTS = [
  {
    id: 'animal_beginner',
    name: '动物小学徒',
    description: '学习了10种动物',
    icon: '/icons/achievement_animal_1.png',
    type: 'learning',
    condition: {
      type: 'learning_count',
      category: 'animal',
      value: 10
    },
    rewardStars: 50
  },
  {
    id: 'animal_expert',
    name: '动物小专家',
    description: '学习了30种动物',
    icon: '/icons/achievement_animal_2.png',
    type: 'learning',
    condition: {
      type: 'learning_count',
      category: 'animal',
      value: 30
    },
    rewardStars: 100
  },
  {
    id: 'color_master',
    name: '颜色大师',
    description: '学习了所有颜色',
    icon: '/icons/achievement_color_1.png',
    type: 'learning',
    condition: {
      type: 'learning_complete',
      category: 'color'
    },
    rewardStars: 50
  },
  {
    id: 'game_newbie',
    name: '游戏新手',
    description: '完成了10个关卡',
    icon: '/icons/achievement_game_1.png',
    type: 'game',
    condition: {
      type: 'level_complete_count',
      value: 10
    },
    rewardStars: 50
  },
  {
    id: 'game_master',
    name: '游戏达人',
    description: '完成了50个关卡',
    icon: '/icons/achievement_game_2.png',
    type: 'game',
    condition: {
      type: 'level_complete_count',
      value: 50
    },
    rewardStars: 100
  },
  {
    id: 'perfectionist',
    name: '完美主义者',
    description: '获得了20个三星评价',
    icon: '/icons/achievement_perfect.png',
    type: 'game',
    condition: {
      type: 'three_star_count',
      value: 20
    },
    rewardStars: 150
  },
  {
    id: 'star_rich',
    name: '星星富翁',
    description: '累计获得1000颗星星',
    icon: '/icons/achievement_star.png',
    type: 'special',
    condition: {
      type: 'total_stars',
      value: 1000
    },
    rewardStars: 200
  },
  {
    id: 'daily_learner',
    name: '每日学习',
    description: '连续学习7天',
    icon: '/icons/achievement_daily.png',
    type: 'habit',
    condition: {
      type: 'consecutive_days',
      value: 7
    },
    rewardStars: 100
  }
]
