// Toast 提示管理器

import { createApp, h, type App } from 'vue'
// @ts-ignore
import Toast from '@/modules/common/components/Toast.vue'

interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

class ToastManager {
  private container: HTMLDivElement | null = null
  private app: App | null = null
  private timer: number | null = null

  private getContainer() {
    if (!this.container) {
      this.container = document.createElement('div')
      this.container.id = 'toast-container'
      document.body.appendChild(this.container)
    }
    return this.container
  }

  show(options: ToastOptions) {
    const container = this.getContainer()
    const normalizedOptions = {
      ...options,
      message: options.message.replace(/^[❌✕×]\s*/, '')
    }

    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = null
    }

    if (this.app) {
      this.app.unmount()
      this.app = null
    }

    // 清除之前的toast
    container.innerHTML = ''

    // 创建新的toast
    const app = createApp({
      render() {
        return h(Toast, normalizedOptions)
      }
    })

    this.app = app
    app.mount(container)

    // 自动销毁
    this.timer = window.setTimeout(() => {
      this.app?.unmount()
      this.app = null
      this.timer = null
      container.innerHTML = ''
    }, (normalizedOptions.duration || 2000) + 500)
  }

  success(message: string, duration?: number) {
    this.show({ message, type: 'success', duration })
  }

  error(message: string, duration?: number) {
    this.show({ message, type: 'error', duration })
  }

  info(message: string, duration?: number) {
    this.show({ message, type: 'info', duration })
  }

  warning(message: string, duration?: number) {
    this.show({ message, type: 'warning', duration })
  }
}

export const toast = new ToastManager()
