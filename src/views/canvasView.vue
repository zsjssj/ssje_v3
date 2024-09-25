<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

class canvasDraw {
  constructor(canvasElement) {
    // this.canvas = document.getElementById('canvasTest')
    this.canvas = canvasElement
    this.ctx = this.canvas.getContext('2d')

    this.lastX = 0 //记录画笔上次的x坐标
    this.lastY = 0 //记录画笔上次的Y坐标

    this.isCanDraw = false //记录画笔是否可以移动
    this.canvasId = 0 //记录画布的id
  }
  init() {
    this.canvas.width = 500
    this.canvas.height = 500
    // const scale = window.devicePixelRatio // 获取设备像素比
    // canvas.width = 500 * scale
    // canvas.height = 500 * scale
    // ctx.scale(scale, scale) // 按比例缩放上下文

    //2d绘图配置
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.ctx.lineWidth = 0.5 // 根据需要调整线宽
  }
  saveDraw() {
    const link = document.createElement('a')
    link.href = this.canvas.toDataURL()
    link.download = 'canvas.png'
    link.click()
    // this.canvasId += 1
  }
  handleDraw(event) {
    event.preventDefault()
    if (this.isCanDraw) {
      this.ctx.lineTo(event.offsetX, event.offsetY)
      if (Math.abs(event.offsetX - this.lastX) > 3 || Math.abs(event.offsetY - this.lastY) > 3) {
        this.ctx.quadraticCurveTo(this.lastX, this.lastY, event.offsetX, event.offsetY)
      }
      this.ctx.stroke()
      ;[this.lastX, this.lastY] = [event.offsetX, event.offsetY]
    }
  }
  onHandleDraw() {
    const gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl')
    gl && gl.drawArrays(gl.POINTS, 0, 1)
    const _this = this

    //监听鼠标按下事件
    this.canvas.addEventListener('mousedown', event => {
      event.preventDefault()
      this.isCanDraw = true
      ;[this.lastX, this.lastY] = [event.offsetX, event.offsetY]
      this.ctx.beginPath()
      this.ctx.moveTo(event.offsetX, event.offsetY)
      this.canvas.addEventListener('mousemove', this.handleDraw.bind(this))
    })

    //监听鼠标滑动事件
    // canvas.addEventListener('mousemove', handleDraw)

    //监听鼠标松开事件
    window.addEventListener('mouseup', event => {
      event.preventDefault()
      this.isCanDraw = false
      this.ctx.closePath()
      this.canvas.removeEventListener('mousemove', this.handleDraw.bind(this))
    })
  }

  initShader(vertexShaderSource, fragmentShaderSource) {
    console.log('initShader', this, this.canvas)
    const gl = this.canvas.getContext('webgl')
    console.log('gl', gl)
    const vertexShader = gl.createShader(gl.VERTEX_SHADER) //创建顶点着色器对象
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) //创建片元着色器对象
    gl.shaderSource(vertexShader, vertexShaderSource) //引入顶点、片元着色器源代码
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    gl.compileShader(vertexShader) //编译顶点、片元着色器
    gl.compileShader(fragmentShader)
    const program = gl.createProgram() //创建程序对象program
    gl.attachShader(program, vertexShader) //附着顶点着色器和片元着色器到program
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program) //链接program
    gl.useProgram(program) //使用program
    return program //返回程序program对象
  }

  //清除绘图
  clearDraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

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
  ctx.saveDraw()
}
function onClickClear(event) {
  ctx.clearDraw()
}

let ctx
onMounted(() => {
  const canvas = document.getElementById('canvasTest')
  ctx = new canvasDraw(canvas)
  ctx.init()
  ctx.onHandleDraw()
  setTimeout(() => {
    test()
  }, 1000)
  // test()
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
