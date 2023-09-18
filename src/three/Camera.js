import * as THREE from 'three'
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(5, 5, 5)
export default camera
