class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private musicVolume: number = 0.5
  private effectVolume: number = 0.7
  private isMuted: boolean = false
  private backgroundMusicEnabled: boolean = false
  private backgroundAudioContext: AudioContext | null = null
  private backgroundGain: GainNode | null = null
  private backgroundTimers: number[] = []
  private backgroundPlaying: boolean = false

  constructor() {
    const savedMusicVolume = localStorage.getItem('musicVolume')
    const savedEffectVolume = localStorage.getItem('effectVolume')
    const savedMuted = localStorage.getItem('isMuted')
    const savedBackgroundMusicEnabled = localStorage.getItem('backgroundMusicEnabled')

    if (savedMusicVolume) this.musicVolume = parseFloat(savedMusicVolume)
    if (savedEffectVolume) this.effectVolume = parseFloat(savedEffectVolume)
    if (savedMuted) this.isMuted = savedMuted === 'true'
    if (savedBackgroundMusicEnabled) this.backgroundMusicEnabled = savedBackgroundMusicEnabled === 'true'
  }

  private getAudioContext() {
    return new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  preload(key: string, url: string) {
    if (!this.sounds.has(key)) {
      const audio = new Audio(url)
      audio.preload = 'auto'
      this.sounds.set(key, audio)
    }
  }

  playEffect(key: string, url?: string) {
    if (this.isMuted || this.effectVolume <= 0) return

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

  playMusic(key: string, url?: string, loop: boolean = true) {
    if (this.isMuted || this.musicVolume <= 0) return

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

  stop(key: string) {
    const audio = this.sounds.get(key)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  stopAll() {
    this.sounds.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('musicVolume', this.musicVolume.toString())

    this.sounds.forEach(audio => {
      if (audio.loop) {
        audio.volume = this.musicVolume
      }
    })

    if (this.backgroundGain && this.backgroundAudioContext) {
      this.backgroundGain.gain.setTargetAtTime(this.musicVolume * 0.16, this.backgroundAudioContext.currentTime, 0.08)
    }
  }

  setEffectVolume(volume: number) {
    this.effectVolume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('effectVolume', this.effectVolume.toString())
  }

  setVolume(volume: number) {
    const safeVolume = Math.max(0, Math.min(1, volume))
    this.setMusicVolume(safeVolume)
    this.setEffectVolume(safeVolume)
    this.isMuted = safeVolume <= 0
    localStorage.setItem('isMuted', this.isMuted.toString())

    if (this.isMuted) {
      this.stopAll()
      this.stopBackgroundMusic()
    } else if (this.backgroundMusicEnabled) {
      this.playBackgroundMusic()
    }
  }

  getVolume() {
    return this.isMuted ? 0 : this.effectVolume
  }

  toggleMute() {
    this.isMuted = !this.isMuted
    localStorage.setItem('isMuted', this.isMuted.toString())

    if (this.isMuted) {
      this.stopAll()
      this.stopBackgroundMusic()
    } else if (this.backgroundMusicEnabled) {
      this.playBackgroundMusic()
    }
  }

  getMuted() {
    return this.isMuted
  }

  setBackgroundMusicEnabled(enabled: boolean) {
    this.backgroundMusicEnabled = enabled
    localStorage.setItem('backgroundMusicEnabled', enabled.toString())

    if (enabled) {
      this.playBackgroundMusic()
    } else {
      this.stopBackgroundMusic()
    }
  }

  getBackgroundMusicEnabled() {
    return this.backgroundMusicEnabled
  }

  playBackgroundMusic() {
    if (!this.backgroundMusicEnabled || this.isMuted || this.musicVolume <= 0 || this.backgroundPlaying) return

    const context = this.backgroundAudioContext || this.getAudioContext()
    this.backgroundAudioContext = context
    this.backgroundGain = this.backgroundGain || context.createGain()
    this.backgroundGain.connect(context.destination)
    this.backgroundGain.gain.setValueAtTime(this.musicVolume * 0.16, context.currentTime)
    this.backgroundPlaying = true

    const melody = [
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63
    ]
    const durations = [0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.86, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.92]

    const playLoop = () => {
      if (!this.backgroundPlaying || !this.backgroundAudioContext || !this.backgroundGain) return

      let offset = 0
      melody.forEach((frequency, index) => {
        const oscillator = context.createOscillator()
        const noteGain = context.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.value = frequency
        oscillator.connect(noteGain)
        noteGain.connect(this.backgroundGain!)
        const start = context.currentTime + offset
        const end = start + durations[index]
        noteGain.gain.setValueAtTime(0.0001, start)
        noteGain.gain.exponentialRampToValueAtTime(0.7, start + 0.04)
        noteGain.gain.exponentialRampToValueAtTime(0.0001, end)
        oscillator.start(start)
        oscillator.stop(end + 0.02)
        offset += durations[index]
      })

      const timer = window.setTimeout(playLoop, (offset + 1.2) * 1000)
      this.backgroundTimers.push(timer)
    }

    playLoop()
  }

  stopBackgroundMusic() {
    this.backgroundPlaying = false
    this.backgroundTimers.forEach(timer => window.clearTimeout(timer))
    this.backgroundTimers = []
    if (this.backgroundGain && this.backgroundAudioContext) {
      this.backgroundGain.gain.setTargetAtTime(0.0001, this.backgroundAudioContext.currentTime, 0.05)
    }
  }

  playClick() {
    if (this.isMuted || this.effectVolume <= 0) return
    const audioContext = this.getAudioContext()
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

  playSuccess() {
    if (this.isMuted || this.effectVolume <= 0) return
    const audioContext = this.getAudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2)
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(this.effectVolume * 0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.4)
  }

  playError() {
    if (this.isMuted || this.effectVolume <= 0) return
    const audioContext = this.getAudioContext()
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

export const audioManager = new AudioManager()
