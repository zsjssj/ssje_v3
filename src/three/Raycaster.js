import * as THREE from 'three'
import renderer from './Render.js'

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}

function render() {
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  console.log(intersects[0])
  // for (let i = 0; i < intersects.length; i++) {
  //   intersects[i].object.material.color.set(0xff0000)
  // }
  renderer.render(scene, camera)
}

window.addEventListener('pointermove', onPointerMove)
window.requestAnimationFrame(render)
