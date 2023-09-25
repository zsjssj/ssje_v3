<template>
  <div id="container">init</div>
  <el-input
    v-model.trim="searchdata"
    class="m-2 searchinput"
    placeholder="请输入地名"
    :prefix-icon="Search"
    @change="serchArea"
  />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import AMapLoader from '@amap/amap-jsapi-loader'
const searchdata = ref(null)
let map = null

function serchArea(ev) {
  console.log(ev)
}

onMounted(() => {
  AMapLoader.load({
    key: '	dd7fd80ca8c604f56e89dfe5ca3fe8ff', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        // 设置地图容器id
        viewMode: '2D', // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [104.06, 30.67] // 初始化地图中心点位置
      })
      map.on('click', function (ev) {
        console.log(ev)
      })
      //103.986382,30.751319
    })
    .catch((e) => {
      console.log(e)
    })
})
onUnmounted(() => {
  map?.destroy()
})
</script>

<style lang="less" scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100vw;
  height: 100vh;
}
.searchinput {
  position: absolute;
  left: 0;
  top: 10vh;
  width: 200px;
}
</style>
