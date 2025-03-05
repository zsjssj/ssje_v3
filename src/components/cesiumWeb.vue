<template>
  <div id="cesiumcontainer" ref="containerdom"></div>
  <!-- 针对2d模式会显示的一些标签 -->
  <div class="mask2d" v-show="mode.includes('3d') || mode.includes('2d')"></div>
  <div class="maskbg" v-show="mode.includes('3d')"></div>
  <div class="scale2d">
    <div @click="handleScale(1)"><img src="../../assets/images/scaleAdd.png" alt="" /></div>
    <div @click="handleScale(0)"><img src="../../assets/images/scaleSub.png" alt="" /></div>
  </div>
  <div class="positionMask" v-show="props.mode.includes('2d')">
    <positionMaskVue
      :positionMask="positionMask"
      @clickTo="
        data => {
          handleClickTo(data)
        }
      "
    />
  </div>
  <!-- 3d模式 -->
  <div v-show="mode.includes('3d')" class="scale3d">
    <label3d
      :markerList="markerList"
      @selectSubstation="
        data => {
          emit('selectSubstation', data)
        }
      "
    />
  </div>
</template>

<script setup>
import {
  Viewer,
  SceneTransforms,
  Color,
  SceneMode,
  GeoJsonDataSource,
  UrlTemplateImageryProvider,
  CesiumTerrainProvider,
  Cesium3DTileset,
  Cesium3DTileStyle,
  sampleTerrain,
  EllipsoidalOccluder,
  Ellipsoid,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Math as CesMath,
  Cartographic,
  Cartesian2,
  Cartesian3,
  CustomDataSource,
  VerticalOrigin,
  Resource
} from 'cesium'
import { ref, useTemplateRef, onMounted, defineAsyncComponent, onBeforeUnmount, onUnmounted, watch, watchEffect, getCurrentInstance, nextTick } from 'vue'
import '@/Widgets/widgets.css'
import { useStore } from 'vuex'
// import label3d from './label3d.vue'
import positionMaskVue from './positionMask.vue'
const store = useStore()
const { proxy } = getCurrentInstance()

const label3d = defineAsyncComponent(() => import('./label3d.vue'))

const colorList = ['rgb(166, 216, 255)', 'rgb(166, 216, 255)', '#D4AF1F', '#D03253']
const mode = defineModel('mode', { type: Array, default: ['2d'] })
const props = defineProps(['region', 'allRegionId', 'company', 'power'])
const emit = defineEmits(['selectSubstation', 'sendlnglat', 'selectRegionId'])

const containerdom = useTemplateRef('containerdom')
let viewer = null
window.CESIUM_BASE_URL = '/'
let dtilesregion = encodeURIComponent('四川省/成都市/都江堰市')
let tilesurl = '/mapapi/2dtiles/{z}/{x}/{y}.png'
// let dtilesurl = `/mapapi/${dtilesregion}/3dtiles/tileset.json` //线上目录
// let terrainurl = `/mapapi/${dtilesregion}/dem` //线上目录
let dtilesurl = `/mapapi/3dtiles/tileset.json`
let terrainurl = `/mapapi/dem`

const urlTemplateImagery1 = new UrlTemplateImageryProvider({
  url: tilesurl,
  fileExtension: 'png',
  minimumLevel: 0,
  maximumLevel: 5
})
urlTemplateImagery1.errorEvent.addEventListener(error => {})
const urlTemplateImagery2 = new UrlTemplateImageryProvider({
  url: '/mapapi/2dtiles2/{z}/{x}/{y}.png',
  fileExtension: 'png',
  minimumLevel: 0,
  maximumLevel: 16
})
urlTemplateImagery2.errorEvent.addEventListener(error => {})

