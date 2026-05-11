// 音频管理工具类

class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private musicVolume: number = 0.5
  private effectVolume: number = 0.7
  private isMuted: boolean = false

  constructor() {
    // 从localStorage加载音量设置
    const savedMusicVolume = localStorage.getItem('musicVolume')
    const savedEffectVolume = localStorage.getItem('effectVolume')
    const savedMuted = localStorage.getItem('isMuted')

    if (savedMusicVolume) this.musicVolume = parseFloat(savedMusicVolume)
    if (savedEffectVolume) this.effectVolume = parseFloat(savedEffectVolume)
    if (savedMuted) this.isMuted = savedMuted === 'true'
  }

  /**
   * 预加载音频
   */
  preload(key: string, url: string) {
    if (!this.sounds.has(key)) {
      const audio = new Audio(url)
      audio.preload = 'auto'
      this.sounds.set(key, audio)
    }
  }

  /**
   * 播放音效
   */
  playEffect(key: string, url?: string) {
    if (this.isMuted) return

    if (url && !this.sounds.has(key)) {
      this.preload(key, url)
    }

    const audio = this.sounds.get(key)
    if (audio) {
      audio.volume = this.effectVolume
      audio.currentTime = 0
      audio.play().catch(err => console.warn('Audio play failed:', err))
    }
  }

  /**
   * 播放背景音乐
   */
  playMusic(key: string, url?: string, loop: boolean = true) {
    if (this.isMuted) return

    if (url && !this.sounds.has(key)) {
      this.preload(key, url)
    }

    const audio = this.sounds.get(key)
    if (audio) {
      audio.volume = this.musicVolume
      audio.loop = loop
      audio.play().catch(err => console.warn('Music play failed:', err))
    }
  }

  /**
   * 停止音频
   */
  stop(key: string) {
    const audio = this.sounds.get(key)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  /**
   * 停止所有音频
   */
  stopAll() {
    this.sounds.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  /**
   * 设置音乐音量
   */
  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('musicVolume', this.musicVolume.toString())

    // 更新所有音乐的音量
    this.sounds.forEach(audio => {
      if (audio.loop) {
        audio.volume = this.musicVolume
      }
    })
  }

  /**
   * 设置音效音量
   */
  setEffectVolume(volume: number) {
    this.effectVolume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('effectVolume', this.effectVolume.toString())
  }

  /**
   * 切换静音
   */
  toggleMute() {
    this.isMuted = !this.isMuted
    localStorage.setItem('isMuted', this.isMuted.toString())

    if (this.isMuted) {
      this.stopAll()
    }
  }

  /**
   * 获取静音状态
   */
  getMuted() {
    return this.isMuted
  }

  /**
   * 播放点击音效
   */
  playClick() {
    // 使用Web Audio API生成简单的点击音
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(this.effectVolume * 0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  /**
   * 播放成功音效
   */
  playSuccess() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(this.effectVolume * 0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.4)
  }

  /**
   * 播放错误音效
   */
  playError() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 200
    oscillator.type = 'sawtooth'

    gainNode.gain.setValueAtTime(this.effectVolume * 0.2, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }
}

// 导出单例
export const audioManager = new AudioManager()
