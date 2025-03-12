import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

abstract class myThreeObject {
  abstract scene: THREE.Scene
  abstract camera: THREE.PerspectiveCamera
  abstract renderer: THREE.WebGLRenderer
  abstract init(): void
  abstract animate(): void
  abstract renderKeep(): void
  abstract stopRender(): void
  abstract renderOnce(): void
  abstract renderTime(time: number): void
}

class myThreeClass extends myThreeObject {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  domW: number
  domH: number
  private dom: HTMLElement
  orbit: OrbitControls

  ifdoRender: boolean = false
  timeId: NodeJS.Timeout | null = null

  constructor(public Dom: HTMLElement) {
    super()
    this.dom = Dom
    this.domW = Dom.offsetWidth
    this.domH = Dom.offsetHeight
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = this.initRenderer(this.domW, this.domH)
    this.orbit = this.initOrbit()
    this.animate = this.animate.bind(this)
    this.init()
  }
  override init() {
    if (!this.dom.contains(this.renderer.domElement)) {
      this.dom.appendChild(this.renderer.domElement)
    }
    this.camera.position.z = 5
    window.addEventListener('resize', () => {
      this.resize(window.innerWidth, window.innerHeight)
    })
    this.animate = this.animate.bind(this) //绑定this
    this.scene.add()
  }
  private initRenderer(w: number, h: number) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, precision: 'lowp' })
    renderer.autoClear = true
    renderer.setSize(w, h)
    return renderer
  }
  private initOrbit() {
    const Orbit = new OrbitControls(this.camera, this.renderer.domElement)
    Orbit.maxDistance = 700
    Orbit.enableDamping = true
    Orbit.dampingFactor = 0.5
    Orbit.panSpeed = 1.5
    Orbit.zoomSpeed = 1.2
    return Orbit
  }

  override animate() {
    this.renderer.render(this.scene, this.camera)
    if (this.ifdoRender) requestAnimationFrame(this.animate)
  }
  public override renderKeep() {
    if (!this.ifdoRender) this.ifdoRender = true
    requestAnimationFrame(this.animate)
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
      ;(this.camera.aspect = w / h), this.camera.updateProjectionMatrix()
      this.renderer.setSize(w, h), this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderOnce()
    }
  }
}

export { myThreeClass }
