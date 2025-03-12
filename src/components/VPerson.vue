<template>
  <div ref="threeContainer" id="threeContainer"></div>
</template>

<!-- <script type="importmap">
{
  "imports": {
    "three": "../build/three.module.js",
    "three/addons/": "./jsm/"
  }
}
</script> -->

<script setup>
import { ref, onMounted } from 'vue'
import { getPersonAI } from '@/api/home'
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
let camera, scene, renderer, stats, mixer, clock, controls

//模型微表情字段、与接口传过来的微表情字段匹配
let BSNameMap1 = {
  EyeBlinkLeft: 'eyeBlink_L',
  EyeLookDownLeft: 'eyeLookDown_L',
  EyeLookInLeft: 'eyeLookIn_L',
  EyeLookOutLeft: 'eyeLookOut_L',
  EyeLookUpLeft: 'eyeLookUp_L',
  EyeSquintLeft: 'eyeSquint_L',
  EyeWideLeft: 'eyeWide_L',
  EyeBlinkRight: 'eyeBlink_R',
  EyeLookDownRight: 'eyeLookDown_R',
  EyeLookInRight: 'eyeLookIn_R',
  EyeLookOutRight: 'eyeLookOut_R',
  EyeLookUpRight: 'eyeLookUp_R',
  EyeSquintRight: ' eyeSquint_R',
  EyeWideRight: 'eyeWide_R',
  JawForward: 'jawForward',
  JawRight: 'jawRight',
  JawOpen: 'jawOpen',
  MouthClose: 'mouthClose',
  MouthFunnel: 'mouthFunnel',
  MouthPucker: 'mouthPucker',
  MouthLeft: 'mouthLeft',
  MouthRight: 'mouthRight',
  MouthSmileLeft: 'mouthSmile_L',
  MouthSmileRight: 'mouthSmile_R',
  MouthFrownLeft: 'mouthFrown_L',
  MouthFrownRight: 'mouthFrown_R',
  MouthDimpleLeft: 'mouthDimple_L',
  MouthDimpleRight: 'mouthDimple_R',
  MouthStretchLeft: 'mouthStretch_L',
  MouthStretchRight: 'mouthStretch_R',
  MouthRollLower: 'mouthRollLower',
  MouthRollUpper: 'mouthRollUpper',
  MouthShrugLower: 'mouthShrugLower',
  MouthShrugUpper: 'mouthShrugUpper',
  BrowDownLeft: 'browDown_L',
  BrowDownRight: 'browDown_R',
  BrowInnerUp: ' browInnerUp',
  BrowOuterUpLeft: 'browOuterUp_L',
  BrowOuterUpRight: 'browOuterUp_R'
}

