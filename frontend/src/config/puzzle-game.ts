export interface PuzzleLevel {
  level: number
  title: string
  prompt: string
  imageUrl: string
  imageName: string
  themeColor: string
  gridSize: number
}

export interface PuzzlePiece {
  id: string
  slotIndex: number
}

export const PUZZLE_TOTAL_LEVELS = 10

export const PUZZLE_LEVELS: PuzzleLevel[] = [
  {
    level: 1,
    title: '动物乐园',
    prompt: '把 4 块放回亮亮的位置',
    imageUrl: '/images/puzzle/zoo_1.webp',
    imageName: '动物乐园',
    themeColor: '#8fd6c8',
    gridSize: 2
  },
  {
    level: 2,
    title: '动物乐园',
    prompt: '把 4 块放回亮亮的位置',
    imageUrl: '/images/puzzle/zoo_2.webp',
    imageName: '动物乐园',
    themeColor: '#8fd6c8',
    gridSize: 2
  },
  {
    level: 3,
    title: '动物乐园',
    prompt: '把 4 块放回亮亮的位置',
    imageUrl: '/images/puzzle/zoo_3.webp',
    imageName: '动物乐园',
    themeColor: '#8fd6c8',
    gridSize: 2
  },
  {
    level: 4,
    title: '水果派对',
    prompt: '看看哪块能合上',
    imageUrl: '/images/puzzle/fruit_scene.webp',
    imageName: '水果派对',
    themeColor: '#ffb8a8',
    gridSize: 2
  },
  {
    level: 5,
    title: '停车小镇',
    prompt: '一块一块拼完整',
    imageUrl: '/images/puzzle/parking_scene.webp',
    imageName: '停车小镇',
    themeColor: '#9fc9ff',
    gridSize: 3
  },
  {
    level: 6,
    title: '蔬菜花园',
    prompt: '找到每一块的位置',
    imageUrl: '/images/puzzle/vagetable_scene.webp',
    imageName: '蔬菜花园',
    themeColor: '#a7d982',
    gridSize: 3
  },
  {
    level: 7,
    title: '公园大挑战',
    prompt: '全部拼好就完成啦',
    imageUrl: '/images/puzzle/park.webp',
    imageName: '公园大挑战',
    themeColor: '#ffd76b',
    gridSize: 3
  },
  {
    level: 8,
    title: '露营大挑战',
    prompt: '全部拼好就完成啦',
    imageUrl: '/images/puzzle/camping.webp',
    imageName: '露营大挑战',
    themeColor: '#ffd76b',
    gridSize: 3
  },
  {
    level: 8,
    title: '畅想星空',
    prompt: '全部拼好就完成啦',
    imageUrl: '/images/puzzle/sky.webp',
    imageName: '畅想星空',
    themeColor: '#6bbfff',
    gridSize: 3
  },
  {
    level: 9,
    title: '夏日海边',
    prompt: '全部拼好就完成啦',
    imageUrl: '/images/puzzle/sea.webp',
    imageName: '夏日海边',
    themeColor: '#6bbfff',
    gridSize: 3
  },
  {
    level: 10,
    title: '幸福一家人',
    prompt: '全部拼好就完成啦',
    imageUrl: '/images/puzzle/family.webp',
    imageName: '幸福一家人',
    themeColor: '#6bbfff',
    gridSize: 3
  }
]

export const createPuzzlePieces = (gridSize: number): PuzzlePiece[] => {
  return Array.from({ length: gridSize * gridSize }, (_, slotIndex) => ({
    id: `piece-${slotIndex}`,
    slotIndex
  }))
}
