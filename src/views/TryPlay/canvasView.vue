<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { canvasDraw } from '@u/canvasDraw'

let ctx: canvasDraw | null = null

// //保存canvas画布
function onClickSave() {
  ctx && ctx.saveDraw()
}

function onClickClear() {
  ctx && ctx.clearDraw()
}

// function createSquare(gl) {
//   let vertexBuffer = gl.createBuffer()
//   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
//   const verts = [0.5, 0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, -0.5, -0.5, 0.0]
//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW)
//   const square = {
//     buffer: vertexBuffer,
//     vertSize: 3,
//     nVerts: 4,
//     primtype: gl.TRIANGLE_STRIP
//   }
//   return square
// }

// //返回着物体矩阵的函数
// function getMatrix() {
//   //定义正方形的变换矩阵-先对于相机沿z轴后移3.333单位
//   const modelViewMatrix = new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -3.333, 1.0])
//   //变换矩阵（45°视野）
//   const projectionMatrix = new Float32Array([2.4142136573791504, 0, 0, 0, 0, 2.4142136573791504, 0, 0, 0, 0, -1.0020020008087158, -1, 0, 0, -0.20020020008087158, 0])
//   return { modelViewMatrix, projectionMatrix }
// }

// //返回着色器配置的函数
// // function getShader() {
// //   //顶点着色器代码
// //   const vertexShaderSource = `
// //   attribute vec3 vertexPos;
// //   attribute vec4 a_Position;
// //   uniform mat4 modelViewMatrix;
// //   uniform mat4 projectionMatrix;
// //   void main() {
// //     gl_Position = modelViewMatrix * modelViewMatrix * vec4(vertexPos,1.0);
// //   }
// // `
// //   //片元着色器代码
// //   const fragmentShaderSource = `
// //   void main() {
// //     gl_FragColor = vec4(1.0,1.0,1.0,1.0);
// //   }
// // `
// //   return { vertexShaderSource, fragmentShaderSource }
// // }

// //绘制
// // function draw(gl) {
// //   const obj = createSquare(gl)
// //   const { vertexShaderSource, fragmentShaderSource } = getShader()
// //   const { modelViewMatrix, projectionMatrix } = getMatrix()

// //   //用黑色清除背景
// //   gl.clearColor(0.0, 0.0, 0.0, 1.0)
// //   gl.clear(gl.COLOR_BUFFER_BIT)
// //   //设置顶点数组
// //   gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer)
// //   //设置着色器
// //   var shaderProgram = gl.createProgram()

// //   // Attach pre-existing shaders
// //   gl.attachShader(shaderProgram, vertexShaderSource)
// //   gl.attachShader(shaderProgram, fragmentShaderSource)

// //   gl.linkProgram(shaderProgram)
// //   gl.useProgram(shaderProgram)
// //   gl.useProgram(shaderProgram)
// //   //设置着色器参数：点坐标、投影矩阵和模型视图矩阵
// //   gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0)
// //   gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, getMatrix().projectionMatrix)
// //   gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, getMatrix().modelViewMatrix)
// //   gl.drawArrays(obj.primtype, 0, obj.nVerts)
// // }

onMounted(() => {
  const canvas = document.getElementById('canvasTest')
  ctx = new canvasDraw(<HTMLCanvasElement>canvas)
  ctx.onHandleDraw()
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
  width: 500px;
  height: 500px;
  background-color: rgb(200, 200, 200);
}
</style>
