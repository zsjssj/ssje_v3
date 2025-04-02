<template>
  <div class="loading-spinner">
    <div class="spinner">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    <p v-if="text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<style lang="scss" scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  .spinner {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;

    > div {
      width: 12px;
      height: 12px;
      background-color: var(--primary-color);
      border-radius: 100%;
      display: inline-block;
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .bounce1 {
      animation-delay: -0.32s;
    }

    .bounce2 {
      animation-delay: -0.16s;
    }
  }

  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 1rem;
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
