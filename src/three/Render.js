import * as THREE from 'three'
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
// renderer.setClearColor(1.0, 1.0, 1.0, 0.0)
renderer.setSize(window.innerWidth, window.innerHeight)

export default renderer
