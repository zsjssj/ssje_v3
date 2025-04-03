<template>
  <div class="not-found">
    <div class="container">
      <div class="error-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
        <router-link to="/" class="home-button">
          <i class="fas fa-home"></i>
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed
</script>

<style lang="scss" scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;

  .error-content {
    max-width: 600px;
    margin: 0 auto;

    h1 {
      font-size: 8rem;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0;
      line-height: 1;
    }

    h2 {
      font-size: 2rem;
      margin: 1rem 0;
      color: var(--text-primary);
    }

    p {
      color: var(--text-secondary);
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .home-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: var(--primary-color);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 1.1rem;
      transition: background-color 0.3s;

      &:hover {
        background: var(--primary-hover);
      }

      i {
        font-size: 1.2rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .not-found {
    .error-content {
      h1 {
        font-size: 6rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      p {
        font-size: 1rem;
      }
    }
  }
}
</style>