const BSNameMap = Object.fromEntries(Object.entries(BSNameMap1).map(([key, value]) => [value.trim(), key]))
// let BSIndexMap = {
//   browDown_L: 0,
//   browDown_R: 1,
//   browInnerUp: 2,
//   browOuterUp_L: 3,
//   browOuterUp_R: 4,
//   cheekPuff: 5,
//   cheekSquint_L: 6,
//   cheekSquint_R: 7,
//   eyeBlink_L: 8,
//   eyeBlink_R: 9,
//   eyeLookDown_L: 10,
//   eyeLookDown_R: 11,
//   eyeLookIn_L: 12,
//   eyeLookIn_R: 13,
//   eyeLookOut_L: 14,
//   eyeLookOut_R: 15,
//   eyeLookUp_L: 16,
//   eyeLookUp_R: 17,
//   eyeSquint_L: 18,
//   eyeSquint_R: 19,
//   eyeWide_L: 20,
//   eyeWide_R: 21,
//   jawForward: 22,
//   jawLeft: 23,
//   jawOpen: 24,
//   jawRight: 25,
//   mouthClose: 26,
//   mouthDimple_L: 27,
//   mouthDimple_R: 28,
//   mouthFrown_L: 29,
//   mouthFrown_R: 30,
//   mouthFunnel: 31,
//   mouthLeft: 32,
//   mouthLowerDown_L: 33,
//   mouthLowerDown_R: 34,
//   mouthPress_L: 35,
//   mouthPress_R: 36,
//   mouthPucker: 37,
//   mouthRight: 38,
//   mouthRollLower: 39,
//   mouthRollUpper: 40,
//   mouthShrugLower: 41,
//   mouthShrugUpper: 42,
//   mouthSmile_L: 43,
//   mouthSmile_R: 44,
//   mouthStretch_L: 45,
//   mouthStretch_R: 56,
//   mouthUpperUp_L: 47,
//   mouthUpperUp_R: 48,
//   noseSneer_L: 49,
//   noseSneer_R: 50,
//   tongueOut: 51
// }
let BSIndexMap = {
  browDown_L: 1,
  browDown_R: 2,
  browInnerUp: 0,
  browOuterUp_L: 3,
  browOuterUp_R: 4,
  cheekPuff: 19,
  cheekSquint_L: 20,
  cheekSquint_R: 21,
  eyeBlink_L: 13,
  eyeBlink_R: 14,
  eyeLookDown_L: 7,
  eyeLookDown_R: 8,
  eyeLookIn_L: 9,
  eyeLookIn_R: 10,
  eyeLookOut_L: 11,
  eyeLookOut_R: 12,
  eyeLookUp_L: 5,
  eyeLookUp_R: 6,
  eyeSquint_L: 15,
  eyeSquint_R: 16,
  eyeWide_L: 17,
  eyeWide_R: 18,
  jawForward: 25,
  jawLeft: 26,
  jawOpen: 24,
  jawRight: 27,
  mouthClose: 36,
  mouthDimple_L: 41,
  mouthDimple_R: 42,
  mouthFrown_L: 39,
  mouthFrown_R: 40,
  mouthFunnel: 28,
  mouthLeft: 30,
  mouthLowerDown_L: 45,
  mouthLowerDown_R: 46,
  mouthPress_L: 47,
  mouthPress_R: 48,
  mouthPucker: 29,
  mouthRight: 31,
  mouthRollLower: 33,
  mouthRollUpper: 32,
  mouthShrugLower: 35,
  mouthShrugUpper: 34,
  mouthSmile_L: 37,
  mouthSmile_R: 38,
  mouthStretch_L: 49,
  mouthStretch_R: 50,
  mouthUpperUp_L: 43,
  mouthUpperUp_R: 44,
  noseSneer_L: 22,
  noseSneer_R: 23,
  tongueOut: 51
}

function init(container) {
  clock = new THREE.Clock()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20)
  camera.position.set(-1.8, 0.8, 3)
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setAnimationLoop(animate)
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  container.appendChild(renderer.domElement)

  const ktx2Loader = new KTX2Loader().setTranscoderPath('basis/').detectSupport(renderer)

  new GLTFLoader()
    .setKTX2Loader(ktx2Loader)
    .setMeshoptDecoder(MeshoptDecoder)
    .load('http://localhost:3000/facecap.glb', gltf => {
      const mesh = gltf.scene.children[0]
      scene.add(mesh)
      // mixer = new THREE.AnimationMixer(mesh)
      // mixer.clipAction(gltf.animations[0]).play()
      const head = mesh.getObjectByName('mesh_2')
      const influences = head.morphTargetInfluences
      mixer = new THREE.AnimationMixer(head)
      const gui = new GUI()
      gui.close()
      for (const [key, value] of Object.entries(head.morphTargetDictionary)) {
        // gui.add(influences, value, 0, 1, 0.01).name(key.replace('blendShape1.', '')).listen()
        gui.add(influences, value, 0, 1, 0.01).name(key.replace('blendShape.', '')).listen()
      }
    })

  const environment = new RoomEnvironment(renderer)
  const pmremGenerator = new THREE.PMREMGenerator(renderer)

  scene.background = new THREE.Color(0x666666)
  scene.environment = pmremGenerator.fromScene(environment).texture

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.minDistance = 2.5
  controls.maxDistance = 5
  controls.minAzimuthAngle = -Math.PI / 2
  controls.maxAzimuthAngle = Math.PI / 2
  controls.maxPolarAngle = Math.PI / 1.8
  controls.target.set(0, 0.15, -0.2)

  stats = new Stats()
  container.appendChild(stats.dom)
  window.addEventListener('resize', onWindowResize)
}