//初始化场景
const initcesium = function () {
  viewer = new Viewer('cesiumcontainer', {
    contextOptions: { webgl: { alpha: true } },
    shadows: false,
    targetFrameRate: 60,
    infoBox: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    requestRenderMode: true,
    maximumRenderTimeChange: 100,
    terrainProvider: undefined,
    selectionIndicator: false,
    sceneMode: SceneMode.SCENE2D
  })
  viewer.imageryLayers.removeAll()
  viewer.scene.skyBox.show = false
  viewer.scene.moon = null
  viewer.scene.backgroundColor = new Color(0.0, 0.0, 0.0, 0.0)
  viewer._cesiumWidget.creditContainer.style.display = 'none'
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [3, 4] //禁用cesium鼠右键拖拽缩放功能
  viewer.imageryLayers.addImageryProvider(urlTemplateImagery1)
  viewer.imageryLayers.addImageryProvider(urlTemplateImagery2)
  viewer.imageryLayers.get(1).show = false
}

//初始化相机
let pitch1 = props.pitchnumber ? CesMath.toRadians(props.pitchnumber) : CesMath.toRadians(-45)
const initcamera = ({ lng, lat, height, pitch }, { far, near, minimumZoomDistance, maximumZoomDistance }) => {
  const lng1 = lng || store.state.region.cesiumcoordinate[0] || 103.64
  const lat1 = lat || store.state.region.cesiumcoordinate[1] || 30.96
  viewer?.camera.setView({
    destination: Cartesian3.fromDegrees(lng1, lat1, height || 5000),
    orientation: {
      pitch: CesMath.toRadians(pitch) || pitch1
    }
  })
  minScale = minimumZoomDistance
  maxScale = maximumZoomDistance
  viewer.camera.frustum.far = far || 40000
  viewer.camera.frustum.near = near || 1
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = minimumZoomDistance || 100
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = maximumZoomDistance || 20000
}

//显示地形
let terrainProvider = null
let initTerrain = url => {
  terrainProvider = CesiumTerrainProvider.fromUrl(url, { requestMetadata: false })
  terrainProvider
    .then(res => {
      viewer.terrainProvider = res
      viewer.scene.globe.depthTestAgainstTerrain = true //开启地形深度检测
    })
    .catch(error => {
      console.log('加载地形失败', error)
    })
}

//添加3d建筑，3dtiles数据
let dujiangyanjz = null
let add3dtitles = async function (data) {
  const resource = new Resource({
    url: data
    // headers: { cookie: Cookie },
  })

  try {
    let model = await Cesium3DTileset.fromUrl(resource, {
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      maximumScreenSpaceError: 32, // 数值加大，能让最终成像变模糊
      skipScreenSpaceErrorFactor: 16,
      skipLevels: 1,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: true, // 如果为true则不会在已加载完概况房屋后，自动从中心开始超清化房屋
      cullWithChildrenBounds: true,
      cullRequestsWhileMoving: true,
      cullRequestsWhileMovingMultiplier: 10, // 值越小能够更快的剔除
      preloadWhenHidden: true,
      preferLeaves: true,
      maximumMemoryUsage: 128, // 内存分配变小有利于倾斜摄影数据回收，提升性能体验
      progressiveResolutionHeightFraction: 0.5, // 数值偏于0能够让初始加载变得模糊
      dynamicScreenSpaceErrorDensity: 0.5, // 数值加大，能让周边加载变快
      dynamicScreenSpaceErrorFactor: 1,
      preloadFlightDestinations: true
    })
    dujiangyanjz = viewer?.scene.primitives.add(model)
    dujiangyanjz.style = new Cesium3DTileStyle({
      color: 'rgba(200, 200, 200,1)'
    })
  } catch (error) {
    console.log(`Error loading tileset: ${error}`)
  }
}

