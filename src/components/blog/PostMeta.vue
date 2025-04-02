<template>
  <div class="post-meta">
    <div class="meta-item">
      <i class="far fa-calendar"></i>
      <span>{{ date }}</span>
    </div>
    <div class="meta-item">
      <i class="far fa-clock"></i>
      <span>{{ readTime }} min read</span>
    </div>
    <div class="meta-item">
      <i class="far fa-user"></i>
      <span>{{ author }}</span>
    </div>
    <div class="meta-item">
      <i class="far fa-folder"></i>
      <span>{{ category }}</span>
    </div>
    <div class="meta-item">
      <i class="far fa-comments"></i>
      <span>{{ comments }} comments</span>
    </div>
    <div class="meta-item">
      <i class="far fa-eye"></i>
      <span>{{ views }} views</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  date: string
  readTime: number
  author: string
  category: string
  comments: number
  views: number
}>()
</script>

<style lang="scss" scoped>
.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    i {
      font-size: 1rem;
      color: var(--primary-color);
    }
  }
}

@media (max-width: 768px) {
  .post-meta {
    gap: 0.8rem;
    font-size: 0.8rem;

    .meta-item {
      i {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
