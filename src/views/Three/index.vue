<template>
  <div class="about" ref="thr"></div>
  <div class="about1" ref="thrcss3d"></div>
</template>

<script setup>
import router from '@/router/index.ts'
import render, { css3drenderer } from '@/three/Render.js'
import camera from '@/three/Camera.js'
import scene from '@/three/Scene.js'
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
  background-image: url(@/assets/about-bgi.png);
  background-size: cover;
  height: 100vh;
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
</style>
