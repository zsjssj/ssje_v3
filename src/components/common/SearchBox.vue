<template>
  <div class="search-box">
    <div class="input-wrapper">
      <i class="fas fa-search"></i>
      <input type="text" :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :placeholder="placeholder" @keyup.enter="$emit('search')" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()
</script>

<style lang="scss" scoped>
.search-box {
  .input-wrapper {
    position: relative;
    width: 100%;
    max-width: 500px;

    i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
    }

    input {
      width: 100%;
      padding: 0.8rem 1rem 0.8rem 2.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-size: 1rem;
      transition: all 0.3s;

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
      }

      &::placeholder {
        color: var(--text-secondary);
      }
    }
  }
}

@media (max-width: 768px) {
  .search-box {
    .input-wrapper {
      input {
        padding: 0.6rem 0.8rem 0.6rem 2.3rem;
        font-size: 0.9rem;
      }
    }
  }
}
</style>
