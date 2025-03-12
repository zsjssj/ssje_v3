<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue'
import { myThreeClass } from '@u/three'

const threeDom = useTemplateRef('threeDom')
let myThree: myThreeClass = null
onMounted(() => {
  console.log('threeDom.value', threeDom.value)
  myThree = new myThreeClass(threeDom.value)
  console.log('mythree', myThree)
})
</script>

<template>
  <div id="threeDomId" ref="threeDom">three</div>
</template>

<style lang="scss" scoped>
#threeDomId {
  height: 100vh;
  width: 100vw;
  @include flex();
}
</style>
