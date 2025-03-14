<script lang="ts" setup>
import { onMounted } from 'vue'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'

// let view: any
function arcGisInit() {
  const map = new Map({
    basemap: 'topo-vector'
  })
  new MapView({
    container: 'viewDiv', // reference the div id
    map: map,
    zoom: 4,
    center: [104.0667, 30.6667]
  })
}
onMounted(() => {
  arcGisInit()
})
</script>

<template>
  <div id="viewDiv">
    <span>ssje-arcgis</span>
  </div>
</template>

<style lang="scss" scoped>
#viewDiv {
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
