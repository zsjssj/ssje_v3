<template>
  <div id="app">
    <nav v-show="nav_show">
      <div class="left">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTAzLTA1VDEzOjU1OjQ5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wMy0yMVQyMTowMjo0NyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wMy0yMVQyMTowMjo0NyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3NGYwZTZiOS1lZTM0LTI4NDYtYjE4YS1hYmY1YjU4YWVmMTUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1MDIzZGIxOS02NWUxLTA0NGUtYWM0YS1hMTI3NGMxNmI2OGMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYjZkYzdhZi1mNDUwLWQzNDAtODdiMy1hYmY3YmIwY2FjYmUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBiNmRjN2FmLWY0NTAtZDM0MC04N2IzLWFiZjdiYjBjYWNiZSIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0wNVQxMzo1NTo0OSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjc0ZjBlNmI5LWVlMzQtMjg0Ni1iMThhLWFiZjViNThhZWYxNSIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0yMVQyMTowMjo0NyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pp71/QgAAAh0SURBVHic3ZtbbJTHFcd/M7v2Grs2i21sjO0lIgRCJEgoCakiWkFJQTQOGEUJUfFDVfFQ1CSvlZoqqpo+9aEvBalUqFIlNwltU18SCCoNQUmJECkoxVUFhISs7+Araxtfd04fZr0Xs8R7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"
          alt="头像"
        />
        <span>十三君诶|个人博客</span>
      </div>
      <div class="right">
        <ul>
          <li>
            <router-link to="/home"> <i></i>个人主页</router-link>
          </li>
          <li>
            <router-link to="/about"> <i></i>兴趣技能</router-link>
          </li>
          <li>
            <router-link to="/talk"> <i></i>留言板</router-link>
          </li>
          <li>
            <router-link to="/learn"> <i></i>学习资源</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <main ref="main">
      <router-view></router-view>
      <!-- <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view> -->
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
let nav_show = ref(true)

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

<style lang="less" scoped>
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
    margin-top: 3vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 64vw;
    max-height: 10vh;
    .left {
      width: 20vw;
      img {
        vertical-align: middle;
        width: 6vmin;
        height: 6vmin;
        transform: translate(-1vw);
      }
      span {
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
    .right {
      ul {
        list-style: none;
        -webkit-animation: tracking-in-expand 2s cubic-bezier(0.215, 0.61, 0.355, 1) both;
        animation: tracking-in-expand 2s cubic-bezier(0.215, 0.61, 0.355, 1) both;
        li {
          display: inline-flex;
          line-height: 6vmin;
          text-align: center;
          height: 6vmin;
          border-radius: 14px;
          &:hover {
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.1);
          }
          a {
            display: block;
            padding: 0 20px;
            width: 100%;
            height: 100%;
            font-size: 2vmin;
            &.router-link-exact-active {
              color: #5ab0f7;
            }
          }
        }
      }
    }
  }
  main {
    background-color: rgb(235, 235, 235);
  }
}
</style>
