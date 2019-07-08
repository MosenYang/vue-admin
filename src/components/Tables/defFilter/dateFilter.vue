<template>
  <div>
    <el-date-picker
      :refs="refName"
      v-model="dateValue"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至 "
      start-placeholder="开始搜索日期"
      end-placeholder="结束搜索日期"
      value-format="yyyy-MM-dd"
      @change="changeData"
      :picker-options="pickerOptions">
    </el-date-picker>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dateValue: '',
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
      }
    }
  },
  props: {
    comData: {// 传入下拉数据
      type: Array,
      default: []
    },
    placeholder: {
      type: String,
      default: '请选择项'
    },
    label: {//列名
      type: String,
      default: ''
    },
    filterKey: {//列字段
      type: String,
      default: ''
    },
    paramKey: {// 参数
      type: String,
      default: ''
    },
    refName: {// 绰号
      type: String,
      default: 'date'
    }
  },
  computed: {},
  watch: {},
  methods: {
    changeData() {
      if (!this.dateValue) return console.log('没选中值')
      this.$emit('getFilterBridge', {
        label: this.label,// 列名字
        filterKey: this.filterKey,// 列字段
        value: this.dateValue,// 列数据
        paramKey: this.paramKey// 接口字段
      })
    }
  },
  created() {},
  mounted() {},
  components: {}
}
</script>
<style lang='scss' scoped>
  /*@import "src/styles/mixin.scss"*/
  /*@import "../../../../styles/index.scss";*/

</style>
