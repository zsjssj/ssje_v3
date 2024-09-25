<template>
  <div id="cesiumcontainer" ref="containerdom"></div>
  <div
    v-if="props.ifshowmask"
    style="
      position: absolute;
      width: 20.5rem;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 10;
      background: linear-gradient(to right, rgba(0, 9, 33, 1), rgba(0, 9, 33, 0.9), rgba(0, 9, 33, 0.8), rgba(0, 9, 33, 0.7), rgba(0, 9, 33, 0));
    "
  ></div>
  <div
    v-if="props.ifshowmask"
    style="
      position: absolute;
      width: 20.5rem;
      height: 100%;
      right: 0;
      top: 0;
      z-index: 10;
      background: linear-gradient(to left, rgba(0, 9, 33, 1), rgba(0, 9, 33, 0.9), rgba(0, 9, 33, 0.8), rgba(0, 9, 33, 0.7), rgba(0, 9, 33, 0));
    "
  ></div>
</template>

<script setup>
import {
  Viewer,
  SceneTransforms,
  Color,
  UrlTemplateImageryProvider,
  CesiumTerrainProvider,
  Cesium3DTileset,
  Cesium3DTileStyle,
  sampleTerrain,
  EllipsoidalOccluder,
  Ellipsoid,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Math as CesiumMath,
  Cartographic,
  Cartesian3
} from 'cesium'
import { ref, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import '@/Widgets/widgets.css'
import { useStore } from 'vuex'
const store = useStore()
const emit = defineEmits(['selectSubstation', 'sendlnglat'])

let props = defineProps(['company', 'power', 'ifshowmask', 'ifshow3d', 'ifListenerclick', 'pitchnumber', 'Usershowregion'])

let containerdom = ref(null)
let viewer = null
window.CESIUM_BASE_URL = '/'
let dtilesregion = encodeURIComponent('四川省/成都市/都江堰市')
let tilesurl = 'https://tiles-1307225140.cos.ap-shanghai.myqcloud.com/2dtiles/{z}/{x}/{y}.png'
let dtilesurl = `https://tiles-1307225140.cos.ap-shanghai.myqcloud.com/${dtilesregion}/3dtiles/tileset.json`
let terrainurl = `https://tiles-1307225140.cos.ap-shanghai.myqcloud.com/${dtilesregion}/dem`
// let tilesurl = 'http://localhost:3000/djyyaogan/{z}/{x}/{y}.png'
// let dtilesurl = 'http://localhost:3000/3dtiles/tileset.json'
// let terrainurl = 'http://localhost:3000/dem'

//初始化场景
let initcesium = function () {
  viewer = new Viewer('cesiumcontainer', {
    contextOptions: { webgl: { alpha: true } },
    targetFrameRate: 60, // 控制渲染帧数
    infoBox: false, //是否显示信息框
    geocoder: false, //是否显示搜索框按钮
    homeButton: false, //不显示home按钮
    sceneModePicker: false, //显示查看器显示模式按钮(3d、2.5d、2d)
    baseLayerPicker: false, //是否显示图层显示器
    navigationHelpButton: false, //是否显示帮助按钮
    animation: false, //是否播放动画
    timeline: false, //是否显示时间轴
    fullscreenButton: false, //是否显示全屏按钮
    requestRenderMode: true //是否在视口场景变化时再渲染
  })
  viewer.imageryLayers.removeAll()
  viewer.scene.skyBox.show = false
  viewer.scene.backgroundColor = new Color(0.0, 0.0, 0.0, 0.0)
  console.log('viewer.imageryLayers', viewer.imageryLayers)
  // viewer.imageryLayers.get(0).show = false
  viewer._cesiumWidget.creditContainer.style.display = 'none'
  //禁用cesium鼠右键拖拽缩放功能
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [3, 4]
  viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      url: tilesurl,
      fileExtension: 'png',
      minimumLevel: 0,
      maximumLevel: 17
    })
  )
}

//初始化相机
let pitch1 = props.pitchnumber ? CesiumMath.toRadians(props.pitchnumber) : CesiumMath.toRadians(-45)
let initcamera = function (lng = store.state.region.cesiumcoordinate[0] || 103.64, lat = store.state.region.cesiumcoordinate[1] - 0.03 || 30.96, height = 5000) {
  viewer?.camera.setView({
    destination: Cartesian3.fromDegrees(lng, lat, height),
    orientation: {
      pitch: pitch1
    }
  })
  viewer.camera.frustum.far = 40000 //相机最远可视距离
  viewer.camera.frustum.near = 1 //相机最近可视距离
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100 //相机的高度的最小值
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000 //相机高度的最大值
}

