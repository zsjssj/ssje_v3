<template>
  <header class="header">
    <div class="container header-container">
      <div class="left">
        <router-link to="/" class="brand">
          <div class="name">SSJE</div>
          <div class="subtitle">Personal Blog</div>
        </router-link>
      </div>
      <div class="right">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/blog" class="nav-link">博客</router-link>
        <router-link to="/about" class="nav-link">关于我</router-link>
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark-theme')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark-theme')
  }
})
</script>

<style lang="scss" scoped>
.header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.brand {
  text-decoration: none;
  color: var(--text-primary);

  .name {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .subtitle {
    font-size: 1rem;
    font-weight: 500;
  }
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: var(--primary-color);
  }
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--bg-secondary);
  }

  i {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .right {
    display: none;
  }
}
</style>
