<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
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
      titleFontSize: 0
    }
  },
  created() {},
  watch: {},
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {},
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },

  methods: {
    // !初始化echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      const initOption = {
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        series: [
          {
            type: 'line'
          }
        ]
      }

      this.chartInstance.setOption(initOption)
    },
    // !获取服务器数据
    async getData() {
      const { data: res } = await this.$api.get('map')
      this.allData = res
      this.updateChart()
    },
    // !更新图表
    updateChart() {
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },

    // !屏幕适配
    screenAdapter() {
      this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6
      //分辨率大小相关的配置项
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        // title: {
        //   textStyle: {
        //     fontSize: this.titleFontSize
        //   }
        // },
        // tooltip: {
        //   axisPointer: {
        //     lineStyle: {
        //       width: this.titleFontSize
        //     }
        //   }
        // },
        series: [
          {
            barWidth: this.titleFontSize,
            itemStyle: {
              barBorderRadius: [
                0,
                this.titleFontSize / 2,
                this.titleFontSize / 2,
                0
              ]
            }
          }
        ]
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
