<template>
  <div class="about">
    <div class="container">
      <Breadcrumb :items="breadcrumbItems" />

      <div class="about-content">
        <div class="profile-section">
          <div class="profile-header">
            <img :src="profile.avatar" :alt="profile.name" class="profile-avatar" />
            <div class="profile-info">
              <h1>{{ profile.name }}</h1>
              <p class="title">{{ profile.title }}</p>
              <div class="social-links">
                <a :href="profile.github" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-github"></i>
                </a>
                <a :href="profile.twitter" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-twitter"></i>
                </a>
                <a :href="profile.linkedin" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          <div class="profile-bio">
            <p>{{ profile.bio }}</p>
          </div>
        </div>

        <div class="skills-section">
          <h2>Skills</h2>
          <div class="skills-grid">
            <div v-for="skill in skills" :key="skill.category" class="skill-category">
              <h3>{{ skill.category }}</h3>
              <ul class="skill-list">
                <li v-for="item in skill.items" :key="item.name">
                  <span class="skill-name">{{ item.name }}</span>
                  <div class="skill-level">
                    <div class="progress-bar" :style="{ width: item.level + '%' }"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="experience-section">
          <h2>Experience</h2>
          <div class="timeline">
            <div v-for="job in experience" :key="job.id" class="timeline-item">
              <div class="timeline-date">{{ job.period }}</div>
              <div class="timeline-content">
                <h3>{{ job.title }}</h3>
                <p class="company">{{ job.company }}</p>
                <p class="description">{{ job.description }}</p>
                <ul class="achievements">
                  <li v-for="achievement in job.achievements" :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-section">
          <h2>Get in Touch</h2>
          <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
          <a :href="'mailto:' + profile.email" class="contact-button"> Send Message </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { getPlaceholderAvatar } from '@/utils/image'

const breadcrumbItems = [
  { text: 'Home', path: '/' },
  { text: 'About', path: '/about' }
]

const profile = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  avatar: getPlaceholderAvatar('john'),
  bio: 'I am a passionate full-stack developer with over 5 years of experience in building modern web applications. I specialize in Vue.js, TypeScript, and Node.js, and I love creating beautiful, user-friendly interfaces that provide great user experiences.',
  email: 'john@example.com',
  github: 'https://github.com/zsjssj',
  twitter: 'https://twitter.com/johndoe',
  linkedin: 'https://linkedin.com/in/johndoe'
}

const skills = [
  {
    category: 'Frontend',
    items: [
      { name: 'Vue.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'HTML/CSS', level: 95 },
      { name: 'JavaScript', level: 90 }
    ]
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'PostgreSQL', level: 70 }
    ]
  },
  {
    category: 'Tools & Others',
    items: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 70 },
      { name: 'AWS', level: 65 },
      { name: 'CI/CD', level: 75 }
    ]
  }
]

const experience = [
  {
    id: 1,
    period: '2020 - Present',
    title: 'Senior Full Stack Developer',
    company: 'Tech Company Inc.',
    description: 'Leading the development of a modern web application using Vue 3 and TypeScript.',
    achievements: ['Implemented new features that increased user engagement by 40%', 'Reduced application load time by 50% through optimization', 'Mentored junior developers and conducted code reviews']
  },
  {
    id: 2,
    period: '2018 - 2020',
    title: 'Full Stack Developer',
    company: 'Web Solutions Ltd.',
    description: 'Developed and maintained multiple web applications using Vue.js and Node.js.',
    achievements: ['Built a responsive e-commerce platform', 'Integrated payment gateways and shipping APIs', 'Improved application performance by 30%']
  }
]

const team = [
  {
    name: 'John Doe',
    role: 'Lead Developer',
    avatar: getPlaceholderAvatar('john'),
    bio: 'Full-stack developer with over 5 years of experience.'
  }
  // ... other team members ...
]
</script>

<style lang="scss" scoped>
.about {
  padding: 4rem 0;

  .about-content {
    max-width: 900px;
    margin: 0 auto;

    .profile-section {
      margin-bottom: 4rem;
      text-align: center;

      .profile-header {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-bottom: 2rem;

        .profile-avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--primary-color);
        }

        .profile-info {
          text-align: left;

          h1 {
            margin: 0 0 0.5rem;
            font-size: 2.5rem;
          }

          .title {
            color: var(--text-secondary);
            font-size: 1.2rem;
            margin: 0 0 1rem;
          }

          .social-links {
            display: flex;
            gap: 1rem;

            a {
              color: var(--text-secondary);
              font-size: 1.5rem;
              transition: color 0.3s;

              &:hover {
                color: var(--primary-color);
              }
            }
          }
        }
      }

      .profile-bio {
        font-size: 1.1rem;
        line-height: 1.8;
        color: var(--text-primary);
        max-width: 800px;
        margin: 0 auto;
      }
    }

    .skills-section {
      margin-bottom: 4rem;

      h2 {
        text-align: center;
        margin-bottom: 3rem;
      }

      .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;

        .skill-category {
          h3 {
            margin-bottom: 1.5rem;
          }

          .skill-list {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
              display: flex;
              align-items: center;
              gap: 1rem;
              margin-bottom: 1rem;

              .skill-name {
                min-width: 100px;
              }

              .skill-level {
                flex: 1;
                height: 8px;
                background: var(--bg-secondary);
                border-radius: 4px;
                overflow: hidden;

                .progress-bar {
                  height: 100%;
                  background: var(--primary-color);
                  border-radius: 4px;
                  transition: width 1s ease-in-out;
                }
              }
            }
          }
        }
      }
    }

    .experience-section {
      margin-bottom: 4rem;

      h2 {
        text-align: center;
        margin-bottom: 3rem;
      }

      .timeline {
        position: relative;
        max-width: 800px;
        margin: 0 auto;

        &::before {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 100%;
          background: var(--border-color);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 3rem;
          width: 50%;
          padding-right: 2rem;

          &:nth-child(even) {
            margin-left: 50%;
            padding-right: 0;
            padding-left: 2rem;
          }

          .timeline-date {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
          }

          .timeline-content {
            background: var(--card-bg);
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px var(--shadow-color);

            h3 {
              margin: 0 0 0.5rem;
            }

            .company {
              color: var(--text-secondary);
              margin: 0 0 1rem;
            }

            .description {
              margin-bottom: 1rem;
            }

            .achievements {
              list-style: none;
              padding: 0;
              margin: 0;

              li {
                position: relative;
                padding-left: 1.5rem;
                margin-bottom: 0.5rem;

                &::before {
                  content: '•';
                  color: var(--primary-color);
                  position: absolute;
                  left: 0;
                }
              }
            }
          }
        }
      }
    }

    .contact-section {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--card-bg);
      border-radius: 8px;
      box-shadow: 0 2px 8px var(--shadow-color);

      h2 {
        margin-bottom: 1rem;
      }

      p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
      }

      .contact-button {
        display: inline-block;
        padding: 1rem 2rem;
        background: var(--primary-color);
        color: white;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
          background: var(--primary-hover);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .about {
    padding: 2rem 0;

    .about-content {
      .profile-section {
        .profile-header {
          flex-direction: column;
          text-align: center;

          .profile-info {
            text-align: center;
          }
        }
      }

      .experience-section {
        .timeline {
          &::before {
            left: 0;
          }

          .timeline-item {
            width: 100%;
            padding-left: 2rem;
            padding-right: 0;
            margin-left: 0;
            margin-bottom: 2rem;

            &:nth-child(even) {
              margin-left: 0;
              padding-left: 2rem;
            }
          }
        }
      }
    }
  }
}
</style>
