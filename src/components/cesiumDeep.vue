<template>
  <div id="cesiumcontainer" ref="containerdom">
    <div v-if="shouwImage" class="flexCenter ces cesLeft">
      <div v-show="imageData.left?.url">
        <div class="cestitle">{{ imageData.left?.name }}</div>
        <img :src="imageData.left?.url" />
        <span
          v-for="(item2, index2) in imageData.left?.videoAnalysisDo"
          :key="index2"
          style="position: absolute; display: block; transform: translateY(-100%); background-color: red; font-size: 0.8rem; padding: 0 0.25rem"
          :style="{ top: (item2.y / imageData.left.height) * 100 + '%', left: (item2.x / imageData.left?.width) * 100 + '%' }"
          >{{ item2.class }} {{ (item2.score ** (1 / 5)).toFixed(2) }}</span
        >
        <div
          v-for="(item2, index2) in imageData.left?.videoAnalysisDo"
          :key="index2"
          style="position: absolute; border: 1px solid red"
          :style="{
            top: (item2.y / imageData.left?.height) * 100 + '%',
            left: (item2.x / imageData.left?.width) * 100 + '%',
            width: (item2.width / imageData.left?.width) * 100 + '%',
            height: (item2.height / imageData.left?.height) * 100 + '%'
          }"
        ></div>
      </div>
      <div v-show="imageData.left1?.data?.tempMatrix">
        <div class="cestitle">{{ imageData.left1?.name }}</div>
        <heartMap v-if="imageData?.left1?.data" style="width: 26rem; height: 22rem; margin-bottom: 0.625rem" :chartData="imageData.left1?.data" />
      </div>
    </div>
    <div v-if="shouwImage" class="flexCenter ces cesRight">
      <div v-show="imageData.right?.url">
        <div class="cestitle">{{ imageData.right?.name }}</div>
        <img :src="imageData.right?.url" />
        <span
          v-for="(item2, index2) in imageData.right?.videoAnalysisDo"
          :key="index2"
          style="position: absolute; display: block; transform: translateY(-100%); background-color: red; font-size: 0.8rem; padding: 0 0.25rem"
          :style="{ top: (item2.y / imageData.right?.height) * 100 + '%', left: (item2.x / imageData.right?.width) * 100 + '%' }"
          >{{ item2.class }} {{ item2.score.toFixed(2) }}</span
        >
        <div
          v-for="(item2, index2) in imageData.right?.videoAnalysisDo"
          :key="index2"
          style="position: absolute; border: 1px solid red"
          :style="{
            top: (item2.y / imageData.right?.height) * 100 + '%',
            left: (item2.x / imageData.right?.width) * 100 + '%',
            width: (item2.width / imageData.right?.width) * 100 + '%',
            height: (item2.height / imageData.right?.height) * 100 + '%'
          }"
        ></div>
      </div>
      <div v-show="imageData.right1?.data?.tempMatrix">
        <div class="cestitle">{{ imageData.right1?.name }}</div>
        <heartMap v-if="imageData?.right1?.data" style="width: 26rem; height: 22rem; margin-bottom: 0.625rem" :chartData="imageData.right1?.data" />
      </div>
    </div>
    <div
      class="cesiumlabal"
      v-for="item in nameMaker"
      :class="{ hiddenLabel: item.state === 0 && item.id !== hoverTowerId, deepwarning: item.state == 1 && item.id == hoverTowerId, warningbd: item.state == 2 }"
      :id="item.id"
      :key="item.id"
    >
      <h3>{{ item.name }}</h3>
    </div>
    <div
      class="cesiumLatestLabal"
      v-for="item in latestDataMaker"
      :class="{ hiddenLabel: item.state == 0 || item.id !== hoverTowerId, warningbd: item.state == 2 }"
      :id="item.id + 'latest'"
      :key="item.id + 'latest'"
      v-loading="item.loading"
    >
      <template v-if="item.data && item.data.length > 0">
        <div v-for="item2 in item.data" :key="item.id + item2.name" :style="{ backgroundColor: item2.name ? '' : 'rgba(255,255,255,0)', height: item2.name ? '' : '0.125rem' }">
          {{ item2.title && item2.name }}
          <span v-show="!item2.title">{{ item2.name ? item2.name + ': ' : '' }}</span>
          <span v-show="!item2.title">{{ item2.value + ' ' + item2.unit }}</span>
        </div></template
      >
    </div>
  </div>
</template>

<script setup>
import * as Cesium from 'cesium'
import { ref, onMounted, onUnmounted, watch, reactive, nextTick, getCurrentInstance } from 'vue'
import heartMap from '@/views/Home/components/heartMap.vue'
import { getTowerLastData } from '@/api/home.js'
import { parabola, generateEllipsePoints } from '@/utl/Bezierurve.js'
import { ElMessage } from 'element-plus'
import '@/Widgets/widgets.css'
import moment from 'moment'
import useStore from '@/pinia/index.js'
const { homeStore, nodeStore } = useStore()
const { proxy } = getCurrentInstance()

//设置cesium静态资源路径
window.CESIUM_BASE_URL = '/'
let props = defineProps(['modelValue', 'powerTowerData', 'powerLineData', 'ifListenerclick', 'pitchnumber', 'choosetower'])
let containerdom = ref(null)
let viewer = null
let testtile = 'https://tiles-1307225140.cos.ap-shanghai.myqcloud.com/2dtiles/{z}/{x}/{y}.png'
let dtilesregion = encodeURIComponent('四川省/凉山彝族自治州/会东县')
let tilesurl = `https://tiles-1307225140.cos.ap-shanghai.myqcloud.com/${dtilesregion}/tiles/{z}/{x}/{y}.png`
let terrainurl = `https://tiles-1307225140.cos.ap-shanghai.myqcloud.com/${dtilesregion}/dem`

