<template>
  <div class="post-tags">
    <h3>Tags</h3>
    <div class="tags">
      <router-link v-for="tag in tags" :key="tag" :to="'/blog?tag=' + tag" class="tag" :class="{ active: currentTag === tag }">
        {{ tag }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  tags: string[]
}>()

const route = useRoute()
const currentTag = computed(() => (route.query.tag as string) || '')
</script>

<style lang="scss" scoped>
.post-tags {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .tag {
      padding: 0.4rem 0.8rem;
      background: var(--bg-primary);
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: 20px;
      font-size: 0.9rem;
      transition: all 0.3s;

      &:hover {
        background: var(--primary-color);
        color: white;
      }

      &.active {
        background: var(--primary-color);
        color: white;
      }
    }
  }
}

@media (max-width: 768px) {
  .post-tags {
    padding: 1rem;

    .tags {
      .tag {
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
      }
    }
  }
}
</style>