//显示地形
let terrainProvider = null
let initTerrain = url => {
  terrainProvider = CesiumTerrainProvider.fromUrl(url, {})
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
  try {
    let model = await Cesium3DTileset.fromUrl(data, {
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
      color: 'rgba(255,255,255,0.7)'
    })
  } catch (error) {
    console.log(`Error loading tileset: ${error}`)
  }
}

//添加labal标签
let removeaddmaker = null
let addmaker = async function (data, power) {
  data.forEach(async item => {
    const data1 = power.find(item2 => item2.substationObjectId === item.objectId)
    terrainProvider
      .then(async terrain => {
        const [firstHeight] = await sampleTerrain(terrain, 15, [Cartographic.fromDegrees(...item.coordinate)])
        let height = firstHeight?.height ? firstHeight.height : 0
        const divdom = document.createElement('div')
        divdom.addEventListener('click', function (e) {
          emit('selectSubstation', item)
        })
        divdom.id = item.objectId
        divdom.innerHTML = `
            <h3 v-text=>${item.name}</h3>
            <span>功耗:${data1?.power?.toFixed(2) || 0} KW</span>
            <span>温度:${data1?.temp?.toFixed(2) || 0} ℃</span>
          `
        divdom.className = 'cesiumlabal'
        switch (data1?.state || '正常') {
          case '停电':
            divdom.classList.add('nopower')
            break
          case '告警':
            divdom.classList.add('deepwarning')
            break
          case '预警':
            divdom.classList.add('warning')
            break
          default:
            break
        }
        containerdom.value?.appendChild(divdom)
        const ellipsoid = Ellipsoid.WGS84
        const point = Cartesian3.fromDegrees(...item.coordinate)
        removeaddmaker = viewer?.scene.postRender.addEventListener(() => {
          let windowCoord = SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, Cartesian3.fromDegrees(...item.coordinate, props.ifshow3d ? height : 0))
          const occluder = new EllipsoidalOccluder(ellipsoid, viewer.camera.position)
          const visible = occluder.isPointVisible(point)
          if (windowCoord && visible) {
            let x = windowCoord.x - divdom.offsetWidth / 2
            let y = windowCoord.y - divdom.offsetHeight
            divdom.style.cssText = `
              transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);
            `
          } else {
            //位置在地球背面的标签不显示
            divdom.style.cssText = `visibility:hidden;`
          }
        })
      })
      .catch(error => {
        console.log('加载地图标签失败', error)
      })
  })
}

