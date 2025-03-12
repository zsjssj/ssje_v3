<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import * as Cesium from 'cesium'

let viewer: any = null
//设置cesium静态资源路径
// window.CESIUM_BASE_URL = '/'

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MWI5Mjc4Ni0zYjE0LTRjZDYtODIyNi05ZDAxZDJmZTUxNDQiLCJpZCI6MTY0MzMxLCJpYXQiOjE2OTM4MTc0NTJ9.fV9wIV4QqNLpsMBJOuHIZrWiITp-3rQKvwHyxBrvyKI'
//设置默认视角(中国)
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2)

function initcamera(lng = 104.0667, lat = 30.6667, height = 10000, pitch = Cesium.Math.toRadians(-90)) {
  if (!viewer) return
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
    orientation: { pitch }
  })
  viewer.camera.defaultMoveAmount = 100000
  // viewer.camera.frustum.far = 60000 //相机最远可视距离
  viewer.camera.frustum.near = 1 //相机最近可视距离
  // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100 //相机的高度的最小值
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 25000000 //相机高度的最大值
}

onMounted(async () => {
  const worldTerrain = await Cesium.createWorldTerrainAsync({
    requestVertexNormals: true, //法线
    requestWaterMask: true //水纹效果
  })
  viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: worldTerrain,
    infoBox: false, //取消控制台的信息框
    animation: false, //是否播放动画
    timeline: false //是否显示时间轴
  })
  viewer.cesiumWidget.creditContainer.style.display = 'none'
  initcamera()
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
