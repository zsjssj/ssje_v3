<template>
  <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'">
    <i class="fas" :class="isDark ? 'fa-sun' : 'fa-moon'"></i>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
})

// Watch for system theme changes
watch(
  () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  (prefersDark) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = prefersDark
      document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    }
  }
)
</script>

<style lang="scss" scoped>
.theme-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 1.2rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background: var(--bg-secondary);
    transform: rotate(15deg);
  }

  i {
    transition: transform 0.3s;
  }

  &:hover i {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .theme-toggle {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}
</style>
