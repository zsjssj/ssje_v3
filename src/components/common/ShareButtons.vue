<template>
  <div class="share-buttons">
    <button v-for="button in shareButtons" :key="button.name" class="share-button" :class="button.name" @click="share(button)" :aria-label="'Share on ' + button.name">
      <i :class="button.icon"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
interface ShareButton {
  name: string
  icon: string
  url: string
}

const props = defineProps<{
  title: string
  url: string
}>()

const shareButtons: ShareButton[] = [
  {
    name: 'twitter',
    icon: 'fab fa-twitter',
    url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(props.url)}`
  },
  {
    name: 'facebook',
    icon: 'fab fa-facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`
  },
  {
    name: 'linkedin',
    icon: 'fab fa-linkedin',
    url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(props.url)}&title=${encodeURIComponent(props.title)}`
  },
  {
    name: 'whatsapp',
    icon: 'fab fa-whatsapp',
    url: `https://wa.me/?text=${encodeURIComponent(props.title + ' ' + props.url)}`
  }
]

const share = (button: ShareButton) => {
  const width = 600
  const height = 400
  const left = (window.innerWidth - width) / 2
  const top = (window.innerHeight - height) / 2

  window.open(button.url, 'share', `width=${width},height=${height},left=${left},top=${top}`)
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

.share-buttons {
  display: flex;
  gap: 0.5rem;

  .share-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    color: white;
    font-size: 1rem;

    &:hover {
      transform: translateY(-2px);
    }

    &.twitter {
      background: #1da1f2;
      &:hover {
        background: color.scale(#1da1f2, $lightness: -10%);
      }
    }

    &.facebook {
      background: #4267b2;
      &:hover {
        background: color.scale(#4267b2, $lightness: -10%);
      }
    }

    &.linkedin {
      background: #0077b5;
      &:hover {
        background: color.scale(#0077b5, $lightness: -10%);
      }
    }

    &.whatsapp {
      background: #25d366;
      &:hover {
        background: color.scale(#25d366, $lightness: -10%);
      }
    }
  }
}

@media (max-width: 768px) {
  .share-buttons {
    .share-button {
      width: 32px;
      height: 32px;
      font-size: 0.9rem;
    }
  }
}
</style>
