import * as THREE from 'three'
const light = new THREE.AmbientLight({ color: 0x404040, intensity: 1 }) // soft white light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true //设置光照投射阴影
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 0.1
directionalLight.shadow.camera.far = 2000
export { light, directionalLight }
