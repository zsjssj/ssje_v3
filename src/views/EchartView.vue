<template>
  <div id="chinaMap"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import China from '@/assets/map/china.json'

let myChart = null
let option
option = {
  title: {
    text: '中国地图',
    subtext: 'Data from Wikipedia'
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      //console.log(params);
      return params.seriesName + '<br>' + params.name + ':' + params.value + '人'
    }
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },
  visualMap: {
    min: 0,
    max: 500,
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['lightskyblue', 'yellow', 'orangered']
    }
  },
  series: [
    {
      name: '中华人名共和国',
      type: 'map',
      map: 'China',
      label: {
        show: true,
        fontSize: 8
      },
      data: [
        { name: '江苏省', value: 100 },
        { name: '北京市', value: 86 },
        { name: '上海市', value: 68 },
        { name: '重庆市', value: 123 },
        { name: '河北省', value: 34 },
        { name: '河南省', value: 32 },
        { name: '云南省', value: 160 },
        { name: '辽宁省', value: 43 },
        { name: '黑龙江省', value: 181 },
        { name: '湖南省', value: 24 },
        { name: '安徽省', value: 33 },
        { name: '山东省', value: 54 },
        { name: '新疆省', value: 118 },
        { name: '浙江省', value: 44 },
        { name: '江西省', value: 220 },
        { name: '湖北省', value: 21 },
        { name: '广西省', value: 30 },
        { name: '甘肃省', value: 12 },
        { name: '山西省', value: 32 },
        { name: '内蒙古省', value: 35 },
        { name: '陕西省', value: 25 },
        { name: '吉林省', value: 45 },
        { name: '福建省', value: 28 },
        { name: '贵州省', value: 18 },
        { name: '广东省', value: 37 },
        { name: '青海省', value: 62 },
        { name: '西藏省', value: 43 },
        { name: '四川省', value: 33 },
        { name: '宁夏省', value: 8 },
        { name: '海南省', value: 19 },
        { name: '台湾省', value: 190 },
        { name: '香港省', value: 11 },
        { name: '澳门省', value: 10 },
        { name: '内蒙古自治区', value: 200 },
        { name: '天津市', value: 230 },
        { name: '广西壮族自治区', value: 30 },
        { name: '新疆维吾尔自治区', value: 100 },
        { name: '宁夏回族自治区', value: 500 },
        { name: '西藏自治区', value: 70 }
      ]
    }
  ]
}

window.addEventListener('resize', () => {
  myChart.resize()
})
onMounted(() => {
  myChart = echarts.init(document.getElementById('chinaMap'))
  myChart.showLoading()
  myChart.hideLoading()
  echarts.registerMap('China', China)
  myChart.on('click', (item) => {
    // console.log(item.name)
    return
  })
  option && myChart.setOption(option)
})
</script>

<style scoped>
#chinaMap {
  width: 100vw;
  height: 100vh;
}
</style>
