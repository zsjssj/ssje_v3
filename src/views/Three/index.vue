<script lang="ts" setup>
import { onMounted, useTemplateRef, onBeforeUnmount } from 'vue'
import { myThreeClass } from '@u/three'

const threeDom = useTemplateRef<HTMLDivElement>('threeDom')
let myThree: myThreeClass

//创建平面

onMounted(() => {
  console.log('threeDom.value', threeDom.value)
  myThree = new myThreeClass(<HTMLDivElement>threeDom.value)
  console.log('mythree', myThree)
  // createPlane()
})
onBeforeUnmount(() => {
  myThree && myThree.dispose()
})
</script>

<template>
  <div id="threeDomId" ref="threeDom">
    <span>ssje-shader</span>
  </div>
</template>

<style lang="scss" scoped>
#threeDomId {
  height: 100vh;
  width: 100vw;
  position: relative;
  span {
    position: absolute;
    top: 50%;
    left: 50%;
    color: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    z-index: 100;
    pointer-events: none;
  }
  @include flex();
}
</style>
