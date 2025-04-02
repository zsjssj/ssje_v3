<template>
  <nav class="breadcrumb" aria-label="breadcrumb">
    <ol>
      <li>
        <router-link to="/">
          <i class="fas fa-home"></i>
          Home
        </router-link>
      </li>
      <li v-for="(item, index) in items" :key="index">
        <template v-if="index === items.length - 1">
          <span aria-current="page">{{ item.text }}</span>
        </template>
        <template v-else>
          <router-link :to="item.path">{{ item.text }}</router-link>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  text: string
  path: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<style lang="scss" scoped>
.breadcrumb {
  margin-bottom: 2rem;

  ol {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;

    li {
      display: flex;
      align-items: center;
      color: var(--text-secondary);

      &:not(:last-child)::after {
        content: '/';
        margin: 0 0.5rem;
        color: var(--text-secondary);
      }

      a {
        color: var(--text-secondary);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        transition: color 0.3s;

        &:hover {
          color: var(--primary-color);
        }

        i {
          font-size: 1rem;
        }
      }

      span {
        color: var(--text-primary);
        font-weight: 500;
      }
    }
  }
}

@media (max-width: 768px) {
  .breadcrumb {
    margin-bottom: 1.5rem;
    font-size: 0.8rem;
  }
}
</style>
