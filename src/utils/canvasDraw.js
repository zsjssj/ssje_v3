export class canvasDraw {
  constructor(canvasElement) {
    this.canvas = canvasElement
    this.lastX = 0 //记录画笔上次的x坐标
    this.lastY = 0 //记录画笔上次的Y坐标

    this.isCanDraw = false //记录画笔是否可以移动
    this.canvasId = 0 //记录画布的id
    this.init()
  }
  init() {
    this.canvas.width = 500
    this.canvas.height = 500
    // const scale = window.devicePixelRatio // 获取设备像素比
    // canvas.width = 500 * scale
    // canvas.height = 500 * scale
    // ctx.scale(scale, scale) // 按比例缩放上下文

    //2d绘图配置
    //canvas一旦获取了2d上下文，就不能再获取webgl上下文
    let ctx = this.canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 0.5 // 根据需要调整线宽
    ctx = null
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
      const ctx = this.canvas.getContext('2d')
      ctx.lineTo(event.offsetX, event.offsetY)
      if (Math.abs(event.offsetX - this.lastX) > 3 || Math.abs(event.offsetY - this.lastY) > 3) {
        ctx.quadraticCurveTo(this.lastX, this.lastY, event.offsetX, event.offsetY)
      }
      ctx.stroke()
      ;[this.lastX, this.lastY] = [event.offsetX, event.offsetY]
    }
  }
  onHandleDraw() {
    const gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl')
    gl && gl.drawArrays(gl.POINTS, 0, 1)
    console.log('onHandleDraw', gl)
    const _this = this

    //监听鼠标按下事件
    this.canvas.addEventListener('mousedown', event => {
      event.preventDefault()
      this.isCanDraw = true
      ;[this.lastX, this.lastY] = [event.offsetX, event.offsetY]
      const ctx = this.canvas.getContext('2d')
      ctx.beginPath()
      ctx.moveTo(event.offsetX, event.offsetY)
      this.canvas.addEventListener('mousemove', this.handleDraw.bind(this))
    })

    //监听鼠标松开事件
    window.addEventListener('mouseup', event => {
      const ctx = this.canvas.getContext('2d')
      event.preventDefault()
      this.isCanDraw = false
      ctx.closePath()
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
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
