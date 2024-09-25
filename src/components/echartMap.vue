<template>
  <!-- <div ref="mapChart" style="width: 100%"></div> -->
  <div style="width: 100%; height: 100%; position: relative">
    <div class="mapChart" ref="mapChart" style="width: 38vh; height: 22vh; margin: 0 auto"></div>
    <div class="return" @click="goback">
      <div class="goBack"></div>
    </div>
  </div>
</template>
<script>
import { markRaw } from 'vue'
import * as echarts from 'echarts'
import chinaMapData from '../../../../assets/china.json'
import sichuanMapData from '../../../../assets/sichuan.json'
import chengduMapData from '../../../../assets/chengdu.json'
import guangdongMapData from '../../../../assets/guangdong.json'
import xizangData from '../../../../assets/xizang.json'
import lasaData from '../../../../assets/lasa.json'
import { getCityWeather } from '../../../../api/home.js'
import cityId from '@/assets/cityCode.json'
import markImg from '../../../../assets/images/mark.svg'
import { ElMessage } from 'element-plus'
export default {
  name: 'HomeMapChart',
  props: {
    region: {
      type: Array
    },
    allRegionId: {
      type: Array
    }
  },
  data() {
    return {
      chart: null,
      usercity: {},
      userarea: [],
      area: {},
      maplist: [],
      cityid: ''
    }
  },
  emits: ['tochoose'],
  async mounted() {
    this.initChart({
      mapdata: chinaMapData,
      zoom: 1.7,
      center: [100, 36]
    })
    window.addEventListener('resize', this.chartresize)
    this.clickMapEvent()
  },
  updated() {
    this.initChart({
      mapdata: chinaMapData,
      zoom: 1.7,
      center: [100, 36]
    })
  },
  methods: {
    initChart({ mapdata = null, zoom = 1, center = [], regions = [...this.userarea, ...Object.keys(this.usercity)] }) {
      const options = {
        geo: {
          map: 'chinaMap',
          zoom: zoom,
          center: center, //设置地图中心点的坐标
          itemStyle: {
            areaColor: 'rgba(0 ,0 ,128, 0.3)',
            color: 'rgba(178, 178, 178, 0.3)',
            borderColor: 'rgba(0,229,238, 0.8)'
          },
          emphasis: {
            label: {
              color: '#fff'
            },
            itemStyle: {
              areaColor: '#008792',
              color: '#000'
            }
          },
          regions: regions.reduce((pre, item) => {
            pre.push({
              name: item,
              itemStyle: {
                areaColor: '#1C86EE'
              }
            })
            return pre
          }, [])
        }
      }
      echarts.registerMap('chinaMap', mapdata)
      if (!this.chart) {
        this.chart = markRaw(echarts.init(this.$refs.mapChart))
      }
      this.chart.clear()
      this.chart.setOption(options)
    },
    goback() {
      this.initChart({
        mapdata: chinaMapData,
        zoom: 1.7,
        center: [100, 36]
      })
    },
    finddityId(data, arr) {
      let aa1 = data.find(item => {
        return arr[0].includes(item.label)
      }).children
      let aa2 = aa1.find(item => {
        return arr[1].includes(item.label)
      }).children
      let aa3 = aa2.find(item => {
        return arr[arr.length - 1].includes(item.label)
      })
      if (!aa3) {
        aa3 = aa2.find(item => {
          return arr[1].includes(item.label)
        })
      }
      return aa3
    },
    async movecesium(params) {
      let regionJsonArr = {
        广东省: guangdongMapData,
        成都市: chengduMapData,
        四川省: sichuanMapData,
        西藏自治区: xizangData,
        拉萨市: lasaData
      }
      if (this.userarea.includes(params.name)) {
        let regioncenter = regionJsonArr[params.name].features.filter(item => {
          return Object.keys(this.usercity).includes(item.properties.name)
        })
        if ((regioncenter != [], regioncenter.length > 0)) {
          regioncenter.forEach(item => {
            this.usercity[item.properties.name] = item.properties.center
          })
        }
        this.initChart({
          mapdata: regionJsonArr[params.name]
        })
      }
      if (Object.keys(this.usercity).includes(params.name)) {
        if (this.usercity[params.name] && this.usercity[params.name].length === 0) {
          let aa = chinaMapData.features.find(item => {
            return item.properties.name == params.name
          })
          if (aa) {
            this.usercity[aa.properties.name] = aa.properties.center
          }
        }
        let arr1 = this.region
          .find(item => {
            return item.includes(params.name)
          })
          .split('/')
        this.cityid = this.finddityId(cityId, arr1)
        try {
          let { data: res } = await getCityWeather(this.cityid.value)
          this.$store.commit('region/setCityWeather', res?.data?.forecast[0])
        } catch (error) {}
        this.$store.commit('region/setCity', params.name)
        let obj = this.allRegionId.find(item => {
          return item.name == params.name
        })
        this.$store.commit('region/setRegionChooseId', obj?.objectId)
        this.$emit('tochoose', this.usercity[params.name], params.name)
      }
    },
    clickMapEvent() {
      this.chart && this.chart.on('click', this.movecesium)
    },
    chartresize() {
      this.chart.resize()
    }
  },
  watch: {
    region: {
      immediate: true,
      handler(newval, oldval) {
        newval &&
          newval.forEach(item => {
            let aa = item.split('/')
            this.usercity[aa.pop()] = []
            this.userarea = [...this.userarea, ...aa]
          })
        this.userarea = [...new Set(this.userarea)]
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.chartresize)
    this.chart.off('click', this.movecesium)
  }
}
</script>
<style>
.return {
  width: 30px;
  height: 20px;
  position: absolute;
  border-radius: 4px;
  top: 10px;
  right: 0;
}
.goBack {
  width: 10px;
  height: 10px;
  border-top: 4px solid #1c86ee;
  border-left: 4px solid #1c86ee;
  transform: translate(18px, 4px) rotateZ(-45deg);
}
.return:hover .goBack {
  transition: 0.4s ease-in;
  border-top: 2px solid skyblue;
  border-left: 2px solid skyblue;
  filter: drop-shadow(-8px -8px 0 skyblue);
}
.return:hover {
  box-shadow: 0 0 4px 0 #1c86ee inset;
}
</style>
