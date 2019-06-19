<template>
  <!--下拉 匹配远程搜索-->
  <div style="padding: 10px">
    <el-select v-model="inputValue"
               multiple
               filterable
               remote
               reserve-keyword
               placeholder="请输入关键词"
               :remote-method="remoteMethod"
               :loading="loading">
      <el-option v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { getOrderInfo } from '@/api/businessOrder/order'

export default {
  name: 'searchText',
  props: {
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
  created() {},
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
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          let param = {}
          getOrderInfo().then(() => {

          })
          this.options = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    }
  }
}
</script>
<style scoped>
  /*@import "../base/reset.css";*/

</style>
