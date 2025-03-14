import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import shader_fragment from '@/shader/fragment.glsl'
import shader_vertex from '@/shader/vertex.glsl'

function createShaderMatrial(w: number, h: number) {
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(w, h) },
      mouse: { value: new THREE.Vector2(0.5, 0.5) }
    },
    vertexShader: shader_vertex,
    fragmentShader: shader_fragment
  })
  return shaderMaterial
}

abstract class myThreeObject {
  abstract scene: THREE.Scene
  abstract camera: THREE.OrthographicCamera
  abstract renderer: THREE.WebGLRenderer
  abstract init(): void
  abstract animate(): void
  abstract renderKeep(allBack?: Function): void
  abstract stopRender(): void
  abstract renderOnce(): void
  abstract renderTime(time: number): void
}

class myThreeClass extends myThreeObject {
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  renderer: THREE.WebGLRenderer
  domW: number
  domH: number
  private dom: HTMLElement
  shaderMaterial: THREE.ShaderMaterial
  plane: THREE.Mesh

  ifdoRender: boolean = false
  timeId: NodeJS.Timeout | null = null

  constructor(public Dom: HTMLElement) {
    super()
    this.dom = Dom
    this.domW = Dom.offsetWidth
    this.domH = Dom.offsetHeight
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)
    this.renderer = this.initRenderer(this.domW, this.domH)
    this.shaderMaterial = createShaderMatrial(this.domW, this.domH)
    this.plane = this.createPlane()
    this.animate = this.animate.bind(this)
    this.init()
  }
  override init() {
    if (!this.dom.contains(this.renderer.domElement)) {
      this.dom.appendChild(this.renderer.domElement)
    }
    this.camera.position.set(0, 0, 1)
    this.camera.lookAt(0, 0, 0)
    window.addEventListener('resize', () => {
      this.resize(window.innerWidth, window.innerHeight)
    })
    this.animate = this.animate.bind(this) //绑定this
    this.scene.add(this.camera, this.plane)

    this.renderKeep()
  }
  private initRenderer(w: number, h: number) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, precision: 'lowp' })
    renderer.autoClear = true
    renderer.setSize(w, h)
    return renderer
  }

  override animate() {
    this.renderer.render(this.scene, this.camera)
    if (this.ifdoRender) requestAnimationFrame(this.animate)
    this.shaderMaterial.uniforms.u_time.value = performance.now() / 1000
    this.shaderMaterial.uniforms.u_resolution.value.set(this.domW, this.domH)
  }
  public override renderKeep(callBack?: Function) {
    if (!this.ifdoRender) this.ifdoRender = true
    requestAnimationFrame(this.animate)
    typeof callBack === 'function' && callBack()
  }
  public override stopRender() {
    if (this.ifdoRender) this.ifdoRender = false
  }
  //单次渲染
  public override renderOnce() {
    if (this.ifdoRender) this.ifdoRender = false
    requestAnimationFrame(this.animate)
  }
  //根据时间渲染
  public override renderTime(time: number) {
    this.ifdoRender = true
    if (this.timeId) {
      window.clearTimeout(this.timeId), (this.timeId = null)
    }
    this.timeId = setTimeout(() => {
      this.ifdoRender = false
    }, time * 1000)
    requestAnimationFrame(this.animate.bind(this))
  }
  //窗口大小改变修改渲染器大小
  public resize(w: number, h: number) {
    if (this.Dom && this.camera && this.renderer) {
      ;[this.domW, this.domH] = [w, h]
      // ; (this.camera.aspect = w / h),
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(w, h), this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderOnce()
    }
  }
  createPlane() {
    const geometry = new THREE.PlaneGeometry(this.domW, this.domH)
    const plane = new THREE.Mesh(geometry, this.shaderMaterial)
    return plane
  }
  dispose() {
    this.shaderMaterial.dispose()
    this.stopRender()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}

export { myThreeClass }