//添加labal标签
let removeaddmaker = null
const remove_positopnMakers = []
const markerList = ref([])
let addmaker = async function (data, power) {
  const heightList = data.map(item => Cartographic.fromDegrees(...item.Node.Props.coordinate))
  const terrain = await CesiumTerrainProvider.fromUrl(terrainurl, { requestMetadata: false })
  const firstHeight1 = await sampleTerrain(terrain, 15, heightList)
  for (let index = 0; index < data.length; index++) {
    if (data[index]['fieldMap'] && data[index]['fieldMap'].alarmInfo) {
    }
    const handleFun = () => {
      const item = data[index]
      const { region, Node, name, objectId, regionObjectId } = item
      const data1 = power.find(item2 => item2.substationObjectId === item.objectId)
      let height = firstHeight1[index]?.height ? firstHeight1[index].height : 0
      markerList.value = markerList.value.concat({
        adcode: region.adcode,
        coordinate: Node.Props.coordinate,
        layoutFile: Node.Props.layoutFile,
        name,
        aramType: item['fieldMap'] && item['fieldMap'].alarmInfo ? item['fieldMap'].alarmInfo : 0,
        // aramType: 3,
        objectId,
        regionObjectId,
        power: data1?.power?.toFixed(1) || '0.0',
        temp: data1?.temp?.toFixed(1) || '0.0',
        state: 0
      })
      nextTick(() => {
        const divdom = document.getElementById(item.objectId)
        if (divdom) remove_positopnMakers.push(handleHtmlPosition(divdom, item.Node.Props.coordinate, height))
      })
    }
    // runTask(handleFun)
    handleFun()
  }
}

//修改标签状态
let changemasker = function (data) {
  data.forEach(item => {
    const ele = markerList.value.find(item2 => item2.objectId == item.deviceId)
    if (ele) {
      ele.power = item.electrical ? (item.electrical / 1000).toFixed(2) : 0
      ele.state = item.state
    }
  })
}

//监听相机高度决定3d建筑是否显示
let removecamerachange = null
let cameraEventListener = () => {
  removecamerachange = viewer.camera.changed.addEventListener(data => {
    let height = viewer.camera.positionCartographic.height
    height >= 6000 ? (dujiangyanjz.show = false) : (dujiangyanjz.show = true)
  })
}

//摄像机超出范围自动回归
let removegoback = null
let goBackCenter = function () {
  let Range = lng && lnt ? { west: lng - 0.25, north: lnt + 0.2, east: lng + 0.25, south: lnt - 0.2 } : { west: 103.4, north: 31.16, east: 103.88, south: 30.84 }
  removegoback = viewer.scene.postRender.addEventListener(function () {
    let { west, north, east, south } = viewer.camera.computeViewRectangle()
    let west1 = (west / CesMath.PI) * 180
    let north1 = (north / CesMath.PI) * 180
    let east1 = (east / CesMath.PI) * 180
    let south1 = (south / CesMath.PI) * 180
    let coordinate1 = props.company?.Node.Props.coordinate || [103.64, 30.98]
    if (west1 < Range.west || north1 > Range.north || east1 > Range.east || south1 < Range.south) {
      initcamera({
        lng: coordinate1[0],
        lat: coordinate1[1],
        height: Math.round(viewer.camera.positionCartographic.height) >= 5000 ? Math.round(viewer.camera.positionCartographic.height) : 5000
      })
    }
  })
}

//摄像机超出范围自动回归
let removegoback1 = null
let goBackCenter1 = (lng, lnt, [a1, a2, b1, b2], callback) => {
  //设置可浏览经纬度范围
  let Range = {
    west: lng - a2 || 0.2,
    north: lnt + b2 || 0.3,
    east: lng + a1 || 0.2,
    south: lnt - b1 || 0.2
  }
  removegoback1 && removegoback1()
  removegoback1 = null
  removegoback1 = viewer.scene.postRender.addEventListener(function () {
    let position = viewer.scene.camera.positionCartographic
    let longitude = CesMath.toDegrees(position.longitude)
    let latitude = CesMath.toDegrees(position.latitude)
    if (longitude < Range.west || latitude > Range.north || longitude > Range.east || latitude < Range.south) {
      typeof callback === 'function' && callback()
    }
  })
}

//处理放大和缩小功能
let minScale = 0
let maxScale = 10
const handleScale = mode => {
  const h = viewer.camera.positionCartographic.height
  const dis = (maxScale - minScale) / 4
  if (h >= minScale && h <= maxScale) {
    mode === 0 ? viewer.camera.moveForward(-dis) : viewer.camera.moveForward(dis)
  } else if (h < minScale && mode === 0) {
    viewer.camera.moveForward(-500000)
  } else if (h > maxScale && mode === 1) {
    viewer.camera.moveForward(500000)
  }
}

