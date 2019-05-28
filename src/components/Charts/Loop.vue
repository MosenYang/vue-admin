<template>
  <div class="chart-comp" :style="{height:height,width:width}">
    <div class="chart-container" :style="{height:height,width:width}">
      <div :id="id" :class="className" :style="{height:height,width:width}" />
      <div class="loop-mask flex-center" @mouseover="changeActive($event)" @mouseout="removeActive($event)">
        {{ num }}
      </div>
    </div>
    <span class="loop-name">上海</span>
  </div>

</template>
<script>
import echarts from 'echarts'
import resize from './mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      num: '90%',
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    changeActive(e) {
      this.num = 123
    },
    removeActive(e) {
      this.num = '20%'
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        color: ['#c08dca', '#dfe1b3'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {// 高亮
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: '600'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' }
            ]
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .chart-comp {
    text-align: center;
    .chart-container {
      position: relative;
      .loop-mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        font-weight: 500;
        font-size: 24px;
      }
    }
  }
</style>
