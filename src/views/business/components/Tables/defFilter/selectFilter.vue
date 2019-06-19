<template>
  <!--下拉 匹配远程搜索-->
  <div style="padding: 10px">
    <el-select v-model="inputValue"
               value-key="id"
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
    name: 'select',
    props: {
      comData: {
        type: Array,
        default: []
      },
      placeholder: {
        type: String,
        default: '请选择项'
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
    mounted() {
      console.log('comData', this.comData)
      this.comData.forEach((item) => {
        let obj = {
          id: item.value || item.id,
          name: item.name || item.label
        }
        this.options.push(obj)
      })
      console.log('this.options', this.options)

    },
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
