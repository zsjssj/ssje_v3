import * as THREE from 'three'
import renderer from './Render.js'
import camera from '@/three/Camera.js'
import cube from '@/three/createobject.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { light, directionalLight } from './light.js'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { vector } from 'echarts'

const scene = new THREE.Scene()
scene.add(camera)
scene.add(light)
scene.add(directionalLight)

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

function render() {
  renderer.render(scene, camera)
}
let threediv = null
function createTag(object) {
  threediv = document.createElement('div')
  threediv.className = 'elementTag'
  threediv.innerHTML = `
    <div class="content" >
      <h3>${object.name}</h3>
    </div>
  `
  const object3d = new CSS3DObject(threediv)
  object3d.scale.set(0.05, 0.05, 0.05)
  object3d.position.copy(object.position)
  scene.add(object3d)
}

window.addEventListener('mousedown', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  intersects[0] && intersects[0].object.name !== '平面' && console.log(intersects[0].object.name)
})
window.requestAnimationFrame(render)

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('@/assets/draco/')
loader.setDRACOLoader(dracoLoader)
loader.load(
  '/mode_car/mode1.glb',
  function (gltf) {
    scene.add(gltf.scene)
    gltf.scene.position.set(0, 0, 0)
    const obj = gltf.scene.children
    obj.forEach((item) => {
      // console.log(item.name)
      if (item.children) {
        item.children.forEach((item2) => {
          item2.castShadow = true
          item2.receiveShadow = true
          item2.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(Math.random(), Math.random(), Math.random())
          })
        })
      }
      item.castShadow = true
      item.receiveShadow = true
      item.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random())
        // side: THREE.DoubleSide
      })
      item.name !== '文本' && createTag(item)
    })
  },
  function (xhr) {
    // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  function (error) {
    // console.log('An error happened')
  }
)

export default scene
