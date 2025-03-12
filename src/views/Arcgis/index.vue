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
  <div id="viewDiv"></div>
</template>

<style scoped></style>