//初始化场景
let initcesium = () => {
  viewer = new Cesium.Viewer('cesiumcontainer', {
    contextOptions: { webgl: { alpha: true } },
    // skyAtmosphere: false,
    targetFrameRate: 60, // 控制渲染帧数
    infoBox: false, //是否显示信息框
    geocoder: false, //是否显示搜索框按钮
    homeButton: false, //不显示home按钮
    vrButton: false,
    sceneModePicker: false, //显示查看器显示模式按钮(3d、2.5d、2d)
    baseLayerPicker: false, //是否显示图层显示器
    navigationHelpButton: false, //是否显示帮助按钮
    animation: false, //是否播放动画
    timeline: false, //是否显示时间轴
    fullscreenButton: false, //是否显示全屏按钮
    requestRenderMode: true, //是否在视口场景变化时再渲染,
    selectionIndicator: false
    // shouldAnimate: true
  })
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  if (Cesium.FeatureDetection.supportsImageRenderingPixelated()) {
    //判断是否支持图像渲染像素化处理
    viewer.resolutionScale = window.devicePixelRatio
  }
  viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
      positiveX: '/Assets/Textures/cesiumsky/px.png',
      negativeX: '/Assets/Textures/cesiumsky/nx.png',
      positiveY: '/Assets/Textures/cesiumsky/py.png',
      negativeY: '/Assets/Textures/cesiumsky/ny.png',
      positiveZ: '/Assets/Textures/cesiumsky/pz.png',
      negativeZ: '/Assets/Textures/cesiumsky/nz.png'
    }
  })
  viewer.scene.fxaa = true
  viewer.scene.postProcessStages.fxaa.enabled = true
  viewer.scene.globe.baseColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)
  // viewer.scene.skyBox.show = true
  viewer.scene.sun.show = true
  viewer.scene.globe.enableLighting = true //是否开启全局光照
  viewer.shadows = true //是否开启阴影
  viewer.shadowMap.darkness = 0.6 //阴影透明度--越大越透明
  // viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)
  viewer.imageryLayers.removeAll(true)
  viewer._cesiumWidget.creditContainer.style.display = 'none'
  //禁用cesium鼠右键拖拽缩放功能
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [3, 4]
  // viewer.scene.screenSpaceCameraController.enableRotate = false
  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: tilesurl,
      fileExtension: 'png',
      minimumLevel: 0,
      maximumLevel: 17
    })
  )
}

//初始化相机
let pitch1 = props.pitchnumber ? Cesium.Math.toRadians(props.pitchnumber) : Cesium.Math.toRadians(-45)
let initcamera = function (lng = homeStore.coordinate[0] || 102.6723081, lat = homeStore.coordinate[1] - 0.03 || 26.54102626, height = 10000, pitch = pitch1) {
  viewer?.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
    orientation: {
      pitch
    }
  })
  viewer.camera.defaultMoveAmount = 100000
  // viewer.camera.frustum.far = 60000 //相机最远可视距离
  viewer.camera.frustum.near = 1 //相机最近可视距离
  // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100 //相机的高度的最小值
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 25000 //相机高度的最大值
}
//相机飞行
const cameraFlyTo = ({ destination = [], heading, pitch, duration }) => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(...destination),
    orientation: { heading: Cesium.Math.toRadians(heading || 0), pitch: Cesium.Math.toRadians(pitch || -30) },
    duration: duration || 2
  })
}

//判断查看完整的线路所需要的相机位置
const getCameraPosition = (north, east, south, west, id) => {
  let [north1, east1, south1, west1] = [Cesium.Math.toRadians(north), Cesium.Math.toRadians(east), Cesium.Math.toRadians(south), Cesium.Math.toRadians(west)]
  let data = viewer.camera.getRectangleCameraCoordinates(new Cesium.Rectangle(west1, south1, east1, north1))
  let tower = viewer.entities.getById(id)
  let lnglat = Cesium.Cartographic.fromCartesian(data)
  cameraFlyTo({ destination: [(east + west) / 2, (north + south) / 2 - (lnglat.height / 111000) * 3 ** (1 / 2), lnglat.height + tower.message.demHeight] })
  return data
}

