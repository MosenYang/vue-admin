<template>
  <!--下拉 匹配远程搜索-->
  <div>
    <el-select v-model="inputValue"
               value-key="id"
               size="small"
               @change="handleCallback"
               placeholder="请选择">
      <el-option v-for="item in options"
                 :key="item.id"
                 :label="item.name"
                 :value="item">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'selectFte',
  props: {
    comData: {// 传入下拉数据
      type: Array,
      default: []
    },
    placeholder: {
      type: String,
      default: '请选择项'
    },
    label: {
      type: String,
      default: ''
    },
    filterKey: {
      type: String,
      default: ''
    },
    paramKey: {
      type: String,
      default: ''
    },
    refName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputValue: null,// 绑定的是对象
      options: []// 下拉项
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {

    this.comData.forEach((item) => {
      let obj = {
        id: item.value || item.id || item.key,
        name: item.name || item.label || item.area_name
      }
      this.options.push(obj)
    })
  },
  methods: {
    handleCallback() {
      if (!this.inputValue) return console.log('没选中值')
      this.$emit('getFilterBridge', {
        label: this.label,// 列名字
        filterKey: this.filterKey,// 列字段
        value: this.inputValue,// 列数据
        paramKey:this.paramKey// 接口字段
      })
      this.inputValue = null
    }
  }
}
</script>
<style scoped>
  /*@import "../base/reset.css";*/

</style>
