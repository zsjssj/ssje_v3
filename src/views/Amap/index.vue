<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
// const searchdata = ref(null)
let map: any = null

// function serchArea(ev) {
//   console.log(ev)
// }

onMounted(() => {
  AMapLoader.load({
    key: '	dd7fd80ca8c604f56e89dfe5ca3fe8ff', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then(AMap => {
      map = new AMap.Map('container', {
        // 设置地图容器id
        viewMode: '2D', // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [104.06, 30.67] // 初始化地图中心点位置
      })
      map.on('click', function (ev: Event) {
        console.log(ev)
      })
      //103.986382,30.751319
    })
    .catch(e => {
      console.log(e)
    })
})
onUnmounted(() => {
  map?.destroy()
})
</script>

<template>
  <div id="container">
    <span>ssje-amap</span>
  </div>
</template>

<style lang="scss" scoped>
#container {
  height: 100vh;
  position: relative;
  span {
    position: absolute;
    top: 50%;
    left: 50%;
    color: rgba(0, 0, 0, 0.5);
    transform: translate(-50%, -50%);
    z-index: 100;
    pointer-events: none;
  }
}
</style>
