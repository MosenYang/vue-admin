<template>
  <!--下拉 匹配远程搜索-->
  <div style="padding: 10px">
    <el-select v-model="inputValue"
               value-key="value"
               placeholder="请选择">
      <el-option v-for="item in comData"
                 :key="item.value"
                 :label="item.label"
                 :value="item">
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'select',
  props: {
    comData: {
      type: Array,
      default: []
    },
    placeholder: {
      type: String,
      default: '未定义'
    },
    filterKey: {
      type: String,
      default: ''
    },
    refName: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputValue: '',
      list: [],
      loading: false,
      options: []
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {},
  methods: {
    handleBlur() {
      if (!this.inputValue) return
      this.$emit('getFilterBridge', {
        type: 'text',
        key: this.filterkey,
        label: this.label,
        value: this.inputValue
      })
      this.inputValue = null
    }
  }
}
</script>
<style scoped>
  /*@import "../base/reset.css";*/

</style>
