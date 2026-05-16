class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private musicVolume: number = 0.5
  private effectVolume: number = 0.7
  private isMuted: boolean = false
  private backgroundMusicEnabled: boolean = false
  private audioContext: AudioContext | null = null
  private backgroundGain: GainNode | null = null
  private backgroundTimers: number[] = []
  private backgroundOscillators: OscillatorNode[] = []
  private backgroundPlaying: boolean = false
  private backgroundStarting: boolean = false
  private backgroundLoopId: number = 0
  private backgroundSongIndex: number = 0

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
    if (this.audioContext && this.audioContext.state !== 'closed') {
      return this.audioContext
    }

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    return this.audioContext
  }

  private runWhenAudioReady(callback: (context: AudioContext) => void) {
    const context = this.getAudioContext()

    if (context.state === 'running') {
      callback(context)
      return
    }

    context.resume()
      .then(() => {
        if (context.state === 'running') {
          callback(context)
        }
      })
      .catch(err => console.warn('Audio resume failed:', err))
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

    if (this.backgroundGain && this.audioContext && this.audioContext.state !== 'closed') {
      this.backgroundGain.gain.setTargetAtTime(this.musicVolume * 0.16, this.audioContext.currentTime, 0.08)
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
    if (!this.backgroundMusicEnabled || this.isMuted || this.musicVolume <= 0 || this.backgroundPlaying || this.backgroundStarting) return

    const context = this.getAudioContext()

    const songs = [
      {
        name: 'Twinkle Twinkle Little Star',
        melody: [
          261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
          349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63,
          392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
          392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
          261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
          349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63
        ],
        durations: [
          0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.96,
          0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.96,
          0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.96,
          0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.96,
          0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 0.96,
          0.48, 0.48, 0.48, 0.48, 0.48, 0.48, 1.08
        ]
      },
      {
        name: 'Frere Jacques',
        melody: [
          261.63, 293.66, 329.63, 261.63, 261.63, 293.66, 329.63, 261.63,
          329.63, 349.23, 392.00, 329.63, 349.23, 392.00,
          392.00, 440.00, 392.00, 349.23, 329.63, 261.63,
          392.00, 440.00, 392.00, 349.23, 329.63, 261.63,
          261.63, 196.00, 261.63, 261.63, 196.00, 261.63
        ],
        durations: [
          0.38, 0.38, 0.38, 0.5, 0.38, 0.38, 0.38, 0.5,
          0.38, 0.38, 0.76, 0.38, 0.38, 0.76,
          0.25, 0.25, 0.25, 0.25, 0.38, 0.5,
          0.25, 0.25, 0.25, 0.25, 0.38, 0.5,
          0.38, 0.38, 0.76, 0.38, 0.38, 0.9
        ]
      },
      {
        name: 'Mary Had a Little Lamb',
        melody: [
          329.63, 293.66, 261.63, 293.66, 329.63, 329.63, 329.63,
          293.66, 293.66, 293.66, 329.63, 392.00, 392.00,
          329.63, 293.66, 261.63, 293.66, 329.63, 329.63, 329.63,
          329.63, 293.66, 293.66, 329.63, 293.66, 261.63
        ],
        durations: [
          0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.84,
          0.42, 0.42, 0.84, 0.42, 0.42, 0.84,
          0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42,
          0.42, 0.42, 0.42, 0.42, 0.42, 1.0
        ]
      },
      {
        name: 'London Bridge',
        melody: [
          392.00, 440.00, 392.00, 349.23, 329.63, 349.23, 392.00,
          293.66, 329.63, 349.23, 329.63, 349.23, 392.00,
          392.00, 440.00, 392.00, 349.23, 329.63, 349.23, 392.00,
          293.66, 392.00, 329.63, 261.63
        ],
        durations: [
          0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.84,
          0.42, 0.42, 0.42, 0.42, 0.42, 0.84,
          0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.84,
          0.42, 0.42, 0.42, 1.0
        ]
      },
      {
        name: 'Brahms Lullaby',
        melody: [
          392.00, 392.00, 440.00, 392.00, 392.00, 440.00,
          392.00, 440.00, 523.25, 493.88, 440.00, 392.00,
          329.63, 392.00, 349.23, 329.63, 293.66, 261.63,
          293.66, 329.63, 349.23, 392.00, 329.63, 261.63
        ],
        durations: [
          0.64, 0.32, 0.72, 0.64, 0.32, 0.72,
          0.42, 0.42, 0.64, 0.42, 0.42, 0.92,
          0.52, 0.52, 0.52, 0.52, 0.52, 0.88,
          0.42, 0.42, 0.42, 0.64, 0.52, 1.1
        ]
      }
    ]

    const startLoop = () => {
      if (!this.backgroundMusicEnabled || this.isMuted || this.musicVolume <= 0 || this.backgroundPlaying) return

      const activeContext = this.getAudioContext()
      if (activeContext.state !== 'running') return

      const loopId = ++this.backgroundLoopId
      this.backgroundGain = activeContext.createGain()
      this.backgroundGain.connect(activeContext.destination)
      this.backgroundGain.gain.setValueAtTime(this.musicVolume * 0.16, activeContext.currentTime)
      this.backgroundPlaying = true

      playLoop(loopId)
    }

    const playLoop = (loopId: number) => {
      if (!this.backgroundPlaying || loopId !== this.backgroundLoopId || !this.backgroundGain || context.state !== 'running') return

      const song = songs[this.backgroundSongIndex % songs.length]
      this.backgroundSongIndex++
      let offset = 0

      song.melody.forEach((frequency, index) => {
        const oscillator = context.createOscillator()
        const noteGain = context.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.value = frequency
        oscillator.connect(noteGain)
        noteGain.connect(this.backgroundGain!)
        const start = context.currentTime + offset
        const duration = song.durations[index] ?? 0.45
        const end = start + duration
        noteGain.gain.setValueAtTime(0.0001, start)
        noteGain.gain.exponentialRampToValueAtTime(0.7, start + 0.04)
        noteGain.gain.exponentialRampToValueAtTime(0.0001, end)
        oscillator.start(start)
        oscillator.stop(end + 0.02)
        this.backgroundOscillators.push(oscillator)
        oscillator.onended = () => {
          this.backgroundOscillators = this.backgroundOscillators.filter(item => item !== oscillator)
        }
        offset += duration
      })

      const timer = window.setTimeout(() => playLoop(loopId), (offset + 1.2) * 1000)
      this.backgroundTimers.push(timer)
    }

    if (context.state === 'running') {
      startLoop()
      return
    }

    this.backgroundStarting = true
    context.resume()
      .then(() => {
        this.backgroundStarting = false
        startLoop()
      })
      .catch((err) => {
        this.backgroundStarting = false
        console.warn('Background music resume failed:', err)
      })
  }

  stopBackgroundMusic() {
    this.backgroundLoopId++
    this.backgroundPlaying = false
    this.backgroundStarting = false
    this.backgroundTimers.forEach(timer => window.clearTimeout(timer))
    this.backgroundTimers = []
    this.backgroundOscillators.forEach((oscillator) => {
      try {
        oscillator.stop()
      } catch {
        // The oscillator may have already ended naturally.
      }
      oscillator.disconnect()
    })
    this.backgroundOscillators = []
    if (this.backgroundGain && this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.backgroundGain.gain.setTargetAtTime(0.0001, this.audioContext.currentTime, 0.05)
        this.backgroundGain.disconnect()
      } catch {
        // The gain may already be disconnected.
      }
    }
    this.backgroundGain = null
  }

  playClick() {
    if (this.isMuted || this.effectVolume <= 0) return
    this.playBackgroundMusic()
    this.runWhenAudioReady((audioContext) => {
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
      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }
    })
  }

  playSuccess() {
    if (this.isMuted || this.effectVolume <= 0) return
    this.playBackgroundMusic()
    this.runWhenAudioReady((audioContext) => {
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
      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }
    })
  }

  playPuzzleMatch() {
    if (this.isMuted || this.effectVolume <= 0) return
    this.playBackgroundMusic()
    this.runWhenAudioReady((audioContext) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(990, audioContext.currentTime + 0.08)
      oscillator.type = 'triangle'
      gainNode.gain.setValueAtTime(this.effectVolume * 0.22, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.16)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.16)
      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }
    })
  }

  playError() {
    if (this.isMuted || this.effectVolume <= 0) return
    this.playBackgroundMusic()
    this.runWhenAudioReady((audioContext) => {
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
      oscillator.onended = () => {
        oscillator.disconnect()
        gainNode.disconnect()
      }
    })
  }
}

export const audioManager = new AudioManager()