const getAnimationClip = bsList => {
  const tracks = [] // 关键帧动画数据集
  const morphs = {} // 每个BS按时间轴顺序变化的权重值
  const timeAxis = [] // 时间轴，取结尾时间
  Object.keys(BSIndexMap).forEach(key => {
    morphs[key] = []
  })
  bsList.forEach((ele, index) => {
    const { endTime } = ele
    timeAxis.push(endTime / 1000)
    Object.keys(morphs).forEach(key => {
      // 如果能从接口数据中取到BS权重，则push给当前BS
      if (ele[BSNameMap[key]]) {
        morphs[key].push(ele[BSNameMap[key]])
      } else {
        // 如果取不到则沿用上一个时间节点的数据或者设置为默认权重0
        morphs[key].push(morphs[key][index - 1] || 0)
      }
    })
  })
  Object.keys(morphs).forEach(key => {
    const track = new THREE.KeyframeTrack(`.morphTargetInfluences[${BSIndexMap[key]}]`, timeAxis, morphs[key])
    tracks.push(track)
  })
  const clip = new THREE.AnimationClip('default', timeAxis[timeAxis.length - 1], tracks)
  return clip
}

function playAI() {
  let playIndex = 0 // 当前播放的下标
  let AnimationAction
  const playBS = () => {
    // 判断是否全部都播放完毕
    if (playIndex < infoList.value.length) {
      // infoList.value[playIndex].audio.play() // 播放音频
      AnimationAction = mixer.clipAction(infoList.value[playIndex].clip) //返回动画操作对象
      AnimationAction.loop = THREE.LoopOnce //不循环播放
      AnimationAction.reset()
      AnimationAction.play()
      infoList.value[playIndex].audio.onended = () => {
        playIndex++ // 播放完成之后继续播放下一个
        playBS()
      }
    }
  }
  playBS()
}

const getAudio = objectName => {
  return new Promise((resolve, reject) => {
    const data = {
      objectName
    }
    fetch(objectName)
      .then(res => {
        const blob = new Blob([res.data], { type: 'audio/wav' })
        const url = window.URL.createObjectURL(blob)
        const audio = document.createElement('audio')
        audio.src = url
        audio.oncanplay = () => {
          resolve(audio)
        }
      })
      .catch(e => {
        reject(e)
      })

    // 通过接口下载音频
    // downloadFile(data)
    //   .then(res => {
    //     // 根据二进制流生成audio对象并返回
    //     const blob = new Blob([res.data], { type: 'audio/wav' })
    //     const url = window.URL.createObjectURL(blob)
    //     const audio = document.createElement('audio')
    //     audio.src = url
    //     audio.oncanplay = () => {
    //       resolve(audio)
    //     }
    //   })
    //   .catch(e => {
    //     reject(e)
    //   })
  })
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  const delta = clock.getDelta()
  if (mixer) {
    mixer.update(delta)
  }
  renderer.render(scene, camera)
  controls.update()
  stats.update()
}

onMounted(() => {
  let dom = document.getElementById('threeContainer')
  init(dom)
  setTimeout(() => {
    getPersonAI().then(({ data }) => {
      const clip = getAnimationClip(data)
      let AnimationAction
      const playBS = async () => {
        // const audio = await getAudio('http://localhost:3000/output.wav')
        // audio.play()
        AnimationAction = mixer.clipAction(clip) //返回动画操作对象
        AnimationAction.loop = THREE.LoopOnce //不循环播放
        AnimationAction.timeScale = 1 //默认1，可以调节播放速度
        AnimationAction.reset()
        AnimationAction.play()
      }
      playBS()
    })
  }, 3000)
})
</script>

<style scoped></style>