//记录针对市一级的设备数量
const regionsubnumber = (data = []) => {
  const regsubnumber = []
  data.forEach(item => {
    let count1 = 0
    item.children &&
      item.children.forEach(item2 => {
        let count2 = 0
        item2.children &&
          item2.children.forEach(item3 => {
            count2 = item3.substation ? count2 + item3.substation.length : count2
            regsubnumber.push({ name: item3.name, count: item3.substation ? item3.substation.length : null })
          })
        count1 = item2.substation ? count1 + item2.substation.length + count2 : count2
        regsubnumber.push({
          name: item2.name,
          count: item2.substation ? item2.substation.length + count2 : count2
        })
      })
    regsubnumber.concat([{ name: item.name, count: item.substation ? item.substation.length + count1 : count1 }])
    // regsubnumber = [...regsubnumber, { name: item.name, count: item.substation ? item.substation.length + count1 : count1 }]
  })
  return regsubnumber
}

//手动创建标签
const positionMask = ref([])
let remove_addPositopnMakers = []
let addPositopnMaker = function (name, id, position, state) {
  try {
    positionMask.value.push({ name, id, position, state })
    nextTick(() => {
      let divdom = document.getElementById(id)
      if (divdom) remove_addPositopnMakers.push(handleHtmlPosition(divdom, position, 0))
    })
  } catch (error) {
    console.log('添加标签失败', error)
  }
}
//处理cesium添加的html标签位置绑定问题
const handleHtmlPosition = (divdom, position, dem) => {
  const [ellipsoid, point] = [Ellipsoid.WGS84, Cartesian3.fromDegrees(...position)]
  return viewer?.scene.postRender.addEventListener(() => {
    const windowCoord = SceneTransforms.worldToWindowCoordinates(viewer.scene, Cartesian3.fromDegrees(...position, dem))
    const occluder = new EllipsoidalOccluder(ellipsoid, viewer.camera.position)
    const visible = occluder.isPointVisible(point)
    if (windowCoord && visible) {
      let [x, y] = [windowCoord.x - divdom.offsetWidth / 2, windowCoord.y - divdom.offsetHeight]
      divdom.style.cssText = `
              transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);
            `
    } else {
      divdom.style.cssText = `visibility:hidden;`
    }
  })
}

const handleClickTo = item => {
  //转换到3d模式，并且定位到相关的位置
  mode.value = ['3d']
  positionMask.value = []
  viewer.dataSources.removeAll()
  viewer.imageryLayers.get(0).show = false
  viewer.imageryLayers.get(1).show = true
  viewer.scene.mode = SceneMode.SCENE3D
  initcamera({ lng: item.position[0], lat: item.position[1] - 0.05, height: 5000, pitch: -45 }, { far: 30000000, near: 1, minimumZoomDistance: 1, maximumZoomDistance: 50000 })
  goBackCenter1(...item.position, [0.5, 0.5, 0.5, 0.2], () => {
    initcamera({ lng: item.position[0], lat: item.position[1] - 0.05, height: 5000, pitch: -45 }, { far: 30000000, near: 1, minimumZoomDistance: 1, maximumZoomDistance: 50000 })
  })
  initTerrain(terrainurl)
  add3dtitles(dtilesurl)
  cameraEventListener()
  const res = props.allRegionId.find(item1 => item1.name === item.id)
  const id = res['objectId']
  emit('selectRegionId', id)
  store.commit('region/setRegionChooseId', id)
}

//右键点击选点
let pointtimeid, Handler
const watchclick = () => {
  if (!Handler) Handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
  Handler.setInputAction(async event => {
    const pRadians = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
    const cartographic = Cartographic.fromCartesian(pRadians)
    const longitude = Number(CesMath.toDegrees(cartographic.longitude).toFixed(6))
    const latitude = Number(CesMath.toDegrees(cartographic.latitude).toFixed(6))
    emit('sendlnglat', [longitude, latitude])
    viewer.entities.values.length > 0 && viewer.entities.removeAll()
    pointtimeid && clearTimeout(pointtimeid)
    pointtimeid = setTimeout(() => {
      viewer.entities.add({
        position: Cartesian3.fromDegrees(longitude, latitude, 0),
        point: {
          pixelSize: 5,
          color: Color.RED,
          outlineColor: Color.WHITE,
          outlineWidth: 2
        }
      })
      viewer.scene.requestRender()
    }, 0)
  }, ScreenSpaceEventType.RIGHT_CLICK)
}

