<template>
  <div class="tag-cloud">
    <h3>Categories</h3>
    <div class="tags">
      <button v-for="tag in tags" :key="tag.name" class="tag" :class="{ active: selectedTag === tag.name }" @click="$emit('select', tag.name)">
        {{ tag.name }}
        <span class="count">({{ tag.count }})</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tag {
  name: string
  count: number
}

defineProps<{
  tags: Tag[]
  selectedTag?: string
}>()

defineEmits<{
  (e: 'select', tag: string): void
}>()
</script>

<style lang="scss" scoped>
.tag-cloud {
  h3 {
    margin-bottom: 1rem;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .tag {
      padding: 0.4rem 0.8rem;
      border: 1px solid var(--border-color);
      border-radius: 20px;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }

      &.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }

      .count {
        margin-left: 0.2rem;
        opacity: 0.8;
      }
    }
  }
}

@media (max-width: 768px) {
  .tag-cloud {
    .tags {
      .tag {
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
      }
    }
  }
}
</style>
