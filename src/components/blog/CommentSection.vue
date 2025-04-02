<template>
  <div class="comment-section">
    <h3>Comments</h3>

    <!-- Comment Form -->
    <form class="comment-form" @submit.prevent="submitComment">
      <div class="form-group">
        <textarea v-model="newComment" placeholder="Write a comment..." rows="3" required></textarea>
      </div>
      <div class="form-group">
        <input v-model="name" type="text" placeholder="Your name" required />
      </div>
      <div class="form-group">
        <input v-model="email" type="email" placeholder="Your email" required />
      </div>
      <button type="submit" class="submit-button">Post Comment</button>
    </form>

    <!-- Comments List -->
    <div class="comments-list">
      <div v-if="comments.length === 0" class="no-comments">
        <p>No comments yet. Be the first to comment!</p>
      </div>

      <div v-else class="comment" v-for="comment in comments" :key="comment.id">
        <div class="comment-header">
          <img :src="comment.avatar" :alt="comment.name" class="avatar" />
          <div class="comment-info">
            <span class="name">{{ comment.name }}</span>
            <span class="date">{{ comment.date }}</span>
          </div>
        </div>
        <div class="comment-content">
          {{ comment.content }}
        </div>
        <div class="comment-actions">
          <button @click="replyTo(comment)" class="reply-button">
            <i class="fas fa-reply"></i>
            Reply
          </button>
        </div>

        <!-- Nested Replies -->
        <div v-if="comment.replies && comment.replies.length > 0" class="replies">
          <div v-for="reply in comment.replies" :key="reply.id" class="comment reply">
            <div class="comment-header">
              <img :src="reply.avatar" :alt="reply.name" class="avatar" />
              <div class="comment-info">
                <span class="name">{{ reply.name }}</span>
                <span class="date">{{ reply.date }}</span>
              </div>
            </div>
            <div class="comment-content">
              {{ reply.content }}
            </div>
            <div class="comment-actions">
              <button @click="replyTo(reply)" class="reply-button">
                <i class="fas fa-reply"></i>
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Comment {
  id: string
  name: string
  email: string
  avatar: string
  content: string
  date: string
  replies?: Comment[]
}

const comments = ref<Comment[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Great article! Very informative.',
    date: '2024-03-15',
    replies: [
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
        content: 'I agree! The examples were particularly helpful.',
        date: '2024-03-16'
      }
    ]
  }
])

const newComment = ref('')
const name = ref('')
const email = ref('')
const replyingTo = ref<Comment | null>(null)

const submitComment = () => {
  const comment: Comment = {
    id: Date.now().toString(),
    name: name.value,
    email: email.value,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 100)}`,
    content: newComment.value,
    date: new Date().toISOString().split('T')[0]
  }

  if (replyingTo.value) {
    // Add as reply
    const parentComment = comments.value.find((c) => c.id === replyingTo.value?.id)
    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = []
      }
      parentComment.replies.push(comment)
    }
  } else {
    // Add as new comment
    comments.value.push(comment)
  }

  // Reset form
  newComment.value = ''
  name.value = ''
  email.value = ''
  replyingTo.value = null
}

const replyTo = (comment: Comment) => {
  replyingTo.value = comment
  newComment.value = `@${comment.name} `
}
</script>

<style lang="scss" scoped>
.comment-section {
  margin-top: 3rem;

  h3 {
    margin-bottom: 2rem;
  }

  .comment-form {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;

    .form-group {
      margin-bottom: 1rem;

      textarea,
      input {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
        }
      }
    }

    .submit-button {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s;

      &:hover {
        background: var(--primary-hover);
      }
    }
  }

  .comments-list {
    .no-comments {
      text-align: center;
      color: var(--text-secondary);
      padding: 2rem;
    }

    .comment {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .comment-header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 1rem;
        }

        .comment-info {
          display: flex;
          flex-direction: column;

          .name {
            font-weight: 500;
            color: var(--text-primary);
          }

          .date {
            font-size: 0.9rem;
            color: var(--text-secondary);
          }
        }
      }

      .comment-content {
        color: var(--text-primary);
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      .comment-actions {
        .reply-button {
          background: none;
          border: none;
          color: var(--primary-color);
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0;
          transition: color 0.3s;

          &:hover {
            color: var(--primary-hover);
          }

          i {
            font-size: 1rem;
          }
        }
      }
    }

    .replies {
      margin-left: 3rem;
      margin-top: 1rem;
      padding-left: 1rem;
      border-left: 2px solid var(--border-color);

      .reply {
        border-bottom: none;
        padding-bottom: 1rem;
        margin-bottom: 1rem;

        &:last-child {
          padding-bottom: 0;
          margin-bottom: 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .comment-section {
    .replies {
      margin-left: 1.5rem;
      padding-left: 0.5rem;
    }

    .comment-form {
      padding: 1rem;
    }
  }
}
</style>
