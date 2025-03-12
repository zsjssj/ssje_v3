<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
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
      <div @click="torouter('arcgis')">到arcgis界面</div>
      <div @click="torouter('cesium')">到Cesium地球界面</div>
      <div @click="torouter('amap')">到高德地图界面</div>
      <div @click="torouter('three3d')">到Three界面</div>
    </div>
  </div>
  <router-view style="height: 100vh; width: 100vw"></router-view>
</template>

<style lang="scss" scoped>
.left1 {
  width: 30px;
  height: 50px;
  position: absolute;
  top: 15vh;
  z-index: 1000;
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
  z-index: 1000;
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
