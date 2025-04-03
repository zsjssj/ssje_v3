<template>
  <div class="blog-post">
    <!-- Hero Section -->
    <section class="post-hero">
      <div class="container">
        <div class="post-header">
          <div class="post-category">{{ post.category }}</div>
          <h1>{{ post.title }}</h1>
          <div class="post-meta">
            <span class="date">
              <i class="far fa-calendar"></i>
              {{ formatDate(post.date) }}
            </span>
            <span class="read-time">
              <i class="far fa-clock"></i>
              {{ post.readTime }} min read
            </span>
            <span class="author">
              <i class="far fa-user"></i>
              {{ post.author }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Image -->
    <div class="post-cover">
      <img :src="post.cover" :alt="post.title" />
    </div>

    <!-- Article Content -->
    <article class="post-content">
      <div class="container">
        <div class="content" v-html="post.content"></div>

        <!-- Tags -->
        <div class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag"> #{{ tag }} </span>
        </div>

        <!-- Share Buttons -->
        <div class="share-buttons">
          <h3>Share this article</h3>
          <div class="buttons">
            <button class="share-btn twitter">
              <i class="fab fa-twitter"></i>
              Twitter
            </button>
            <button class="share-btn linkedin">
              <i class="fab fa-linkedin"></i>
              LinkedIn
            </button>
            <button class="share-btn facebook">
              <i class="fab fa-facebook"></i>
              Facebook
            </button>
          </div>
        </div>

        <!-- Author Bio -->
        <div class="author-bio">
          <img :src="post.authorAvatar" :alt="post.author" class="author-avatar" />
          <div class="author-info">
            <h4>{{ post.author }}</h4>
            <p>{{ post.authorBio }}</p>
            <div class="author-social">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-linkedin"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <CommentSection :post-id="post.id" />
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import CommentSection from '@c/CommentSection.vue'
import { getPlaceholderImage, getPlaceholderAvatar } from '@/utils/image'

const route = useRoute()

interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  cover: string
  date: string
  category: string
  readTime: number
  author: string
  authorAvatar: string
  authorBio: string
  tags: string[]
}

const post = ref<Post>({
  id: route.params.id as string,
  title: 'Getting Started with Vue 3',
  excerpt: 'Learn the basics of Vue 3 and how to create your first application.',
  content: `
    <p>Vue 3 is the latest version of the popular Vue.js framework, bringing with it a host of new features and improvements. In this article, we'll explore what's new and how to get started.</p>
    
    <h2>What's New in Vue 3?</h2>
    <p>Vue 3 introduces several major improvements:</p>
    <ul>
      <li>Composition API for better code organization</li>
      <li>Improved TypeScript support</li>
      <li>Better performance and smaller bundle size</li>
      <li>New built-in components</li>
    </ul>

    <h2>Setting Up Your First Vue 3 Project</h2>
    <p>Getting started with Vue 3 is easier than ever. You can use the Vue CLI or create-vue to scaffold your project:</p>
    <pre><code>npm create vue@latest</code></pre>

    <h2>Basic Component Structure</h2>
    <p>Here's a simple example of a Vue 3 component using the Composition API:</p>
    <pre><code>&lt;script setup&gt;
import { ref } from 'vue'

const count = ref(0)
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="count++"&gt;Count is: {{ count }}&lt;/button&gt;
&lt;/template&gt;</code></pre>

    <h2>Conclusion</h2>
    <p>Vue 3 is a powerful framework that makes building web applications more enjoyable and efficient. With its improved features and better developer experience, it's a great choice for your next project.</p>
  `,
  cover: getPlaceholderImage('vue3', 1200, 600),
  date: '2024-03-15',
  category: 'Vue.js',
  readTime: 5,
  author: 'John Doe',
  authorAvatar: getPlaceholderAvatar('author', 200),
  authorBio: 'Full-stack developer with over 5 years of experience in web development. Passionate about creating beautiful and functional web applications.',
  tags: ['Vue.js', 'JavaScript', 'Frontend', 'Web Development']
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  // In a real application, you would fetch the post data from an API
  // using the route.params.id
})
</script>

