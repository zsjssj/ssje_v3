import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
// renderer.setClearColor(1.0, 1.0, 1.0, 0.0)
renderer.shadowMap.enabled = true //开启阴影渲染
renderer.shadowMap.autoUpdate = true //开启动态阴影渲染
renderer.setSize(window.innerWidth, window.innerHeight)

const css3drenderer = new CSS3DRenderer()
css3drenderer.setSize(window.innerWidth, window.innerHeight)

export default renderer
export { css3drenderer }
