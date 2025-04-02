<template>
  <footer class="footer">
    <div class="container footer-container">
      <div class="footer-content">
        <div class="social-links">
          <a href="https://github.com/zsjssj" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-github"></i>
          </a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
        <div class="copyright">© {{ new Date().getFullYear() }} SSJE. All rights reserved.</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component logic here
</script>

<style lang="scss" scoped>
.footer {
  background-color: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-top: auto;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.social-links {
  display: flex;
  gap: 1.5rem;

  a {
    color: var(--text-secondary);
    font-size: 1.5rem;
    transition: color 0.3s;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.copyright {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer {
    padding: 1.5rem 0;
  }
}
</style>
