export interface HomeSection {
  id: string
  title: string
  icon: string
  description: string
  badge: string
  route: string
  className: string
}

export interface MediaContentItem {
  id: string
  title: string
  icon: string
  duration: string
  ageRange: string
  description: string
  tags: string[]
}

export const HOME_SECTIONS: HomeSection[] = [
  {
    id: 'learning',
    title: '学习乐园',
    icon: '📚',
    description: '认识动物、水果、颜色...',
    badge: '8个主题',
    route: '/learning',
    className: 'learning-card'
  },
  {
    id: 'games',
    title: '游戏世界',
    icon: '🎮',
    description: '记忆、拼图、找不同...',
    badge: '6种游戏',
    route: '/games',
    className: 'game-card'
  },
  {
    id: 'songs',
    title: '经典儿歌',
    icon: '🎵',
    description: '节奏轻快，跟唱启蒙',
    badge: '12首精选',
    route: '/songs',
    className: 'song-card'
  },
  {
    id: 'animations',
    title: '精选动画',
    icon: '📺',
    description: '短时观看，故事陪伴',
    badge: '10集动画',
    route: '/animations',
    className: 'animation-card'
  }
]

export const CLASSIC_SONGS: MediaContentItem[] = [
  {
    id: 'twinkle-star',
    title: '小星星',
    icon: '⭐',
    duration: '2:10',
    ageRange: '0-3岁',
    description: '旋律舒缓，适合睡前和亲子哼唱。',
    tags: ['旋律启蒙', '睡前']
  },
  {
    id: 'two-tigers',
    title: '两只老虎',
    icon: '🐯',
    duration: '1:45',
    ageRange: '2-6岁',
    description: '节奏简单，适合跟唱和拍手互动。',
    tags: ['节奏', '跟唱']
  },
  {
    id: 'little-donkey',
    title: '小毛驴',
    icon: '🎒',
    duration: '2:05',
    ageRange: '3-6岁',
    description: '故事感强，帮助孩子理解歌词情境。',
    tags: ['故事', '表达']
  },
  {
    id: 'number-song',
    title: '数字歌',
    icon: '🔢',
    duration: '1:58',
    ageRange: '3-6岁',
    description: '把数字认知融入轻快旋律。',
    tags: ['数字', '认知']
  }
]

export const FEATURED_ANIMATIONS: MediaContentItem[] = [
  {
    id: 'forest-friends',
    title: '森林好朋友',
    icon: '🌳',
    duration: '4:30',
    ageRange: '2-5岁',
    description: '认识常见动物，学习友好相处。',
    tags: ['动物', '社交']
  },
  {
    id: 'color-rainbow',
    title: '彩虹颜色屋',
    icon: '🌈',
    duration: '3:50',
    ageRange: '3-6岁',
    description: '用生活场景认识颜色和搭配。',
    tags: ['颜色', '观察']
  },
  {
    id: 'little-helper',
    title: '我是小帮手',
    icon: '🧹',
    duration: '4:05',
    ageRange: '3-6岁',
    description: '通过短故事建立整理和协作意识。',
    tags: ['习惯', '生活']
  },
  {
    id: 'safe-crossing',
    title: '安全过马路',
    icon: '🚦',
    duration: '3:40',
    ageRange: '4-6岁',
    description: '学习红绿灯和基础交通安全。',
    tags: ['安全', '交通']
  }
]
