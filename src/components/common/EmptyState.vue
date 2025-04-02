<template>
  <div class="empty-state">
    <i :class="icon" class="icon"></i>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  message: string
}>()
</script>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;

  .icon {
    font-size: 4rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .empty-state {
    padding: 2rem 1rem;

    .icon {
      font-size: 3rem;
    }

    h3 {
      font-size: 1.2rem;
    }
  }
}
</style>
