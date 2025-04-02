<template>
  <article class="post-card">
    <div class="post-cover">
      <img :src="post.cover" :alt="post.title" />
      <div class="post-category">{{ post.category }}</div>
    </div>
    <div class="post-content">
      <h3>{{ post.title }}</h3>
      <p>{{ post.excerpt }}</p>
      <div class="post-meta">
        <span class="date">
          <i class="far fa-calendar"></i>
          {{ formatDate(post.date) }}
        </span>
        <span class="read-time">
          <i class="far fa-clock"></i>
          {{ post.readTime }} min read
        </span>
      </div>
      <router-link :to="`/blog/${post.id}`" class="read-more">
        Read More
        <i class="fas fa-arrow-right"></i>
      </router-link>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Post {
  id: string
  title: string
  excerpt: string
  cover: string
  date: string
  category: string
  readTime: number
}

defineProps<{
  post: Post
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style lang="scss" scoped>
.post-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px var(--shadow-color);
  }

  .post-cover {
    position: relative;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .post-category {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--primary-color);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius-sm);
      font-size: 0.9rem;
      font-weight: 500;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .post-content {
    padding: 1.5rem;

    h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.6;
    }

    .post-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: var(--text-secondary);

      span {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        i {
          font-size: 1rem;
        }
      }
    }

    .read-more {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: gap 0.3s;

      &:hover {
        gap: 0.8rem;
      }

      i {
        transition: transform 0.3s;
      }

      &:hover i {
        transform: translateX(4px);
      }
    }
  }
}

@media (max-width: 768px) {
  .post-card {
    .post-cover {
      height: 180px;
    }

    .post-content {
      padding: 1.25rem;

      h3 {
        font-size: 1.2rem;
      }
    }
  }
}
</style>
