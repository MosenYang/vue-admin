<template>
  <div class="page">
    <div class="title">
      <div class="title-name">全额报表</div>
      <div class="picker-wrap">
        时间范围选择：
        <el-date-picker
          v-model="value2"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </div>
    </div>
    <div class="flex">
      <Loop id="a1" class-name="a1" />
      <Loop id="a2" class-name="a2" />
      <Loop id="a3" class-name="a3" />
      <Loop id="a4" class-name="a4" />
      <Loop id="a5" class-name="a5" />
    </div>
    <div class="chart-wrap">
      <div class="bar-name">成交额度/成交量</div>
      <Pillar style="width: 100%;height: 500px" />
    </div>
    <div class="chart-wrap">
      <div class="bar-name">线形图</div>
      <GanttChart id="c1" class-name="c1" style="width: 100%;height: 500px" />
    </div>
  </div>
</template>
<script>
import Loop from '../../components/Charts/Loop'
import Pillar from '../../components/Charts/Pillar'
import GanttChart from '../../components/Charts/GanttChart'

export default {
  components: { Loop, Pillar, GanttChart },
  props: {},
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value1: '',
      value2: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {},
  beforeCreated() {
  }
}
</script>
<style lang="scss" scoped>
  .page {
    padding: 0 20px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-name {
      font-weight: 600;
      font-size: 30px;
      color: #97a8be;
      padding: 20px 0;
    }
  }

  .chart-wrap {
    padding: 40px 0;

    .bar-name {
      padding: 10px 0;
      font-weight: 500;
      font-size: 20px;
      color: #97a8be;

    }
  }
</style>
