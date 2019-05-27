<template>
  <div class="chart-container">
    <div :id="id" :class="className" :style="{height:height,width:width}" />
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
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        // tooltip: {
        //   trigger: 'item',
        //   formatter: "{a} <br/>{b}: {c} ({d}%)"
        // },
        color: ['#ca8622', '#bda29a'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '60%'],
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
      this.chart.on('mouseover', function() {
        console.log('222')
        return false
      })
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
