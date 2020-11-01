<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '../utils/map_utils'
export default {
  name: 'Map',
  components: {},
  props: {},
  data() {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false,
      choiceType: 'map',
      titleFontSize: 0,
      mapData: {}
    }
  },
  created() {},
  watch: {},
  computed: {},
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // !初始化echarts对象
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      const { data: res } = await axios.get(
        'http://localhost:9090/static/map/china.json'
      )
      this.$echarts.registerMap('china', res)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }

      this.chartInstance.setOption(initOption)
      //! 省份地图数据
      this.chartInstance.on('click', async arg => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        if (!this.mapData[provinceInfo.key]) {
          const { data: ret } = await axios.get(
            'http://localhost:9090' + provinceInfo.path
          )
          this.mapData[provinceInfo.key] = ret
          this.$echarts.registerMap(provinceInfo.key, ret)
        }

        const changeOption = {
          geo: {
            type: 'map',
            map: provinceInfo.key,
            top: '5%',
            bottom: '5%',
            itemStyle: {
              areaColor: '#2E72BF',
              borderColor: '#333'
            }
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    // !获取服务器数据
    async getData() {
      const { data: res } = await this.$api.get('map')
      this.allData = res
      console.log(this.allData)
      this.updateChart()
    },
    // !更新图表
    updateChart() {
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        return {
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })
      const dataOption = {
        legend: { data: legendArr },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    //! 回到中国地图
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }

      this.chartInstance.setOption(revertOption)
    },
    // !屏幕适配
    screenAdapter() {
      this.titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      //分辨率大小相关的配置项
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        }
      }

      this.chartInstance.setOption(adapterOption)

      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: #fff;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}
.select-item {
  cursor: pointer;
}
.select-con {
  background-color: #222733;
}
</style>
