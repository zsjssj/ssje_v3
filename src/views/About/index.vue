<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const showleft = ref(false)
function changeshow() {
  showleft.value = !showleft.value
}

function torouter(url: string) {
  router.push({ name: `${url}` })
}
</script>

<template>
  <div v-if="!showleft" class="left1" @click="changeshow">
    <span></span>
  </div>
  <div class="aboutleft" v-else>
    <div class="header">
      <div>左侧首页</div>
      <span @click="changeshow"></span>
    </div>
    <div class="aboutmain">
      <div :class="{ isActive: route.name == 'arcgis' }" @click="torouter('arcgis')">arcgis</div>
      <div :class="{ isActive: route.name == 'cesium' }" @click="torouter('cesium')">cesium</div>
      <div :class="{ isActive: route.name == 'amap' }" @click="torouter('amap')">amap</div>
      <div :class="{ isActive: route.name == 'three3d' }" @click="torouter('three3d')">three</div>
    </div>
  </div>
  <router-view style="height: 100vh; width: 100vw"></router-view>
</template>

<style lang="scss" scoped>
.left1 {
  width: 30px;
  height: 50px;
  position: absolute;
  top: 30vh;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  background-color: rgba(145, 218, 255, 0.1);
  backdrop-filter: blur(1rem);
  box-shadow: 0 0 0.25rem 0rem rgba(0, 0, 0, 0.3);
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
  position: absolute;
  z-index: 1000;
  // margin-top: 15vh;
  padding: 1rem;
  left: 1rem;
  top: 30vh;
  // bottom: 0;
  width: 12rem;
  border-radius: 1rem;
  // height: 18rem;
  // height: content;
  background-color: rgba(145, 218, 255, 0.1);
  backdrop-filter: blur(1rem);
  box-shadow: 0 0 0.25rem 0rem rgba(0, 0, 0, 0.3);
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
    }
    span {
      width: 0.6rem;
      height: 0.6rem;
      margin-right: 0.25rem;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;

  div {
    width: 5rem;
    height: 5rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.25rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
    box-shadow: 1px 1px 0.25rem 0rem rgba(255, 255, 255, 0.2) inset, 1px 1px 0.25rem 0rem rgba(0, 0, 0, 0.2);
    &:hover {
      cursor: pointer;
      color: #5ab0f7;
    }
    &.isActive {
      color: #5ab0f7;
    }
  }
}
</style>
