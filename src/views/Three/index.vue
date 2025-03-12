<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue'
import { myThreeClass } from '@u/three'
import * as Three from 'three'

const threeDom = useTemplateRef<HTMLDivElement>('threeDom')
let myThree: myThreeClass

//创建平面
function createPlane() {
  const geometry = new Three.PlaneGeometry(100, 100)
  const material = new Three.MeshBasicMaterial({ color: 0xffff00, side: Three.DoubleSide })
  const plane = new Three.Mesh(geometry, material)
  plane.rotation.x = Math.PI / 2
  myThree.scene.add(plane)
}

onMounted(() => {
  console.log('threeDom.value', threeDom.value)
  myThree = new myThreeClass(<HTMLDivElement>threeDom.value)
  console.log('mythree', myThree)
  createPlane()
})
</script>

<template>
  <div id="threeDomId" ref="threeDom"></div>
</template>

<style lang="scss" scoped>
#threeDomId {
  height: 100vh;
  width: 100vw;
  @include flex();
}
</style>
