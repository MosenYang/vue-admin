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
    <div>
      <Chart />
    </div>
  </div>
</template>
<script>
import Chart from '../../components/Charts/Loop'
export default {
  components: { Chart },
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
  watch: {
  },
  // 生命周期钩子：组件实例完成创建之后调用
  created() {
    console.log('组件实例完成创建component created')
  },
  // 生命周期钩子：组件实例渲染完成时调用
  mounted() {
    console.log('组件实例渲染完成component mounted')
  },
  methods: {

  },
  beforeCreated() {
    console.log('component before created')
  }
}
</script>
<style lang="scss" scoped>
  .page{
    padding:0 20px  ;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-name{
      font-weight: 600;
      font-size: 30px;
      color: #97a8be;
      padding: 20px 0 ;
    }
  }

</style>
