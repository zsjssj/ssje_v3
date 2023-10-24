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
    sceneMode: Cesium.SceneMode.SCENE2D,
    targetFrameRate: 30, // 控制渲染帧数
    infoBox: false, //取消控制台的信息框
    animation: false, //是否播放动画
    timeline: false //是否显示时间轴
  })
  viewer.cesiumWidget.creditContainer.style.display = 'none'
  //添加点
  let point = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(103.986382, 30.751319, 10),
    point: {
      pixlSize: 10,
      color: Cesium.Color.RED,
      outlineColor: Cesium.Color.WHITE
      // outlineWidth: 1
    },
    label: {
      text: '作者位置',
      //文字大小以及字体
      font: '12px sans-serif',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      //FILL填充文字，OUTLINE勾勒标签，FILL_AND_OUTLINE填充文字和勾勒标签
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      //文字偏移量
      pixelOffest: new Cesium.Cartesian2(0, -24),
      //设置文字的显示位置(水平),LEFT/RIGHT/CENTER
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER
    }
  })
})
onBeforeUnmount(() => {
  viewer && viewer.destroy()
})
</script>
<style lang="less" scoped>
#cesiumContainer {
  height: 100vh;
}
</style>
