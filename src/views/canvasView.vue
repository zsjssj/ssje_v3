<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { canvasDraw } from '@/utils/canvasDraw.js'

function test() {
  //顶点着色器代码
  const vertexShaderSource = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = vec(0.0,0.0,0.0,1.0);
    gl_PointSize = 20.0;
  }
`
  //片元着色器代码
  const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  }
`
  var program = ctx.initShader(vertexShaderSource, fragmentShaderSource)
}

//保存canvas画布
function onClickSave(event) {
  ctx && ctx.saveDraw()
}
function onClickClear(event) {
  ctx && ctx.clearDraw()
}
function createSquare(gl) {
  let vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  const verts = [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)
  const square = {
    buffer: vertexBuffer,
    vertSize: 3,
    nVerts: 4,
    primtype: gl.TRIANGLE_STRIP
  }
  return square
}

let ctx
onMounted(() => {
  const canvas = document.getElementById('canvasTest')
  // let ctx2d = canvas.getContext('2d')
  // ctx2d.fillStyle = 'red'
  // console.log('ctx2d', ctx2d)
  let gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  console.log('gl', gl)
  // ctx = new canvasDraw(canvas)
  // ctx.onHandleDraw()

  const square = createSquare(gl)
  console.log('square', square)
})

onBeforeUnmount(() => {
  //主动释放GL缓存
  let canvas = ctx?.canvas.getContext('webgl2') || ctx?.canvas.getContext('webgl')
  canvas?.getExtension('WEBGL_lose_context')?.loseContext()
})
</script>

<template>
  <div class="layout">
    <canvas id="canvasTest"></canvas>
    <div>
      <button style="margin: 1rem 1rem 0 0; padding: 0.25rem 1rem" @click="onClickClear">清空</button>
      <button style="margin: 1rem 0 0 0; padding: 0.25rem 1rem" @click="onClickSave">保存</button>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

#canvasTest {
  /* border: 1px solid #000; */
  background-color: rgb(200, 200, 200);
}
</style>
