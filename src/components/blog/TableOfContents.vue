<template>
  <nav class="table-of-contents" v-if="headings.length > 0">
    <h3>Table of Contents</h3>
    <ul>
      <li v-for="heading in headings" :key="heading.id" :class="heading.level">
        <a :href="'#' + heading.id" :class="{ active: activeHeading === heading.id }" @click.prevent="scrollToHeading(heading.id)">
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Heading {
  id: string
  text: string
  level: number
}

const headings = ref<Heading[]>([])
const activeHeading = ref('')

const extractHeadings = () => {
  const article = document.querySelector('article')
  if (!article) return

  const headingElements = article.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings.value = Array.from(headingElements).map((el) => ({
    id: el.id,
    text: el.textContent || '',
    level: parseInt(el.tagName[1])
  }))
}

const updateActiveHeading = () => {
  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const headingPositions = Array.from(headingElements).map((el) => ({
    id: el.id,
    top: el.getBoundingClientRect().top
  }))

  const currentHeading = headingPositions.find((heading) => heading.top > 0) || headingPositions[headingPositions.length - 1]
  if (currentHeading) {
    activeHeading.value = currentHeading.id
  }
}

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  extractHeadings()
  window.addEventListener('scroll', updateActiveHeading)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<style lang="scss" scoped>
.table-of-contents {
  position: sticky;
  top: 2rem;
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);

  h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.5rem;

      a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.3s;
        display: block;
        padding: 0.2rem 0;

        &:hover {
          color: var(--primary-color);
        }

        &.active {
          color: var(--primary-color);
          font-weight: 500;
        }
      }

      &.h2 {
        margin-left: 0;
      }

      &.h3 {
        margin-left: 1rem;
      }

      &.h4 {
        margin-left: 2rem;
      }

      &.h5 {
        margin-left: 3rem;
      }

      &.h6 {
        margin-left: 4rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .table-of-contents {
    position: static;
    margin-bottom: 2rem;
  }
}
</style>
