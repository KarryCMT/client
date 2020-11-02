<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      allData: null,
      timerId: null
    }
  },
  created() {},
  watch: {},
  computed: {},
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候, 主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    // 在组件销毁的时候, 需要将监听器取消掉
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, 'chalk')
      // 对图表初始化配置的控制
      const initOption = {
        // title: {
        //   text: '▎地区销售排行',
        //   left: 20,
        //   top: 20
        // },
        // grid: {
        //   top: '40%',
        //   left: '5%',
        //   right: '5%',
        //   bottom: '5%',
        //   containLabel: true // 距离是包含坐标轴上的文字
        // },
        // tooltip: {
        //   show: true
        // },
        series: [
          {
            type: 'pie'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 对图表对象进行鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData() {
      const { data: res } = await this.$api.get('hot')
      this.allData = res
      console.log(this.allData)

      this.updateChart()
      // 启动定时器
      this.startInterval()
    },
    updateChart() {
      const legendData = this.allData[0].children.map(item => {
        return item.name
      })
      const seriesData = this.allData[0].children.map(item => {
        return {
          name: item.name,
          value: item.name
        }
      })
      console.log(seriesData)
      const dataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval() {},
    screenAdapter() {
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6
      // 和分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 手动的调用图表对象的resize 才能产生效果
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped></style>
