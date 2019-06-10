<template>
  <div style="padding: 10px">
    <el-input
      :ref="refName"
      v-model="inputValue"
      :placeholder = 'placeholder'
      maxlength="20"
      show-word-limit
      @blur="handleBlur"
    >
      <i slot="prefix" class="el-input__icon el-icon-search" />
    </el-input>
  </div>
</template>
<script>
export default {
  name:'searchText',
  props: {
    placeholder:{
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
    ftn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    handleBlur(item) {
      console.log('1', item)
      this.$emit('getFilterBridge', {
        type: 'text',
        key: this.filterkey,
        label: '',
        value: this.inputValue,
        ftn: this.ftn
      })
    }
  }
}
</script>
<style scoped>
  /*@import "../base/reset.css";*/

</style>
