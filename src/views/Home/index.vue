<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Welcome to My Blog</h1>
          <p class="subtitle">Exploring technology, development, and everything in between</p>
          <router-link to="/blog" class="cta-button">
            Read Articles
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Posts -->
    <section class="featured-posts">
      <div class="container">
        <h2>Featured Posts</h2>
        <div class="posts-grid">
          <PostCard v-for="post in featuredPosts" :key="post.id" :post="post" />
        </div>
        <router-link to="/blog" class="view-all">
          View All Posts
          <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>
    </section>

    <!-- About Preview -->
    <section class="about-preview">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>About Me</h2>
            <p>I'm a passionate full-stack developer with over 5 years of experience in web development. I love creating beautiful and functional web applications using modern technologies.</p>
            <router-link to="/about" class="read-more">
              Read More
              <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
          <div class="about-image">
            <img :src="profileImage" alt="Profile" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PostCard from '@/components/blog/PostCard.vue'

const profileImage = 'https://picsum.photos/seed/profile/400/400'

const featuredPosts = [
  {
    id: '1',
    title: 'Getting Started with Vue 3',
    excerpt: 'Learn the basics of Vue 3 and how to create your first application.',
    cover: 'https://picsum.photos/seed/vue3/800/400',
    date: '2024-03-15',
    category: 'Vue.js',
    readTime: 5
  },
  {
    id: '2',
    title: 'TypeScript Best Practices',
    excerpt: 'Essential tips and tricks for writing better TypeScript code.',
    cover: 'https://picsum.photos/seed/typescript/800/400',
    date: '2024-03-10',
    category: 'TypeScript',
    readTime: 8
  },
  {
    id: '3',
    title: 'Modern CSS Techniques',
    excerpt: 'Explore modern CSS features and how to use them effectively.',
    cover: 'https://picsum.photos/seed/css/800/400',
    date: '2024-03-05',
    category: 'CSS',
    readTime: 6
  }
]
</script>

<style lang="scss" scoped>
.home {
  .hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
    color: white;
    padding: 6rem 2rem;
    text-align: center;
    margin-bottom: 4rem;

    .hero-content {
      max-width: 800px;
      margin: 0 auto;

      h1 {
        font-size: 3rem;
        margin-bottom: 1.5rem;
        line-height: 1.2;
      }

      .subtitle {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        opacity: 0.9;
      }

      .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: white;
        color: var(--primary-color);
        padding: 1rem 2rem;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 500;
        transition: transform 0.3s;

        &:hover {
          transform: translateY(-2px);
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

  .featured-posts {
    padding: 4rem 0;

    h2 {
      text-align: center;
      margin-bottom: 3rem;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .view-all {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      justify-content: center;
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

  .about-preview {
    background: var(--bg-secondary);
    padding: 4rem 0;

    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;

      .about-text {
        h2 {
          margin-bottom: 1.5rem;
        }

        p {
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 2rem;
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

      .about-image {
        img {
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 12px var(--shadow-color);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .home {
    .hero {
      padding: 4rem 1rem;

      .hero-content {
        h1 {
          font-size: 2.5rem;
        }
      }
    }

    .about-preview {
      .about-content {
        grid-template-columns: 1fr;
        gap: 2rem;

        .about-image {
          order: -1;
        }
      }
    }
  }
}
</style>
