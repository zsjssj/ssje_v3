<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>
<script setup>
import * as Cesium from 'cesium'
import '@/Widgets/widgets.css' //导入样式
import { onMounted } from 'vue'

//设置cesium静态资源路径
window.CESIUM_BASE_URL = '/'

// Cesium.Ion.defaultAccessToken = 'assets:read, geocode'
//设置默认视角(中国)
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(89.5, 20.4, 110.4, 61.2)
onMounted(() => {
  let viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox: false, //取消控制台的信息框
    animation: false, //是否播放动画
    timeline: false //是否显示时间轴
  })
  viewer.cesiumWidget.creditContainer.style.display = 'none'
})
</script>