let watchLeftClick = function () {
  if (!Handler) Handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
  Handler.setInputAction(event => {
    emit('selectSubstation', null)
  }, ScreenSpaceEventType.LEFT_CLICK)
}

//2d地图初始化需要进行的一些操作
const init2dMap = name => {
  try {
    ;(mode.value = ['2d']), (markerList.value = [])
    dujiangyanjz && viewer.scene.primitives.remove(dujiangyanjz)
    viewer.scene.mode = SceneMode.SCENE2D
    ;(viewer.imageryLayers.get(0).show = true), (viewer.imageryLayers.get(1).show = false)
    const region1 = name.split('/')
    const region2 = region1.at(-1)
    const jsonRes = proxy.GeoJSON[region2]
    const regionResourcesUser = store.state.region.regionResourcesUser
    const lng = jsonRes['features'][0]['properties']['center'][0]
    const lat = jsonRes['features'][0]['properties']['center'][1]
    initcamera({ lng, lat, height: 500000, pitch: 90 }, { far: 30000000, near: 1, minimumZoomDistance: 100000, maximumZoomDistance: 3000000 })
    goBackCenter1(103.64, 30.96, [30, 40, 27, 20], () => {
      initcamera({ lng, lat, height: 500000, pitch: 90 }, { far: 30000000, near: 1, minimumZoomDistance: 100000, maximumZoomDistance: 3000000 })
    })
    viewer.dataSources.removeAll()
    const strokeColor = [1, 137, 255].map(item => item / 255) //便于调试颜色
    const fillColor = [0, 147, 255].map(item => item / 255) //便于调试颜色
    viewer.dataSources.add(GeoJsonDataSource.load(jsonRes, { stroke: new Color(...strokeColor, 1), fill: new Color(...fillColor, 0.5), strokeWidth: 1 }))
    remove_positopnMakers.length > 0 && remove_positopnMakers.forEach(item => item())
    remove_addPositopnMakers.length > 0 && remove_addPositopnMakers.forEach(item => item())
    const arrNum = regionsubnumber(regionResourcesUser)
    const regionP1 = regionResourcesUser.find(item => item.name === region1[0])
    const regionP2 = regionP1['children'].find(item => item.name === region1[1])
    const regionP4 = regionP2['children'].map(item => {
      const regionP3 = jsonRes['features'].find(item1 => item1['properties'].name === item.name)
      const arrNum1 = arrNum.find(item2 => item2.name === item.name)
      return { name: item.name, count: arrNum1['count'], position: regionP3['properties']['center'] }
    })
    positionMask.value = []
    for (let index = 0; index < regionP4.length; index++) {
      const element = regionP4[index]
      addPositopnMaker(element.count, element.name, element.position, 0)
    }
    emit('selectSubstation', null)
  } catch (error) {
    console.error('初始化2d地图失败', error)
  }
}

//监听父页面是否传值
let lng, lnt

//修改标签状态
watchEffect(
  () => {
    if (props.power && props.power.length > 0 && markerList.value.length > 0) changemasker(props.power)
  },
  {
    flush: 'post'
  }
)

