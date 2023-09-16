import * as THREE from 'three'
import camera from '@/three/Camera.js'
import cube from '@/three/createobject.js'

const scene = new THREE.Scene()

// scene.background = new THREE.Color('rgba(255,255,0,1)')
// scene.background = new THREE.Color('rgba(255,255,0,1)')
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
scene.add(camera)
scene.add(cube)

export default scene