//相机巡检模式
let [time1, timeInterval, CameraInspectsNewData, shouwImage] = [null, null, {}, ref(false)]
const setCameraInspects = async type => {
  if (type) {
    let i = 0
    towerHandler && towerHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    towerHandler && towerHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    let { pointId } = filterCeslinedata[i]
    let towerModel = viewer.entities.getById(pointId)
    handleLastData(towerModel.message, 0) //循环前开始请求数据
    timeInterval = setInterval(() => {
      let { pointId, height, position } = filterCeslinedata[i]
      let [lng, lat, ang] = position
      towerModel = viewer.entities.getById(pointId)
      handtowerhover({ id: towerModel }, false) //处理hover效果
      let [offset, angleX, angleY] = [(1 * height) / 10000, Math.sin(Cesium.Math.toRadians(ang)), Math.cos(Cesium.Math.toRadians(ang))]
      cameraFlyTo({ destination: [lng - offset * angleX, lat - offset * angleY, towerDem[pointId] + 3 * scaleNum * offset * 10000], heading: ang, duration: 2 })
      i = (i + 1) % filterCeslinedata.length
      let { pointId: pointId1 } = filterCeslinedata[i]
      towerModel = viewer.entities.getById(pointId1)
      handleLastData(towerModel.message, 0) //预处理下一个杆塔最新数据
    }, 6000)
    time1 = setTimeout(() => {
      shouwImage.value = true
    }, 5500)
    connectWebsocket(Object.keys(homeStore.systemId_TowerTd))
  } else {
    towerHandler.setInputAction(handlertowerclick, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    towerHandler.setInputAction(proxy.debounce(handlertowerhover, 200), Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    timeInterval && clearInterval(timeInterval)
    time1 && window.clearTimeout(time1)
    shouwImage.value = false
    clearWebsocket()
  }
}

// 移动地图、监听鼠标移动事件
let handler
let movestep = () => {
  let ismove = false
  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction(() => {
    ismove = true
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
  handler.setInputAction(function (movement) {
    if (ismove) {
      let deltaX = movement.endPosition.x - movement.startPosition.x
      let deltaY = movement.endPosition.y - movement.startPosition.y
      let height = viewer.camera.positionCartographic.height
      viewer.camera.move(new Cesium.Cartesian3(deltaX, 0.0, deltaY), (0.2 * height) / 900)
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  handler.setInputAction(() => {
    ismove = false
    // handler.destroy()
  }, Cesium.ScreenSpaceEventType.LEFT_UP)
}

//显示地形
let terrainProvider
let showterrain = async url => {
  terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(url, {})
  viewer.terrainProvider = terrainProvider
  viewer.scene.globe.depthTestAgainstTerrain = true //开启地形深度检测
  viewer.scene.requestRender()
}

//处理cesium添加的html标签位置绑定问题
const handleHtmlPosition = (divdom, position, dem) => {
  const [ellipsoid, point] = [Cesium.Ellipsoid.WGS84, Cesium.Cartesian3.fromDegrees(...position)]
  return viewer?.scene.postRender.addEventListener(() => {
    // let windowCoord = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, Cesium.Cartesian3.fromDegrees(...position, dem))
    let windowCoord = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, Cesium.Cartesian3.fromDegrees(...position, dem))
    const occluder = new Cesium.EllipsoidalOccluder(ellipsoid, viewer.camera.position)
    const visible = occluder.isPointVisible(point)
    if (windowCoord && visible) {
      let [x, y] = [windowCoord.x - divdom.offsetWidth / 2, windowCoord.y - divdom.offsetHeight]
      divdom.style.cssText = `
              transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);
            `
      //位置在地球背面的标签不显示
    } else {
      divdom.style.cssText = `
              visibility:hidden;
            `
    }
  })
}

//添加标签
const nameMaker = ref([])
let removeaddmaker = null
let addmaker = function (name, id, position, dem, state) {
  try {
    nameMaker.value.push({ name, id, state })
    nextTick(() => {
      let divdom = document.getElementById(id)
      if (divdom) removeaddmaker = handleHtmlPosition(divdom, position, dem)
    })
  } catch (error) {
    ElMessage.error('加载杆塔标签失败')
  }
}

//添加山火标识
let removefiremaker
let addfiremaker = async function (id, firePosition) {
  try {
    let { x, y } = firePosition.centerPoint
    const data = await Cesium.sampleTerrain(terrainProvider, 15, [Cesium.Cartographic.fromDegrees(x, y)])
    let height = data[0].height ? data[0].height : 0
    const divdom = document.createElement('div')
    divdom.id = id
    divdom.classList.add('firemasker'), containerdom.value?.appendChild(divdom)
    removefiremaker = handleHtmlPosition(divdom, [x, y], height)
    let hourRange = generateEllipsePoints(102.6819, 26.6048, 0.002, 0.001)
      .map(item => [item.x, item.y])
      .flat()
    let eightHourRange = generateEllipsePoints(102.6819, 26.6048, 0.004, 0.002)
      .map(item => [item.x, item.y])
      .flat()
    let twentyFourHourRange = generateEllipsePoints(102.6819, 26.6048, 0.006, 0.003)
      .map(item => [item.x, item.y])
      .flat()
    viewer.entities.add({
      name: 'fire24hourRange',
      polygon: {
        hierarchy: { positions: Cesium.Cartesian3.fromDegreesArray(hourRange) },
        material: warningheightshowcolor.withAlpha(0.1),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
  } catch (error) {
    ElMessage.error('加载山火标识失败')
  }
}
let addfiremaker1 = async function (id, firePosition) {
  try {
    let { x, y, h } = firePosition
    const divdom = document.createElement('div')
    divdom.id = id
    divdom.classList.add('firemasker'), containerdom.value?.appendChild(divdom)
    removefiremaker = handleHtmlPosition(divdom, [x, y], h)
    let hourRange = generateEllipsePoints(x, y, 0.002, 0.001)
      .map(item => [item.x, item.y])
      .flat()
    let eightHourRange = generateEllipsePoints(x, y, 0.004, 0.002)
      .map(item => [item.x, item.y])
      .flat()
    let twentyFourHourRange = generateEllipsePoints(x, y, 0.006, 0.003)
      .map(item => [item.x, item.y])
      .flat()
    viewer.entities.add({
      name: 'fire24hourRange',
      polygon: {
        hierarchy: { positions: Cesium.Cartesian3.fromDegreesArray(hourRange) },
        material: warningheightshowcolor.withAlpha(0.2),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
    viewer.entities.add({
      name: 'eightHourRange',
      polygon: {
        hierarchy: { positions: Cesium.Cartesian3.fromDegreesArray(eightHourRange) },
        material: warningheightshowcolor.withAlpha(0.2),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
    viewer.entities.add({
      name: 'twentyFourHourRange',
      polygon: {
        hierarchy: { positions: Cesium.Cartesian3.fromDegreesArray(twentyFourHourRange) },
        material: warningheightshowcolor.withAlpha(0.2),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    })
    viewer.scene.requestRender()
  } catch (error) {
    ElMessage.error('加载山火标识失败')
  }
}

//通过摄像机矩阵添加山火位置
const addSingleImage = () => {
  let [cameraLng, cameraLat, cameraH] = [102.672308, 26.591026, 123]
  let [ang, ang1] = [0, -10]
  let [heading, pitch] = [Cesium.Math.toRadians(ang), Cesium.Math.toRadians(ang1)]
  let [fov, roll] = [Cesium.Math.toRadians(45), Cesium.Math.toRadians(0)]
  let cameraPosition = Cesium.Cartesian3.fromDegrees(cameraLng, cameraLat, 1119.4870514745023 + 3 * cameraH)
  let currentState = {
    position: viewer.camera.position.clone(),
    direction: viewer.camera.direction.clone(),
    up: viewer.camera.up.clone()
  }
  viewer.camera.setView({ destination: cameraPosition, orientation: { heading, pitch, roll } })
  let [x, y] = [viewer.scene.canvas.clientWidth * 0.5, viewer.scene.canvas.clientHeight * 0.5]
  // let directionX = Math.cos(pitch) * Math.sin(heading) // 计算方向向量的三个分量
  // let directionY = Math.cos(pitch) * Math.cos(heading)
  // let directionZ = Math.sin(pitch)
  // let directionVector = new Cesium.Cartesian3(directionX, directionY, directionZ) // 创建方向向量的 Cartesian3 对象
  // let directionVector = new Cesium.Cartesian3(1, 1, 1)
  let directionVector = viewer.camera.direction
  Cesium.Cartesian3.normalize(directionVector, directionVector) // 如果需要，可以将方向向量归一化
  // let customRay = new Cesium.Ray(cameraPosition, directionVector)
  let customRay = viewer.camera.getPickRay({ x, y })
  // let length = 1000 // 射线的长度
  // let endPoint = Cesium.Cartesian3.add(cameraPosition, Cesium.Cartesian3.multiplyByScalar(directionVector, length, new Cesium.Cartesian3()), new Cesium.Cartesian3())
  // let rayEntity = viewer.entities.add({
  //   name: 'Ray', // 射线的名称
  //   position: cameraPosition, // 射线的起点
  //   polyline: {
  //     resolution: 1,
  //     material: Cesium.Color.RED.withAlpha(1),
  //     width: 2,
  //     leadTime: 0,
  //     show: true,
  //     trailTime: 1800,
  //     positions: new Cesium.CallbackProperty(function (time, result) {
  //       return [cameraPosition, endPoint]
  //     }, false)
  //   }
  // })
  let intersection = viewer.scene.globe.pick(customRay, viewer.scene)
  if (intersection) {
    let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(intersection)
    let lng = Cesium.Math.toDegrees(cartographic.longitude)
    let lat = Cesium.Math.toDegrees(cartographic.latitude)
    let h = cartographic.height
    let tilesLoadedEvent = viewer.scene.globe.tileLoadProgressEvent.addEventListener(function (event) {
      if (event == 0) {
        tilesLoadedEvent()
        let pRadians = viewer.scene.pickPosition({ x, y })
        if (pRadians) {
          addfiremaker1('test123', { x: lng, y: lat, h })
        }
      }
    })
    // viewer.camera.position = currentState.position
    // viewer.camera.direction = currentState.direction
    // viewer.camera.up = currentState.up
  } else {
  }
}

//创建最新数据展示框
let removeLatestmaker = null
const latestDataMaker = ref([])
let addLatestMaker = (name, id, state, position, dem) => {
  try {
    latestDataMaker.value = [...latestDataMaker.value, { name, id, data: [], state, loading: false }]
    nextTick(() => {
      let divdom = document.getElementById(id + 'latest')
      if (divdom) removeaddmaker = handleHtmlPosition(divdom, position, dem)
    })
  } catch (error) {
    ElMessage.error('加载杆塔标签失败')
  }
}

//添加对应线路
const addLineTower = async lineData => {
  let argArr = lineData.map(item => Cesium.Cartographic.fromDegrees(...item.position.slice(0, 2)))
  const Terrain = await Cesium.sampleTerrain(terrainProvider, 15, argArr)
  ;[latestDataMaker.value, nameMaker.value] = [[], []]
  await Promise.all(
    lineData.map(async (item, index, arr) => {
      let height = Terrain[index].height ? Terrain[index].height : 0
      if (!towerDem[item.pointId]) towerDem[item.pointId] = height
      addPowerTower(item, height)
      index > 0 && addPowerLine(arr[index - 1], item)
    })
  )
}

//添加塔实体和模型
let [scaleNum, towerDem] = [3, {}]
const addPowerTower = (tower, dem) => {
  let message = JSON.parse(JSON.stringify(tower)) //防止后续数据修改时产生影响
  ;[message.demHeight, message.latestLabelHeight, message.latsetLabelPosition] = [dem, dem + (tower.height * scaleNum) / 2, [...message.position.slice(0, 2)]]
  viewer.entities.add({
    name: tower.name,
    id: tower.pointId,
    position: new Cesium.Cartesian3.fromDegrees(...tower.position.slice(0, 2), dem),
    orientation: Cesium.Transforms.headingPitchRollQuaternion(
      new Cesium.Cartesian3.fromDegrees(...tower.position.slice(0, 2), dem),
      new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(tower.position.at(-1) - 90), 0, 0)
    ),
    model: {
      uri: tower.filePath,
      color: Cesium.Color.WHITE,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 20000),
      colorBlendMode: Cesium.ColorBlendMode.MIX,
      scale: (tower.height / 10) * scaleNum,
      silhouetteSize: tower.warning ? 4 : 0,
      silhouetteColor: warningheightshowcolor,
      shadows: Cesium.ShadowMode.CAST_ONLY
    },
    message
  })
  let state = tower.warning ? 2 : tower.sensors?.length > 0 ? 1 : 0
  //创建塔时顺便创建相应的名称dom和最新数据dom,
  addmaker(tower.name, tower.pointId, tower.position.slice(0, 2), dem + tower.height * scaleNum, state)
  addLatestMaker(tower.name + 'latest', tower.pointId, state, tower.position.slice(0, 2), message.latestLabelHeight)
}

//单独添加模型
const addmodel = async () => {
  let position = [104.076844, 30.408939]
  const Terrain = await Cesium.sampleTerrain(terrainProvider, 15, [Cesium.Cartographic.fromDegrees(...position)])
  let height = Terrain[0].height ? Terrain[0].height + 500 : 80
  viewer.entities.add({
    name: 'name',
    id: 'id',
    position: new Cesium.Cartesian3.fromDegrees(...position, height),
    orientation: Cesium.Transforms.headingPitchRollQuaternion(
      new Cesium.Cartesian3.fromDegrees(...position, height),
      new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-90), 0, Cesium.Math.toRadians(180))
    ),
    model: {
      uri: 'http://localhost:3000/newtest.glb',
      color: Cesium.Color.WHITE,
      // scale: 100,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 20000),
      colorBlendMode: Cesium.ColorBlendMode.MIX,
      silhouetteColor: warningheightshowcolor,
      color: Cesium.Color.WHITE.withAlpha(0.6),
      shadows: Cesium.ShadowMode.CAST_ONLY
    }
  })
}

//加载3d模型的另一种方式
const addPowerTower2 = async (tower, dem) => {
  let message = JSON.parse(JSON.stringify(tower))
  const origin = Cesium.Cartesian3.fromDegrees(...tower.position.slice(0, 2), dem)
  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)
  const model = viewer.scene.primitives.add(
    Cesium.Model.fromGltf({
      url: tower.filePath
      // color: Cesium.Color.WHITE,
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(1, 20000),
      // colorBlendMode: Cesium.ColorBlendMode.MIX,
      // scale: (tower.height / 10) * scaleNum,
      // modelMatrix: modelMatrix,
      // silhouetteSize: tower.warning ? 4 : 0,
      // silhouetteColor: warningheightshowcolor,
      // shadows: Cesium.ShadowMode.CAST_ONLY,
      // message
    })
  )
  model.readyPromise.then(function (model) {})
}

//相对坐标计算,转为经纬度
let getxyz = ({ position, angle, xyz }) => {
  const localToWorld = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(...position))
  let rotationZ = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(-(angle - 90) || 0)))
  Cesium.Matrix4.multiply(localToWorld, rotationZ, localToWorld)
  const first = Cesium.Matrix4.multiplyByPoint(localToWorld, Cesium.Cartesian3.fromElements(...xyz), new Cesium.Cartesian3())
  let firheight = Cesium.Cartographic.fromCartesian(first).height
  return [Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(first).longitude), Cesium.Math.toDegrees(Cesium.Cartographic.fromCartesian(first).latitude), firheight]
}

//添加线
const addPowerLine = async (item0, item1) => {
  let [height, height2] = [towerDem[item0.pointId], towerDem[item1.pointId]]
  let [scaleNum1, scaleNum2] = [(item0.height * scaleNum) / 10, (item1.height * scaleNum) / 10]
  let classifiedData = {}
  let arr = [item0.wireInfo, item1.wireInfo]
  arr.forEach(item => {
    for (let key in item) {
      let id = item[key].id
      if (!classifiedData[id]) classifiedData[id] = []
      classifiedData[id].push(item[key])
    }
  })
  Object.values(classifiedData).forEach(value => {
    let [lng1, lat1, h1] = getxyz({
      position: item0.position.slice(0, 2),
      angle: item0.position.at(-1),
      xyz: [value[0].xyzPoint.x * scaleNum1, value[0].xyzPoint.y * scaleNum1, value[0].xyzPoint.z * scaleNum1]
    })
    let [lng2, lat2, h2] = getxyz({
      position: item1.position.slice(0, 2),
      angle: item1.position.at(-1),
      xyz: [value[1].xyzPoint.x * scaleNum2, value[1].xyzPoint.y * scaleNum2, value[1].xyzPoint.z * scaleNum2]
    })
    //计算类抛物线线段位置数组
    let arr1 = parabola([lng1, lat1, height + h1 || 0, lng2, lat2, height2 + h2 || 0])
    viewer.entities.add({
      name: '线段',
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(arr1),
        width: 1,
        material: new Cesium.PolylineGlowMaterialProperty({ color: Cesium.Color.AQUA.withAlpha(1) })
      }
    })
  })
}

//摄像机超出范围自动回归
let removegoback = null
let goBackCenter = (lng = 102.6723081, lnt = 26.51102626) => {
  //设置可浏览经纬度范围
  let Range = {
    west: lng - 0.2,
    north: lnt + 0.3,
    east: lng + 0.2,
    south: lnt - 0.2
  }
  removegoback && removegoback()
  removegoback = viewer.scene.postRender.addEventListener(function () {
    //获取摄像机位置
    let position = viewer.scene.camera.positionCartographic
    // 弧度转经纬度
    let longitude = Cesium.Math.toDegrees(position.longitude)
    let latitude = Cesium.Math.toDegrees(position.latitude)
    // let height = position.height
    if (longitude < Range.west || latitude > Range.north || longitude > Range.east || latitude < Range.south) {
      initcamera(lng, lnt, Math.round(viewer.camera.positionCartographic.height) >= 10000 ? Math.round(viewer.camera.positionCartographic.height) : 10000)
    }
  })
}

//窗口尺寸变化时候，cesium地图跟着变化
let cesviewerchange = () => {
  viewer.resize()
}

//鼠标移动处理
let [towerinfo, chooseTowerID, hovertower] = [ref({ pointId: '', systemList: [] }), [], null]
let [towerheightshowcolor, warningheightshowcolor] = [Cesium.Color.ROYALBLUE, Cesium.Color.RED]
const handlertowerhover = clickEvent => {
  let [pick, pickModel] = [viewer.scene.pickPosition(clickEvent.endPosition), viewer.scene.pick(clickEvent.endPosition)]
  handtowerhover(pickModel)
}

//鼠标移动时候处理对应dom和塔边框显示隐藏
const handtowerhover = (pickModel, type = true) => {
  hoverTowerId.value = ''
  if (pickModel && pickModel.id && Object.hasOwn(pickModel.id, 'message')) {
    if (hovertower && hovertower.id !== choosetower[0].id && !hovertower.message?.warning) {
      hovertower.model.silhouetteSize = 0
    }
    hovertower = pickModel.id
    hoverTowerId.value = hovertower.id
    hovertower.model.silhouetteSize = 4
    hovertower.model.silhouetteColor = hovertower.message.warning ? warningheightshowcolor : towerheightshowcolor
    towerinfo.value = hovertower.message
    chooseTowerID.push(hovertower.message.pointId), chooseTowerID.length > 2 && chooseTowerID.shift()
    let messSors = hovertower.message.sensors
    if (messSors?.length > 0 && (chooseTowerID.length == 1 || (chooseTowerID.length >= 2 && towerinfo.value.pointId != chooseTowerID[0]))) {
      handleLastData(hovertower.message)
    }
    if (type) {
      let idList = hovertower.message.systemList.map(item => item.id)
      connectWebsocket(idList)
    }
    viewer.scene.requestRender()
  } else if (hovertower && (choosetower.length === 0 || hovertower.id !== choosetower[0].id)) {
    hoverTowerId.value = ''
    hovertower.model.silhouetteSize = hovertower.message.warning ? 4 : 0
    hovertower = null
    viewer.scene.requestRender()
    clearWebsocket()
    return
  } else {
    hoverTowerId.value = ''
    lookApifing(signalArr)
    clearWebsocket()
  }
}

//判断点击的塔形成的列表长度是否为零
let ifchoosetowerLength = () => {
  if (choosetower.length !== 0) {
    choosetower[0].model.silhouetteSize = choosetower[0].message.warning ? 4 : 0
    let beforedom = document.getElementById(choosetower[0].message.pointId)
    beforedom.classList = ['cesiumlabal']
    if (choosetower[0].message.warning) beforedom.classList.add('warningbd')
    if (!choosetower[0].message.sensors || choosetower[0].message.sensors.length == 0) beforedom.classList.add('hiddenLabel')
    choosetower.shift()
  }
}

const emit = defineEmits(['sendTowerId', 'update:modelValue'])
//鼠标点击模型处理
let handlertowerclick = async clickEvent => {
  let pick = viewer.scene.pickPosition(clickEvent.position)
  let pickModel = viewer.scene.pick(clickEvent.position)
  if (pick && pickModel?.id && Object.hasOwn(pickModel.id, 'message')) {
    ifchoosetowerLength() //判断点击的塔列表是否为零，不为零则需要将里面的元素样式变为默认
    choosetower.push(pickModel.id)
    pickModel.id.model.silhouetteSize = 4
    pickModel.id.model.silhouetteColor = towerheightshowcolor
    let dom = document.getElementById(pickModel.id.message.pointId)
    dom.classList = ['cesiumlabal']
    emit('sendTowerId', pickModel.id.message)
    viewer.scene.requestRender()
  }
}

let websocket
const connectWebsocket = (systemIds = []) => {
  if (typeof WebSocket === 'undefined') {
    return console.log('您的浏览器不支持WebSocket')
  } else {
    try {
      //ws://10.210.200.129:8081/api/v1/ws'
      let islocalhost = window.location.href.indexOf('localhost') > -1
      // let url = islocalhost ? 'ws://localhost:3000/api/ws' : 'wss://deepgrid-backend-new.deepsensing.cn/api/v1/ws'
      let url = 'wss://deepgrid-backend-new.deepsensing.cn/api/v1/ws'
      if (!websocket) websocket = new WebSocket(proxy.webSocketUrl)
      websocket.onopen = () => {
        websocket.send(JSON.stringify({ systemIds }))
      }
      websocket.onmessage = evt => {
        const data = JSON.parse(evt.data)
        if (data.code == 101 && data.DataType !== 213) {
          let newObj = {}
          Object.keys(data.Data[0]).forEach(type => {
            newObj[type.toLowerCase()] = data.Data[0][type]
          })
          let objIndex = latestDataMaker.value.findIndex(item => item.id == homeStore.systemId_TowerTd[data.SystemId])
          if ((objIndex !== -1 && latestDataMaker.value, latestDataMaker.value[objIndex].data.length > 0)) {
            latestDataMaker.value[objIndex].data.forEach(item => {
              if (newObj[item.key]) item.value = newObj[item.key]
            })
          }
        }
      }
      websocket.onerror = evt => {
        console.log('websocket错误:', evt)
      }
      websocket.onclose = evt => {
        console.log('websocket关闭:', evt)
      }
    } catch (error) {}
  }
}

const clearWebsocket = () => {
  websocket?.close()
  websocket = null
}

const handleNameUnit = (secArr, key) => {
  let name = secArr[key.toLowerCase()].split('[')[0]
  let unit = secArr[key.toLowerCase()].match(/\[(.*?)\]/)[1]
  return [name, unit]
}

const handlLatestLabel = (taegetObj, secArr) => {
  return Object.entries(taegetObj)
    .filter(([key, item1]) => Object.hasOwn(secArr, key.toLowerCase()))
    .map(([key, item2]) => {
      let [name, unit] = handleNameUnit(secArr, key)
      return { name, value: Number(item2).toFixed(2), unit, key }
    })
}

//处理杆塔下传感器最新数据
let handleLatestData = (firArr, secArr, type, ifAddBlank = false) => {
  let HeaderName = Object.values(homeStore.sensortype).find(item => item.packageTypes.includes(Number(type)))
  let arr = []
  if (type == 215 || type == 216) {
    arr = Object.entries(firArr.Data)
      .filter(([key, item1]) => Object.hasOwn(secArr, key.toLowerCase()) && key.match(/\d+/g) <= firArr.Data.sensorCount)
      .map(([key, item2]) => {
        let [name, unit] = handleNameUnit(secArr, key)
        let phase = firArr.SensorInfos.find(item => item.index == key.match(/\d+/g))?.wire.phase || ''
        return { name: `${name}-${phase} `, value: Number(item2).toFixed(2), unit, key }
      })
  } else if (type == 7) {
    arr = handlLatestLabel(firArr.Data, secArr)
  } else if (type == 9) {
    arr = handlLatestLabel(firArr.Data[0], secArr)
  } else {
    arr = handlLatestLabel(firArr, secArr)
  }
  ifAddBlank && arr.push({ name: '', value: '', unit: '', key: '' })
  return arr.length ? [{ name: HeaderName && HeaderName.sensorTypeName, title: true }, ...arr] : []
}

//处理杆塔下最新图片数据
const imageData = reactive({ left: { name: null, data: null }, left1: null, right: { name: null, data: null }, right1: null })
const handleLatestImageData = (data, type, tower, state) => {
  try {
    let imgList = data.Data
    let obj = { left: { name: null, data: null }, left1: null, right: { name: null, data: null }, right1: null }
    if (type == 225) {
      for (let index = 0; index < imgList.length; index++) {
        const element = imgList[index]
        let time = moment(element.time).format('YYYY-MM-DD HH:mm:ss')
        let { channel, pictureUrl, videoAnalysisDo } = element
        if (channel == 1) {
          obj.left = { name: '大号测' + time, url: pictureUrl, videoAnalysisDo }
        } else if (channel == 2) {
          obj.right = { name: '小号测' + time, url: pictureUrl, videoAnalysisDo }
        }
      }
    } else if (type == 226) {
      let { camera1, camera2, camera3, camera4 } = imgList
      let arr = [camera1, camera2, camera3, camera4]
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index][0]
        let { position } = element
        let time = moment(element.time).format('YYYY-MM-DD HH:mm:ss')
        if (element && (index == 0 || index == 2)) {
          if (index == 0) {
            obj.left1 = { name: position + ' ' + time, data: element.tempMatrixVo }
          } else {
            obj.left = { name: position + ' ' + time, url: element.pictureUrl, videoAnalysisDo: [] }
          }
        } else if (element && (index == 1 || index == 3)) {
          obj.right = { name: position + time, videoAnalysisDo: [] }
          if (index == 1) {
            obj.right1 = { name: position + ' ' + time, data: element.tempMatrixVo }
          } else {
            obj.right = { name: position + ' ' + time, url: element.pictureUrl, videoAnalysisDo: [] }
          }
        }
      }
    }
    if (state) {
      let { left, left1, right, right1 } = obj
      ;[imageData.left, imageData.left1, imageData.right, imageData.right1] = [left, left1, right, right1]
    }
    //在预处理和正在处理时判断所属杆塔id,防止混淆
    if (!CameraInspectsNewData[tower.pointId]) CameraInspectsNewData[tower.pointId] = {}
    CameraInspectsNewData[tower.pointId] = JSON.parse(JSON.stringify(obj))
  } catch (error) {}
}

//查看最新数据前判断是否有相关请求还在发送，如果有就取消掉
const lookApifing = signalArr => {
  if (signalArr.length > 0) {
    for (let i = 0; i < signalArr.length; i++) signalArr[i].controller.abort()
    signalArr = []
  }
}

//处理最新数据
let signalArr = []
const hoverTowerId = ref('')
let handleLastData = async (goalData, type = 1) => {
  try {
    const controller = new AbortController()
    let signal = controller.signal
    type && lookApifing(signalArr)
    signalArr.push({ signal: proxy.generateRandomString(16), controller })
    if (type) imageData.left = imageData.left1 = imageData.right = imageData.right1 = null
    let objIndex = latestDataMaker.value.findIndex(item => item.id == goalData.pointId)
    latestDataMaker.value[objIndex].loading = true
    if (type && CameraInspectsNewData[goalData.pointId]) {
      let { left, left1, right, right1 } = CameraInspectsNewData[goalData.pointId]
      ;[imageData.left, imageData.left1, imageData.right, imageData.right1] = [left, left1, right, right1]
    }
    if (objIndex !== -1 && latestDataMaker.value[objIndex].data.length > 0) {
      latestDataMaker.value[objIndex].loading = false
    } else {
      let idList = goalData.systemList.map(item => item.id)
      getTowerLastData(idList, signal)
        .then(data => {
          if (data && data.length != 0) {
            let latestDataLabelArr = []
            data.forEach((res, index, arr) => {
              res.data['213'] && delete res.data['213']
              if (res.data['225']) handleLatestImageData(res.data['225'], 225, goalData, type), delete res.data['225']
              if (res.data['226']) handleLatestImageData(res.data['226'], 226, goalData, type), delete res.data['226']
              Object.entries(res.data).forEach(([type, value], index2, arr2) => {
                let newSensorAlarm = nodeStore.lowThresholdsTypeField[type]
                if (arr.length == index + 1 && arr2.length == index2 + 1) {
                  latestDataLabelArr.push(...handleLatestData(value, newSensorAlarm, type))
                } else {
                  latestDataLabelArr.push(...handleLatestData(value, newSensorAlarm, type, true))
                }
              })
            })
            let target = latestDataLabelArr.at(-1)
            if (target && !target.name) latestDataLabelArr.pop()
            latestDataMaker.value[objIndex].data = latestDataLabelArr
            if (!CameraInspectsNewData[goalData.pointId]) CameraInspectsNewData[goalData.pointId] = {}
          }
        })
        .catch(error => {
          if (signal.aborted) {
            chooseTowerID = []
          } else {
            ElMessage.warning('最新数据获取失败')
          }
        })
        .finally(() => {
          latestDataMaker.value[objIndex].loading = false
        })
    }
  } catch (error) {
    ElMessage.warning('最新数据展示失败')
  }
}

//线路更换时，就清理元素
const clearDom = (className = '') => {
  let domlist = Array.from(document.getElementsByClassName(className))
  domlist.forEach(element => {
    element.remove()
  })
}

let [choosetower, latestLabel, filterCeslinedata, time2, time3] = [[], [], [], null, null]
let watchfunction1, watchfunction2, watchfunction3, towerHandler, CameraInspectsNewDataTimeId
onMounted(async () => {
  initcesium(), await showterrain(terrainurl), initcamera()
  //监听线路
  watchfunction1 = watch(
    () => homeStore.ceslinedata,
    (newvalue, oldvalue) => {
      viewer.entities.values.length > 0 && viewer.entities.removeAll()
      choosetower = []
      if (!newvalue || newvalue.length == 0) {
        return
      }
      clearDom('cesiumlabal'), clearDom('cesiumLatestLabal')
      if (newvalue[0].lineName.includes('山东')) {
        viewer.imageryLayers.get(0).show = false
        if (viewer.imageryLayers.get(1)) {
          viewer.imageryLayers.get(1).show = true
        } else {
          viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({ url: testtile, fileExtension: 'png', minimumLevel: 0, maximumLevel: 17 }))
          viewer.imageryLayers.get(1).show = true
        }
        initcamera(newvalue[0].position[0], newvalue[0].position[1])
      } else {
        viewer.imageryLayers.get(0).show = true
        if (viewer.imageryLayers.get(1)) {
          viewer.imageryLayers.get(1).show = false
        }
      }

      filterCeslinedata = newvalue.filter(item => item.systemList.length > 0)
      addLineTower(newvalue).then(() => {
        emit('update:modelValue', false)
      })
    },
    { immediate: true }
  )
  //监听点击的塔
  watchfunction2 = watch(
    () => props.choosetower,
    async (newvalue, oldvalue) => {
      if (newvalue && props.choosetower.type == 'tower') {
        let pickModel = viewer.entities.getById(newvalue.id)
        ifchoosetowerLength()
        choosetower.push(pickModel)
        pickModel.model.silhouetteSize = 4
        pickModel.model.silhouetteColor = pickModel.message.warning ? warningheightshowcolor : towerheightshowcolor
        let dom = document.getElementById(pickModel.message.pointId)
        pickModel.message.warning ? dom.classList.add('warningbg', 'warningbd') : dom.classList.add('deepwarning')
        let [lng, lat] = props.choosetower.position
        cameraFlyTo({ destination: [lng, lat - pickModel.message.height / 10000, pickModel.message.demHeight + 8 * pickModel.message.height] })
      }
      //因为选中线路后，默认要把视角跟随到该线路第一个塔，所以移动至线路的交互不容易展示出来（网络条件好的）
      // else if (newvalue && props.choosetower.type == 'line') {
      //   let pickModel = viewer.entities.values.find((item) => item.name == newvalue.name)
      //   let [lng, lat] = props.choosetower.position
      //   const data = await Cesium.sampleTerrain(terrainProvider, 15, [Cesium.Cartographic.fromDegrees(lng, lat)])
      //   let height = data[0].height ? data[0].height : 0
      //   viewer?.camera.flyTo({
      //     destination: Cesium.Cartesian3.fromDegrees(lng, lat - 0.02, height + objHeight[props.choosetower.type]),
      //     orientation: {
      //       pitch: pitch1
      //     },
      //     duration: 2
      //   })
      // }
    },
    { immediate: true, flush: 'post' }
  )
  // watchfunction3 = watch(
  //   () => homeStore.topAlarm,
  //   (newval) => {
  //     if (newval && newval.length > 0) {
  //       for (let index = 0; index < newval.length; index++) {
  //         const element = newval[index]

  //         element.warningType == 5 && addfiremaker(element.id, element.position) //山火标识
  //       }
  //     }
  //   },
  //   { immediate: true }
  // )
  window.addEventListener('resize', cesviewerchange)
  towerHandler = viewer.screenSpaceEventHandler
  towerHandler.setInputAction(handlertowerclick, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  towerHandler.setInputAction(proxy.debounce(handlertowerhover, 200), Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  CameraInspectsNewDataTimeId = setInterval(() => {
    CameraInspectsNewData = {} //最新数据缓存定时清空清空
    latestDataMaker.value.forEach(item => {
      item.data = []
    })
  }, 300000)
})

onUnmounted(() => {
  window.removeEventListener('resize', cesviewerchange)
  watchfunction1 && watchfunction1(), watchfunction2 && watchfunction2()
  CameraInspectsNewDataTimeId && clearInterval(CameraInspectsNewDataTimeId)
  removeaddmaker && removeaddmaker()
  removeLatestmaker && removeLatestmaker()
  viewer.entities.values.length > 0 && viewer.entities.removeAll()
  removegoback && removegoback()
  handler && handler.destroy()
  time3 && clearTimeout(time3)
  // towerHandler && towerHandler.destroy()
  //内存释放
  let canvas = viewer?.canvas.getContext('webgl2') || viewer?.canvas.getContext('webgl')
  canvas?.getExtension('WEBGL_lose_context')?.loseContext()
  !viewer.isDestroyed() && viewer.destroy()
  clearWebsocket()
  homeStore.ceslinedata = null
})

defineExpose({ initcamera, viewer, getCameraPosition, setCameraInspects })
</script>

<style>
#cesiumcontainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.cesiumlabal {
  visibility: visible;
  color: aliceblue;
  position: absolute;
  padding: 0.125rem;
  z-index: 2;
  left: 0;
  top: -2vw;
  width: 5vw;
  min-height: 2vh;
  border-radius: 0.625rem;
  border: 0.125rem solid rgb(203, 203, 203);
  display: flex;
  background-color: rgba(203, 203, 203, 0.7);
  flex-direction: column;
  justify-content: center;
}
.cesiumlabal:hover {
  cursor: pointer;
  /* border-color: rgb(160, 205, 244); */
  box-shadow: 0px 0px 2px 1px rgba(0, 126, 245, 1) inset;
  background-color: rgba(0, 136, 255, 0.6);
}
.cesiumlabal h3 {
  font-size: 0.8vw;
  margin: 0 0;
  padding-bottom: 2px;
  text-align: center;
}
.cesiumlabal span {
  font-size: 0.6vw;
  padding: 2px 4px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}
.cesiumLatestLabal {
  pointer-events: none;
  visibility: visible;
  color: rgb(55, 155, 248);
  position: absolute;
  font-size: 1rem;
  z-index: 5;
  top: 0%;
  left: -8rem;
  min-height: 5.6rem;
  min-width: 5rem;
  border-radius: 0.625rem;
  overflow: hidden;
  display: flex;
  background-color: rgba(0, 0, 0, 0.2);
  flex-direction: column;
  justify-content: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
}

.cesiumLatestLabal > div {
  background-color: rgba(0, 9, 33, 0.3);
  font-size: 1rem;
  margin: 0 0;
  padding-bottom: 2px;
  padding: 0.0625rem 0.5rem;
}
.cesiumLatestLabal > div:nth-of-type(1) {
  padding-top: 0.125rem;
}
.cesiumLatestLabal > div:nth-last-of-type(1) {
  padding-bottom: 0.25rem;
}
.cesiumLatestLabal > div span:nth-of-type(1) {
  color: rgb(207, 240, 253);
}
.cesiumLatestLabal > div span:nth-of-type(2) {
  font-weight: 600;
}

.hiddenLabel {
  visibility: hidden;
}

.labelnormal {
  border-color: rgb(122, 200, 248);
  background-color: rgba(122, 200, 248, 0.7);
}

.nopower {
  border-color: rgb(255, 132, 0);
  background-color: rgba(255, 132, 0, 0.7);
}
.nopower::before {
  border-top-color: rgba(255, 132, 0, 0.7);
}

.deepwarning {
  border-color: rgb(14, 104, 231);
  background-color: rgba(14, 104, 231, 0.7);
}
.deepwarning::before {
  border-top-color: rgba(14, 104, 231, 0.7);
}

.warningbd {
  border-color: rgba(231, 32, 14, 1);
}
.warningbg {
  /* border-color: rgba(231, 32, 14, 1); */
  background-color: rgba(231, 32, 14, 0.7);
}

.warning::before {
  border-top-color: rgba(231, 32, 14, 0.7);
}

.firemasker {
  width: 2rem;
  height: 2rem;
  background-image: url('@/assets/image/fire1.png');
  background-size: 100% 100%;
  visibility: visible;
  color: aliceblue;
  position: absolute;
  padding: 2px;
  z-index: 2;
  left: 0;
  top: -1rem;
  min-height: 2vh;
  border-radius: 50%;
  border: 2px solid rgb(237, 104, 3);
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  flex-direction: column;
  justify-content: center;
}

.firemasker:before {
  pointer-events: none;
  content: '';
  display: block;
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  width: 1rem;
  height: 1rem;
  background-image: url('@/assets/image/triangles.png');
  background-size: 100% 100%;
  transform: translate(-50%, 100%);
}

.ces {
  z-index: 1;
  /* border: 1px solid rgb(1, 84, 144);
  border-top-width: 0;
  border-bottom-width: 0; */
  flex-direction: column;
  top: 0;
  bottom: 0;
  position: absolute;
  width: 30vw;
}
.cestitle {
  color: white;
}

.ces img {
  width: 100%;
  height: auto;
}
.cesLeft {
  left: 0;
}

.cesRight {
  right: 0;
}
</style>