<style lang="scss" scoped>
@use 'sass:color';

.blog-post {
  .post-hero {
    padding: 4rem 0;
    background: var(--bg-secondary);
    margin-bottom: 2rem;

    .post-header {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;

      .post-category {
        display: inline-block;
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1.5rem;
        border-radius: var(--border-radius-sm);
        margin-bottom: 1.5rem;
        font-weight: 500;
      }

      h1 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        line-height: 1.2;
      }

      .post-meta {
        display: flex;
        gap: 2rem;
        justify-content: center;
        color: var(--text-secondary);
        font-size: 0.9rem;

        span {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          i {
            font-size: 1rem;
          }
        }
      }
    }
  }

  .post-cover {
    width: 100%;
    height: 500px;
    margin-bottom: 3rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .post-content {
    padding-bottom: 4rem;

    .content {
      max-width: 800px;
      margin: 0 auto 3rem;
      font-size: 1.1rem;
      line-height: 1.8;
      color: var(--text-primary);

      :deep(h2) {
        font-size: 2rem;
        margin: 2.5rem 0 1.5rem;
      }

      :deep(p) {
        margin-bottom: 1.5rem;
      }

      :deep(ul) {
        margin-bottom: 1.5rem;
        padding-left: 2rem;

        li {
          margin-bottom: 0.5rem;
        }
      }

      :deep(pre) {
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: var(--border-radius-md);
        margin: 1.5rem 0;
        overflow-x: auto;

        code {
          font-family: var(--font-family-code);
          font-size: 0.9rem;
        }
      }
    }

    .post-tags {
      max-width: 800px;
      margin: 0 auto 3rem;
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;

      .tag {
        background: var(--bg-secondary);
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius-sm);
        color: var(--text-secondary);
        font-size: 0.9rem;
        transition: all 0.3s;

        &:hover {
          background: var(--primary-color);
          color: white;
        }
      }
    }

    .share-buttons {
      max-width: 800px;
      margin: 0 auto 3rem;
      text-align: center;

      h3 {
        margin-bottom: 1rem;
      }

      .buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;

        .share-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: var(--border-radius-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;

          &.twitter {
            background: #1da1f2;
            color: white;

            &:hover {
              background: color.scale(#1da1f2, $lightness: -10%);
            }
          }

          &.linkedin {
            background: #0077b5;
            color: white;

            &:hover {
              background: color.scale(#0077b5, $lightness: -10%);
            }
          }

          &.facebook {
            background: #4267b2;
            color: white;

            &:hover {
              background: color.scale(#4267b2, $lightness: -10%);
            }
          }
        }
      }
    }

    .author-bio {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      gap: 2rem;
      padding: 2rem;
      background: var(--bg-secondary);
      border-radius: var(--border-radius-md);

      .author-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
      }

      .author-info {
        h4 {
          margin-bottom: 0.5rem;
        }

        p {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .author-social {
          display: flex;
          gap: 1rem;

          a {
            color: var(--text-secondary);
            font-size: 1.2rem;
            transition: color 0.3s;

            &:hover {
              color: var(--primary-color);
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .blog-post {
    .post-hero {
      padding: 3rem 0;

      .post-header {
        h1 {
          font-size: 2rem;
        }

        .post-meta {
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    }

    .post-cover {
      height: 300px;
    }

    .post-content {
      .content {
        font-size: 1rem;
      }

      .share-buttons {
        .buttons {
          flex-direction: column;
        }
      }

      .author-bio {
        flex-direction: column;
        text-align: center;

        .author-avatar {
          margin: 0 auto;
        }

        .author-social {
          justify-content: center;
        }
      }
    }
  }
}
</style>