onMounted(() => {
  initcesium()
  if (props.region && mode.value.includes('2d')) {
    init2dMap(props.region)
  }
  watch(
    () => props.region,
    newval => {
      if (!newval) return
      init2dMap(newval)
    },
    { immediate: true }
  )
  watch(
    mode,
    newval => {
      if (newval.includes('3d')) {
        watchLeftClick()
      } else if (newval.includes('pick')) {
        markerList.value = []
        remove_positopnMakers.length > 0 && remove_positopnMakers.forEach(item => item())
        remove_addPositopnMakers.length > 0 && remove_addPositopnMakers.forEach(item => item())
      }
    },
    {
      immediate: true
    }
  )
  watch(
    () => props.company,
    (newvalue, oldvalue) => {
      if (newvalue instanceof Array && newvalue.length > 0) {
        addmaker(newvalue, props.power)
      } else if (newvalue instanceof Object && Object.hasOwn(newvalue, 'subType')) {
        //判断是不是单个点,在本项目里面单点是用来定位相关做标识的
        viewer.entities.values.length > 0 && viewer.entities.removeAll()
        ;[lng, lnt] = [newvalue.longitude, newvalue.latitude]
        ;(viewer.imageryLayers.get(0).show = false), (viewer.imageryLayers.get(1).show = true)
        watchclick()
        if (!lng && !lnt) {
          const [lng1, lat1] = [103.64, 30.98]
          initcamera({ lng: lng1, lat: lat1, height: 1000, pitch: 90 }, { far: 30000000, near: 1, minimumZoomDistance: 100, maximumZoomDistance: 30000 })
          goBackCenter1(lng1, lat1, [0.5, 0.5, 0.5, 0.5], () => {
            initcamera({ lng: lng1, lat: lat1, height: 1000, pitch: 90 }, { far: 30000000, near: 1, minimumZoomDistance: 100, maximumZoomDistance: 30000 })
          })
          return
        }
        viewer?.entities.add({
          position: Cartesian3.fromDegrees(lng, lnt, 0),
          point: { pixelSize: 5, color: Color.RED, outlineColor: Color.WHITE, outlineWidth: 2 }
        })
        initcamera({ lng, lat: lnt, height: 1000, pitch: 90 }, { far: 30000000, near: 1, minimumZoomDistance: 100, maximumZoomDistance: 30000 })
        goBackCenter1(lng, lnt, [0.5, 0.5, 0.5, 0.5], () => {
          initcamera({ lng, lat: lnt, height: 1000, pitch: 90 }, { far: 30000000, near: 1, minimumZoomDistance: 100, maximumZoomDistance: 30000 })
        })
      }
    },
    {
      immediate: true,
      deep: true
    }
  )
})

onBeforeUnmount(() => {
  // dujiangyanjz && viewer.scene.primitives.remove(dujiangyanjz)
})

onUnmounted(() => {
  viewer.entities.values.length > 0 && viewer.entities.removeAll()
  removegoback && removegoback()
  removecamerachange && removecamerachange()
  removeaddmaker && removeaddmaker()
  remove_positopnMakers.length > 0 && remove_positopnMakers.forEach(item => item())
  remove_addPositopnMakers.length > 0 && remove_addPositopnMakers.forEach(item => item())
  // viewer.scene.primitives.length > 0 && viewer.scene.primitives.removeAll()
  // dujiangyanjz && dujiangyanjz.destroy()
  clearTimeout(pointtimeid)
  Handler && Handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
  Handler && Handler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK)
  Handler && !Handler.isDestroyed() && Handler.destroy()
  //内存释放
  let canvas = viewer?.canvas.getContext('webgl2') || viewer?.canvas.getContext('webgl')
  canvas?.getExtension('WEBGL_lose_context')?.loseContext()
  !viewer.isDestroyed() && viewer.destroy()
})

defineExpose({ initcamera, init2dMap })
</script>

<style>
#cesiumcontainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
canvas {
  width: 100%;
  height: 100%;
  outline: none;
}

.mask2d {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(ellipse at center, rgba(255, 255, 255, 0) 35%, rgba(0, 0, 0, 0.7) 80%);
  z-index: 10;
}
.maskbg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}
.scale2d {
  user-select: none;
  overflow: hidden;
  z-index: 10;
  position: absolute;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  bottom: 2rem;
  right: 2rem;
  width: 40px;
  height: 81px;
  background-image: url('../../assets/images/scale2d.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.scale2d > div {
  overflow: hidden;
  cursor: pointer;
}
.scale2d > div:hover {
  cursor: pointer;
}
.scale2d > div:hover img {
  transform: translateX(-1rem);
  filter: drop-shadow(1rem 0 0 rgb(38, 128, 240));
}

.positionMask,
.scale3d {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  inset: 0;
  pointer-events: none;
  z-index: 9;
}
</style>
