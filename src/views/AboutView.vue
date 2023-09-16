<template>
  <div class="about" ref="thr"></div>
  <div v-if="!showleft" class="left1" @click="changeshow">
    <span></span>
  </div>
  <div class="left" v-if="showleft">
    <div class="header">
      <div>左侧首页</div>
      <span @click="changeshow"></span>
    </div>
    <div class="main">
      <div @click="tocseium">到cesium界面</div>
      <!-- <router-link to="/cesium">到cesium界面</router-link> -->
    </div>
  </div>
</template>

<script setup>
import router from '@/router/index.js'
import render from '@/three/Render.js'
import camera from '@/three/Camera.js'
import scene from '@/three/Scene.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, ref } from 'vue'

const thr = ref(null)
let controls = null
const showleft = ref(true)
function changeshow() {
  if (showleft.value) {
    showleft.value = false
    return
  }
  showleft.value = true
}

function tocseium() {
  router.push('./cesium')
}
function initth() {
  controls = new OrbitControls(camera, render.domElement)
  thr.value.appendChild(render.domElement)
}
render.domElement.addEventListener('dblclick', () => {
  const fullscreenElment = document.fullscreenElement
  if (!fullscreenElment) {
    render.domElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

function animate() {
  requestAnimationFrame(animate)
  render.render(scene, camera)
  controls.update()
}
onMounted(() => {
  initth()
  animate()
  window.addEventListener('resize', () => {
    render.setSize(window.innerWidth, window.innerHeight)
  })
})
</script>

<style lang="less" scoped>
.about {
  background-image: url(@/assets/about-bgi.jpg);
  background-size: cover;
  height: 100vh;
  // padding-top: 20vh;
}
.left1 {
  width: 30px;
  height: 50px;
  position: absolute;
  top: 15vh;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  span {
    width: 10px;
    height: 10px;
    margin-top: 2px;
    margin-right: 0.6vw;
    border-top: 2px solid;
    border-right: 2px solid;
    transform: rotate(45deg);
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0);
    span {
      border-top: 2px solid rgb(25, 122, 243);
      border-right: 2px solid rgb(25, 122, 243);
    }
  }
}
.left {
  display: flex;
  flex-direction: column;
  position: absolute;
  padding-top: 15vh;
  left: 0;
  top: 0;
  bottom: 0;
  width: 15vw;
  background-color: rgba(0, 0, 0, 0.1);
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    span {
      width: 10px;
      height: 10px;
      margin-top: 2px;
      margin-right: 0.6vw;
      border-top: 2px solid;
      border-left: 2px solid;
      transform: rotate(-45deg);
      &:hover {
        border-top: 2px solid rgb(25, 122, 243);
        border-left: 2px solid rgb(25, 122, 243);
      }
    }
  }
}
.left .main {
  width: 100%;
  background-color: #fff;
  margin: 20px, 0;
  padding: 20vh, 2vw;
  height: 5vh;
}
</style>
