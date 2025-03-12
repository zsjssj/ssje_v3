<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
const nav_show = ref(true)
const route = useRoute()

function handleScroll() {
  const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop // 滚动高度
  nav_show.value = scrollHeight <= 200
}
onMounted(() => {
  nextTick(() => {
    window.addEventListener('scroll', handleScroll) // 监听（绑定）滚轮滚动事件
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div id="app">
    <nav v-show="nav_show" :class="{ 'nav-active': route.name !== 'home' }">
      <div class="left">
        <img src="./assets/user.png" alt="头像" />
        <span>十三君诶|个人建站</span>
      </div>
      <div class="right">
        <ul>
          <li>
            <router-link to="/home"> <i></i>个人主页</router-link>
          </li>
          <li>
            <router-link to="/about"> <i></i>兴趣技能</router-link>
          </li>
          <!-- <li>
            <router-link to="/talk"> <i></i>日常记录</router-link>
          </li> -->
          <li>
            <router-link to="/learn"> <i></i>学习记录</router-link>
          </li>
          <li>
            <router-link to="/canvas"> <i></i>canvas测试</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <main ref="main">
      <router-view></router-view>
    </main>
  </div>
  <!-- <canvasView /> -->
</template>

<style lang="scss" scoped>
@-webkit-keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
@keyframes tracking-in-expand {
  0% {
    letter-spacing: -0.5em;
    opacity: 0;
  }
  40% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
a {
  text-decoration: none;
  font-weight: 400;
  color: #3d4a56;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #293139;
  nav {
    margin-top: 2vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 64vw;
    padding: 1vh 1rem 0 1rem;
    max-height: 10vh;
    border-radius: 1rem;
    &.nav-active {
      background-color: rgba(145, 218, 255, 0.1);
      backdrop-filter: blur(2rem);
      box-shadow: 0 0 0.25rem 0rem rgba(0, 0, 0, 0.3);
    }
    .left {
      width: 20vw;
      img {
        vertical-align: middle;
        width: clamp(2rem, 5vmin, 3rem);
        height: clamp(2rem, 5vmin, 3rem);
        border-radius: 0.6rem;
        transform: translate(-1vw);
      }
      span {
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        vertical-align: middle;
        height: 100%;
        font-size: 3vmin;
        background-image: linear-gradient(90deg, rgb(27, 148, 241), rgb(140, 64, 212));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        -webkit-animation: tracking-in-expand 2s cubic-bezier(0.215, 0.61, 0.355, 1) both;
        animation: tracking-in-expand 2s cubic-bezier(0.215, 0.61, 0.355, 1) both;
      }
    }
    .right ul {
      list-style: none;
      -webkit-animation: tracking-in-expand 2s cubic-bezier(0.215, 0.61, 0.355, 1) both;
      animation: tracking-in-expand 2s cubic-bezier(0.215, 0.61, 0.355, 1) both;
      li {
        display: inline-flex;
        line-height: 6vmin;
        text-align: center;
        height: 6vmin;
        border-radius: 14px;
        a {
          display: block;
          padding: 0 20px;
          width: 100%;
          height: 100%;
          text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.1);
          &.router-link-exact-active {
            color: #5ab0f7;
          }
        }
        &:hover {
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  main {
    background-color: rgb(235, 235, 235);
  }
}
</style>
