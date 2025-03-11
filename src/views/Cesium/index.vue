<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { Ion, Camera, Viewer, createWorldTerrainAsync, Rectangle } from 'cesium'

let viewer = null
//设置cesium静态资源路径
// window.CESIUM_BASE_URL = '/'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MWI5Mjc4Ni0zYjE0LTRjZDYtODIyNi05ZDAxZDJmZTUxNDQiLCJpZCI6MTY0MzMxLCJpYXQiOjE2OTM4MTc0NTJ9.fV9wIV4QqNLpsMBJOuHIZrWiITp-3rQKvwHyxBrvyKI'
//设置默认视角(中国)
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2)
onMounted(async () => {
  viewer = new Viewer('cesiumContainer', {
    terrainProvider: await createWorldTerrainAsync({
      requestVertexNormals: true, //法线
      requestWaterMask: true //水纹效果
    }),
    infoBox: false, //取消控制台的信息框
    animation: false, //是否播放动画
    timeline: false //是否显示时间轴
  })
  viewer.cesiumWidget.creditContainer.style.display = 'none'
})
onBeforeUnmount(() => {
  viewer!.destroy()
})
</script>

<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<style scoped>
#cesiumContainer {
  height: 100vh;
}
</style>