//修改标签状态
let changemasker = function (data) {
  data.forEach(item => {
    let dom = document.getElementById(item.substationObjectId)
    if (dom) {
      dom.innerHTML = `
            <h3 v-text=>${item.substationName}</h3>
            <span>功耗:${item.power?.toFixed(2) || 0} KW</span>
            <span>温度:${item.temp?.toFixed(2) || 0} ℃</span>
          `
      dom.className = 'cesiumlabal'
      switch (item.state || '正常') {
        case '停电':
          dom.classList.add('nopower')
          break
        case '告警':
          dom.classList.add('deepwarning')
          break
        case '预警':
          dom.classList.add('warning')
          break
        default:
          break
      }
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
  //设置可浏览经纬度范围
  let Range = lng && lnt ? { west: lng - 0.25, north: lnt + 0.2, east: lng + 0.25, south: lnt - 0.2 } : { west: 103.4, north: 31.16, east: 103.88, south: 30.84 }
  removegoback = viewer.scene.postRender.addEventListener(function () {
    //计算镜头范围方法，该方法会计算当前镜头地理坐标（弧度）范围并返回west,east,north,south 4个范围参数
    let { west, north, east, south } = viewer.camera.computeViewRectangle()
    //地理坐标（弧度）转经纬度坐标
    let west1 = (west / CesiumMath.PI) * 180
    let north1 = (north / CesiumMath.PI) * 180
    let east1 = (east / CesiumMath.PI) * 180
    let south1 = (south / CesiumMath.PI) * 180
    let coordinate1 = props.company?.coordinate || [103.64, 30.98]
    if (west1 < Range.west || north1 > Range.north || east1 > Range.east || south1 < Range.south) {
      initcamera(...coordinate1, Math.round(viewer.camera.positionCartographic.height) >= 5000 ? Math.round(viewer.camera.positionCartographic.height) : 5000)
    }
  })
}

//监听父页面是否传值
let watchtimeid, lng, lnt
watch(
  () => props.company,
  (newvalue, oldvalue) => {
    if (newvalue instanceof Array && newvalue.length >= 0) {
      addmaker(newvalue, props.power)
    } else if (newvalue instanceof Object && newvalue.coordinate) {
      //判断是不是单个点,在本项目里面单点是用来定位相关做标识的
      ;[lng, lnt] = newvalue.coordinate
      watchtimeid && clearTimeout(watchtimeid)
      watchtimeid = setTimeout(() => {
        viewer?.entities.add({
          position: Cartesian3.fromDegrees(...newvalue.coordinate, 0),
          point: {
            pixelSize: 5,
            color: Color.RED,
            outlineColor: Color.WHITE,
            outlineWidth: 2
          }
        })
        initcamera(...newvalue.coordinate)
      }, 0)
    }
  },
  { immediate: true }
)

//修改标签状态
watchEffect(
  () => {
    if (props.power && props.power.length > 0) {
      changemasker(props.power)
    }
  },
  {
    flush: 'post'
  }
)

//右键点击选点
let pointtimeid, Handler
const watchclick = () => {
  if (!Handler) Handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
  Handler.setInputAction(async event => {
    const pRadians = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid)
    const cartographic = Cartographic.fromCartesian(pRadians)
    const longitude = Number(CesiumMath.toDegrees(cartographic.longitude).toFixed(6))
    const latitude = Number(CesiumMath.toDegrees(cartographic.latitude).toFixed(6))
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

onMounted(() => {
  initcesium()
  initcamera()
  props.ifshow3d && initTerrain(terrainurl)
  !props.ifshow3d && goBackCenter()
  props.ifListenerclick && watchclick()
  props.ifshowmask && watchLeftClick()
  props.ifshow3d && add3dtitles(dtilesurl)
  props.ifshow3d && cameraEventListener()
})

onUnmounted(() => {
  viewer.entities.values.length > 0 && viewer.entities.removeAll()
  removegoback && removegoback()
  removecamerachange && removecamerachange()
  removeaddmaker && removeaddmaker()
  // viewer.scene.primitives.length > 0 && viewer.scene.primitives.removeAll()
  // dujiangyanjz && dujiangyanjz.destroy()
  clearTimeout(watchtimeid)
  clearTimeout(pointtimeid)
  Handler && Handler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK)
  Handler && Handler.removeInputAction(ScreenSpaceEventType.RIGHT_CLICK)
  Handler && !Handler.isDestroyed() && Handler.destroy()
  //内存释放
  let canvas = viewer?.canvas.getContext('webgl2') || viewer?.canvas.getContext('webgl')
  canvas?.getExtension('WEBGL_lose_context')?.loseContext()
  !viewer.isDestroyed() && viewer.destroy()
})

defineExpose({ initcamera })
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
.cesiumlabal {
  color: aliceblue;
  position: absolute;
  padding: 2px;
  z-index: 2;
  left: 0;
  top: -2vw;
  width: 5vw;
  min-height: 2vh;
  border-radius: 10px;
  border: 2px solid rgb(7, 138, 252);
  display: flex;
  background-color: rgba(0, 136, 255, 0.7);
  flex-direction: column;
}
.cesiumlabal::before {
  pointer-events: none;
  content: '';
  display: block;
  position: absolute;
  bottom: -1px;
  width: 0px;
  height: 0px;
  border: 2.5vw solid transparent;
  border-top-color: rgba(0, 136, 255, 0.7);
  transform: translateY(100%);
}
.nopower {
  border-color: rgb(255, 132, 0);
  background-color: rgba(255, 132, 0, 0.7);
}
.nopower::before {
  border-top-color: rgba(255, 132, 0, 0.7);
}

.deepwarning {
  border-color: rgb(231, 32, 14);
  background-color: rgba(231, 32, 14, 0.7);
}
.deepwarning::before {
  border-top-color: rgba(231, 32, 14, 0.7);
}

.warning {
  border-color: rgb(23, 160, 8);
  background-color: rgba(23, 160, 8, 0.7);
}
.warning::before {
  border-top-color: rgba(23, 160, 8, 0.7);
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
</style>
