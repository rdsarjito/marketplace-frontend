import { defineStore } from 'pinia'

export type ToastType = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  type: ToastType
  message: string
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as ToastItem[],
    counter: 1,
  }),
  actions: {
    show(type: ToastType, message: string, timeoutMs = 3000) {
      const id = this.counter++
      this.toasts.push({ id, type, message })
      if (timeoutMs > 0) {
        setTimeout(() => this.dismiss(id), timeoutMs)
      }
    },
    success(message: string, timeoutMs = 3000) { this.show('success', message, timeoutMs) },
    error(message: string, timeoutMs = 3000) { this.show('error', message, timeoutMs) },
    info(message: string, timeoutMs = 3000) { this.show('info', message, timeoutMs) },
    dismiss(id: number) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    }
  }
})


