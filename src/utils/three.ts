import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
camera.position.set(5, 5, 5)

const light = new THREE.AmbientLight(0x404040, 1) // soft white light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true //设置光照投射阴影
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 2000

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
renderer.shadowMap.enabled = true //开启阴影渲染
renderer.shadowMap.autoUpdate = true //开启动态阴影渲染
renderer.setSize(window.innerWidth, window.innerHeight)

const css3drenderer = new CSS3DRenderer()
css3drenderer.setSize(window.innerWidth, window.innerHeight)

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
function createTag(object: any) {
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

window.addEventListener('mousedown', event => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  intersects[0] && intersects[0].object.name !== '平面' && console.log(intersects[0].object.name)
})
window.requestAnimationFrame(render)

const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('@/assets/draco/gltf1/')
loader.setDRACOLoader(dracoLoader)
loader.load(
  '/mode/mode1.glb',
  function (gltf) {
    scene.add(gltf.scene)
    gltf.scene.position.set(0, 0, 0)
    const obj = gltf.scene.children
    obj.forEach(item => {
      if (item.children) {
        item.children.forEach(item2 => {
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
  function (_) {
    // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  function (_) {
    // console.log('An error happened')
  }
)

export default { camera, renderer, light, directionalLight, css3drenderer }
