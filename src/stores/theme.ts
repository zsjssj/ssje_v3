import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    theme: (localStorage.getItem('theme') as Theme) || 'light'
  }),

  getters: {
    isDark: (state: ThemeState) => state.theme === 'dark'
  },

  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      this.applyTheme()
    },

    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    },

    initTheme() {
      this.applyTheme()
    }
  }
})
