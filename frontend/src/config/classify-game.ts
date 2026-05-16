export type ClassifyCategory = 'fruit' | 'vegetable' | 'animal' | 'vehicle'

export interface ClassifyItem {
  id: string
  name: string
  imageUrl: string
  category: ClassifyCategory
}

export interface ClassifyTarget {
  id: ClassifyCategory
  title: string
  shortTitle: string
  hint: string
  sceneClass: string
  sceneImageUrl: string
}

export interface ClassifyLevel {
  level: number
  title: string
  prompt: string
  itemsPerCategory: number
}

export const CLASSIFY_TOTAL_LEVELS = 5

export const CLASSIFY_TARGETS: ClassifyTarget[] = [
  {
    id: 'fruit',
    title: '水果果盘',
    shortTitle: '果盘',
    hint: '水果放这里',
    sceneClass: 'fruit-scene',
    sceneImageUrl: '/images/scene/fruit_scene.webp'
  },
  {
    id: 'vegetable',
    title: '蔬菜篮子',
    shortTitle: '菜篮子',
    hint: '蔬菜放这里',
    sceneClass: 'vegetable-scene',
    sceneImageUrl: '/images/scene/vagetable_scene.webp'
  },
  {
    id: 'animal',
    title: '动物园',
    shortTitle: '动物园',
    hint: '小动物回这里',
    sceneClass: 'animal-scene',
    sceneImageUrl: '/images/scene/zoo_scene.webp'
  },
  {
    id: 'vehicle',
    title: '停车场',
    shortTitle: '停车场',
    hint: '车车停这里',
    sceneClass: 'vehicle-scene',
    sceneImageUrl: '/images/scene/parking_scene.webp'
  }
]

export const CLASSIFY_ITEM_POOL: Record<ClassifyCategory, ClassifyItem[]> = {
  fruit: [
    { id: 'apple', name: '苹果', imageUrl: '/images/fruits/apple.svg', category: 'fruit' },
    { id: 'banana', name: '香蕉', imageUrl: '/images/fruits/banana.svg', category: 'fruit' },
    { id: 'orange', name: '橙子', imageUrl: '/images/fruits/orange.svg', category: 'fruit' },
    { id: 'strawberry', name: '草莓', imageUrl: '/images/fruits/strawberry.svg', category: 'fruit' },
    { id: 'watermelon', name: '西瓜', imageUrl: '/images/fruits/watermelon.svg', category: 'fruit' }
  ],
  vegetable: [
    { id: 'carrot', name: '胡萝卜', imageUrl: '/images/vegetables/carrot.svg', category: 'vegetable' },
    { id: 'broccoli', name: '西兰花', imageUrl: '/images/vegetables/broccoli.svg', category: 'vegetable' },
    { id: 'tomato', name: '番茄', imageUrl: '/images/vegetables/tomato.svg', category: 'vegetable' },
    { id: 'corn', name: '玉米', imageUrl: '/images/vegetables/corn.svg', category: 'vegetable' },
    { id: 'potato', name: '土豆', imageUrl: '/images/vegetables/potato.svg', category: 'vegetable' }
  ],
  animal: [
    { id: 'cat', name: '小猫', imageUrl: '/images/animals/cat.svg', category: 'animal' },
    { id: 'rabbit', name: '兔子', imageUrl: '/images/animals/rabbit.svg', category: 'animal' },
    { id: 'dog', name: '小狗', imageUrl: '/images/animals/dog.svg', category: 'animal' },
    { id: 'panda', name: '熊猫', imageUrl: '/images/animals/panda.svg', category: 'animal' },
    { id: 'duck', name: '鸭子', imageUrl: '/images/animals/duck.svg', category: 'animal' }
  ],
  vehicle: [
    { id: 'car', name: '汽车', imageUrl: '/images/vehicles/car.svg', category: 'vehicle' },
    { id: 'bus', name: '公交车', imageUrl: '/images/vehicles/bus.svg', category: 'vehicle' },
    { id: 'bicycle', name: '自行车', imageUrl: '/images/vehicles/bicycle.svg', category: 'vehicle' },
    { id: 'train', name: '火车', imageUrl: '/images/vehicles/train.svg', category: 'vehicle' },
    { id: 'taxi', name: '出租车', imageUrl: '/images/vehicles/taxi.svg', category: 'vehicle' }
  ]
}

export const CLASSIFY_LEVELS: ClassifyLevel[] = [
  {
    level: 1,
    title: '帮小伙伴回家',
    prompt: '拖到它的家里',
    itemsPerCategory: 1
  },
  {
    level: 2,
    title: '热闹的小草地',
    prompt: '找到每个小伙伴的家',
    itemsPerCategory: 1
  },
  {
    level: 3,
    title: '一起整理吧',
    prompt: '一个一个送回家',
    itemsPerCategory: 2
  },
  {
    level: 4,
    title: '小小分类员',
    prompt: '看看谁该去哪里',
    itemsPerCategory: 2
  },
  {
    level: 5,
    title: '回家大挑战',
    prompt: '全部送回正确的家',
    itemsPerCategory: 2
  }
]
