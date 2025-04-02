<template>
  <div class="comment-section">
    <h3>Comments ({{ comments.length }})</h3>

    <!-- Comment Form -->
    <div class="comment-form">
      <div class="avatar">
        <img :src="userAvatar" alt="User avatar" />
      </div>
      <div class="form-content">
        <textarea v-model="newComment" placeholder="Write a comment..." rows="3" @keydown.enter.prevent="submitComment"></textarea>
        <div class="form-actions">
          <button class="submit-btn" :disabled="!newComment.trim()" @click="submitComment">Post Comment</button>
        </div>
      </div>
    </div>

    <!-- Comments List -->
    <div class="comments-list">
      <div v-for="comment in paginatedComments" :key="comment.id" class="comment">
        <div class="avatar">
          <img :src="comment.avatar" :alt="comment.author" />
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="author">{{ comment.author }}</span>
            <span class="date">{{ formatDate(comment.date) }}</span>
          </div>
          <p v-if="!comment.isEditing" class="text">{{ comment.text }}</p>
          <textarea v-else v-model="comment.editText" class="edit-textarea" rows="3" @keydown.enter.prevent="saveEdit(comment)"></textarea>
          <div class="comment-actions">
            <button class="action-btn" @click="likeComment(comment)">
              <i class="fas" :class="comment.isLiked ? 'fa-heart' : 'fa-heart'"></i>
              {{ comment.likes }}
            </button>
            <button class="action-btn" @click="replyToComment(comment)">
              <i class="fas fa-reply"></i>
              Reply
            </button>
            <button v-if="comment.author === 'Current User'" class="action-btn" @click="editComment(comment)">
              <i class="fas fa-edit"></i>
              Edit
            </button>
            <button v-if="comment.author === 'Current User'" class="action-btn delete" @click="deleteComment(comment)">
              <i class="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMoreComments" class="load-more">
      <button class="load-more-btn" @click="loadMoreComments">Load More Comments</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getPlaceholderAvatar } from '@/utils/image'

interface Comment {
  id: string
  author: string
  avatar: string
  text: string
  date: string
  likes: number
  isLiked: boolean
  isEditing?: boolean
  editText?: string
}

const props = defineProps<{
  postId: string
}>()

const userAvatar = getPlaceholderAvatar('user')
const newComment = ref('')
const commentsPerPage = 5
const currentPage = ref(1)

const comments = ref<Comment[]>([
  {
    id: '1',
    author: 'John Doe',
    avatar: getPlaceholderAvatar('john'),
    text: 'Great article! Very informative and well-written.',
    date: '2024-03-15T10:30:00',
    likes: 5,
    isLiked: false
  },
  {
    id: '2',
    author: 'Jane Smith',
    avatar: getPlaceholderAvatar('jane'),
    text: 'I learned a lot from this post. Thanks for sharing!',
    date: '2024-03-15T11:15:00',
    likes: 3,
    isLiked: false
  }
])

const paginatedComments = computed(() => {
  return comments.value.slice(0, currentPage.value * commentsPerPage)
})

const hasMoreComments = computed(() => {
  return comments.value.length > currentPage.value * commentsPerPage
})

const loadMoreComments = () => {
  currentPage.value++
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const submitComment = () => {
  if (!newComment.value.trim()) return

  const comment: Comment = {
    id: Date.now().toString(),
    author: 'Current User',
    avatar: userAvatar,
    text: newComment.value.trim(),
    date: new Date().toISOString(),
    likes: 0,
    isLiked: false
  }

  comments.value.unshift(comment)
  newComment.value = ''
}

const likeComment = (comment: Comment) => {
  comment.isLiked = !comment.isLiked
  comment.likes += comment.isLiked ? 1 : -1
}

const replyToComment = (comment: Comment) => {
  newComment.value = `@${comment.author} `
}

const editComment = (comment: Comment) => {
  comment.isEditing = true
  comment.editText = comment.text
}

const saveEdit = (comment: Comment) => {
  if (!comment.editText?.trim()) return
  comment.text = comment.editText.trim()
  comment.isEditing = false
  comment.editText = ''
}

const deleteComment = (comment: Comment) => {
  const index = comments.value.findIndex((c) => c.id === comment.id)
  if (index !== -1) {
    comments.value.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

.comment-section {
  margin-top: 3rem;

  h3 {
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }

  .comment-form {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .form-content {
      flex: 1;

      textarea {
        width: 100%;
        padding: 1rem;
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius-md);
        resize: vertical;
        font-family: inherit;
        font-size: 1rem;
        line-height: 1.5;
        transition: all 0.3s;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;

        .submit-btn {
          padding: 0.5rem 1.5rem;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: all 0.3s;

          &:hover:not(:disabled) {
            filter: brightness(0.9);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  .comments-list {
    .comment {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .comment-content {
        flex: 1;

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;

          .author {
            font-weight: 500;
          }

          .date {
            color: var(--text-secondary);
            font-size: 0.9rem;
          }
        }

        .text {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .comment-actions {
          display: flex;
          gap: 1rem;

          .action-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s;

            &:hover {
              color: var(--primary-color);
            }

            i {
              font-size: 1rem;
            }
          }
        }
      }
    }
  }
}

.edit-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0.5rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

.action-btn {
  &.delete {
    &:hover {
      color: #dc3545;
    }
  }
}

.load-more {
  text-align: center;
  margin-top: 2rem;

  .load-more-btn {
    padding: 0.75rem 2rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
    }
  }
}

@media (max-width: 768px) {
  .comment-section {
    .comment-form {
      .avatar {
        width: 32px;
        height: 32px;
      }
    }

    .comments-list {
      .comment {
        .avatar {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
</style>
