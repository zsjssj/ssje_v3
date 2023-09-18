<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>
<script setup>
import * as Cesium from 'cesium'
import '@/Widgets/widgets.css' //导入样式
import { onMounted, onBeforeUnmount } from 'vue'

let viewer = null
//设置cesium静态资源路径
window.CESIUM_BASE_URL = '/'

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MWI5Mjc4Ni0zYjE0LTRjZDYtODIyNi05ZDAxZDJmZTUxNDQiLCJpZCI6MTY0MzMxLCJpYXQiOjE2OTM4MTc0NTJ9.fV9wIV4QqNLpsMBJOuHIZrWiITp-3rQKvwHyxBrvyKI'
//设置默认视角(中国)
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2)
onMounted(async () => {
  viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: await Cesium.createWorldTerrainAsync({
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
  viewer.destroy()
})
</script>
<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
}
</style>
