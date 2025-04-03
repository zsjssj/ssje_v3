<template>
  <div class="blog">
    <div class="container">
      <h1>Blog</h1>

      <!-- Search and Filter Section -->
      <div class="search-filter">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="Search articles..." @input="(e) => handleSearch((e.target as HTMLInputElement).value)" />
          <i class="fas fa-search"></i>
        </div>
        <div class="categories">
          <button v-for="category in categories" :key="category" :class="{ active: selectedCategory === category }" @click="filterByCategory(category)">
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Posts Grid -->
      <div class="posts-grid">
        <PostCard v-for="post in paginatedPosts" :key="post.id" :post="post" />
      </div>

      <!-- Empty State -->
      <div v-if="filteredPosts.length === 0" class="empty-state">
        <i class="fas fa-search"></i>
        <h3>No articles found</h3>
        <p>Try adjusting your search or filter criteria</p>
        <button @click="resetFilters">Reset Filters</button>
      </div>

      <!-- Pagination -->
      <div v-if="filteredPosts.length > 0" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="page-numbers">
          <button v-for="page in displayedPages" :key="page" class="page-btn" :class="{ active: currentPage === page }" @click="currentPage = page">
            {{ page }}
          </button>
        </div>

        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PostCard from '@/components/blog/PostCard.vue'
import { getPlaceholderImage } from '@/utils/image'

interface Post {
  id: string
  title: string
  excerpt: string
  cover: string
  date: string
  category: string
  readTime: number
}

const searchQuery = ref('')
const selectedCategory = ref('All')
const debouncedSearchQuery = ref('')

// Debounce function
const debounce = (fn: Function, delay: number) => {
  let timeoutId: number
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

// Debounced search handler
const handleSearch = debounce((value: string) => {
  debouncedSearchQuery.value = value
}, 300)

const categories = ['All', 'Vue.js', 'JavaScript', 'CSS', 'HTML']

const posts = ref<Post[]>([
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
    title: 'Modern CSS Techniques',
    excerpt: 'Explore the latest CSS features and best practices for modern web design.',
    cover: 'https://picsum.photos/seed/css/800/400',
    date: '2024-03-14',
    category: 'CSS',
    readTime: 4
  },
  {
    id: '3',
    title: 'JavaScript Performance Tips',
    excerpt: 'Optimize your JavaScript code for better performance and user experience.',
    cover: 'https://picsum.photos/seed/js/800/400',
    date: '2024-03-13',
    category: 'JavaScript',
    readTime: 6
  }
])

const postsPerPage = 6
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage)
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase()) || post.excerpt.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || post.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const filterByCategory = (category: string) => {
  selectedCategory.value = category
  currentPage.value = 1
}

const resetFilters = () => {
  searchQuery.value = ''
  debouncedSearchQuery.value = ''
  selectedCategory.value = 'All'
  currentPage.value = 1
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

.blog {
  padding: 4rem 0;

  h1 {
    text-align: center;
    margin-bottom: 3rem;
  }

  .search-filter {
    margin-bottom: 3rem;

    .search-box {
      position: relative;
      max-width: 600px;
      margin: 0 auto 2rem;

      input {
        width: 100%;
        padding: 1rem 3rem 1rem 1.5rem;
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius-md);
        font-size: 1rem;
        transition: all 0.3s;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }

      i {
        position: absolute;
        right: 1.5rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
      }
    }

    .categories {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;

      button {
        padding: 0.5rem 1.5rem;
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius-sm);
        background: none;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        &.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }
      }
    }
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 0;

    i {
      font-size: 3rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    h3 {
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    button {
      padding: 0.75rem 2rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        filter: brightness(0.9);
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 3rem;

    .page-numbers {
      display: flex;
      gap: 0.5rem;
    }

    .page-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      background: none;
      cursor: pointer;
      transition: all 0.3s;

      &:hover:not(:disabled) {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }

      &.active {
        background: var(--primary-color);
        border-color: var(--primary-color);
        color: white;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      i {
        font-size: 0.9rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .blog {
    padding: 3rem 0;

    .search-filter {
      .categories {
        button {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }
      }
    }

    .pagination {
      .page-numbers {
        display: none;
      }

      .page-btn {
        width: 36px;
        height: 36px;
      }
    }
  }
}
</style>
