<template>
  <div class="about" ref="thr"></div>
  <div class="about1" ref="thrcss3d"></div>
  <div v-if="!showleft" class="left1" @click="changeshow">
    <span></span>
  </div>
  <div class="aboutleft" v-if="showleft">
    <div class="header">
      <div>左侧首页</div>
      <span @click="changeshow"></span>
    </div>
    <div class="aboutmain">
      <div @click="torouter('cesium')">到cesium地球界面</div>
      <div @click="torouter('echart')">到echart地图界面</div>
    </div>
  </div>
</template>

<script setup>
import router from '@/router/index.js'
import render, { css3drenderer } from '@/three/Render.js'
import camera from '@/three/Camera.js'
import scene from '@/three/Scene.js'
import cube from '@/three/createobject.js'
import { directionalLight } from '@/three/light.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const thr = ref(null)
const thrcss3d = ref(null)
let controls = null
const showleft = ref(false)
function changeshow() {
  if (showleft.value) {
    showleft.value = false
    return
  }
  showleft.value = true
}

function torouter(url) {
  router.push({ name: `${url}` })
}
function initth() {
  controls = new OrbitControls(camera, render.domElement)
  thr.value.appendChild(render.domElement)
  thrcss3d.value.appendChild(css3drenderer.domElement)
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
  css3drenderer.render(scene, camera)
  directionalLight.position.set(20 * Math.sin(new Date() / 5000), 10, -20 * Math.cos(new Date() / 5000))
  controls.update()
}
onMounted(() => {
  initth()
  animate()
})
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  render.setSize(window.innerWidth, window.innerHeight)
  render.setPixelRatio(window.devicePixelRatio)
  css3drenderer.setSize(window.innerWidth, window.innerHeight)
})
onBeforeUnmount(() => {
  // cube.material.dispose()
  // cube.geometry.dispose()
  // cube.clear()
  // scene.remove(directionalLight)
  // render.dispose()
  // scene.clear()
})
</script>

<style lang="less">
.about {
  background-image: url(@/assets/about-bgi.jpg);
  background-size: cover;
  height: 100vh;
  // padding-top: 20vh;
}
.about1 {
  font-size: 10px;
  position: fixed;
  top: -100px;
  left: -50px;
  color: aliceblue;
  z-index: 100;
  pointer-events: none;
  .elementTag {
    position: relative;

    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 10px;
      height: 1px;
      background-color: aqua;
      bottom: 0;
      right: -10px;
      transform: rotate(30deg);
      transform-origin: 0 0;
    }
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 4px;
      height: 4px;
      background-color: aqua;
      border-radius: 50%;
      bottom: -5px;
      right: -10px;
      transform: rotate(30deg);
      transform-origin: 0 0;
    }
    .content {
      background-color: rgba(20, 143, 221, 0.68);
      box-shadow: 0 0 12px rgba(0, 128, 255, 0.75);
      border: 1px solid rgba(127, 127, 255, 0.75);
    }
  }
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
.aboutleft {
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
.aboutleft .aboutmain {
  position: relative;
  margin-top: 2vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 10vh;
  div {
    width: 100%;
    padding: auto;
    &:hover {
      cursor: pointer;
      color: aqua;
    }
  }
}
</style>
