import * as THREE from 'three'

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

  ifdoRender: boolean = false
  timeId: NodeJS.Timeout | null = null

  constructor(public Dom: HTMLElement) {
    super()
    this.domW = Dom.offsetWidth
    this.domH = Dom.offsetHeight
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = this.initRenderer(this.domW, this.domH)
    document.body.appendChild(this.renderer.domElement)
    this.camera.position.z = 5
    this.animate = this.animate.bind(this)
    this.init()
  }
  override init() {
    if (!document.body.contains(this.renderer.domElement)) {
      document.body.appendChild(this.renderer.domElement)
    }
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
}

export { myThreeClass }
