// 本地存储管理工具类

interface UserProgress {
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

interface UserData {
  nickname: string
  totalStars: number
  availableStars: number
  usedStars: number
  petHunger: number
  petHappiness: number
  lastLoginAt: string
  favorites: number[]
  learnedContents: number[]
  achievements: string[]
  progress: {
    [gameId: string]: UserProgress
  }
}

class StorageManager {
  private readonly STORAGE_KEY = 'kids_edu_data'
  private readonly VERSION = '1.0'

  /**
   * 获取用户数据
   */
  getUserData(): UserData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        // 检查版本兼容性
        if (parsed.version === this.VERSION) {
          return this.normalizeData(parsed.data)
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }

    // 返回默认数据
    return this.getDefaultData()
  }

  /**
   * 保存用户数据
   */
  saveUserData(data: Partial<UserData>) {
    try {
      const currentData = this.getUserData()
      const newData = { ...currentData, ...data }

      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify({
          version: this.VERSION,
          data: newData,
          updatedAt: new Date().toISOString()
        })
      )
    } catch (error) {
      console.error('Failed to save user data:', error)
    }
  }

  /**
   * 获取默认数据
   */
  private getDefaultData(): UserData {
    return {
      nickname: '小宝贝',
      totalStars: 0,
      availableStars: 0,
      usedStars: 0,
      petHunger: 100,
      petHappiness: 100,
      lastLoginAt: new Date().toISOString(),
      favorites: [],
      learnedContents: [],
      achievements: [],
      progress: {}
    }
  }

  /**
   * 补齐旧版本本地数据缺失字段
   */
  private normalizeData(data: Partial<UserData>): UserData {
    const defaultData = this.getDefaultData()
    return {
      ...defaultData,
      ...data,
      favorites: data.favorites || [],
      learnedContents: data.learnedContents || [],
      achievements: data.achievements || [],
      progress: data.progress || {}
    }
  }

  /**
   * 增加星星
   */
  addStars(amount: number, source: string = 'unknown') {
    const data = this.getUserData()
    data.totalStars += amount
    data.availableStars += amount
    this.saveUserData(data)

    // 记录交易
    this.addStarTransaction('earn', amount, source)
  }

  /**
   * 消费星星
   */
  spendStars(amount: number, purpose: string = 'unknown'): boolean {
    const data = this.getUserData()
    if (data.availableStars >= amount) {
      data.availableStars -= amount
      data.usedStars += amount
      this.saveUserData(data)

      // 记录交易
      this.addStarTransaction('spend', amount, purpose)
      return true
    }
    return false
  }

  /**
   * 记录星星交易
   */
  private addStarTransaction(type: 'earn' | 'spend', amount: number, description: string) {
    const transactions = this.getStarTransactions()
    transactions.unshift({
      type,
      amount,
      description,
      timestamp: new Date().toISOString()
    })

    // 只保留最近100条记录
    if (transactions.length > 100) {
      transactions.splice(100)
    }

    localStorage.setItem('star_transactions', JSON.stringify(transactions))
  }

  /**
   * 获取星星交易记录
   */
  getStarTransactions() {
    try {
      const data = localStorage.getItem('star_transactions')
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  /**
   * 更新游戏进度
   */
  updateGameProgress(gameId: string, level: number, data: {
    completed?: boolean
    stars?: number
    time?: number
  }) {
    const userData = this.getUserData()

    if (!userData.progress[gameId]) {
      userData.progress[gameId] = {
        gameId,
        levels: {}
      }
    }

    const levelData = userData.progress[gameId].levels[level] || {
      unlocked: true,
      completed: false,
      stars: 0,
      bestTime: 0,
      attempts: 0
    }

    levelData.attempts++

    if (data.completed) {
      levelData.completed = true
    }

    if (data.stars !== undefined && data.stars > levelData.stars) {
      levelData.stars = data.stars
    }

    if (data.time !== undefined) {
      if (levelData.bestTime === 0 || data.time < levelData.bestTime) {
        levelData.bestTime = data.time
      }
    }

    userData.progress[gameId].levels[level] = levelData

    // 解锁下一关
    if (data.completed && !userData.progress[gameId].levels[level + 1]) {
      userData.progress[gameId].levels[level + 1] = {
        unlocked: true,
        completed: false,
        stars: 0,
        bestTime: 0,
        attempts: 0
      }
    }

    this.saveUserData(userData)
  }

  /**
   * 获取游戏进度
   */
  getGameProgress(gameId: string): UserProgress | null {
    const data = this.getUserData()
    return data.progress[gameId] || null
  }

  /**
   * 添加收藏
   */
  addFavorite(contentId: number) {
    const data = this.getUserData()
    if (!data.favorites.includes(contentId)) {
      data.favorites.push(contentId)
      this.saveUserData(data)
    }
  }

  /**
   * 移除收藏
   */
  removeFavorite(contentId: number) {
    const data = this.getUserData()
    data.favorites = data.favorites.filter(id => id !== contentId)
    this.saveUserData(data)
  }

  /**
   * 检查是否收藏
   */
  isFavorite(contentId: number): boolean {
    const data = this.getUserData()
    return data.favorites.includes(contentId)
  }

  /**
   * 标记学习内容已学习，首次学习返回 true
   */
  markContentLearned(contentId: number): boolean {
    const data = this.getUserData()
    if (data.learnedContents.includes(contentId)) {
      return false
    }

    data.learnedContents.push(contentId)
    this.saveUserData(data)
    return true
  }

  /**
   * 检查学习内容是否已学习
   */
  isContentLearned(contentId: number): boolean {
    const data = this.getUserData()
    return data.learnedContents.includes(contentId)
  }

  /**
   * 解锁成就
   */
  unlockAchievement(achievementId: string) {
    const data = this.getUserData()
    if (!data.achievements.includes(achievementId)) {
      data.achievements.push(achievementId)
      this.saveUserData(data)
      return true
    }
    return false
  }

  /**
   * 检查成就是否解锁
   */
  hasAchievement(achievementId: string): boolean {
    const data = this.getUserData()
    return data.achievements.includes(achievementId)
  }

  /**
   * 更新宠物状态
   */
  updatePet(hunger?: number, happiness?: number) {
    const data = this.getUserData()
    if (hunger !== undefined) {
      data.petHunger = Math.max(0, Math.min(100, hunger))
    }
    if (happiness !== undefined) {
      data.petHappiness = Math.max(0, Math.min(100, happiness))
    }
    this.saveUserData(data)
  }

  /**
   * 喂养宠物
   */
  feedPet(cost: number = 10): boolean {
    if (this.spendStars(cost, 'feed_pet')) {
      const data = this.getUserData()
      this.updatePet(
        Math.min(100, data.petHunger + 20),
        Math.min(100, data.petHappiness + 10)
      )
      return true
    }
    return false
  }

  /**
   * 宠物自然消耗（每小时调用）
   */
  petDecay() {
    const data = this.getUserData()
    const lastLogin = new Date(data.lastLoginAt).getTime()
    const now = Date.now()
    const hoursPassed = Math.floor((now - lastLogin) / (1000 * 60 * 60))

    if (hoursPassed > 0) {
      this.updatePet(
        Math.max(0, data.petHunger - hoursPassed * 5),
        Math.max(0, data.petHappiness - hoursPassed * 3)
      )
    }

    // 更新最后登录时间
    data.lastLoginAt = new Date().toISOString()
    this.saveUserData(data)
  }

  /**
   * 清除所有数据
   */
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem('star_transactions')
  }

  /**
   * 导出数据（用于备份）
   */
  exportData(): string {
    const data = this.getUserData()
    return JSON.stringify(data, null, 2)
  }

  /**
   * 导入数据（用于恢复）
   */
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString)
      this.saveUserData(data)
      return true
    } catch {
      return false
    }
  }
}

// 导出单例
export const storageManager = new StorageManager()
