<template>
  <div class="home">
    <header>
      <div class="header-main">
        <span>你们有我未有的东西，反之亦然</span>
        <ul>
          <li>
            <span>访问CSDN</span>
            <a href="https://blog.csdn.net/qq_53925037?type=blog" target="_blank">CSDN</a>
          </li>
          <li>
            <span>访问Github</span>
            <a href="https://github.com/zsjssj" target="_blank">Github</a>
          </li>
          <li>
            <span>2114714800@qq.com</span>
            <a href="#">email</a>
          </li>
          <!-- <li>
            <img src="@/assets/addWeChat.jpg" alt="" srcset="" />
            <a href="#">Wechat</a>
          </li> -->
        </ul>
      </div>
    </header>
    <main>
      <homePart :parttext="myself[0]" :partart="myself[1]"></homePart>
      <homePart :parttext="gonggao[0]" :partart="gonggao[1]" style="color: orangered"></homePart>
    </main>
    <footer>
      <div>十三君诶</div>
      <div>{{ date }}</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import homePart from '@/components/part.vue'
import dayjs from 'dayjs'

const gonggao = ['公告', '本博客所发布的各种软件文章仅限用于学习和研究目的；任何人不得将本站内容用于商业或者非法用途，否则，一切后果请用户自负。如有侵权请邮件与我联系处理。']
const myself = ['自我', '万物包含太多的内容，总有能让自己感到有趣的。将自身作为资本，面对知识与技能时，贪婪的去吸食，壮大自己。']
let timer = null
let date = ref(new Date())
const now = function (time) {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

function setTime() {
  date.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
  setTimeout(setTime, 1000)
}

onMounted(() => {
  setTime()
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style lang="scss" scoped>
* {
  margin: 0px;
  padding: 0px;
  color: #1c2328;
  text-decoration: none;
  list-style: none;
}
html {
  -webkit-locale: 0;
}
.home {
  header {
    background-image: url(@/assets/home-header.png);
    background-size: cover;
    height: 100vh;
    .header-main {
      position: relative;
      top: 40vh;
      span {
        color: #3d4a56;
      }
      ul {
        margin-top: 8vh;
        display: flex;
        justify-content: center;
        font-weight: 600;
        li {
          box-sizing: border-box;
          font-size: 2vmin;
          border-radius: 4vmin;
          height: 6vh;

          span {
            display: none;
            box-sizing: content-box;
            padding: 1vmin;
            border-radius: 0.8vmin;
            background-color: rgb(206, 215, 219);
            position: absolute;
            transform: translate(-50%, 200%);
            // opacity: 0;
          }
          img {
            display: none;
            width: 30vmin;
            height: 30vmin;
            position: absolute;
            transform: translate(-40%, 40%);
            // opacity: 0;
          }
          a {
            display: flex;
            align-items: center;
            padding: 0 4vw;
            width: 100%;
            height: 100%;
          }
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.4);
            a {
              background-image: linear-gradient(90deg, rgb(64, 155, 225) 20%, rgb(166, 92, 236) 40%);
              background-clip: text;
              -webkit-background-clip: text;
              color: transparent;
            }
            span {
              display: inline-table;
            }
            img {
              display: inline-table;
            }
          }
        }
      }
    }
  }
  main {
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    margin: 2vh auto;
    padding: 2vh 0;
    height: 1000px;
    width: 64vw;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.5);
  }
  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 14rem;
    background-color: #1c2328;
    div {
      // border: 1px solid #3efff5;
      color: rgb(214, 223, 231);
    }
  }
}
</style>
