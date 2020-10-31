<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎ ' + showTitle }}</span>
      <span
        class="iconfont title-icon"
        :style="comStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div
          class="select-item"
          @click="handleSelect(item.key)"
          v-for="item in selectTypes"
          :key="item.key"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'Trend',
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
  computed: {
    // *循环渲染标题下拉菜单
    selectTypes() {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    // *处理标题显示
    showTitle() {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },

  methods: {
    // !初始化echarts对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
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
      const { data: res } = await this.$api.get('trend')
      this.allData = res
      this.updateChart()
    },
    // !更新图表
    updateChart() {
      const colorArr1 = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)'
      ]
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)'
      ]
      const timeArr = this.allData.common.month
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((item, index) => {
        return {
          type: 'line',
          name: item.name,
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0, // * 百分之0的时候
                color: colorArr1[index]
              },
              {
                offset: 1, // * 百分之100的时候
                color: colorArr2[index]
              }
            ])
          }
        }
      })

      // !图例的数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    //! 切换图表
    handleSelect(type) {
      this.choiceType = type
      this.updateChart()
      this.showChoice = false
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
